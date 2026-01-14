package com.heikeji.common.core.aspect;

import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 日志切面
 * 用于记录系统关键操作的日志信息
 */
@Aspect
@Component
public class LogAspect {

    private static final Logger log = LoggerFactory.getLogger(LogAspect.class);

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 定义切入点 - 拦截所有Controller层方法
     */
    @Pointcut("execution(* com.heikeji.app.controller.*.*(..)) || execution(* com.heikeji.mall.*.controller.*.*(..))")
    public void logPointCut() {
    }

    /**
     * 定义切入点 - 拦截所有Service层方法
     */
    @Pointcut("execution(* com.heikeji.mall.*.service.impl.*.*(..))")
    public void serviceLogPointCut() {
    }

    /**
     * 前置通知 - 记录请求信息
     */
    @Before("logPointCut()")
    public void doBefore(JoinPoint joinPoint) {
        try {
            // 获取请求信息
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            Method method = signature.getMethod();

            // 记录请求信息
            log.info("[REQUEST] 请求URL: {}", request.getRequestURL().toString());
            log.info("[REQUEST] 请求方法: {}", request.getMethod());
            log.info("[REQUEST] 请求IP: {}", request.getRemoteAddr());
            log.info("[REQUEST] 方法路径: {}.{}", method.getDeclaringClass().getName(), method.getName());
            
            // 记录请求参数（过滤敏感信息）
            Object[] args = joinPoint.getArgs();
            if (args != null && args.length > 0) {
                // 过滤掉request/response等对象
            Object[] filteredArgs = Arrays.stream(args)
                    .filter(arg -> !(arg instanceof HttpServletRequest || arg instanceof jakarta.servlet.http.HttpServletResponse))
                    .toArray();
                if (filteredArgs.length > 0) {
                    String argsJson = objectMapper.writeValueAsString(filteredArgs);
                    // 限制日志长度，避免日志过大
                    if (argsJson.length() > 1000) {
                        argsJson = argsJson.substring(0, 1000) + "... [省略部分参数]";
                    }
                    log.info("[REQUEST] 请求参数: {}", argsJson);
                }
            }
        } catch (Exception e) {
            log.error("记录请求日志失败", e);
        }
    }

    /**
     * 环绕通知 - 记录方法执行时间
     */
    @Around("serviceLogPointCut()")
    public Object aroundService(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.nanoTime();
        Object result;
        
        try {
            // 执行目标方法
            result = joinPoint.proceed();
            
            // 计算执行时间
            long endTime = System.nanoTime();
            long executionTime = TimeUnit.NANOSECONDS.toMillis(endTime - startTime);
            
            // 获取方法信息
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            Method method = signature.getMethod();
            String methodName = method.getDeclaringClass().getName() + "." + method.getName();
            
            // 记录执行时间
            if (executionTime > 1000) {
                // 慢方法警告
                log.warn("[SLOW_METHOD] 方法: {}, 执行时间: {}ms", methodName, executionTime);
            } else {
                log.debug("[METHOD_EXECUTION] 方法: {}, 执行时间: {}ms", methodName, executionTime);
            }
            
            return result;
        } catch (Throwable throwable) {
            // 记录异常信息
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            log.error("[METHOD_EXCEPTION] 方法: {}.{} 执行异常", 
                     signature.getDeclaringType().getName(), 
                     signature.getName(), 
                     throwable);
            throw throwable;
        }
    }

    /**
     * 后置通知 - 记录响应信息
     */
    @AfterReturning(returning = "result", pointcut = "logPointCut()")
    public void doAfterReturning(JoinPoint joinPoint, Object result) {
        try {
            // 记录响应结果（限制长度）
            if (result != null) {
                String resultJson = objectMapper.writeValueAsString(result);
                if (resultJson.length() > 500) {
                    resultJson = resultJson.substring(0, 500) + "... [省略部分响应]";
                }
                log.info("[RESPONSE] 响应结果: {}", resultJson);
            }
        } catch (Exception e) {
            log.error("记录响应日志失败", e);
        }
    }

    /**
     * 异常通知 - 记录异常信息
     */
    @AfterThrowing(value = "logPointCut()", throwing = "e")
    public void doAfterThrowing(JoinPoint joinPoint, Exception e) {
        try {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            
            // 构建异常信息
            Map<String, Object> errorInfo = new HashMap<>();
            errorInfo.put("url", request.getRequestURL().toString());
            errorInfo.put("method", request.getMethod());
            errorInfo.put("ip", request.getRemoteAddr());
            errorInfo.put("className", signature.getDeclaringTypeName());
            errorInfo.put("methodName", signature.getName());
            errorInfo.put("exception", e.getClass().getName());
            errorInfo.put("message", e.getMessage());
            
            log.error("[REQUEST_ERROR] 错误信息: {}, 异常堆栈: ", 
                     objectMapper.writeValueAsString(errorInfo), e);
        } catch (Exception ex) {
            log.error("记录异常日志失败", ex);
        }
    }
}
