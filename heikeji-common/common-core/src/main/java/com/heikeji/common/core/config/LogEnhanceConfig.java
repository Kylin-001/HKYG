package com.heikeji.common.core.config;

import ch.qos.logback.classic.encoder.PatternLayoutEncoder;
import ch.qos.logback.core.rolling.RollingFileAppender;
import ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;

/**
 * 日志增强配置类
 * 提供更完善的日志文件输出、归档策略和日志格式配置
 */
@Configuration
@ConfigurationProperties(prefix = "logging.enhance")
public class LogEnhanceConfig {

    private String logDir = "./logs";
    private String maxFileSize = "100MB";
    private String maxHistory = "30";
    private String totalSizeCap = "1GB";
    private boolean consolePrint = true;
    private String encoding = "UTF-8";

    /**
     * 自定义日志文件路径
     */
    @Bean
    public String logFilePath() {
        File logDirectory = new File(logDir);
        if (!logDirectory.exists()) {
            logDirectory.mkdirs();
        }
        return logDir;
    }

    /**
     * 获取应用日志文件名
     */
    public String getApplicationLogFileName() {
        return logDir + File.separator + "application.log";
    }

    /**
     * 获取错误日志文件名
     */
    public String getErrorLogFileName() {
        return logDir + File.separator + "error.log";
    }

    /**
     * 获取业务日志文件名
     */
    public String getBusinessLogFileName() {
        return logDir + File.separator + "business.log";
    }

    /**
     * 获取访问日志文件名
     */
    public String getAccessLogFileName() {
        return logDir + File.separator + "access.log";
    }

    // getter and setter methods

    public String getLogDir() {
        return logDir;
    }

    public void setLogDir(String logDir) {
        this.logDir = logDir;
    }

    public String getMaxFileSize() {
        return maxFileSize;
    }

    public void setMaxFileSize(String maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public String getMaxHistory() {
        return maxHistory;
    }

    public void setMaxHistory(String maxHistory) {
        this.maxHistory = maxHistory;
    }

    public String getTotalSizeCap() {
        return totalSizeCap;
    }

    public void setTotalSizeCap(String totalSizeCap) {
        this.totalSizeCap = totalSizeCap;
    }

    public boolean isConsolePrint() {
        return consolePrint;
    }

    public void setConsolePrint(boolean consolePrint) {
        this.consolePrint = consolePrint;
    }

    public String getEncoding() {
        return encoding;
    }

    public void setEncoding(String encoding) {
        this.encoding = encoding;
    }
}
