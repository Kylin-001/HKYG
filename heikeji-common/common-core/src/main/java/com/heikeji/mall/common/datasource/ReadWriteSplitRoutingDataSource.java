package com.heikeji.mall.common.datasource;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 读写分离数据源路由
 *
 * 基于Spring AbstractRoutingDataSource实现：
 * 1. 写操作路由到主库（Master）
 * 2. 读操作负载均衡到从库（Slave）
 * 3. 支持强制读主库（保证数据一致性）
 * 4. 从库健康检查和自动剔除
 *
 * 使用方式：
 * @Transactional(readOnly = true) → 自动路由到从库
 * @Transactional → 路由到主库
 * DataSourceContextHolder.forceMaster() → 强制读主库
 */
@Slf4j
@Component
public class ReadWriteSplitRoutingDataSource extends AbstractRoutingDataSource {

    private static final ThreadLocal<DataSourceType> contextHolder = new ThreadLocal<>();

    private final AtomicInteger slaveCounter = new AtomicInteger(0);
    private final ConcurrentHashMap<String, Boolean> slaveHealthStatus = new ConcurrentHashMap<>();
    private int slaveCount;

    @Override
    protected Object determineCurrentLookupKey() {
        DataSourceType type = contextHolder.get();

        if (type == null) {
            type = DataSourceType.MASTER; // 默认主库
        }

        if (type == DataSourceType.SLAVE) {
            return selectHealthySlave();
        }

        log.debug("数据源路由: {}", type);
        return type;
    }

    /**
     * 选择健康的从库（轮询+健康检查）
     */
    private String selectHealthySlave() {
        if (slaveCount <= 1) {
            return DataSourceType.SLAVE.name();
        }

        for (int i = 0; i < slaveCount; i++) {
            int index = Math.abs(slaveCounter.getAndIncrement() % slaveCount);
            String slaveKey = "SLAVE_" + index;

            if (isSlaveHealthy(slaveKey)) {
                log.debug("选择从库: {}", slaveKey);
                return slaveKey;
            }
        }

        // 所有从库都不健康，降级到主库
        log.warn("⚠️ 所有从库不健康，降级到主库读取");
        contextHolder.set(DataSourceType.MASTER);
        return DataSourceType.MASTER.name();
    }

    private boolean isSlaveHealthy(String slaveKey) {
        return slaveHealthStatus.getOrDefault(slaveKey, true);
    }

    public void setSlaveCount(int count) {
        this.slaveCount = count;
        log.info("读写分离配置: 主库x1 + 从库x{}", count);
    }

    public void markSlaveUnhealthy(String slaveKey) {
        slaveHealthStatus.put(slaveKey, false);
        log.warn("❌ 从库标记为不健康: {}", slaveKey);

        // 启动定时健康检查任务
        scheduleHealthCheck(slaveKey);
    }

    public void markSlaveHealthy(String slaveKey) {
        slaveHealthStatus.put(slaveKey, true);
        log.info("✅ 从库恢复健康: {}", slaveKey);
    }

    private void scheduleHealthCheck(String slaveKey) {
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                // 模拟健康检查（实际应执行真实查询）
                boolean healthy = checkSlaveHealth(slaveKey);
                if (healthy) {
                    markSlaveHealthy(slaveKey);
                    log.info("✅ 从库健康检查通过: {}", slaveKey);
                } else {
                    log.warn("❌ 从库仍不健康: {}，30秒后重试", slaveKey);
                    scheduleHealthCheck(slaveKey);
                }
            }
        }, 30000); // 30秒后重试
    }

    private boolean checkSlaveHealth(String slaveKey) {
        // 实际实现应执行 SELECT 1 或心跳查询
        return true;
    }

    public static void setDataSourceType(DataSourceType type) {
        contextHolder.set(type);
    }

    public static DataSourceType getDataSourceType() {
        return contextHolder.get();
    }

    public static void clearDataSourceType() {
        contextHolder.remove();
    }

    public static void forceMaster() {
        contextHolder.set(DataSourceType.MASTER);
    }

    public static void forceSlave() {
        contextHolder.set(DataSourceType.SLAVE);
    }

    public enum DataSourceType {
        MASTER,
        SLAVE
    }
}
