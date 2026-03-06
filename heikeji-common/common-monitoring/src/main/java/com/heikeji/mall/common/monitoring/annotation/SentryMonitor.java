package com.heikeji.mall.common.monitoring.annotation;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface SentryMonitor {
    
    String operation() default "";
    
    String description() default "";
    
    boolean captureArguments() default true;
    
    boolean captureResult() default false;
}
