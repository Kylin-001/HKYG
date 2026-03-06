package com.heikeji.mall.common.monitoring.config;

import io.sentry.Sentry;
import io.sentry.SentryLevel;
import io.sentry.SentryOptions;
import io.sentry.spring.SentryConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Slf4j
@Configuration
public class SentryConfiguration {

    @Value("${sentry.dsn:}")
    private String dsn;

    @Value("${sentry.environment:${spring.profiles.active:development}}")
    private String environment;

    @Value("${sentry.release:${spring.application.name:heikeji-mall}@${spring.application.version:1.0.0}}")
    private String release;

    @Value("${sentry.enabled:false}")
    private boolean enabled;

    @Value("${sentry.traces-sample-rate:0.1}")
    private double tracesSampleRate;

    @Value("${sentry.profiles-sample-rate:0.1}")
    private double profilesSampleRate;

    @PostConstruct
    public void initSentry() {
        if (!enabled || dsn == null || dsn.isEmpty()) {
            log.info("Sentry未启用或DSN未配置，跳过Sentry初始化");
            return;
        }

        Sentry.init(options -> {
            options.setDsn(dsn);
            options.setEnvironment(environment);
            options.setRelease(release);
            
            options.setTracesSampleRate(tracesSampleRate);
            options.setProfilesSampleRate(profilesSampleRate);
            
            options.setBeforeSend((event, hint) -> {
                if (environment.equals("development")) {
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
            
            options.setDebug(environment.equals("development"));
            
            options.setMaxBreadcrumbs(50);
            
            options.setAttachStacktrace(true);
            
            options.setServerName(System.getProperty("server.name", "unknown"));
            
            log.info("Sentry初始化完成 - 环境: {}, 版本: {}", environment, release);
        });
    }

    @Bean
    public SentryConfig sentryConfig() {
        SentryConfig config = new SentryConfig();
        log.info("Sentry配置已加载");
        return config;
    }
}
