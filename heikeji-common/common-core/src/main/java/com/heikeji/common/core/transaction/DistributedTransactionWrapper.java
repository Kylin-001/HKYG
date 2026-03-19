package com.heikeji.common.core.transaction;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

@Slf4j
@Component
public class DistributedTransactionWrapper {

    private final TransactionLogService transactionLogService;

    public DistributedTransactionWrapper(TransactionLogService transactionLogService) {
        this.transactionLogService = transactionLogService;
    }

    // 无参构造函数，使用默认实现
    public DistributedTransactionWrapper() {
        this.transactionLogService = new TransactionLogService() {
            @Override
            public void save(TransactionLog log) {
                // 默认实现：只记录日志
                System.out.println("Saving transaction log: " + log.getTransactionId());
            }

            @Override
            public void update(TransactionLog log) {
                // 默认实现：只记录日志
                System.out.println("Updating transaction log: " + log.getTransactionId() + ", status: " + log.getStatus());
            }

            @Override
            public List<TransactionLog> findByTransactionId(String transactionId) {
                // 默认实现：返回空列表
                return new ArrayList<>();
            }
        };
    }

    public <T> TransactionResult<T> execute(TransactionDefinition definition, Supplier<T> action) {
        String transactionId = generateTransactionId();
        long startTime = System.currentTimeMillis();

        TransactionLog transactionLog = new TransactionLog();
        transactionLog.setTransactionId(transactionId);
        transactionLog.setTransactionType(definition.getType());
        transactionLog.setStatus("STARTED");
        transactionLog.setStartTime(startTime);
        transactionLog.setDescription(definition.getDescription());

        try {
            log.info("Starting distributed transaction: {}", transactionId);
            transactionLogService.save(transactionLog);

            T result = action.get();

            long duration = System.currentTimeMillis() - startTime;
            transactionLog.setStatus("COMMITTED");
            transactionLog.setDuration(duration);
            transactionLog.setEndTime(System.currentTimeMillis());
            transactionLogService.update(transactionLog);

            log.info("Transaction committed successfully: {}, duration: {}ms", transactionId, duration);
            return TransactionResult.success(result, transactionId);

        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            transactionLog.setStatus("FAILED");
            transactionLog.setDuration(duration);
            transactionLog.setEndTime(System.currentTimeMillis());
            transactionLog.setErrorMessage(e.getMessage());
            transactionLogService.update(transactionLog);

            log.error("Transaction failed: {}, error: {}", transactionId, e.getMessage(), e);
            return TransactionResult.failure(e.getMessage(), transactionId);
        }
    }

    public void compensate(String transactionId, List<CompensatableAction> actions) {
        log.info("Starting compensation for transaction: {}", transactionId);

        for (int i = actions.size() - 1; i >= 0; i--) {
            CompensatableAction action = actions.get(i);
            try {
                action.compensate();
                log.info("Compensation action {} completed for transaction {}", i, transactionId);
            } catch (Exception e) {
                log.error("Compensation action {} failed for transaction {}: {}",
                    i, transactionId, e.getMessage(), e);
            }
        }
    }

    public <T> T executeWithRetry(Supplier<T> action, int maxRetries, long retryDelayMs) {
        int attempts = 0;
        Exception lastException = null;

        while (attempts < maxRetries) {
            try {
                return action.get();
            } catch (Exception e) {
                lastException = e;
                attempts++;
                log.warn("Action failed, attempt {}/{}: {}", attempts, maxRetries, e.getMessage());

                if (attempts < maxRetries) {
                    try {
                        Thread.sleep(retryDelayMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        }

        throw new RuntimeException("Action failed after " + maxRetries + " attempts", lastException);
    }

    private String generateTransactionId() {
        return "TX-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 10000);
    }

    public static class TransactionResult<T> {
        private final boolean success;
        private final T data;
        private final String errorMessage;
        private final String transactionId;

        private TransactionResult(boolean success, T data, String errorMessage, String transactionId) {
            this.success = success;
            this.data = data;
            this.errorMessage = errorMessage;
            this.transactionId = transactionId;
        }

        public static <T> TransactionResult<T> success(T data, String transactionId) {
            return new TransactionResult<>(true, data, null, transactionId);
        }

        public static <T> TransactionResult<T> failure(String errorMessage, String transactionId) {
            return new TransactionResult<>(false, null, errorMessage, transactionId);
        }

        public boolean isSuccess() {
            return success;
        }

        public T getData() {
            return data;
        }

        public String getErrorMessage() {
            return errorMessage;
        }

        public String getTransactionId() {
            return transactionId;
        }
    }

    public static class TransactionDefinition {
        private String type;
        private String description;
        private int timeoutSeconds = 30;
        private boolean async = false;

        public TransactionDefinition(String type, String description) {
            this.type = type;
            this.description = description;
        }

        public TransactionDefinition type(String type) {
            this.type = type;
            return this;
        }

        public TransactionDefinition description(String description) {
            this.description = description;
            return this;
        }

        public TransactionDefinition timeout(int seconds) {
            this.timeoutSeconds = seconds;
            return this;
        }

        public TransactionDefinition async(boolean async) {
            this.async = async;
            return this;
        }

        public String getType() {
            return type;
        }

        public String getDescription() {
            return description;
        }

        public int getTimeoutSeconds() {
            return timeoutSeconds;
        }

        public boolean isAsync() {
            return async;
        }
    }

    @FunctionalInterface
    public interface CompensatableAction {
        void compensate() throws Exception;
    }

    public static class TransactionLog {
        private Long id;
        private String transactionId;
        private String transactionType;
        private String status;
        private Long startTime;
        private Long endTime;
        private Long duration;
        private String description;
        private String errorMessage;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTransactionId() { return transactionId; }
        public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
        public String getTransactionType() { return transactionType; }
        public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Long getStartTime() { return startTime; }
        public void setStartTime(Long startTime) { this.startTime = startTime; }
        public Long getEndTime() { return endTime; }
        public void setEndTime(Long endTime) { this.endTime = endTime; }
        public Long getDuration() { return duration; }
        public void setDuration(Long duration) { this.duration = duration; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getErrorMessage() { return errorMessage; }
        public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    }

    public interface TransactionLogService {
        void save(TransactionLog log);
        void update(TransactionLog log);
        List<TransactionLog> findByTransactionId(String transactionId);
    }

    public static TransactionDefinition createDefinition(String type, String description) {
        return new TransactionDefinition(type, description);
    }
}
