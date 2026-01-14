package com.heikeji.system.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heikeji.common.core.security.JwtAuthenticationFilter;
import com.heikeji.common.api.Result;
import com.heikeji.common.api.ResultCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Spring Security配置（Spring Security 6.0+）
 *
 * @author zhangkaiyuan
 * @date 2024-11-20
 */
@Configuration(value = "systemSecurityConfig")
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 密码编码器
     */
    @Bean(name = "systemPasswordEncoder")
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 认证提供器
     */
    @Bean(name = "systemAuthenticationProvider")
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    /**
     * 认证管理器
     */
    @Bean(name = "systemAuthenticationManager")
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * 安全过滤器链配置
     */
    @Bean(name = "systemSecurityFilterChain")
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 关闭CSRF
            .csrf(csrf -> csrf.disable())
            // 关闭会话管理
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 配置请求授权
            .authorizeHttpRequests(auth -> auth
                // 允许匿名访问的接口
                .requestMatchers("/api/system/auth/**", 
                               "/api/system/captcha/**",
                               "/api/health/**",
                               "/swagger-ui/**",
                               "/v3/api-docs/**",
                               "/doc.html",
                               "/webjars/**").permitAll()
                // 其他所有请求都需要认证
                .anyRequest().authenticated())
            // 配置异常处理
            .exceptionHandling(exception -> exception
                // 未认证处理
                .authenticationEntryPoint(authenticationEntryPoint())
                // 未授权处理
                .accessDeniedHandler(accessDeniedHandler()))
            // 添加JWT过滤器
            .addFilterBefore(systemJwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * 未认证处理
     */
    @Bean(name = "systemAuthenticationEntryPoint")
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return new AuthenticationEntryPoint() {
            @Override
            public void commence(HttpServletRequest request, HttpServletResponse response, 
                                AuthenticationException authException) throws IOException {
                response.setContentType("application/json;charset=UTF-8");
                PrintWriter out = response.getWriter();
                out.write(objectMapper.writeValueAsString(Result.failed(ResultCode.UNAUTHORIZED)));
                out.flush();
                out.close();
            }
        };
    }

    /**
     * 未授权处理
     */
    @Bean(name = "systemAccessDeniedHandler")
    public AccessDeniedHandler accessDeniedHandler() {
        return new AccessDeniedHandler() {
            @Override
            public void handle(HttpServletRequest request, HttpServletResponse response, 
                             org.springframework.security.access.AccessDeniedException accessDeniedException) throws IOException {
                response.setContentType("application/json;charset=UTF-8");
                PrintWriter out = response.getWriter();
                out.write(objectMapper.writeValueAsString(Result.failed(ResultCode.FORBIDDEN)));
                out.flush();
                out.close();
            }
        };
    }

    /**
     * JWT认证过滤器
     */
    @Bean(name = "systemJwtAuthenticationFilter")
    public JwtAuthenticationFilter systemJwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
}
