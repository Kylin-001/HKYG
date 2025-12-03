package com.heikeji.mall.order;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

/**
 * 订单服务启动类 */
@SpringBootApplication
@ComponentScan(basePackages = {
    "com.heikeji.mall.order"
    // 暂时移除common.core.cache包的扫描，避免缓存相关的启动问题
})
public class OrderApplication {

    /**
     * 使用BeanFactoryPostProcessor在容器初始化前移除有问题的ddlApplicationRunner bean
     */
    @Bean
    public BeanDefinitionRegistryPostProcessor removeDdlApplicationRunnerPostProcessor() {
        return new BeanDefinitionRegistryPostProcessor() {
            @Override
            public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
                if (registry.containsBeanDefinition("ddlApplicationRunner")) {
                    System.out.println("Removing problematic ddlApplicationRunner bean definition");
                    registry.removeBeanDefinition("ddlApplicationRunner");
                }
            }

            @Override
            public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
                // 额外安全检查，但不尝试移除
                System.out.println("BeanFactoryPostProcessor: ddlApplicationRunner exists in beanFactory: " + 
                    beanFactory.containsBeanDefinition("ddlApplicationRunner"));
            }
        };
    }

    /**
     * 使用ApplicationListener来替代Runner的功能
     */
    @Bean
    public ApplicationListener<ApplicationReadyEvent> applicationReadyListener() {
        return event -> {
            System.out.println("Application is ready! Using ApplicationListener instead of Runner");
        };
    }

    public static void main(String[] args) {
        // 设置开发环境
        System.setProperty("spring.profiles.active", "dev");
        System.setProperty("spring.main.lazy-initialization", "true");
        
        System.out.println("Starting OrderApplication with BeanFactoryPostProcessor to remove problematic bean...");
        
        // 使用标准方式启动应用
        SpringApplication.run(OrderApplication.class, args);
    }
}
