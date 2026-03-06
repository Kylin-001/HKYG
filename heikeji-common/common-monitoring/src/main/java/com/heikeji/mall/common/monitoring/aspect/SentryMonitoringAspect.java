package com.heikeji.mall.common.monitoring.aspect;

import com.heikeji.mall.common.monitoring.service.SentryErrorTrackingService;
import io.sentry.SentryLevel;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Aspect
@Component
public class SentryMonitoringAspect {

    @Autowired
    private SentryErrorTrackingService sentryErrorTrackingService;

    @Pointcut("@annotation(com.heikeji.mall.common.monitoring.annotation.SentryMonitor)")
    public void monitoredMethods() {
    }

    @Around("monitoredMethods()")
    public Object monitorMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        String operation = className + "." + methodName;
        String description = "Method execution: " + operation;
        
        sentryErrorTrackingService.startTransaction(operation, description);
        
        long startTime = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            
            long duration = System.currentTimeMillis() - startTime;
            
            sentryErrorTrackingService.addBreadcrumb("method", 
                "Method executed successfully", 
                Map.of(
                    "class", className,
                    "method", methodName,
                    "duration", String.valueOf(duration)
                ));
            
            sentryErrorTrackingService.setExtra("method.duration", duration);
            
            return result;
        } catch (Throwable throwable) {
            long duration = System.currentTimeMillis() - startTime;
            
            Map<String, Object> errorContext = new HashMap<>();
            errorContext.put("class", className);
            errorContext.put("method", methodName);
            errorContext.put("duration", duration);
            errorContext.put("arguments", joinPoint.getArgs());
            
            sentryErrorTrackingService.captureException(throwable, errorContext);
            
            sentryErrorTrackingService.addBreadcrumb("method", 
                "Method execution failed", 
                Map.of(
                    "class", className,
                    "method", methodName,
                    "duration", String.valueOf(duration),
                    "error", throwable.getMessage()
                ));
            
            throw throwable;
        } finally {
            sentryErrorTrackingService.finishTransaction("completed");
        }
    }

    @Pointcut("execution(* com.heikeji.mall..controller..*(..))")
    public void controllerMethods() {
    }

    @Around("controllerMethods()")
    public Object monitorController(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        sentryErrorTrackingService.addBreadcrumb("controller", 
            "Controller method called", 
            Map.of(
                "class", className,
                "method", methodName
            ));
        
        long startTime = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            
            long duration = System.currentTimeMillis() - startTime;
            if (duration > 3000) {
                sentryErrorTrackingService.captureMessage(
                    String.format("Slow controller method: %s.%s (%dms)", 
                        className, methodName, duration),
                    SentryLevel.WARNING
                );
            }
            
            return result;
        } catch (Throwable throwable) {
            long duration = System.currentTimeMillis() - startTime;
            
            Map<String, Object> errorContext = new HashMap<>();
            errorContext.put("controller", className);
            errorContext.put("method", methodName);
            errorContext.put("duration", duration);
            
            sentryErrorTrackingService.captureException(throwable, errorContext);
            
            throw throwable;
        }
    }
}
