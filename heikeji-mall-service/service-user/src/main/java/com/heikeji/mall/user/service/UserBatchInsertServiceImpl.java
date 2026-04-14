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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户批量插入服务实现类
 *
 * 功能特性：
 * 1. 支持单条和批量数据插入
 * 2. 完整的事务处理机制
 * 3. 数据唯一性校验（用户名、学号、手机号）
 * 4. 密码加密存储
 * 5. 异常处理和错误日志记录
 */
@Service
public class UserBatchInsertServiceImpl extends ServiceImpl<UserMapper, User> implements UserBatchInsertService {

    private static final Logger log = LoggerFactory.getLogger(UserBatchInsertServiceImpl.class);

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserBatchInsertServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 单条用户数据插入
     *
     * @param dto 用户数据传输对象
     * @return 插入结果，包含成功/失败信息和用户ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
    public Result<User> insertSingle(UserBatchInsertDTO dto) {
        log.info("开始插入单条用户数据, username: {}, studentNo: {}", dto.getUsername(), dto.getStudentNo());

        try {
            validateUserUniqueness(dto);

            User user = convertToEntity(dto);
            boolean success = save(user);

            if (success) {
                log.info("用户插入成功, userId: {}, username: {}", user.getId(), user.getUsername());
                return Result.success("用户添加成功", user);
            } else {
                log.error("用户插入失败, username: {}", dto.getUsername());
                return Result.error("用户添加失败，请重试");
            }
        } catch (DuplicateKeyException e) {
            log.error("数据重复异常: {}", e.getMessage());
            throw new RuntimeException("数据已存在：" + extractDuplicateField(e.getMessage()), e);
        } catch (Exception e) {
            log.error("插入用户数据时发生异常, username: {}, error: {}", dto.getUsername(), e.getMessage(), e);
            throw new RuntimeException("插入用户数据失败：" + e.getMessage(), e);
        }
    }

    /**
     * 批量用户数据插入
     *
     * @param dtoList 用户数据列表
     * @return 批量插入结果，包含成功/失败统计和详细信息
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
    public Result<List<User>> insertBatch(List<UserBatchInsertDTO> dtoList) {
        log.info("开始批量插入用户数据, 总数: {}", dtoList.size());

        if (dtoList == null || dtoList.isEmpty()) {
            return Result.error("待插入的数据列表不能为空");
        }

        if (dtoList.size() > 100) {
            return Result.error("单次批量插入数量不能超过100条");
        }

        List<User> successList = new ArrayList<>();
        List<String> errorList = new ArrayList<>();
        int successCount = 0;
        int failCount = 0;

        for (int i = 0; i < dtoList.size(); i++) {
            UserBatchInsertDTO dto = dtoList.get(i);
            try {
                validateUserUniqueness(dto);

                User user = convertToEntity(dto);
                boolean saved = save(user);

                if (saved) {
                    successList.add(user);
                    successCount++;
                    log.info("第{}条用户插入成功, userId: {}, username: {}", i + 1, user.getId(), user.getUsername());
                } else {
                    failCount++;
                    errorList.add(String.format("第%d条(username=%s): 插入失败", i + 1, dto.getUsername()));
                    log.warn("第{}条用户插入失败, username: {}", i + 1, dto.getUsername());
                }
            } catch (DuplicateKeyException e) {
                failCount++;
                String errorMsg = String.format("第%d条(username=%s): 数据重复 - %s",
                        i + 1, dto.getUsername(), extractDuplicateField(e.getMessage()));
                errorList.add(errorMsg);
                log.warn("第{}条用户数据重复, username: {}, error: {}", i + 1, dto.getUsername(), e.getMessage());
            } catch (Exception e) {
                failCount++;
                String errorMsg = String.format("第%d条(username=%s): %s",
                        i + 1, dto.getUsername(), e.getMessage());
                errorList.add(errorMsg);
                log.error("第{}条用户插入异常, username: {}, error: {}", i + 1, dto.getUsername(), e.getMessage(), e);
            }
        }

        log.info("批量插入完成, 总数: {}, 成功: {}, 失败: {}", dtoList.size(), successCount, failCount);

        if (failCount == 0) {
            return Result.success(String.format("成功插入%d条用户数据", successCount), successList);
        } else if (successCount == 0) {
            return Result.error(String.format("全部插入失败(%d条)，错误详情：%s",
                    failCount, String.join("; ", errorList)));
        } else {
            return Result.success(String.format("部分成功：成功%d条，失败%d条。失败详情：%s",
                    successCount, failCount, String.join("; ", errorList)), successList);
        }
    }

    /**
     * 验证用户数据唯一性
     * 检查用户名、学号、手机号是否已存在
     */
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

    /**
     * DTO转实体对象
     * 设置默认值并加密密码
     */
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

    /**
     * 从异常信息中提取重复的字段名
     */
    private String extractDuplicateField(String errorMessage) {
        if (errorMessage == null) return "未知字段";
        if (errorMessage.contains("username") || errorMessage.contains("用户名")) return "用户名";
        if (errorMessage.contains("student_no") || errorMessage.contains("学号")) return "学号";
        if (errorMessage.contains("phone") || errorMessage.contains("手机号")) return "手机号";
        if (errorMessage.contains("email") || errorMessage.contains("邮箱")) return "邮箱";
        return "数据";
    }
}
