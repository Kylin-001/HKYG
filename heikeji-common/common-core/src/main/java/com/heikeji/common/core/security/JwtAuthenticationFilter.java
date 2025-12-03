package com.heikeji.common.core.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

/**
 * JWT认证过滤器
 * 拦截请求中的Token，验证其有效性并设置用户上下文
 *
 * @author: zky
 * @date: 2024-01-01
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired(required = false)
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        try {
            // 尝试从请求头中获取Token
            String authorizationHeader = request.getHeader("Authorization");
            String token = jwtUtils.extractTokenFromHeader(authorizationHeader);
            
            // 如果Token存在且有效
            if (token != null && jwtUtils.validateToken(token)) {
                // 从Token中提取用户信息
                String userId = jwtUtils.getUserIdFromToken(token);
                String username = jwtUtils.getUsernameFromToken(token);
                
                logger.debug("JWT认证成功，用户ID: {}, 用户名: {}", userId, username);
                
                // 构建用户信息并设置到上下文
                UserContext.UserInfo userInfo = UserContext.builder()
                        .userId(userId)
                        .username(username)
                        .build();
                UserContext.setUserContext(userInfo);
                
                // 同步到旧的上下文，确保现有代码继续工作
                UserContextHolderAdapter.syncToOldContext();
                
                // 与Spring Security集成
                if (userDetailsService != null) {
                    // 尝试加载完整的用户详情
                    try {
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        
                        // 创建认证对象
                        UsernamePasswordAuthenticationToken authentication = 
                                new UsernamePasswordAuthenticationToken(
                                        userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        // 设置认证信息到Security上下文
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } catch (Exception e) {
                        logger.warn("无法通过UserDetailsService加载用户信息: {}", e.getMessage());
                        // 如果无法加载用户详情，至少创建一个简单的认证对象
                        UsernamePasswordAuthenticationToken authentication = 
                                new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } else {
                // 尝试从旧的上下文同步，兼容旧的认证方式
                UserContextHolderAdapter.syncFromOldContext();
            }
        } catch (Exception e) {
            logger.error("JWT认证过程中发生错误: {}", e.getMessage(), e);
            // Token无效或过期，清除所有用户上下文
            UserContextHolderAdapter.clearAll();
            SecurityContextHolder.clearContext();
        }

        try {
            // 继续过滤器链
            filterChain.doFilter(request, response);
        } finally {
            // 确保请求结束后清除所有用户上下文，避免内存泄漏
            UserContextHolderAdapter.clearAll();
            SecurityContextHolder.clearContext();
        }
    }
}