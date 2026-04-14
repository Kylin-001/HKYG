package com.heikeji.mall.common.message;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;

/**
 * 数据插入消息队列服务
 *
 * 基于RabbitMQ实现的异步解耦方案：
 * 1. 超大批量数据导入（>1000条）使用消息队列异步处理
 * 2. 实现生产者-消费者模式，削峰填谷
 * 3. 支持消息持久化、重试、死信队列
 * 4. 提供同步/异步双模式
 *
 * 队列设计：
 * - data.insert.direct: 直接交换机（点对点）
 * - data.insert.user: 用户数据队列
 * - data.insert.product: 商品数据队列
 * - data.insert.batch: 批量操作队列
 * - data.insert.dlq: 死信队列（失败消息）
 */
@Service
public class DataInsertMessageService {

    private static final Logger log = LoggerFactory.getLogger(DataInsertMessageService.class);

    private static final String EXCHANGE_NAME = "data.insert.direct";
    private static final String USER_QUEUE = "data.insert.user";
    private static final String PRODUCT_QUEUE = "data.insert.product";
    private static final String BATCH_QUEUE = "data.insert.batch";
    private static final String DLQ_QUEUE = "data.insert.dlq";

    @Autowired(required = false)
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired(required = false)
    private DataInsertMessageCallback callbackService;

    private final Map<String, MessageProcessingStatus> processingStatusMap = new HashMap<>();

    /**
     * 异步发送单条用户插入消息
     */
    public CompletableFuture<String> sendUserInsertAsync(UserInsertMessage message) {
        return CompletableFuture.supplyAsync(() -> {
            String messageId = generateMessageId();
            message.setMessageId(messageId);
            message.setCreateTime(LocalDateTime.now());

            try {
                if (rabbitTemplate != null) {
                    rabbitTemplate.convertAndSend(EXCHANGE_NAME, USER_QUEUE, message);
                    log.info("📤 用户插入消息已发送, messageId={}, username={}",
                            messageId, message.getUsername());
                } else {
                    processLocally(message);
                }
                return messageId;
            } catch (Exception e) {
                log.error("❌ 发送用户插入消息失败: {}", e.getMessage(), e);
                throw new RuntimeException("消息发送失败: " + e.getMessage(), e);
            }
        });
    }

    /**
     * 异步发送批量插入消息
     * 用于大批量数据导入场景（>1000条）
     */
    public CompletableFuture<BatchInsertResult> sendBatchInsertAsync(
            BatchInsertMessage message) {

        return CompletableFuture.supplyAsync(() -> {
            String batchId = UUID.randomUUID().toString().substring(0, 8);
            message.setBatchId(batchId);
            message.setCreateTime(LocalDateTime.now());

            MessageProcessingStatus status = new MessageProcessingStatus();
            status.setBatchId(batchId);
            status.setTotalCount(message.getDataList().size());
            status.setStatus("PENDING");
            status.setStartTime(LocalDateTime.now());
            processingStatusMap.put(batchId, status);

            try {
                if (rabbitTemplate != null) {
                    rabbitTemplate.convertAndSend(EXCHANGE_NAME, BATCH_QUEUE, message);
                    log.info("📤 批量插入消息已发送, batchId={}, 总数={}",
                            batchId, message.getDataList().size());
                } else {
                    BatchInsertResult result = processBatchLocally(message);
                    status.setStatus("COMPLETED");
                    status.setSuccessCount(result.getSuccessCount());
                    status.setFailCount(result.getFailCount());
                    return result;
                }

                return BatchInsertResult.accepted(batchId, message.getDataList().size());
            } catch (Exception e) {
                log.error("❌ 发送批量插入消息失败: {}", e.getMessage(), e);
                status.setStatus("FAILED");
                status.setErrorMessage(e.getMessage());
                throw new RuntimeException("批量消息发送失败: " + e.getMessage(), e);
            }
        });
    }

    /**
     * 查询批量处理状态
     */
    public MessageProcessingStatus getBatchStatus(String batchId) {
        return processingStatusMap.getOrDefault(batchId,
                new MessageProcessingStatus("UNKNOWN", 0, 0, 0));
    }

    /**
     * 处理接收到的用户插入消息（消费者端）
     */
    public void handleUserInsertMessage(UserInsertMessage message) {
        log.info("📥 处理用户插入消息: messageId={}, username={}",
                message.getMessageId(), message.getUsername());

        try {
            if (callbackService != null) {
                callbackService.onUserInsertReceived(message);
            }
            updateProcessingStatus(message.getBatchId(), "PROCESSING");
        } catch (Exception e) {
            log.error("❌ 处理用户插入消息异常: messageId={}, error={}",
                    message.getMessageId(), e.getMessage(), e);
            sendToDeadLetterQueue(message, e.getMessage());
            updateProcessingStatus(message.getBatchId(), "FAILED");
        }
    }

