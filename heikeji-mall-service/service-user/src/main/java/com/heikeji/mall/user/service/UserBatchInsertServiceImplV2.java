package com.heikeji.mall.user.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heikeji.mall.common.Result;
import com.heikeji.mall.user.dto.UserBatchInsertDTO;
import com.heikeji.mall.user.entity.User;
import com.heikeji.mall.user.mapper.UserMapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 用户批量插入服务实现类 - 性能增强版
 *
 * 优化特性：
 * 1. ✅ 分批处理机制（支持超大批量数据）
 * 2. ✅ 异步插入支持（@Async）
 * 3. ✅ 批量唯一性预检查（减少数据库访问）
 * 4. ✅ 操作统计和性能监控
 * 5. ✅ 内存优化的数据处理
 */
@Service
@Primary
public class UserBatchInsertServiceImplV2 extends ServiceImpl<UserMapper, User> implements UserBatchInsertService {

    private static final Logger log = LoggerFactory.getLogger(UserBatchInsertServiceImplV2.class);

    private static final int DEFAULT_BATCH_SIZE = 100;
    private static final int MAX_BATCH_SIZE = 1000;
    private static final int MAX_SINGLE_REQUEST_SIZE = 500;

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, Object> operationStats = new ConcurrentHashMap<>();

    public UserBatchInsertServiceImplV2(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
    public Result<User> insertSingle(UserBatchInsertDTO dto) {
        long startTime = System.currentTimeMillis();
        String operationId = UUID.randomUUID().toString().substring(0, 8);

        log.info("[{}] 开始单条用户插入, username: {}", operationId, dto.getUsername());

        try {
            validateUserUniqueness(dto);
            User user = convertToEntity(dto);
            boolean success = save(user);

            if (success) {
                long duration = System.currentTimeMillis() - startTime;
                log.info("[{}] 单条插入成功, userId: {}, 耗时: {}ms", operationId, user.getId(), duration);

                recordOperation(operationId, "single", true, duration, 1, 0);
                recordAuditLog("INSERT_USER_SINGLE", "SUCCESS", dto.getUsername(), user.getId());

                return Result.success("用户添加成功", user);
            } else {
                recordOperation(operationId, "single", false, System.currentTimeMillis() - startTime, 0, 1);
                return Result.error("用户添加失败，请重试");
            }
        } catch (DuplicateKeyException e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 数据重复异常: {}, 耗时: {}ms", operationId, e.getMessage(), duration);
            recordOperation(operationId, "single", false, duration, 0, 1);
            recordAuditLog("INSERT_USER_SINGLE", "DUPLICATE", dto.getUsername(), null);
            throw new RuntimeException("数据已存在：" + extractDuplicateField(e.getMessage()), e);
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[{}] 插入异常: {}, 耗时: {}ms", operationId, e.getMessage(), duration);
            recordOperation(operationId, "single", false, duration, 0, 1);
            throw new RuntimeException("插入失败：" + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
    public Result<List<User>> insertBatch(List<UserBatchInsertDTO> dtoList) {
        return insertBatchWithConfig(dtoList, DEFAULT_BATCH_SIZE, false);
    }

    /**
     * 增强版批量插入（支持自定义配置）
     *
     * @param dtoList      数据列表
     * @param batchSize    分批大小
     * @param asyncMode   是否异步模式
     * @return 插入结果
     */
    public Result<List<User>> insertBatchWithConfig(List<UserBatchInsertDTO> dtoList,
                                                     int batchSize,
                                                     boolean asyncMode) {
        long startTime = System.currentTimeMillis();
        String operationId = UUID.randomUUID().toString().substring(0, 8);

        log.info("[{}] 开始批量插入, 总数: {}, 分批大小: {}, 异步模式: {}",
                operationId, dtoList.size(), batchSize, asyncMode);

        if (dtoList == null || dtoList.isEmpty()) {
            return Result.error("待插入的数据列表不能为空");
        }

        if (dtoList.size() > MAX_SINGLE_REQUEST_SIZE) {
            return Result.error(String.format("单次请求数量不能超过%d条，建议使用分批API", MAX_SINGLE_REQUEST_SIZE));
        }

        if (asyncMode) {
            // 异步模式：启动异步任务但立即返回进行中状态
            insertBatchAsync(dtoList, batchSize, operationId, startTime);
            return Result.success("批量插入任务已启动，请使用操作ID查询进度", null);
        } else {
            return insertBatchSync(dtoList, batchSize, operationId, startTime);
        }
    }

    /**
     * 同步批量插入（分批处理）
     */
    private Result<List<User>> insertBatchSync(List<UserBatchInsertDTO> dtoList,
                                                int batchSize,
                                                String operationId,
                                                long startTime) {
        List<User> allSuccessList = Collections.synchronizedList(new ArrayList<>());
        List<String> allErrorList = Collections.synchronizedList(new ArrayList<>());
        int totalSuccess = 0;
        int totalFail = 0;

        int totalBatches = (int) Math.ceil((double) dtoList.size() / batchSize);
        log.info("[{}] 将分为{}批处理, 每批最多{}条", operationId, totalBatches, batchSize);

        for (int batchNum = 0; batchNum < totalBatches; batchNum++) {
            int fromIndex = batchNum * batchSize;
            int toIndex = Math.min(fromIndex + batchSize, dtoList.size());
            List<UserBatchInsertDTO> batch = dtoList.subList(fromIndex, toIndex);

            log.info("[{}] 处理第{}/{}批, 本批{}条 (索引:{}-{})",
                    operationId, batchNum + 1, totalBatches, batch.size(), fromIndex, toIndex - 1);

            BatchResult result = processSingleBatch(batch, batchNum, operationId);

            synchronized (allSuccessList) {
                allSuccessList.addAll(result.successList);
            }
            synchronized (allErrorList) {
                allErrorList.addAll(result.errorList);
            }
            totalSuccess += result.successCount;
            totalFail += result.failCount;

            log.info("[{}] 第{}批完成, 成功: {}, 失败: {}, 累计成功: {}, 累计失败: {}",
                    operationId, batchNum + 1, result.successCount, result.failCount,
                    totalSuccess, totalFail);
        }

        long duration = System.currentTimeMillis() - startTime;
        log.info("[{}] 批量插入全部完成! 总数: {}, 成功: {}, 失败: {}, 总耗时: {}ms, 平均每条: {}ms",
                operationId, dtoList.size(), totalSuccess, totalFail, duration,
                dtoList.size() > 0 ? duration / dtoList.size() : 0);

        recordOperation(operationId, "batch_sync", totalFail == 0, duration, totalSuccess, totalFail);
        recordAuditLog("INSERT_USER_BATCH",
                totalFail == 0 ? "SUCCESS" : "PARTIAL_SUCCESS",
                String.format("总数=%d,成功=%d,失败=%d", dtoList.size(), totalSuccess, totalFail),
                null);

        return buildBatchResult(totalSuccess, totalFail, allSuccessList, allErrorList, dtoList.size());
    }

    /**
     * 异步批量插入（ CompletableFuture 并行处理）
     */
    @Async("taskExecutor")
    public CompletableFuture<Result<List<User>>> insertBatchAsync(List<UserBatchInsertDTO> dtoList,
                                                                   int batchSize,
                                                                   String operationId,
                                                                   long startTime) {
        log.info("[{}] 启动异步批量插入模式", operationId);

        int totalBatches = (int) Math.ceil((double) dtoList.size() / batchSize);
        List<CompletableFuture<BatchResult>> futures = new ArrayList<>();

        for (int batchNum = 0; batchNum < totalBatches; batchNum++) {
            int fromIndex = batchNum * batchSize;
            int toIndex = Math.min(fromIndex + batchSize, dtoList.size());
            List<UserBatchInsertDTO> batch = new ArrayList<>(dtoList.subList(fromIndex, toIndex));
            final int currentBatch = batchNum;

            CompletableFuture<BatchResult> future = CompletableFuture.supplyAsync(() -> {
                log.info("[{}] 异步处理第{}/{}批", operationId, currentBatch + 1, totalBatches);
                return processSingleBatch(batch, currentBatch, operationId);
            });

            futures.add(future);
        }

        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                .thenApply(v -> {
                    List<User> allSuccessList = new ArrayList<>();
                    List<String> allErrorList = new ArrayList<>();
                    int totalSuccess = 0;
                    int totalFail = 0;

                    for (CompletableFuture<BatchResult> future : futures) {
                        try {
                            BatchResult result = future.get();
                            allSuccessList.addAll(result.successList);
                            allErrorList.addAll(result.errorList);
                            totalSuccess += result.successCount;
                            totalFail += result.failCount;
                        } catch (Exception e) {
                            log.error("[{}] 异步批次结果获取失败", operationId, e);
                            totalFail++;
                        }
                    }

                    long duration = System.currentTimeMillis() - startTime;
                    log.info("[{}] 异步批量插入完成! 成功: {}, 失败: {}, 耗时: {}ms",
                            operationId, totalSuccess, totalFail, duration);

                    recordOperation(operationId, "batch_async", totalFail == 0, duration, totalSuccess, totalFail);

                    return buildBatchResult(totalSuccess, totalFail, allSuccessList, allErrorList, dtoList.size());
                });
    }

    /**
     * 处理单个批次的数据
     */
    private BatchResult processSingleBatch(List<UserBatchInsertDTO> batch,
                                           int batchNum,
                                           String operationId) {
        BatchResult result = new BatchResult();

        for (int i = 0; i < batch.size(); i++) {
            UserBatchInsertDTO dto = batch.get(i);
            int globalIndex = batchNum * 100 + i + 1;
            try {
                validateUserUniqueness(dto);
                User user = convertToEntity(dto);
                boolean saved = save(user);

                if (saved) {
                    result.successList.add(user);
                    result.successCount++;
                } else {
                    result.failCount++;
                    result.errorList.add(formatError(globalIndex, dto.getUsername(), "插入失败"));
                }
            } catch (DuplicateKeyException e) {
                result.failCount++;
                result.errorList.add(formatError(globalIndex, dto.getUsername(),
                        "数据重复-" + extractDuplicateField(e.getMessage())));
            } catch (Exception e) {
                result.failCount++;
                result.errorList.add(formatError(globalIndex, dto.getUsername(), e.getMessage()));
            }
        }

        return result;
    }

    /**
     * 批量预检查所有数据的唯一性（优化：减少数据库往返次数）
     */
    public ValidationResult preValidateBatch(List<UserBatchInsertDTO> dtoList) {
        log.info("开始批量预检查, 数量: {}", dtoList.size());

        List<String> usernames = dtoList.stream()
                .map(UserBatchInsertDTO::getUsername)
                .collect(Collectors.toList());

        List<String> studentNos = dtoList.stream()
                .map(UserBatchInsertDTO::getStudentNo)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        List<String> phones = dtoList.stream()
                .map(UserBatchInsertDTO::getPhone)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        List<String> emails = dtoList.stream()
                .map(UserBatchInsertDTO::getEmail)
                .filter(e -> e != null && !e.isEmpty())
                .collect(Collectors.toList());

        Map<String, List<String>> conflicts = new HashMap<>();

        checkBatchUniqueness(usernames, "username", conflicts);
        checkBatchUniqueness(studentNos, "student_no", conflicts);
        checkBatchUniqueness(phones, "phone", conflicts);
        checkBatchUniqueness(emails, "email", conflicts);

        boolean valid = conflicts.isEmpty();

        log.info("批量预检查完成, 结果: {}, 冲突数: {}", valid ? "通过" : "存在冲突", conflicts.size());

        return new ValidationResult(valid, conflicts);
    }

    private void checkBatchUniqueness(List<String> values, String fieldName, Map<String, List<String>> conflicts) {
        if (values.isEmpty()) return;

        Set<String> uniqueValues = new HashSet<>();
        List<String> duplicates = new ArrayList<>();

        for (String value : values) {
            if (!uniqueValues.add(value)) {
                duplicates.add(value);
            }
        }

        if (!duplicates.isEmpty()) {
            List<String> existingInDB = new ArrayList<>();
            for (String dup : duplicates) {
                Long count = userMapper.selectCount(
                        new LambdaQueryWrapper<User>()
                                .eq("username".equals(fieldName), User::getUsername, dup)
                                .eq("student_no".equals(fieldName), User::getStudentId, dup)
                                .eq("phone".equals(fieldName), User::getPhone, dup)
                                .eq("email".equals(fieldName), User::getEmail, dup)
                );
                if (count > 0) {
                    existingInDB.add(dup);
                }
            }

            if (!existingInDB.isEmpty()) {
                conflicts.put(fieldName, existingInDB);
            }
        }
    }

    private void validateUserUniqueness(UserBatchInsertDTO dto) {
        if (existsByUsername(dto.getUsername())) {
            throw new DuplicateKeyException("用户名 '" + dto.getUsername() + "' 已存在");
        }
        if (dto.getStudentNo() != null && existsByStudentNo(dto.getStudentNo())) {
            throw new DuplicateKeyException("学号 '" + dto.getStudentNo() + "' 已存在");
        }
        if (dto.getPhone() != null && existsByPhone(dto.getPhone())) {
            throw new DuplicateKeyException("手机号 '" + dto.getPhone() + "' 已被注册");
        }
        if (dto.getEmail() != null && !dto.getEmail().isEmpty() && existsByEmail(dto.getEmail())) {
            throw new DuplicateKeyException("邮箱 '" + dto.getEmail() + "' 已被注册");
        }
    }

    private User convertToEntity(UserBatchInsertDTO dto) {
        User user = new User();
        BeanUtils.copyProperties(dto, user);
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        if (user.getStatus() == null) {
            user.setStatus(0);
        }
        return user;
    }

    private boolean existsByUsername(String username) {
        return userMapper.exists(new LambdaQueryWrapper<User>().eq(User::getUsername, username));
    }

    private boolean existsByStudentNo(String studentNo) {
        return userMapper.exists(new LambdaQueryWrapper<User>().eq(User::getStudentId, studentNo));
    }

    private boolean existsByPhone(String phone) {
        return userMapper.exists(new LambdaQueryWrapper<User>().eq(User::getPhone, phone));
    }

    private boolean existsByEmail(String email) {
        return userMapper.exists(new LambdaQueryWrapper<User>().eq(User::getEmail, email));
    }

    private String extractDuplicateField(String errorMessage) {
        if (errorMessage == null) return "未知字段";
        if (errorMessage.contains("username") || errorMessage.contains("用户名")) return "用户名";
        if (errorMessage.contains("student_no") || errorMessage.contains("学号")) return "学号";
        if (errorMessage.contains("phone") || errorMessage.contains("手机号")) return "手机号";
        if (errorMessage.contains("email") || errorMessage.contains("邮箱")) return "邮箱";
        return "数据";
    }

    private String formatError(int index, String username, String error) {
        return String.format("第%d条(username=%s): %s", index, username, error);
    }

    private Result<List<User>> buildBatchResult(int successCount, int failCount,
                                                 List<User> successList,
                                                 List<String> errorList,
                                                 int totalCount) {
        if (failCount == 0) {
            return Result.success(String.format("✅ 成功插入%d条用户数据", successCount), successList);
        } else if (successCount == 0) {
            return Result.error(String.format("❌ 全部插入失败(%d条)，详情：%s",
                    failCount, String.join("; ", errorList)));
        } else {
            return Result.success(String.format("⚠️ 部分成功：成功%d条，失败%d条。详情：%s",
                    successCount, failCount, String.join("; ", errorList)), successList);
        }
    }

    private void recordOperation(String operationId, String type, boolean success,
                                  long duration, int successCount, int failCount) {
        operationStats.put(operationId, Map.of(
                "type", type,
                "success", success,
                "duration", duration,
                "successCount", successCount,
                "failCount", failCount,
                "timestamp", System.currentTimeMillis()
        ));
    }

    private void recordAuditLog(String action, String status, String target, Long entityId) {
        log.debug("Audit: action={}, status={}, target={}, entityId={}", action, status, target, entityId);
    }

    public Map<String, Object> getOperationStats() {
        return new HashMap<>(operationStats);
    }

    public void clearOldStats(long olderThanMs) {
        long threshold = System.currentTimeMillis() - olderThanMs;
        operationStats.entrySet().removeIf(entry -> {
            Map<?, ?> stats = (Map<?, ?>) entry.getValue();
            Long timestamp = (Long) stats.get("timestamp");
            return timestamp < threshold;
        });
    }

    private static class BatchResult {
        List<User> successList = new ArrayList<>();
        List<String> errorList = new ArrayList<>();
        int successCount = 0;
        int failCount = 0;
    }

    public static class ValidationResult {
        public final boolean valid;
        public final Map<String, List<String>> conflicts;

        public ValidationResult(boolean valid, Map<String, List<String>> conflicts) {
            this.valid = valid;
            this.conflicts = conflicts;
        }
    }
}
