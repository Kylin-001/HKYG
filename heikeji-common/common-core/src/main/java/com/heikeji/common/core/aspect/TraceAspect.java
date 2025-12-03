package com.heikeji.common.core.aspect;

import com.heikeji.common.core.trace.TraceContext;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

/**
 * 链路追踪切面
 * 自动拦截HTTP请求，处理链路追踪的开始和结束
 */
@Aspect
@Component
public class TraceAspect {

    private static final Logger log = LoggerFactory.getLogger("trace");
    
    /**
     * 追踪ID请求头
     */
    private static final String TRACE_ID_HEADER = "X-Trace-Id";
    
    /**
     * 父级Span ID请求头
     */
    private static final String PARENT_SPAN_ID_HEADER = "X-Parent-Span-Id";

    /**
     * 定义切入点 - 拦截所有Controller方法
     */
    @Pointcut("execution(* com.heikeji.app.controller.*.*(..)) || execution(* com.heikeji.mall.*.controller.*.*(..))")
    public void tracePointCut() {
    }

    /**
     * 环绕通知 - 处理链路追踪
     */
    @Around("tracePointCut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        long startTime = System.currentTimeMillis();
        String traceId = null;
        String spanId = null;
        
        try {
            // 从请求头获取追踪信息或创建新的
            initTraceContext();
            
            traceId = TraceContext.getTraceId();
            spanId = TraceContext.getSpanId();
            
            // 记录请求开始
            log.info("[TRACE START] traceId={}, spanId={}, method={}, uri={}", 
                    traceId, spanId, getRequestMethod(), getRequestUri());
            
            // 执行原方法
            Object result = point.proceed();
            
            // 记录请求结束
            long costTime = System.currentTimeMillis() - startTime;
            log.info("[TRACE END] traceId={}, spanId={}, costTime={}ms", 
                    traceId, spanId, costTime);
            
            return result;
        } catch (Exception e) {
            // 记录异常
            log.error("[TRACE ERROR] traceId={}, spanId={}", traceId, spanId, e);
            throw e;
        } finally {
            // 清理追踪上下文
            TraceContext.clear();
        }
    }

    /**
     * 初始化跟踪上下文
     */
    private void initTraceContext() {
        HttpServletRequest request = getRequest();
        if (request != null) {
            // 从请求头获取追踪信息
            String traceId = request.getHeader(TRACE_ID_HEADER);
            String parentSpanId = request.getHeader(PARENT_SPAN_ID_HEADER);
            
            // 开始跟踪
            TraceContext.startTrace(traceId, parentSpanId);
            
            // 将追踪信息设置到响应头中
            request.setAttribute(TRACE_ID_HEADER, TraceContext.getTraceId());
            request.setAttribute(PARENT_SPAN_ID_HEADER, TraceContext.getParentSpanId());
        } else {
            // 如果没有请求上下文，开始一个新的跟踪
            TraceContext.startTrace();
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
     * 获取请求方法
     */
    private String getRequestMethod() {
        HttpServletRequest request = getRequest();
        return request != null ? request.getMethod() : "UNKNOWN";
    }

    /**
     * 获取请求URI
     */
    private String getRequestUri() {
        HttpServletRequest request = getRequest();
        return request != null ? request.getRequestURI() : "UNKNOWN";
    }
}
