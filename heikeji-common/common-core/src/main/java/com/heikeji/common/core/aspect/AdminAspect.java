package com.heikeji.common.core.aspect;

import com.heikeji.common.core.annotation.RequiresAdmin;
import com.heikeji.common.core.security.UserContextHolderAdapter;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * 管理员权限验证切面
 * 处理@RequiresAdmin注解的验证逻辑
 *
 * @author: zky
 * @date: 2024-01-01
 */
@Aspect
@Component
public class AdminAspect {

    private static final Logger log = LoggerFactory.getLogger(AdminAspect.class);

    /**
     * 定义切点：匹配带有@RequiresAdmin注解的方法
     */
    @Pointcut("@annotation(com.heikeji.common.core.annotation.RequiresAdmin)")
    public void adminPointCut() {
    }

    /**
     * 环绕通知
     */
    @Around("adminPointCut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        // 获取方法签名
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();
        
        // 获取注解
        RequiresAdmin annotation = method.getAnnotation(RequiresAdmin.class);
        
        // 如果需要验证管理员权限
        if (annotation.required()) {
            // 检查用户是否已登录
            if (!UserContextHolderAdapter.isLoggedIn()) {
                log.warn("未登录用户尝试访问需要管理员权限的接口: {}.{}", 
                        method.getDeclaringClass().getName(), method.getName());
                throw new RuntimeException("用户未登录");
            }
            
            // 检查用户是否为管理员
            if (!UserContextHolderAdapter.isAdmin()) {
                log.warn("非管理员用户尝试访问需要管理员权限的接口: {}.{}", 
                        method.getDeclaringClass().getName(), method.getName());
                throw new RuntimeException(annotation.message());
            }
            
            log.debug("管理员用户允许访问接口: {}.{}", 
                    method.getDeclaringClass().getName(), method.getName());
        }
        
        // 执行原方法
        return point.proceed();
    }
}