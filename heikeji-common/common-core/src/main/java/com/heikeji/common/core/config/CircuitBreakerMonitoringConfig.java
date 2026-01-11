package com.heikeji.common.core.config;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import io.github.resilience4j.ratelimiter.event.RateLimiterOnSuccessEvent;
import io.github.resilience4j.ratelimiter.event.RateLimiterOnFailureEvent;
import io.github.resilience4j.retry.RetryRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;

/**
 * 熔断降级监控配置类
 * 提供熔断事件监听、指标收集和监控功能
 */
@Configuration
@Slf4j
public class CircuitBreakerMonitoringConfig {

    @Autowired
    private CircuitBreakerRegistry circuitBreakerRegistry;
    
    @Autowired
    private RetryRegistry retryRegistry;
    
    @Autowired
    private RateLimiterRegistry rateLimiterRegistry;

    /**
     * 初始化熔断监控配置
     */
    @PostConstruct
    public void init() {
        // 注册熔断器事件监听器
        registerCircuitBreakerEvents();
        
        // 注册限流器事件监听器
        registerRateLimiterEvents();
        
        // 注册重试事件监听器
        registerRetryEvents();
        
        // 开启熔断器状态定期检查
        startCircuitBreakerHealthCheck();
        
        log.info("熔断降级监控配置初始化完成");
    }
    
    /**
     * 注册熔断器事件监听器
     */
    private void registerCircuitBreakerEvents() {
        circuitBreakerRegistry.getAllCircuitBreakers().forEach(circuitBreaker -> {
            registerCircuitBreakerEvent(circuitBreaker);
        });
        
        // 监听新创建的熔断器
        circuitBreakerRegistry.getEventPublisher()
            .onEntryAdded(event -> registerCircuitBreakerEvent(event.getAddedEntry()));
    }
    
    /**
     * 注册单个熔断器事件
     */
    private void registerCircuitBreakerEvent(CircuitBreaker circuitBreaker) {
        circuitBreaker.getEventPublisher()
            // 状态转换事件
            .onStateTransition(event -> {
                String fromState = event.getStateTransition().getFromState().name();
                String toState = event.getStateTransition().getToState().name();
                
                log.warn("[熔断状态变更] 熔断器名称: {}, 状态: {} -> {}", 
                        circuitBreaker.getName(), fromState, toState);
                
                // 特别记录熔断开启事件
                if (toState.equals("OPEN")) {
                    log.error("[熔断开启警告] 熔断器: {}, 服务调用失败率过高，熔断器已开启，暂停服务调用", 
                            circuitBreaker.getName());
                } else if (toState.equals("HALF_OPEN")) {
                    log.info("[半开状态] 熔断器: {}, 尝试恢复服务调用", circuitBreaker.getName());
                } else if (toState.equals("CLOSED")) {
                    log.info("[熔断关闭] 熔断器: {}, 服务已恢复正常", circuitBreaker.getName());
                }
            })
            // 调用成功事件
            .onSuccess(event -> {
                if (log.isDebugEnabled()) {
                    log.debug("[调用成功] 熔断器: {}, 方法: {}, 耗时: {}ms", 
                            circuitBreaker.getName(),
                            "unknown",
                            event.getElapsedDuration().toMillis());
                }
            })
            // 调用失败事件
            .onError(event -> {
                log.warn("[调用失败] 熔断器: {}, 方法: {}, 异常类型: {}, 异常信息: {}", 
                        circuitBreaker.getName(),
                        "unknown",
                        event.getThrowable().getClass().getSimpleName(),
                        event.getThrowable().getMessage());
            })
            // 忽略异常事件
            .onIgnoredError(event -> {
                if (log.isDebugEnabled()) {
                    log.debug("[忽略异常] 熔断器: {}, 方法: {}, 忽略的异常: {}", 
                            circuitBreaker.getName(),
                            "unknown",
                            event.getThrowable().getMessage());
                }
            })
            // 重置事件
            .onReset(event -> {
                log.info("[熔断器重置] 熔断器: {}, 已重置状态", circuitBreaker.getName());
            });
    }
    
    /**
     * 注册限流器事件监听器
     */
    private void registerRateLimiterEvents() {
        rateLimiterRegistry.getEventPublisher()
            .onEntryAdded(event -> {
                event.getAddedEntry().getEventPublisher()
                    .onSuccess(event1 -> {
                        if (log.isDebugEnabled()) {
                            log.debug("[限流成功] 限流器: {}, 请求允许通过", event.getAddedEntry().getName());
                        }
                    })
                    .onFailure(event1 -> {
                        log.warn("[限流拒绝] 限流器: {}, 请求被限流，当前请求频率过高", 
                                event.getAddedEntry().getName());
                    });
            });
    }
    
    /**
     * 注册重试事件监听器
     */
    private void registerRetryEvents() {
        retryRegistry.getEventPublisher()
            .onEntryAdded(event -> {
                event.getAddedEntry().getEventPublisher()
                    .onRetry(event1 -> {
                        log.info("[重试请求] 重试器: {}, 方法: {}, 第{}次重试, 异常: {}", 
                                event.getAddedEntry().getName(),
                                "unknown",
                                event1.getNumberOfRetryAttempts(),
                                event1.getLastThrowable().getMessage());
                    })
                    .onSuccess(event1 -> {
                        log.info("[重试成功] 重试器: {}, 方法: {}, 在第{}次重试后成功", 
                                event.getAddedEntry().getName(),
                                "unknown",
                                event1.getNumberOfRetryAttempts());
                    })
                    .onError(event1 -> {
                        log.error("[重试失败] 重试器: {}, 方法: {}, 达到最大重试次数{}, 最终失败", 
                                event.getAddedEntry().getName(),
                                "unknown",
                                event1.getNumberOfRetryAttempts(),
                                event1.getLastThrowable());
                    });
            });
    }
    
    /**
     * 启动熔断器健康状态定期检查
     */
    private void startCircuitBreakerHealthCheck() {
        // 每30秒检查一次熔断器状态
        new Thread(() -> {
            while (true) {
                try {
                    circuitBreakerRegistry.getAllCircuitBreakers().forEach(circuitBreaker -> {
                        if (log.isDebugEnabled()) {
                            log.debug("[熔断器状态] 名称: {}, 状态: {}",
                                    circuitBreaker.getName(),
                                    circuitBreaker.getState());
                        }
                        
                        // 检查是否有长时间处于OPEN状态的熔断器
                        if (circuitBreaker.getState() == CircuitBreaker.State.OPEN) {
                            log.warn("[熔断器告警] 熔断器: {} 已长时间处于熔断开启状态，请检查服务健康情况", 
                                    circuitBreaker.getName());
                        }
                    });
                    
                    Thread.sleep(TimeUnit.SECONDS.toMillis(30));
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    log.error("熔断器健康检查线程被中断", e);
                    break;
                } catch (Exception e) {
                    log.error("熔断器健康检查异常", e);
                }
            }
        }, "circuit-breaker-health-check").start();
    }
}