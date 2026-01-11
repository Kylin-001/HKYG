package com.heikeji.mall.campus.config;

import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.lang.reflect.Method;

/**
 * 校园信息服务缓存配置类，统一管理缓存策略
 */
@Configuration
@EnableCaching
public class CacheConfig extends CachingConfigurerSupport {
    
    /**
     * 自定义缓存键生成器，生成统一格式的缓存键
     * 格式：methodName::param1::param2::...::paramN
     */
    @Bean
    @Override
    public KeyGenerator keyGenerator() {
        return new KeyGenerator() {
            @Override
            public Object generate(Object target, Method method, Object... params) {
                StringBuilder sb = new StringBuilder();
                sb.append(method.getName());
                sb.append("::");
                for (Object param : params) {
                    if (param != null) {
                        sb.append(param.toString());
                        sb.append("::");
                    }
                }
                return sb.toString();
            }
        };
    }
    
    /**
     * 缓存名称常量定义
     */
    public static final String CACHE_NAME_CAMPUS = "campusCache";
    public static final String CACHE_NAME_NOTICE = "noticeCache";
    public static final String CACHE_NAME_CLASSROOM = "classroomCache";
    
    /**
     * 缓存过期时间常量定义
     */
    public static final int CACHE_EXPIRE_TIME_NOTICE = 3600; // 公告缓存1小时
    public static final int CACHE_EXPIRE_TIME_CLASSROOM = 1800; // 空教室缓存30分钟
    public static final int CACHE_EXPIRE_TIME_STATISTICS = 300; // 统计数据缓存5分钟
    public static final int CACHE_EXPIRE_TIME_CONTENT = 7200; // 内容缓存2小时
    
    /**
     * 缓存键前缀常量定义
     */
    public static final String CACHE_KEY_NOTICE = "notice::";
    public static final String CACHE_KEY_CLASSROOM = "classroom::";
    public static final String CACHE_KEY_STATISTICS = "statistics::";
    public static final String CACHE_KEY_CONTENT = "content::";
    public static final String CACHE_KEY_HOT = "hot::";
    public static final String CACHE_KEY_LATEST = "latest::";
}