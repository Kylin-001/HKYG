package com.heikeji.mall.common.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 数据插入功能配置属性类
 *
 * 从application.yml中读取data-insert.*配置项，
 * 提供类型安全的配置访问方式。
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "data-insert")
public class DataInsertProperties {

    private BatchConfig batch = new BatchConfig();
    private MonitoringConfig monitoring = new MonitoringConfig();
    private AuditConfig audit = new AuditConfig();
    private CacheConfig cache = new CacheConfig();
    private ValidationConfig validation = new ValidationConfig();

    @Data
    public static class BatchConfig {
        private int defaultBatchSize = 100;
        private int maxSingleRequestSize = 500;
        private int maxBatchSize = 1000;
        private AsyncConfig async = new AsyncConfig();

        @Data
        public static class AsyncConfig {
            private boolean enabled = true;
            private int threadPoolCoreSize = 5;
            private int threadPoolMaxSize = 20;
            private int threadPoolQueueCapacity = 1000;
            private int threadPoolKeepAliveSeconds = 60;
        }
    }

    @Data
    public static class MonitoringConfig {
        private long warningThresholdMs = 2000L;
        private long criticalThresholdMs = 5000L;
        private double failureRateThreshold = 0.1;
    }

    @Data
    public static class AuditConfig {
        private boolean enabled = true;
        private int maxLogSize = 10000;
        private boolean autoMaskSensitiveData = true;
    }

    @Data
    public static class CacheConfig {
        private boolean evictOnInsert = true;
        private String evictionStrategy = "ALL";
    }

    @Data
    public static class ValidationConfig {
        private boolean enableBatchPrecheck = true;
        private int uniquenessCheckTimeout = 5000;
    }
}
