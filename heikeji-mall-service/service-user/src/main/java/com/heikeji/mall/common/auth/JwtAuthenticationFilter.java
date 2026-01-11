package com.heikeji.mall.common.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heikeji.mall.common.exception.AuthenticationException;
import com.heikeji.mall.common.response.R;
import com.heikeji.common.core.security.JwtUtils;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;

/**
 * JWT认证过滤器
 * 用于验证请求中的JWT令牌并设置认证信息到Spring Security上下文中
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 从请求头中提取JWT令牌
     *
     * @param request 请求对象
     * @return JWT令牌，如果不存在则返回null
     */
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        // 也可以从请求参数中提取令牌
        String tokenParam = request.getParameter("token");
        if (tokenParam != null) {
            return tokenParam;
        }
        return null;
    }

    /**
     * 验证JWT令牌并设置认证信息
     *
     * @param request     请求对象
     * @param response    响应对象
     * @param filterChain 过滤器链
     * @throws ServletException Servlet异常
     * @throws IOException      IO异常
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = extractToken(request);
            if (token != null) {
                // 验证令牌有效性
                if (jwtUtils.validateToken(token)) {
                    // 从令牌中获取用户ID
                    String userIdStr = jwtUtils.getUserIdFromToken(token);
                    Long userId = userIdStr != null ? Long.parseLong(userIdStr) : null;
                    
                    // 如果用户ID不为空且当前上下文没有认证信息
                    if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        // 加载用户详情
                        // 注意：这里需要修改为通过用户ID加载，而不是用户名
                        UserDetails userDetails = userDetailsService.loadUserByUsername(String.valueOf(userId));
                        
                        // 创建认证令牌
                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        
                        // 设置认证详情
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        // 设置认证信息到上下文
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                        
                        // 设置用户上下文
                        com.heikeji.mall.common.auth.UserContext.setUserContext(userId, userDetails.getUsername(), null, null, null, null);
                    }
                }
            }
            // 继续处理请求
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            log.error("JWT令牌已过期: {}", e.getMessage());
            handleAuthenticationException(response, "JWT令牌已过期", HttpStatus.UNAUTHORIZED);
        } catch (UnsupportedJwtException e) {
            log.error("JWT令牌格式不支持: {}", e.getMessage());
            handleAuthenticationException(response, "JWT令牌格式不支持", HttpStatus.UNAUTHORIZED);
        } catch (MalformedJwtException e) {
            log.error("JWT令牌格式错误: {}", e.getMessage());
            handleAuthenticationException(response, "JWT令牌格式错误", HttpStatus.UNAUTHORIZED);
        } catch (SignatureException e) {
            log.error("JWT令牌签名错误: {}", e.getMessage());
            handleAuthenticationException(response, "JWT令牌签名错误", HttpStatus.UNAUTHORIZED);
        } catch (IllegalArgumentException e) {
            log.error("JWT令牌参数错误: {}", e.getMessage());
            handleAuthenticationException(response, "JWT令牌参数错误", HttpStatus.UNAUTHORIZED);
        } catch (AuthenticationException e) {
            log.error("认证失败: {}", e.getMessage());
            handleAuthenticationException(response, e.getMessage(), HttpStatus.UNAUTHORIZED);
        } finally {
            // 清理用户上下文
            com.heikeji.mall.common.auth.UserContext.clear();
        }
    }

    /**
     * 处理认证异常
     *
     * @param response   响应对象
     * @param message    错误信息
     * @param statusCode HTTP状态码
     * @throws IOException IO异常
     */
    private void handleAuthenticationException(HttpServletResponse response, String message, HttpStatus statusCode) throws IOException {
        response.setStatus(statusCode.value());
        response.setContentType("application/json;charset=UTF-8");
        R<?> result = R.error(message);
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}