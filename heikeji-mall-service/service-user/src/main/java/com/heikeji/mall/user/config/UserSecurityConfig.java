package com.heikeji.mall.user.config;

import com.heikeji.mall.common.auth.interceptor.AuthorizationInterceptor;
import com.heikeji.mall.user.interceptor.EnhancedAuthorizationInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 用户安全配置类
 * 用于配置认证和授权相关的组件
 */
@Configuration
public class UserSecurityConfig implements WebMvcConfigurer {

    @Autowired
    private AuthorizationInterceptor authorizationInterceptor;

    @Autowired
    private EnhancedAuthorizationInterceptor enhancedAuthorizationInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authorizationInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/api/auth/login", "/api/auth/register", "/api/auth/refresh")
                .excludePathPatterns("/api/user/login", "/api/user/register", "/api/user/phoneLogin")
                .excludePathPatterns("/api/security/login", "/api/security/validatePassword")
                .excludePathPatterns("/api/common/captcha")
                .excludePathPatterns("/actuator/**")
                .excludePathPatterns("/swagger-ui/**", "/v3/api-docs/**");

        registry.addInterceptor(enhancedAuthorizationInterceptor)
                .addPathPatterns("/api/admin/**")
                .addPathPatterns("/api/user/**");
    }
}