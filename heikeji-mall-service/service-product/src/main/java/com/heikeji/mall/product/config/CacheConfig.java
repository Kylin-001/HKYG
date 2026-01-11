package com.heikeji.mall.product.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.lang.reflect.Method;
import java.util.Arrays;

/**
 * 商品服务缓存配置类，统一管理缓存策略
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
    public static final String CACHE_NAME_PRODUCT = "productCache";
    
    /**
     * 缓存过期时间常量定义
     */
    public static final int CACHE_EXPIRE_TIME_PRODUCT = 3600; // 商品缓存1小时
    public static final int CACHE_EXPIRE_TIME_CATEGORY = 7200; // 分类缓存2小时
    public static final int CACHE_EXPIRE_TIME_HOT = 1800; // 热门商品缓存30分钟
    public static final int CACHE_EXPIRE_TIME_RECOMMEND = 300; // 推荐商品缓存5分钟
    public static final int CACHE_EXPIRE_TIME_SEARCH = 600; // 搜索结果缓存10分钟
    
    /**
     * 缓存键前缀常量定义
     */
    public static final String CACHE_KEY_PRODUCT = "product::";
    public static final String CACHE_KEY_PRODUCTS = "products::";
    public static final String CACHE_KEY_HOT = "hot::";
    public static final String CACHE_KEY_NEW = "new::";
    public static final String CACHE_KEY_CATEGORY = "category::";
    public static final String CACHE_KEY_CATEGORY_CHILDREN = "category_children::";
    public static final String CACHE_KEY_SEARCH = "search::";
    public static final String CACHE_KEY_RECOMMEND = "recommend::";
    public static final String CACHE_KEY_PERSONALIZED = "personalized::";
    public static final String CACHE_KEY_COUNT = "count::";
    public static final String CACHE_KEY_ALERT = "alert::";
}
