package com.heikeji.mall.takeout.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC配置类
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * 图片存储路径
     */
    @Value("${file.upload.path}")
    private String uploadPath;

    /**
     * 图片访问路径
     */
    @Value("${file.upload.access-path}")
    private String accessPath;

    /**
     * 配置静态资源映射
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置图片上传路径映射
        registry.addResourceHandler(accessPath)
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
