package com.heikeji.common.core.aspect;

import com.heikeji.common.core.annotation.EnableCircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.retry.RetryRegistry;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.time.Duration;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletionException;

/**
 * 熔断降级AOP拦截器
 * 处理@EnableCircuitBreaker注解的方法调用
 */
@Aspect
@Component("customCircuitBreakerAspect")
@Slf4j
public class CircuitBreakerAspect {

    @Autowired
    private CircuitBreakerRegistry circuitBreakerRegistry;

    @Autowired
    private RetryRegistry retryRegistry;

    @Autowired
    private RateLimiterRegistry rateLimiterRegistry;

    /**
     * 切点定义：拦截所有带有@EnableCircuitBreaker注解的方法
     */
    @Pointcut("@annotation(com.heikeji.common.core.annotation.EnableCircuitBreaker)")
    public void circuitBreakerPointcut() {
    }

    /**
     * 环绕通知：实现熔断降级逻辑
     */
    @Around("circuitBreakerPointcut()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        // 获取方法签名和注解信息
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        EnableCircuitBreaker annotation = method.getAnnotation(EnableCircuitBreaker.class);

        // 初始化断路器名称
        String tempName = annotation.name();
        if ("default".equals(tempName)) {
            tempName = method.getDeclaringClass().getSimpleName() + "_" + method.getName();
        }
        final String circuitBreakerName = tempName;

        log.debug("[CircuitBreaker] 开始处理方法: {}，断路器: {}", 
                method.getName(), circuitBreakerName);

        try {
            // 创建或获取断路器
            CircuitBreaker circuitBreaker = getOrCreateCircuitBreaker(circuitBreakerName, annotation);

            // 创建或获取重试器
            Retry retry = getOrCreateRetry(circuitBreakerName + "_retry", annotation);

            // 创建最终变量以便在lambda中使用
            final EnableCircuitBreaker finalAnnotation = annotation;
            final ProceedingJoinPoint finalJoinPoint = joinPoint;

            // 创建可调用任务
            Callable<Object> callable = () -> {
                try {
                    // 如果启用限流，先进行限流检查
                    if (finalAnnotation.enableRateLimit()) {
                        RateLimiter rateLimiter = getOrCreateRateLimiter(circuitBreakerName + "_rateLimiter", finalAnnotation);
                        return rateLimiter.executeSupplier(() -> {
                            try {
                                return finalJoinPoint.proceed();
                            } catch (Throwable throwable) {
                                throw new RuntimeException(throwable);
                            }
                        });
                    }
                    return finalJoinPoint.proceed();
                } catch (Throwable throwable) {
                    // 检查是否有指定的降级方法
                    if (finalAnnotation.fallbackMethod() != null && !finalAnnotation.fallbackMethod().isEmpty()) {
                        return invokeFallbackMethod(finalJoinPoint, throwable, finalAnnotation.fallbackMethod());
                    }
                    throw new RuntimeException(throwable);
                }
            };

            // 组合使用重试和断路器
            Callable<Object> decoratedCallable = CircuitBreaker
                    .decorateCallable(circuitBreaker, Retry.decorateCallable(retry, callable));

            // 执行增强后的方法
            return decoratedCallable.call();

        } catch (CompletionException e) {
            // 处理包装异常
            Throwable cause = e.getCause();
            if (cause != null) {
                log.error("[CircuitBreaker] 方法执行异常: {}", cause.getMessage());
                throw cause;
            }
            log.error("[CircuitBreaker] 方法执行异常: {}", e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            // 处理运行时异常
            log.error("[CircuitBreaker] 方法执行异常: {}", e.getMessage());
            throw e;
        } catch (Throwable e) {
            log.error("[CircuitBreaker] 方法执行异常: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * 获取或创建断路器
     */
    private CircuitBreaker getOrCreateCircuitBreaker(String name, EnableCircuitBreaker annotation) {
        try {
            return circuitBreakerRegistry.circuitBreaker(name);
        } catch (Exception e) {
            // 断路器不存在，创建新的
        }

        CircuitBreakerConfig config = CircuitBreakerConfig.custom()
                .failureRateThreshold(annotation.failureRateThreshold())
                .minimumNumberOfCalls(5)
                .slidingWindowSize(10)
                .waitDurationInOpenState(Duration.ofSeconds(annotation.waitDurationInOpenState()))
                .build();

        return circuitBreakerRegistry.circuitBreaker(name, config);
    }

    /**
     * 获取或创建重试器
     */
    private Retry getOrCreateRetry(String name, EnableCircuitBreaker annotation) {
        try {
            return retryRegistry.retry(name);
        } catch (Exception e) {
            // 重试器不存在，创建新的
        }

        RetryConfig config = RetryConfig.custom()
                .maxAttempts(annotation.maxRetryAttempts())
                .waitDuration(Duration.ofMillis(annotation.retryWaitTime()))
                .build();

        return retryRegistry.retry(name, config);
    }

    /**
     * 获取或创建限流器
     */
    private RateLimiter getOrCreateRateLimiter(String name, EnableCircuitBreaker annotation) {
        try {
            return rateLimiterRegistry.rateLimiter(name);
        } catch (Exception e) {
            // 限流器不存在，创建新的
        }

        RateLimiterConfig config = RateLimiterConfig.custom()
                .limitRefreshPeriod(Duration.ofSeconds(1))
                .limitForPeriod(annotation.rateLimitThreshold())
                .timeoutDuration(Duration.ofMillis(500))
                .build();

        return rateLimiterRegistry.rateLimiter(name, config);
    }

    /**
     * 调用降级方法
     */
    private Object invokeFallbackMethod(ProceedingJoinPoint joinPoint, Throwable throwable, String fallbackMethodName) {
        try {
            Object target = joinPoint.getTarget();
            Class<?>[] paramTypes = ((MethodSignature) joinPoint.getSignature()).getParameterTypes();
            
            // 降级方法参数类型需要包含原方法的所有参数，最后加上异常参数
            Class<?>[] fallbackParamTypes = new Class<?>[paramTypes.length + 1];
            System.arraycopy(paramTypes, 0, fallbackParamTypes, 0, paramTypes.length);
            fallbackParamTypes[paramTypes.length] = Throwable.class;

            // 查找降级方法
            Method fallbackMethod = target.getClass().getDeclaredMethod(fallbackMethodName, fallbackParamTypes);
            fallbackMethod.setAccessible(true);

            // 准备参数
            Object[] args = new Object[joinPoint.getArgs().length + 1];
            System.arraycopy(joinPoint.getArgs(), 0, args, 0, joinPoint.getArgs().length);
            args[joinPoint.getArgs().length] = throwable;

            // 调用降级方法
            log.warn("[CircuitBreaker] 调用降级方法: {}，异常: {}", fallbackMethodName, throwable.getMessage());
            return fallbackMethod.invoke(target, args);

        } catch (Exception e) {
            log.error("[CircuitBreaker] 调用降级方法失败: {}", e.getMessage());
            throw new RuntimeException("降级方法调用失败", e);
        }
    }
}