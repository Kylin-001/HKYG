package com.heikeji.common.core.health;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

/**
 * 数据库健康检查指示器
 * 用于检查数据库连接状态和性能指标
 */
@Component
public class DatabaseHealthIndicator {

    private static final Logger log = LoggerFactory.getLogger(DatabaseHealthIndicator.class);

    @Resource
    private DataSource dataSource;

    /**
     * 执行健康检查
     */
    public Map<String, Object> checkHealth() {
        Map<String, Object> healthInfo = new HashMap<>();
        
        if (dataSource == null) {
            healthInfo.put("status", "DOWN");
            healthInfo.put("error", "DataSource not available");
            return healthInfo;
        }

        try (Connection connection = dataSource.getConnection()) {
            // 获取数据库元信息
            DatabaseMetaData metaData = connection.getMetaData();
            
            // 收集数据库基本信息
            Map<String, Object> dbDetails = new HashMap<>();
            dbDetails.put("database_product", metaData.getDatabaseProductName());
            dbDetails.put("database_version", metaData.getDatabaseProductVersion());
            dbDetails.put("driver_name", metaData.getDriverName());
            dbDetails.put("driver_version", metaData.getDriverVersion());
            dbDetails.put("url", metaData.getURL());
            
            // 执行简单的查询测试（使用纯JDBC）
            long startTime = System.currentTimeMillis();
            boolean querySuccess = false;
            try (Statement statement = connection.createStatement();
                 ResultSet rs = statement.executeQuery("SELECT 1")) {
                if (rs.next()) {
                    int result = rs.getInt(1);
                    querySuccess = result == 1;
                }
            }
            long queryTime = System.currentTimeMillis() - startTime;
            
            dbDetails.put("query_test", querySuccess ? "success" : "failed");
            dbDetails.put("query_time_ms", queryTime);
            dbDetails.put("connection_valid", connection.isValid(5));
            dbDetails.put("data_source_type", dataSource.getClass().getSimpleName());
            
            // 根据查询时间判断数据库性能状态
            String performanceStatus = "normal";
            if (queryTime > 500) {
                performanceStatus = "slow";
            }
            dbDetails.put("performance_status", performanceStatus);
            
            healthInfo.put("status", "UP");
            healthInfo.putAll(dbDetails);
                    
            log.debug("Database health check passed: {}", dbDetails);
            
        } catch (Exception e) {
            log.error("Database health check failed", e);
            healthInfo.put("status", "DOWN");
            healthInfo.put("error", e.getMessage());
            healthInfo.put("exception", e.getClass().getSimpleName());
        }
        
        return healthInfo;
    }
}