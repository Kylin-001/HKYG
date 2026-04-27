package com.heikeji.mall.common.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heikeji.common.core.security.JwtUtils;
import com.heikeji.common.core.security.UserContextHolderAdapter;
import com.heikeji.mall.common.exception.AuthenticationException;
import com.heikeji.mall.common.response.R;
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

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private JwtUtils jwtUtils;

    /**
     * 从请求头中提取JWT令牌
     *
     * @param request 请求对象
     * @return JWT令牌，如果不存在或格式无效则返回null
     */
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7).trim();
            // 验证token是否为空或格式明显不正确
            if (token.isEmpty() || !token.contains(".")) {
                log.warn("提取到的JWT令牌格式无效: 令牌为空或不包含分隔符");
                return null;
            }
            return token;
        }
        // 也可以从请求参数中提取令牌
        String tokenParam = request.getParameter("token");
        if (tokenParam != null && !tokenParam.trim().isEmpty() && tokenParam.contains(".")) {
            return tokenParam.trim();
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
                try {
                    // 验证令牌有效性
                    if (jwtUtils.validateToken(token)) {
                        // 从令牌中获取用户ID和用户名
                        String userId = jwtUtils.getUserIdFromToken(token);
                        String username = jwtUtils.getUsernameFromToken(token);
                        
                        // 如果用户名不为空且当前上下文没有认证信息
                        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                            // 加载用户详情
                            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                            
                            // 创建认证令牌
                            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                            
                            // 设置认证详情
                            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            
                            // 设置认证信息到上下文
                            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                            
                            // 设置用户上下文到 UserContextHolderAdapter
                            if (userId != null) {
                                try {
                                    UserContextHolderAdapter.setCurrentUserId(Long.valueOf(userId));
                                } catch (NumberFormatException e) {
                                    log.warn("无法将userId转换为Long: {}", userId);
                                }
                            }
                        }
                    }
                } catch (ExpiredJwtException e) {
                    log.warn("JWT令牌已过期: {}", e.getMessage());
                    // 令牌过期不影响未登录用户的请求，继续处理
                } catch (UnsupportedJwtException | MalformedJwtException | SignatureException | IllegalArgumentException e) {
                    log.warn("JWT令牌无效: {} - {}", e.getClass().getSimpleName(), e.getMessage());
                    // 无效令牌不影响未登录用户的请求，继续处理
                }
            }
            // 继续处理请求
            filterChain.doFilter(request, response);
        } catch (AuthenticationException e) {
            log.error("认证失败: {}", e.getMessage());
            handleAuthenticationException(response, e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
        // 注意：不在finally中清理上下文，让控制器可以获取用户信息
        // 上下文会在请求处理完成后由拦截器清理
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
