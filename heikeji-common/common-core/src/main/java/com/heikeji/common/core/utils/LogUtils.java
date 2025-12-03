package com.heikeji.common.core.utils;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Method;
import java.util.Arrays;

/**
 * 日志工具类
 * @author system
 */
public class LogUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(LogUtils.class);
    
    /**
     * 获取日志记录器
     * @param clazz 类
     * @return Logger
     */
    public static Logger getLogger(Class<?> clazz) {
        return LoggerFactory.getLogger(clazz);
    }
    
    /**
     * 获取方法签名信息
     * @param joinPoint 切入点
     * @return 方法签名信息
     */
    public static String getMethodSignature(ProceedingJoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        String className = joinPoint.getTarget().getClass().getName();
        String methodName = method.getName();
        String params = Arrays.toString(joinPoint.getArgs());
        return className + "." + methodName + "(" + params + ")";
    }
    
    /**
     * 记录操作日志
     * @param module 模块名称
     * @param operation 操作描述
     * @param username 用户名
     * @param params 参数
     */
    public static void recordOperationLog(String module, String operation, String username, String params) {
        logger.info("[操作日志] 模块: {}, 操作: {}, 用户名: {}, 参数: {}", 
                module, operation, username, params != null ? params : "无");
    }
    
    /**
     * 记录错误日志
     */
    public static void error(Logger logger, String message, Exception e) {
        if (logger != null) {
            logger.error(message, e);
        }
    }
}
