package com.heikeji.mall.takeout.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class TakeoutSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeHttpRequests()
            .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/api-docs/**").permitAll()
            .requestMatchers("/actuator/**").permitAll()
            // 公开访问的商家和商品接口 (带 /api 前缀)
            .requestMatchers("/api/takeout/merchant/active").permitAll()
            .requestMatchers("/api/takeout/merchant/detail/**").permitAll()
            .requestMatchers("/api/takeout/merchant/search").permitAll()
            .requestMatchers("/api/takeout/product/merchant/**").permitAll()
            .requestMatchers("/api/takeout/product/detail/**").permitAll()
            .requestMatchers("/api/takeout/product/recommended/**").permitAll()
            // 公开访问的商家和商品接口 (不带 /api 前缀)
            .requestMatchers("/takeout/merchant/active").permitAll()
            .requestMatchers("/takeout/merchant/detail/**").permitAll()
            .requestMatchers("/takeout/merchant/search").permitAll()
            .requestMatchers("/takeout/product/merchant/**").permitAll()
            .requestMatchers("/takeout/product/detail/**").permitAll()
            .requestMatchers("/takeout/product/recommended/**").permitAll()
            .anyRequest().authenticated();
        return http.build();
    }
}
