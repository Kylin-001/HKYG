package com.heikeji.common.core.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heikeji.common.core.constant.CommonConstants;
import com.heikeji.common.core.utils.LogUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * 操作日志切面
 * 记录用户操作日志，包括操作时间、操作人、操作内容、IP地址等信息
 */
@Aspect
@Component
public class OperationLogAspect {

    private static final Logger log = LoggerFactory.getLogger("operation");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 定义切入点 - 拦截所有Controller方法
     */
    @Pointcut("execution(* com.heikeji.app.controller.*.*(..)) || execution(* com.heikeji.mall.*.controller.*.*(..))")
    public void operationLogPointCut() {
    }

    /**
     * 环绕通知 - 记录操作日志
     */
    @Around("operationLogPointCut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object result = null;
        String errorMsg = null;

        try {
            // 执行原方法
            result = point.proceed();
            return result;
        } catch (Exception e) {
            errorMsg = getErrorStackTrace(e);
            throw e;
        } finally {
            try {
                // 记录操作日志
                recordOperationLog(point, startTime, System.currentTimeMillis(), errorMsg, result);
            } catch (Exception e) {
                // 记录日志失败不影响主流程
                LogUtils.error(LoggerFactory.getLogger(OperationLogAspect.class), "记录操作日志失败", e);
            }
        }
    }

    /**
     * 记录操作日志
     */
    private void recordOperationLog(ProceedingJoinPoint point, long startTime, long endTime, String errorMsg, Object result) {
        HttpServletRequest request = getRequest();
        if (request == null) {
            return;
        }

        // 获取方法签名
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();

        // 构建日志信息
        Map<String, Object> logInfo = new HashMap<>();
        logInfo.put("timestamp", LocalDateTime.now().format(DATE_TIME_FORMATTER));
        logInfo.put("costTime", endTime - startTime);
        logInfo.put("ip", getIp(request));
        logInfo.put("method", request.getMethod());
        logInfo.put("uri", request.getRequestURI());
        logInfo.put("userAgent", request.getHeader("User-Agent"));
        logInfo.put("className", method.getDeclaringClass().getName());
        logInfo.put("methodName", method.getName());
        logInfo.put("userId", getCurrentUserId());
        logInfo.put("username", getCurrentUsername());
        logInfo.put("params", getRequestParams(point));
        logInfo.put("success", errorMsg == null);
        logInfo.put("errorMsg", errorMsg);

        // 记录结果，限制长度
        if (result != null) {
            String resultStr = result.toString();
            if (resultStr.length() > 500) {
                resultStr = resultStr.substring(0, 500) + "...";
            }
            logInfo.put("result", resultStr);
        }

        try {
            String logJson = objectMapper.writeValueAsString(logInfo);
            if (errorMsg != null) {
                log.error(logJson);
            } else {
                log.info(logJson);
            }
        } catch (Exception e) {
            LogUtils.error(LoggerFactory.getLogger(OperationLogAspect.class), "序列化操作日志失败", e);
        }
    }

    /**
     * 获取当前请求
     */
    private HttpServletRequest getRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            return attributes.getRequest();
        }
        return null;
    }

    /**
     * 获取客户端IP地址
     */
    private String getIp(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // 多级代理情况下，取第一个IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }

    /**
     * 获取请求参数
     */
    private String getRequestParams(ProceedingJoinPoint point) {
        Object[] args = point.getArgs();
        if (args == null || args.length == 0) {
            return "[]";
        }
        
        try {
            String paramsJson = objectMapper.writeValueAsString(args);
            // 限制参数长度
            if (paramsJson.length() > 1000) {
                paramsJson = paramsJson.substring(0, 1000) + "... [省略部分参数]";
            }
            return paramsJson;
        } catch (Exception e) {
            return "[参数序列化失败]";
        }
    }

    /**
     * 获取当前用户ID
     * 这里需要根据实际的用户认证方式进行实现
     */
    private String getCurrentUserId() {
        // 从线程上下文或请求头获取用户ID
        HttpServletRequest request = getRequest();
        if (request != null) {
            String userId = request.getHeader("X-User-Id");
            if (userId != null && !userId.isEmpty()) {
                return userId;
            }
        }
        // 默认返回未认证
        return "unauthorized";
    }

    /**
     * 获取当前用户名
     */
    private String getCurrentUsername() {
        HttpServletRequest request = getRequest();
        if (request != null) {
            String username = request.getHeader("X-Username");
            if (username != null && !username.isEmpty()) {
                return username;
            }
        }
        return "unknown";
    }

    /**
     * 获取错误堆栈信息
     */
    private String getErrorStackTrace(Exception e) {
        try {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            return sw.toString();
        } catch (Exception ex) {
            return "Error getting stack trace: " + ex.getMessage();
        }
    }
}
