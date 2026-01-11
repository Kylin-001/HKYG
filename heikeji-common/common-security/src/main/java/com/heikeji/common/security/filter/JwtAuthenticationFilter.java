package com.heikeji.common.security.filter;

import com.heikeji.common.security.utils.JwtUtils;
import io.jsonwebtoken.Claims;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * JWT认证过滤器
 * 用于验证APP端请求中的JWT token
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            // 从请求头获取token
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && JwtUtils.validateToken(jwt)) {
                // 从token中获取用户信息
                Claims claims = JwtUtils.getClaimsFromToken(jwt);
                String username = claims.getSubject();
                Long userId = JwtUtils.getUserIdFromToken(jwt);

                // 创建认证对象
                UserDetails userDetails = new User(username, "", new ArrayList<>());
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 将认证对象设置到Spring Security上下文中
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("无法设置用户认证: {}", ex);
            // 不抛出异常，继续执行过滤器链
        }

        filterChain.doFilter(request, response);
    }

    /**
     * 从请求头中获取JWT token
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(JwtUtils.TOKEN_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(JwtUtils.TOKEN_PREFIX)) {
            return bearerToken.substring(JwtUtils.TOKEN_PREFIX.length());
        }
        return null;
    }
}
