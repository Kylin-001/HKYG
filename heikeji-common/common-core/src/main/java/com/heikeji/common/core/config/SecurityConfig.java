package com.heikeji.common.core.config;

import com.heikeji.common.core.security.JwtAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;

/**
 * Spring Security配置类
 * 配置JWT认证和安全规则
 *
 * @author: zky
 * @date: 2024-01-01
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean(name = "commonSecurityConfig")
    public SecurityConfig commonSecurityConfig() {
        return this;
    }

    @Bean(name = "commonPasswordEncoder")
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean(name = "commonSecurityFilterChain")
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        logger.info("配置Spring Security安全规则");
        
        http
            // 禁用CSRF保护，因为我们使用的是Token认证
            .csrf(csrf -> csrf.disable())
            
            // 禁用Session，使用无状态认证
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 配置请求授权规则
            .authorizeHttpRequests(authorize -> authorize
                // 允许公开访问的路径
                .antMatchers("/api/auth/**", "/api/public/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                // 允许健康检查路径
                .antMatchers("/actuator/**").permitAll()
                // 允许OPTIONS请求
                .antMatchers("/", "/favicon.ico", "/*.html", "/*.js", "/*.css").permitAll()
                // 其他所有请求都需要认证
                .anyRequest().authenticated()
            )
            
            // 异常处理配置
            .exceptionHandling(exception -> exception
                // 可以在这里配置认证失败和授权失败的处理器
                .accessDeniedPage("/error/403")
            )
            
            // 禁用默认的登录和注销表单
            .formLogin(form -> form.disable())
            .logout(logout -> logout.disable());

        // 在LogoutFilter之后添加JWT过滤器
        http.addFilterAfter(jwtAuthenticationFilter, LogoutFilter.class);

        logger.info("Spring Security配置完成");
        return http.build();
    }
}