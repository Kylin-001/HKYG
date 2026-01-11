package com.heikeji.mall.common.auth.interceptor;

import com.heikeji.common.core.security.JwtUtils;
import com.heikeji.mall.common.exception.AuthorizationException;
import com.heikeji.mall.user.entity.User;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Objects;

/**
 * 通用授权拦截器
 * 用于处理JWT令牌验证和用户认证
 */
@Component
public class AuthorizationInterceptor implements HandlerInterceptor {

    /**
     * 令牌请求头名称
     */
    public static final String TOKEN_HEADER = "Authorization";

    /**
     * 令牌前缀
     */
    public static final String TOKEN_PREFIX = "Bearer ";

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 获取请求头中的令牌
        String token = request.getHeader(TOKEN_HEADER);
        if (token == null || !token.startsWith(TOKEN_PREFIX)) {
            // 如果没有令牌，直接放行（某些接口可能不需要认证）
            return true;
        }

        // 移除令牌前缀
        token = token.substring(TOKEN_PREFIX.length());

        try {
            // 验证并解析令牌
            Claims claims = jwtUtils.extractClaims(token);
            if (claims == null) {
                throw new AuthorizationException("无效的令牌");
            }

            // 从令牌中获取用户信息
            String userIdStr = claims.get("userId", String.class);
            if (userIdStr == null) {
                throw new AuthorizationException("无效的令牌");
            }
            Long userId = Long.parseLong(userIdStr);
            String username = claims.get("username", String.class);
            String roles = claims.get("roles", String.class);

            // 创建用户对象并设置到请求上下文
            User user = new User();
            user.setId(userId);
            user.setUsername(username);
            // TODO: 从数据库或缓存中获取完整的用户信息

            // 将用户信息设置到请求中
            request.setAttribute("currentUser", user);
            request.setAttribute("userId", userId);
            request.setAttribute("username", username);
            request.setAttribute("roles", roles);

        } catch (Exception e) {
            throw new AuthorizationException("令牌验证失败：" + e.getMessage());
        }

        return true;
    }
}