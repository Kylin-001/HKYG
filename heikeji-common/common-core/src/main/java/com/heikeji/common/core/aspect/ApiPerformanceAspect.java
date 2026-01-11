package com.heikeji.common.core.aspect;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Objects;

/**
 * API接口性能监控切面
 * 监控所有Controller方法的执行时间和参数信息
 */
@Aspect
@Component
public class ApiPerformanceAspect {

    private static final Logger log = LoggerFactory.getLogger(ApiPerformanceAspect.class);

    // 定义切入点：监控所有Controller包下的方法
    @Pointcut("execution(* com.heikeji.*.*.controller..*.*(..))")
    public void apiPointCut() {
    }

    // 执行环绕通知
    @Around("apiPointCut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        // 获取请求信息
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        
        // 获取方法签名
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();
        String className = method.getDeclaringClass().getName();
        String methodName = method.getName();
        String uri = request.getRequestURI();
        String methodType = request.getMethod();
        String ip = getClientIp(request);
        
        // 记录请求开始
        if (log.isDebugEnabled()) {
            log.debug("[API-START] URI: {}, Method: {}, IP: {}, Class: {}, Method: {}, Params: {}",
                    uri, methodType, ip, className, methodName, Arrays.toString(point.getArgs()));
        }
        
        // 执行目标方法
        Object result;
        try {
            result = point.proceed();
        } catch (Exception e) {
            // 记录异常信息
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            log.error("[API-ERROR] URI: {}, Method: {}, Execution Time: {}ms, Error: {}",
                    uri, methodType, executionTime, e.getMessage(), e);
            throw e;
        }
        
        // 计算执行时间
        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;
        
        // 根据执行时间记录不同级别的日志
        if (executionTime > 5000) {
            // 执行时间超过5秒，记录警告日志
            log.warn("[API-SLOW] URI: {}, Method: {}, IP: {}, Execution Time: {}ms",
                    uri, methodType, ip, executionTime);
        } else if (executionTime > 1000) {
            // 执行时间超过1秒，记录info日志
            log.info("[API-WARNING] URI: {}, Method: {}, IP: {}, Execution Time: {}ms",
                    uri, methodType, ip, executionTime);
        } else if (log.isDebugEnabled()) {
            // 正常执行时间，记录debug日志
            log.debug("[API-END] URI: {}, Method: {}, IP: {}, Execution Time: {}ms",
                    uri, methodType, ip, executionTime);
        }
        
        return result;
    }
    
    /**
     * 获取客户端真实IP
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // 多层代理情况下，取第一个IP
        if (ip != null && ip.indexOf(",") > 0) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}
