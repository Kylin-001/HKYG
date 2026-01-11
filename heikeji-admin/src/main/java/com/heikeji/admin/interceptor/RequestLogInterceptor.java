package com.heikeji.admin.interceptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Enumeration;

/**
 * 请求日志拦截器
 * 记录所有HTTP请求的详细信息
 */
@Component
public class RequestLogInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(RequestLogInterceptor.class);
    private static final ThreadLocal<Long> startTimeThreadLocal = new ThreadLocal<>();
    private static final ThreadLocal<String> requestIdThreadLocal = new ThreadLocal<>();

    /**
     * 请求处理前
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 记录请求开始时间
        startTimeThreadLocal.set(System.currentTimeMillis());
        
        // 生成请求ID
        String requestId = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")) + "-" + Thread.currentThread().getId();
        requestIdThreadLocal.set(requestId);
        
        // 记录请求信息
        StringBuilder logBuilder = new StringBuilder();
        logBuilder.append("[REQUEST] | ID: ").append(requestId)
                 .append(" | URL: ").append(request.getRequestURL().toString())
                 .append(" | METHOD: ").append(request.getMethod())
                 .append(" | IP: ").append(getClientIp(request))
                 .append(" | USER-AGENT: ").append(request.getHeader("User-Agent"));
        
        // 记录请求参数
        Enumeration<String> paramNames = request.getParameterNames();
        if (paramNames.hasMoreElements()) {
            logBuilder.append(" | PARAMS: {");
            boolean first = true;
            while (paramNames.hasMoreElements()) {
                String paramName = paramNames.nextElement();
                String paramValue = request.getParameter(paramName);
                // 过滤敏感信息
                if (isSensitiveParam(paramName)) {
                    paramValue = "******";
                }
                if (!first) {
                    logBuilder.append(", ");
                }
                logBuilder.append(paramName).append(":").append(paramValue);
                first = false;
            }
            logBuilder.append("}");
        }
        
        logger.info(logBuilder.toString());
        
        // 将请求ID设置到响应头
        response.setHeader("X-Request-ID", requestId);
        
        return true;
    }

    /**
     * 请求处理后
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, 
                          ModelAndView modelAndView) {
        // 请求处理后但还未返回响应时的处理
    }

    /**
     * 请求完成后（包括异常处理完成后）
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // 计算请求处理时间
        Long startTime = startTimeThreadLocal.get();
        if (startTime != null) {
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            
            // 记录响应信息
            StringBuilder logBuilder = new StringBuilder();
            logBuilder.append("[RESPONSE] | ID: ").append(requestIdThreadLocal.get())
                     .append(" | STATUS: ").append(response.getStatus())
                     .append(" | TIME: ").append(executionTime).append("ms");
            
            // 如果有异常，记录异常信息
            if (ex != null) {
                logBuilder.append(" | EXCEPTION: ").append(ex.getMessage());
                logger.error(logBuilder.toString(), ex);
            } else {
                // 根据响应时间级别记录不同日志级别
                if (executionTime > 3000) {
                    logger.warn(logBuilder.toString());
                } else {
                    logger.info(logBuilder.toString());
                }
            }
        }
        
        // 清理ThreadLocal，避免内存泄漏
        startTimeThreadLocal.remove();
        requestIdThreadLocal.remove();
    }

    /**
     * 获取客户端真实IP地址
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // 多级代理时，取第一个IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }

    /**
     * 判断是否为敏感参数
     */
    private boolean isSensitiveParam(String paramName) {
        if (!StringUtils.hasText(paramName)) {
            return false;
        }
        String lowerParamName = paramName.toLowerCase();
        return lowerParamName.contains("password") || 
               lowerParamName.contains("pwd") || 
               lowerParamName.contains("token") || 
               lowerParamName.contains("secret") || 
               lowerParamName.contains("key");
    }
}
