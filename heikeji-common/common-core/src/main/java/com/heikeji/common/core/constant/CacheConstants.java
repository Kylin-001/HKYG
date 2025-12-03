package com.heikeji.common.core.constant;

/**
 * 缓存常量类
 * 定义缓存相关的常量值
 *
 * @author: zky
 * @date: 2024-01-01
 */
public class CacheConstants {

    /**
     * 空值标记
     */
    public static final Object NULL_VALUE = new NullValue();
    
    /**
     * 默认过期时间（秒）
     */
    public static final long DEFAULT_EXPIRE_TIME = 300;
    
    /**
     * 短时间过期时间（秒）- 用于缓存空值
     */
    public static final long SHORT_EXPIRE_TIME = 60;
    
    /**
     * 长时间过期时间（秒）
     */
    public static final long LONG_EXPIRE_TIME = 3600;
    
    /** 默认锁过期时间（秒） */
    public static final long DEFAULT_LOCK_EXPIRE = 30;
    
    /** 分布式锁前缀 */
    public static final String LOCK_PREFIX = "lock:";
    
    /**
     * 用户相关缓存前缀
     */
    public static final String USER_CACHE_PREFIX = "user:";
    
    /**
     * 商品相关缓存前缀
     */
    public static final String PRODUCT_CACHE_PREFIX = "product:";
    
    /**
     * 订单相关缓存前缀
     */
    public static final String ORDER_CACHE_PREFIX = "order:";
    
    /**
     * 配置相关缓存前缀
     */
    public static final String CONFIG_CACHE_PREFIX = "config:";
    
    /**
     * 权限相关缓存前缀
     */
    public static final String PERMISSION_CACHE_PREFIX = "permission:";
    
    /**
     * 菜单相关缓存前缀
     */
    public static final String MENU_CACHE_PREFIX = "menu:";
    
    /**
     * 角色相关缓存前缀
     */
    public static final String ROLE_CACHE_PREFIX = "role:";
    
    /**
     * 分类相关缓存前缀
     */
    public static final String CATEGORY_CACHE_PREFIX = "category:";
    
    /**
     * 品牌相关缓存前缀
     */
    public static final String BRAND_CACHE_PREFIX = "brand:";
    
    /**
     * 库存相关缓存前缀
     */
    public static final String STOCK_CACHE_PREFIX = "stock:";
    
    /**
     * 优惠券相关缓存前缀
     */
    public static final String COUPON_CACHE_PREFIX = "coupon:";
    
    /**
     * 购物车相关缓存前缀
     */
    public static final String CART_CACHE_PREFIX = "cart:";
    
    /**
     * 收货地址相关缓存前缀
     */
    public static final String ADDRESS_CACHE_PREFIX = "address:";
    
    /**
     * 搜索历史相关缓存前缀
     */
    public static final String SEARCH_HISTORY_CACHE_PREFIX = "search_history:";
    
    /**
     * 热门搜索相关缓存前缀
     */
    public static final String HOT_SEARCH_CACHE_PREFIX = "hot_search:";
    
    /**
     * 统计数据相关缓存前缀
     */
    public static final String STAT_CACHE_PREFIX = "stat:";
    
    /**
     * 分布式锁相关缓存前缀
     */
    public static final String LOCK_CACHE_PREFIX = "lock:";
    
    /**
     * 布隆过滤器相关缓存前缀
     */
    public static final String BLOOM_FILTER_PREFIX = "bloom:";
    
    /**
     * 用户会话相关缓存前缀
     */
    public static final String SESSION_CACHE_PREFIX = "session:";
    
    /**
     * Token相关缓存前缀
     */
    public static final String TOKEN_CACHE_PREFIX = "token:";
    
    /**
     * 验证码相关缓存前缀
     */
    public static final String CAPTCHA_CACHE_PREFIX = "captcha:";
    
    /**
     * 分布式限流相关缓存前缀
     */
    public static final String RATE_LIMIT_CACHE_PREFIX = "rate_limit:";
    
    /**
     * 空值内部类
     */
    private static class NullValue implements java.io.Serializable {
        private static final long serialVersionUID = 1L;
        
        @Override
        public String toString() {
            return "[NULL_VALUE]";
        }
    }
}