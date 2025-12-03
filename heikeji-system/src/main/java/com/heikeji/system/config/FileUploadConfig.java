package com.heikeji.system.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

/**
 * 文件上传配置
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Configuration
@ConfigurationProperties(prefix = "file.upload")
public class FileUploadConfig {

    /**
     * 上传文件存储路径
     */
    private String path = "/upload/files";

    /**
     * 最大文件大小（MB）
     */
    private long maxFileSize = 10;

    /**
     * 最大请求大小（MB）
     */
    private long maxRequestSize = 50;

    /**
     * 允许的文件类型
     */
    private String allowedTypes = "jpg,png,gif,bmp,jpeg,doc,docx,xls,xlsx,ppt,pptx,pdf,zip,rar";

    /**
     * 创建MultipartResolver
     */
    @Bean(name = "multipartResolver")
    public MultipartResolver multipartResolver() {
        // 直接返回StandardServletMultipartResolver实例
        // 在Spring Boot 3.x中，配置需要在application.properties中设置
        return new StandardServletMultipartResolver();
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public long getMaxFileSize() {
        return maxFileSize;
    }

    public void setMaxFileSize(long maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public long getMaxRequestSize() {
        return maxRequestSize;
    }

    public void setMaxRequestSize(long maxRequestSize) {
        this.maxRequestSize = maxRequestSize;
    }

    public String getAllowedTypes() {
        return allowedTypes;
    }

    public void setAllowedTypes(String allowedTypes) {
        this.allowedTypes = allowedTypes;
    }

    /**
     * 检查文件类型是否允许
     */
    public boolean isAllowedType(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return false;
        }
        String extension = getFileExtension(fileName).toLowerCase();
        String[] allowed = allowedTypes.split(",");
        for (String type : allowed) {
            if (type.trim().equals(extension)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取文件扩展名
     */
    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex < 0) {
            return "";
        }
        return fileName.substring(lastDotIndex + 1);
    }
}
