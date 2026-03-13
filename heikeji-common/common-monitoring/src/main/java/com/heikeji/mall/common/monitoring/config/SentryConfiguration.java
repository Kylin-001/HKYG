package com.heikeji.mall.common.monitoring.config;

import io.sentry.Sentry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Slf4j
@Configuration
@ConditionalOnProperty(name = "sentry.enabled", havingValue = "true")
public class SentryConfiguration {

    @Value("${sentry.dsn:}")
    private String dsn;

    @Value("${sentry.environment:${spring.profiles.active:development}}")
    private String environment;

    @Value("${sentry.release:${spring.application.name:heikeji-mall}@${spring.application.version:1.0.0}}")
    private String release;

    @Value("${sentry.traces-sample-rate:0.1}")
    private double tracesSampleRate;

    @Value("${sentry.profiles-sample-rate:0.1}")
    private double profilesSampleRate;

    @PostConstruct
    public void initSentry() {
        if (dsn == null || dsn.isEmpty()) {
            log.info("Sentry DSN未配置，跳过Sentry初始化");
            return;
        }

        Sentry.init(options -> {
            options.setDsn(dsn);
            options.setEnvironment(environment);
            options.setRelease(release);
            
            options.setTracesSampleRate(tracesSampleRate);
            options.setProfilesSampleRate(profilesSampleRate);
            
            options.setBeforeSend((event, hint) -> {
                if ("development".equals(environment)) {
                    log.debug("Sentry事件: {}", event);
                }
                return event;
            });
            
            options.setBeforeBreadcrumb((breadcrumb, hint) -> {
                if (breadcrumb.getCategory() != null && 
                    breadcrumb.getCategory().startsWith("http")) {
                    return breadcrumb;
                }
                return null;
            });
            
            options.setDebug("development".equals(environment));
            options.setMaxBreadcrumbs(50);
            options.setAttachStacktrace(true);
            options.setServerName(System.getProperty("server.name", "unknown"));
            
            log.info("Sentry初始化完成 - 环境: {}, 版本: {}", environment, release);
        });
    }
}
