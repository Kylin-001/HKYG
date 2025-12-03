package com.heikeji.system.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heikeji.common.api.Result;
import com.heikeji.common.api.ResultCode;
import com.heikeji.common.core.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import java.io.PrintWriter;

/**
 * JWT认证过滤器
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.header}")
    private String tokenHeader;

    @Value("${jwt.prefix}")
    private String tokenPrefix;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private JwtUtils jwtUtils;

    /**
     * 生成token
     */
    public String generateToken(String userId, String username) {
        return jwtUtils.generateToken(userId, username);
    }

    /**
     * 从token中获取用户名
     */
    public String getUsernameFromToken(String token) {
        return jwtUtils.getUsernameFromToken(token);
    }

    /**
     * 验证token
     */
    public boolean validateToken(String token) {
        return jwtUtils.validateToken(token);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // 获取请求头中的token
            String bearerToken = request.getHeader(tokenHeader);
            String token = jwtUtils.extractTokenFromHeader(bearerToken);

            // 验证token
            if (token != null && validateToken(token)) {
                // 从token中获取用户名
                String username = getUsernameFromToken(token);

                // 加载用户信息
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 创建认证对象
                UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 设置认证信息到上下文
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            // 认证失败，返回错误信息
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json; charset=utf-8");
            PrintWriter out = response.getWriter();
            out.write(objectMapper.writeValueAsString(Result.failed(ResultCode.UNAUTHORIZED, "认证失败")));
            out.flush();
            out.close();
            return;
        }

        // 继续过滤链
        filterChain.doFilter(request, response);
    }
}
