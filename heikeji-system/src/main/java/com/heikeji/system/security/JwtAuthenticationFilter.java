package com.heikeji.system.security;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT认证过滤器（Spring Security 6.0+）
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /**
     * 验证请求头中的token
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        // 获取Authorization头
        String bearerToken = request.getHeader("Authorization");
        // 检查是否以Bearer开头
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromRequest(request);

        if (token != null) {
            // 在此处添加token验证逻辑
            // 如果token有效，创建一个Authentication对象并设置到SecurityContext中
            
            // 示例：简单的token验证（实际中应使用JWT库）
            if (isValidToken(token)) {
                // 创建认证对象
                Authentication authentication = createAuthentication(request);
                // 设置到安全上下文中
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * 验证token是否有效
     * 
     * @param token token字符串
     * @return 是否有效
     */
    private boolean isValidToken(String token) {
        // 这里应该实现实际的token验证逻辑
        // 例如验证JWT签名、过期时间等
        return token != null && !token.isEmpty();
    }

    /**
     * 创建认证对象
     * 
     * @param request HTTP请求
     * @return 认证对象
     */
    private Authentication createAuthentication(HttpServletRequest request) {
        // 这里应该根据token中的信息创建具体的UserDetails对象
        // 返回一个UsernamePasswordAuthenticationToken
        return new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
            "user", "password", null);
    }
}
