package com.heikeji.common.core.config;

import org.hibernate.validator.HibernateValidator;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.validation.beanvalidation.MethodValidationPostProcessor;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

/**
 * 参数校验配置类
 * 配置统一的参数校验规则
 *
 * @author: zky
 * @date: 2024-01-01
 */
@AutoConfiguration
public class ValidationConfig {

    /**
     * 配置Bean验证器
     * 设置为快速失败模式，发现第一个错误就停止校验
     */
    @Bean
    public Validator validator() {
        ValidatorFactory validatorFactory = Validation.byProvider(HibernateValidator.class)
                .configure()
                // 快速失败模式，发现第一个错误就停止校验
                .failFast(true)
                // 设置校验消息国际化资源文件基础名称
                .messageInterpolator(new CustomMessageInterpolator())
                .buildValidatorFactory();
        return validatorFactory.getValidator();
    }

    /**
     * 配置方法参数校验处理器
     * 用于支持@Validated注解在方法参数上的校验
     */
    @Bean
    public MethodValidationPostProcessor methodValidationPostProcessor() {
        MethodValidationPostProcessor processor = new MethodValidationPostProcessor();
        // 设置使用自定义的验证器
        processor.setValidator(validator());
        return processor;
    }

    /**
     * 自定义消息插值器
     * 用于增强消息国际化处理
     */
    static class CustomMessageInterpolator implements jakarta.validation.MessageInterpolator {
        private final jakarta.validation.MessageInterpolator defaultInterpolator = Validation.buildDefaultValidatorFactory().getMessageInterpolator();

        @Override
        public String interpolate(String messageTemplate, Context context) {
            // 可以在这里添加自定义的消息处理逻辑
            return defaultInterpolator.interpolate(messageTemplate, context);
        }

        @Override
        public String interpolate(String messageTemplate, Context context, java.util.Locale locale) {
            // 简化实现，使用Java标准Locale类而不是MessageInterpolator.LocaleResolver
            return defaultInterpolator.interpolate(messageTemplate, context, locale);
        }
    }
}