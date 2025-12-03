package com.heikeji.mall.common.auth.annotation;

import java.lang.annotation.*;

/**
 * 公共API注解，标记不需要认证的接口
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface PublicApi {
    
    /**
     * 是否公开API
     * @return true表示公开，false表示需要认证
     */
    boolean value() default true;
}
