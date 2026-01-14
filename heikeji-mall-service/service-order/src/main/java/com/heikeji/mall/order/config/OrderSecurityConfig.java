package com.heikeji.mall.order.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * 订单服务安全配置类
 * 配置Swagger和其他公开路径的访问权限
 *
 * @author heikeji
 * @date 2026-01-12
 */
@Configuration
@EnableWebSecurity
public class OrderSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 禁用CSRF保护
                .csrf(csrf -> csrf.disable())
                // 禁用Session
                .sessionManagement(session -> 
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // 配置请求授权规则
                .authorizeHttpRequests(authorize -> authorize
                    // 允许Swagger相关路径
                    .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/api-docs/**").permitAll()
                    // 允许健康检查路径
                    .requestMatchers("/actuator/**").permitAll()
                    // 允许公开API路径
                    .requestMatchers("/api/auth/**", "/api/public/**").permitAll()
                    // 允许静态资源
                    .requestMatchers("/", "/favicon.ico", "/*.html", "/*.js", "/*.css").permitAll()
                    // 允许所有OPTIONS请求
                    .requestMatchers("/api/**").permitAll()
                    // 其他所有请求都需要认证
                    .anyRequest().authenticated()
                )
                // 禁用默认的登录和注销表单
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .logout(logout -> logout.disable());

        return http.build();
    }
}