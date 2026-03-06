package com.heikeji.mall.common.monitoring.service;

import io.sentry.Breadcrumb;
import io.sentry.Sentry;
import io.sentry.SentryLevel;
import io.sentry.protocol.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class SentryErrorTrackingService {

    @Value("${sentry.enabled:false}")
    private boolean enabled;

    public void captureException(Throwable throwable, Map<String, Object> extraData) {
        if (!enabled) {
            return;
        }

        try {
            Sentry.withScope(scope -> {
                if (extraData != null && !extraData.isEmpty()) {
                    scope.setContexts("custom", extraData);
                }

                scope.setLevel(SentryLevel.ERROR);

                addRequestContext(scope);

                Sentry.captureException(throwable);
            });

            log.error("错误已上报到Sentry: {}", throwable.getMessage());
        } catch (Exception e) {
            log.error("上报错误到Sentry失败", e);
        }
    }

    public void captureException(Throwable throwable) {
        captureException(throwable, null);
    }

    public void captureMessage(String message, SentryLevel level) {
        if (!enabled) {
            return;
        }

        try {
            Sentry.withScope(scope -> {
                scope.setLevel(level);
                addRequestContext(scope);
                Sentry.captureMessage(message);
            });

            log.info("消息已上报到Sentry: {}", message);
        } catch (Exception e) {
            log.error("上报消息到Sentry失败", e);
        }
    }

    public void captureMessage(String message) {
        captureMessage(message, SentryLevel.INFO);
    }

    public void setUser(String userId, String username, String email) {
        if (!enabled) {
            return;
        }

        try {
            User user = new User();
            user.setId(userId);
            user.setUsername(username);
            user.setEmail(email);

            Sentry.setUser(user);
            log.debug("Sentry用户已设置: {}", username);
        } catch (Exception e) {
            log.error("设置Sentry用户失败", e);
        }
    }

    public void clearUser() {
        if (!enabled) {
            return;
        }

        try {
            Sentry.setUser(null);
            log.debug("Sentry用户已清除");
        } catch (Exception e) {
            log.error("清除Sentry用户失败", e);
        }
    }

    public void addBreadcrumb(String category, String message, Map<String, String> data) {
        if (!enabled) {
            return;
        }

        try {
            Breadcrumb breadcrumb = new Breadcrumb();
            breadcrumb.setCategory(category);
            breadcrumb.setMessage(message);
            breadcrumb.setLevel(SentryLevel.INFO);

            if (data != null && !data.isEmpty()) {
                breadcrumb.setData(data);
            }

            Sentry.addBreadcrumb(breadcrumb);
            log.debug("Sentry面包屑已添加: {}", message);
        } catch (Exception e) {
            log.error("添加Sentry面包屑失败", e);
        }
    }

    public void addBreadcrumb(String category, String message) {
        addBreadcrumb(category, message, null);
    }

    public void setTag(String key, String value) {
        if (!enabled) {
            return;
        }

        try {
            Sentry.setTag(key, value);
            log.debug("Sentry标签已设置: {} = {}", key, value);
        } catch (Exception e) {
            log.error("设置Sentry标签失败", e);
        }
    }

    public void setExtra(String key, Object value) {
        if (!enabled) {
            return;
        }

        try {
            Sentry.setExtra(key, value);
            log.debug("Sentry额外信息已设置: {} = {}", key, value);
        } catch (Exception e) {
            log.error("设置Sentry额外信息失败", e);
        }
    }

    private void addRequestContext(io.sentry.Scope scope) {
        try {
            ServletRequestAttributes attributes = 
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                
                Map<String, Object> requestData = new HashMap<>();
                requestData.put("url", request.getRequestURL().toString());
                requestData.put("method", request.getMethod());
                requestData.put("remoteAddr", request.getRemoteAddr());
                requestData.put("userAgent", request.getHeader("User-Agent"));
                
                Map<String, String> headers = new HashMap<>();
                Enumeration<String> headerNames = request.getHeaderNames();
                while (headerNames.hasMoreElements()) {
                    String headerName = headerNames.nextElement();
                    String headerValue = request.getHeader(headerName);
                    headers.put(headerName, headerValue);
                }
                requestData.put("headers", headers);
                
                Map<String, String> parameters = new HashMap<>();
                request.getParameterMap().forEach((key, values) -> {
                    parameters.put(key, String.join(", ", values));
                });
                requestData.put("parameters", parameters);
                
                scope.setContexts("request", requestData);
                
                scope.setTag("request.method", request.getMethod());
                scope.setTag("request.path", request.getRequestURI());
            }
        } catch (Exception e) {
            log.error("添加请求上下文失败", e);
        }
    }

    public void startTransaction(String operation, String description) {
        if (!enabled) {
            return;
        }

        try {
            io.sentry.ITransaction transaction = Sentry.startTransaction(
                operation, 
                description
            );
            
            Sentry.configureScope(scope -> {
                scope.setTransaction(transaction);
            });
            
            log.debug("Sentry事务已启动: {} - {}", operation, description);
        } catch (Exception e) {
            log.error("启动Sentry事务失败", e);
        }
    }

    public void finishTransaction(String status) {
        if (!enabled) {
            return;
        }

        try {
            io.sentry.ITransaction transaction = Sentry.getSpan();
            if (transaction != null) {
                transaction.finish();
                log.debug("Sentry事务已结束: {}", status);
            }
        } catch (Exception e) {
            log.error("结束Sentry事务失败", e);
        }
    }
}
