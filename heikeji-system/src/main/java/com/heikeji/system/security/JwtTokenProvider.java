package com.heikeji.system.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * JWT令牌提供者 - 简化版本
 */
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpiration;

    /**
     * 生成简化版JWT令牌
     */
    public String generateToken(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            // 返回一个简单的token格式，username:timestamp
            return userDetails.getUsername() + ":" + System.currentTimeMillis();
        }
        return "";
    }

    /**
     * 从令牌中获取用户名
     */
    public String getUsernameFromJWT(String token) {
        if (token != null && token.contains(":")) {
            return token.split(":")[0];
        }
        return null;
    }

    /**
     * 验证令牌
     */
    public boolean validateToken(String authToken) {
        // 简单的验证逻辑
        return authToken != null && authToken.contains(":");
    }

    /**
     * 生成刷新令牌
     */
    public String generateRefreshToken(String username) {
        // 返回一个简单的刷新token
        return username + ":refresh:" + System.currentTimeMillis();
    }
}
