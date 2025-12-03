package com.heikeji.common.core.trace;

import org.slf4j.MDC;
import org.springframework.util.StringUtils;

import java.util.UUID;

/**
 * 链路追踪上下文
 * 用于在分布式系统中跟踪请求调用链路
 */
public class TraceContext {

    /**
     * 追踪ID的键名
     */
    public static final String TRACE_ID_KEY = "traceId";
    
    /**
     * 父级Span ID的键名
     */
    public static final String PARENT_SPAN_ID_KEY = "parentSpanId";
    
    /**
     * 当前Span ID的键名
     */
    public static final String SPAN_ID_KEY = "spanId";

    /**
     * 生成新的追踪ID
     */
    public static String generateTraceId() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * 生成新的Span ID
     */
    public static String generateSpanId() {
        return UUID.randomUUID().toString().substring(0, 16);
    }

    /**
     * 开始一个新的追踪上下文
     * 如果已有追踪ID则继续使用，否则创建新的
     */
    public static void startTrace(String traceId, String parentSpanId) {
        // 如果没有提供traceId，生成新的
        if (!StringUtils.hasText(traceId)) {
            traceId = generateTraceId();
        }
        
        // 如果没有提供parentSpanId，设置为空
        if (!StringUtils.hasText(parentSpanId)) {
            parentSpanId = "";
        }
        
        // 生成当前spanId
        String spanId = generateSpanId();
        
        // 设置到MDC中
        MDC.put(TRACE_ID_KEY, traceId);
        MDC.put(PARENT_SPAN_ID_KEY, parentSpanId);
        MDC.put(SPAN_ID_KEY, spanId);
    }

    /**
     * 开始一个新的追踪上下文
     */
    public static void startTrace() {
        startTrace(null, null);
    }

    /**
     * 开始一个子Span
     */
    public static void startChildSpan() {
        String traceId = getTraceId();
        String parentSpanId = getSpanId();
        
        if (StringUtils.hasText(traceId)) {
            String newSpanId = generateSpanId();
            MDC.put(PARENT_SPAN_ID_KEY, parentSpanId);
            MDC.put(SPAN_ID_KEY, newSpanId);
        } else {
            // 如果没有当前追踪上下文，开始一个新的
            startTrace();
        }
    }

    /**
     * 获取当前追踪ID
     */
    public static String getTraceId() {
        return MDC.get(TRACE_ID_KEY);
    }

    /**
     * 获取父级Span ID
     */
    public static String getParentSpanId() {
        return MDC.get(PARENT_SPAN_ID_KEY);
    }

    /**
     * 获取当前Span ID
     */
    public static String getSpanId() {
        return MDC.get(SPAN_ID_KEY);
    }

    /**
     * 设置追踪ID
     */
    public static void setTraceId(String traceId) {
        if (StringUtils.hasText(traceId)) {
            MDC.put(TRACE_ID_KEY, traceId);
        }
    }

    /**
     * 清理追踪上下文
     */
    public static void clear() {
        MDC.remove(TRACE_ID_KEY);
        MDC.remove(PARENT_SPAN_ID_KEY);
        MDC.remove(SPAN_ID_KEY);
    }

    /**
     * 检查是否有活跃的追踪上下文
     */
    public static boolean isActive() {
        return StringUtils.hasText(getTraceId());
    }

    /**
     * 获取追踪上下文信息，用于传递给下游服务
     */
    public static TraceInfo getTraceInfo() {
        TraceInfo info = new TraceInfo();
        info.setTraceId(getTraceId());
        info.setParentSpanId(getSpanId()); // 下游的parentSpanId是当前的spanId
        return info;
    }

    /**
     * 追踪信息对象
     * 用于在服务间传递追踪上下文
     */
    public static class TraceInfo {
        private String traceId;
        private String parentSpanId;

        public String getTraceId() {
            return traceId;
        }

        public void setTraceId(String traceId) {
            this.traceId = traceId;
        }

        public String getParentSpanId() {
            return parentSpanId;
        }

        public void setParentSpanId(String parentSpanId) {
            this.parentSpanId = parentSpanId;
        }

        @Override
        public String toString() {
            return "TraceInfo{" +
                    "traceId='" + traceId + '\'' +
                    ", parentSpanId='" + parentSpanId + '\'' +
                    '}';
        }
    }
}
