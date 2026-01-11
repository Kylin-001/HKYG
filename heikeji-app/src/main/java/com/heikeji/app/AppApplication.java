package com.heikeji.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;

/**
 * APP应用主入口类
 * 移动端APP应用接口服务启动类
 */
@SpringBootApplication
@ComponentScan(basePackages = {
        "com.heikeji.app",
        "com.heikeji.common.security",
        "com.heikeji.common.util",
        "com.heikeji.common.core.handler",
        "com.heikeji.common.core.exception"
})
@EntityScan("com.heikeji.app.model")
// @EnableFeignClients(basePackages = {
//         "com.heikeji.member.api",
//         "com.heikeji.product.api",
//         "com.heikeji.order.api"
// })
@EnableScheduling
public class AppApplication {

    public static void main(String[] args) {
        SpringApplication.run(AppApplication.class, args);
    }

    /**
     * 使用BeanFactoryPostProcessor在容器初始化前移除有问题的ddlApplicationRunner bean
     * 解决BeanNotOfRequiredTypeException: Bean named 'ddlApplicationRunner' is expected to be of type 'org.springframework.boot.Runner'
     */
    @Bean
    public BeanDefinitionRegistryPostProcessor removeDdlApplicationRunner() {
        return new BeanDefinitionRegistryPostProcessor() {
            @Override
            public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) {
                // 在Bean定义阶段移除ddlApplicationRunner
                if (registry.containsBeanDefinition("ddlApplicationRunner")) {
                    System.out.println("Removing problematic ddlApplicationRunner bean definition");
                    registry.removeBeanDefinition("ddlApplicationRunner");
                }
            }

            @Override
            public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
                // 在Bean工厂初始化后检查
                System.out.println("BeanFactoryPostProcessor: ddlApplicationRunner exists in beanFactory: " + 
                    beanFactory.containsBeanDefinition("ddlApplicationRunner"));
            }
        };
    }

}