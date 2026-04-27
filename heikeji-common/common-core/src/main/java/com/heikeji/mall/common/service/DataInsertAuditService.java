package com.heikeji.mall.common.service;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

/**
 * 数据插入审计日志服务
 *
 * 功能：
 * 1. 记录所有数据插入操作的详细信息
 * 2. 支持操作追溯和安全审计
 * 3. 自动脱敏敏感信息
 * 4. 提供查询和统计接口
 */
@Service
public class DataInsertAuditService {

    private static final Logger log = LoggerFactory.getLogger(DataInsertAuditService.class);

    private final List<AuditLogEntry> auditLogs = new CopyOnWriteArrayList<>();

    private static final int MAX_LOG_SIZE = 10000;

    /**
     * 记录审计日志
     *
     * @param action   操作类型
     * @param status   操作状态 (SUCCESS/FAILURE/DUPLICATE/PARTIAL_SUCCESS)
     * @param target   操作目标（如用户名、商品名）
     * @param entityId 实体ID（可为null）
     */
    public void record(String action, String status, String target, Long entityId) {
        AuditLogEntry entry = AuditLogEntry.builder()
                .action(action)
                .status(status)
                .target(maskSensitiveData(target))
                .entityId(entityId)
                .timestamp(LocalDateTime.now())
                .threadName(Thread.currentThread().getName())
                .build();

        auditLogs.add(entry);
        log.debug("审计日志记录: {}", entry);

        if (auditLogs.size() > MAX_LOG_SIZE) {
            cleanupOldEntries();
        }
    }

    /**
     * 查询审计日志
     *
     * @param action   操作类型过滤（可选）
     * @param status   状态过滤（可选）
     * @param limit    返回数量限制
     * @return 日志列表
     */
    public List<AuditLogEntry> query(String action, String status, int limit) {
        return auditLogs.stream()
                .filter(entry -> action == null || action.equals(entry.getAction()))
                .filter(entry -> status == null || status.equals(entry.getStatus()))
                .sorted((e1, e2) -> e2.getTimestamp().compareTo(e1.getTimestamp()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * 获取统计信息
     */
    public AuditStatistics getStatistics() {
        long total = auditLogs.size();
        long successCount = auditLogs.stream()
                .filter(e -> "SUCCESS".equals(e.getStatus())).count();
        long failureCount = auditLogs.stream()
                .filter(e -> "FAILURE".equals(e.getStatus()) || "DUPLICATE".equals(e.getStatus())).count();

        Map<String, Long> actionStats = auditLogs.stream()
                .collect(Collectors.groupingBy(
                        AuditLogEntry::getAction,
                        Collectors.counting()
                ));

        return AuditStatistics.builder()
                .totalOperations(total)
                .successCount(successCount)
                .failureCount(failureCount)
                .successRate(total > 0 ? (double) successCount / total : 0)
                .actionBreakdown(actionStats)
                .build();
    }

    /**
     * 清理过期日志（保留最近1000条）
     */
    public void cleanupOldEntries() {
        if (auditLogs.size() > MAX_LOG_SIZE) {
            int removeCount = auditLogs.size() - MAX_LOG_SIZE + 1000;
            for (int i = 0; i < removeCount && !auditLogs.isEmpty(); i++) {
                auditLogs.remove(0);
            }
            log.info("清理了{}条过期审计日志, 当前保留: {}", removeCount, auditLogs.size());
        }
    }

    /**
     * 敏感数据脱敏处理
     */
    private String maskSensitiveData(String data) {
        if (data == null || data.isEmpty()) return data;

        if (isPhoneNumber(data)) {
            return maskPhone(data);
        } else if (isEmail(data)) {
            return maskEmail(data);
        } else if (isIdCard(data)) {
            return maskIdCard(data);
        }

        return data;
    }

    private boolean isPhoneNumber(String str) {
        return str.matches("^1[3-9]\\d{9}$");
    }

    private boolean isEmail(String str) {
        return str.contains("@") && str.contains(".");
    }

    private boolean isIdCard(String str) {
        return str.matches("^\\d{17}[\\dXx]$") || str.matches("^\\d{15}$");
    }

    private String maskPhone(String phone) {
        if (phone.length() >= 7) {
            return phone.substring(0, 3) + "****" + phone.substring(phone.length() - 4);
        }
        return "****";
    }

    private String maskEmail(String email) {
        int atIndex = email.indexOf('@');
        if (atIndex > 2) {
            return email.substring(0, 2) + "***" + email.substring(atIndex);
        }
        return "***@***";
    }

    private String maskIdCard(String idCard) {
        if (idCard.length() == 18) {
            return idCard.substring(0, 6) + "********" + idCard.substring(14);
        } else if (idCard.length() == 15) {
            return idCard.substring(0, 6) + "*****" + idCard.substring(11);
        }
        return "***********";
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuditLogEntry {
        private String action;
        private String status;
        private String target;
        private Long entityId;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime timestamp;

        private String threadName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuditStatistics {
        private long totalOperations;
        private long successCount;
        private long failureCount;
        private double successRate;
        private java.util.Map<String, Long> actionBreakdown;
    }
}