    /**
     * 处理接收到的批量插入消息（消费者端）
     */
    public void handleBatchInsertMessage(BatchInsertMessage message) {
        log.info("📥 处理批量插入消息: batchId={}, 数量={}",
                message.getBatchId(), message.getDataList().size());

        MessageProcessingStatus status = processingStatusMap.get(message.getBatchId());
        if (status != null) {
            status.setStatus("PROCESSING");
        }

        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();

        for (int i = 0; i < message.getDataList().size(); i++) {
            Object data = message.getDataList().get(i);
            try {
                if (callbackService != null) {
                    callbackService.onBatchItemReceived(message.getBatchId(), i, data);
                }
                successCount++;
            } catch (Exception e) {
                failCount++;
                errors.add(String.format("第%d条: %s", i + 1, e.getMessage()));
                log.warn("⚠️ 批量第{}条处理失败: {}", i + 1, e.getMessage());
            }
        }

        if (status != null) {
            status.setStatus("COMPLETED");
            status.setSuccessCount(successCount);
            status.setFailCount(failCount);
            status.setEndTime(LocalDateTime.now());
        }

        log.info("✅ 批量处理完成: batchId={}, 成功={}, 失败={}",
                message.getBatchId(), successCount, failCount);

        if (callbackService != null) {
            callbackService.onBatchCompleted(message.getBatchId(),
                    new BatchInsertResult(message.getBatchId(), successCount, failCount, errors));
        }
    }

    /**
     * 发送到死信队列
     */
    private void sendToDeadLetterQueue(Object originalMessage, String errorMessage) {
        if (rabbitTemplate == null) return;

        try {
            DeadLetterMessage dlm = DeadLetterMessage.builder()
                    .originalMessage(originalMessage)
                    .errorMessage(errorMessage)
                    .failedTime(LocalDateTime.now())
                    .retryCount(0)
                    .build();

            rabbitTemplate.convertAndSend(EXCHANGE_NAME, DLQ_QUEUE + ".routing", dlm);
            log.warn("💀 消息已发送到死信队列: {}", errorMessage);
        } catch (Exception e) {
            log.error("❌ 发送死信队列失败: {}", e.getMessage(), e);
        }
    }

    private void processLocally(Object message) {
        log.info("🔄 RabbitMQ未配置，降级为本地处理");
        if (callbackService != null) {
            if (message instanceof UserInsertMessage) {
                callbackService.onUserInsertReceived((UserInsertMessage) message);
            }
        }
    }

    private BatchInsertResult processBatchLocally(BatchInsertMessage message) {
        int success = 0;
        int fail = 0;
        for (Object data : message.getDataList()) {
            try {
                if (callbackService != null) {
                    callbackService.onBatchItemReceived(message.getBatchId(), success + fail, data);
                }
                success++;
            } catch (Exception e) {
                fail++;
            }
        }
        return new BatchInsertResult(message.getBatchId(), success, fail, Collections.emptyList());
    }

    private void updateProcessingStatus(String batchId, String status) {
        if (batchId != null && processingStatusMap.containsKey(batchId)) {
            processingStatusMap.get(batchId).setStatus(status);
        }
    }

    private String generateMessageId() {
        return "MSG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // ==================== 消息模型定义 ====================

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class UserInsertMessage {
        private String messageId;
        private String username;
        private String studentNo;
        private String nickname;
        private String phone;
        private String password;
        private Map<String, Object> extraData;
        private String batchId;
        private LocalDateTime createTime;
        private Integer priority;
        private String source; // API/IMPORT/SYNC
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchInsertMessage {
        private String batchId;
        private List<Object> dataList;
        private String module; // user/product/order
        private LocalDateTime createTime;
        private Integer totalSize;
        private String source;
        private Map<String, Object> metadata;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchInsertResult {
        private String batchId;
        private int successCount;
        private int failCount;
        private List<String> errors;
        private LocalDateTime completedTime;

        public static BatchInsertResult accepted(String batchId, int totalCount) {
            return BatchInsertResult.builder()
                    .batchId(batchId)
                    .successCount(0)
                    .failCount(0)
                    .completedTime(LocalDateTime.now())
                    .errors(Collections.singletonList("任务已提交，请通过batchId查询进度"))
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeadLetterMessage {
        private Object originalMessage;
        private String errorMessage;
        private LocalDateTime failedTime;
        private int retryCount;
        private String lastError;
    }

    @Data
    @AllArgsConstructor
    public static class MessageProcessingStatus {
        private String batchId;
        private String status; // PENDING/PROCESSING/COMPLETED/FAILED/PARTIAL
        private int totalCount;
        private int successCount;
        private int failCount;
        private String errorMessage;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private double progress;

        public MessageProcessingStatus() {}

        public MessageProcessingStatus(String status, int total, int success, int fail) {
            this.status = status;
            this.totalCount = total;
            this.successCount = success;
            this.failCount = fail;
            this.progress = total > 0 ? (double) (success + fail) / total : 0;
        }
    }
}
