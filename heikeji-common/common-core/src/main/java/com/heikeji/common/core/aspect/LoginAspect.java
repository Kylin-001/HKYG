package com.heikeji.common.core.aspect;

import com.heikeji.common.core.annotation.RequiresLogin;
import com.heikeji.common.core.security.UserContext;
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
 * 登录验证切面
 * 处理@RequiresLogin注解的验证逻辑
 *
 * @author: zky
 * @date: 2024-01-01
 */
@Aspect
@Component
public class LoginAspect {

    private static final Logger log = LoggerFactory.getLogger(LoginAspect.class);

    /**
     * 定义切点：匹配带有@RequiresLogin注解的方法
     */
    @Pointcut("@annotation(com.heikeji.common.core.annotation.RequiresLogin)")
    public void loginPointCut() {
    }

    /**
     * 环绕通知
     */
    @Around("loginPointCut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        // 获取方法签名
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();
        
        // 获取注解
        RequiresLogin annotation = method.getAnnotation(RequiresLogin.class);
        
        // 如果需要验证登录状态
        if (annotation.required()) {
            // 检查用户是否已登录
            if (!isLoggedIn()) {
                log.warn("未登录用户尝试访问需要登录的接口: {}.{}", 
                        method.getDeclaringClass().getName(), method.getName());
                throw new RuntimeException(annotation.message());
            }
            
            log.debug("用户已登录，允许访问接口: {}.{}", 
                    method.getDeclaringClass().getName(), method.getName());
        }
        
        // 执行原方法
        return point.proceed();
    }

    /**
     * 检查用户是否已登录
     * 同时检查新旧两种上下文
     */
    private boolean isLoggedIn() {
        return UserContextHolderAdapter.isLoggedIn();
    }
}