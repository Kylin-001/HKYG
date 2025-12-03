package com.heikeji.common.core.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT工具类
 * 用于生成和验证JWT令牌
 *
 * @author: zky
 * @date: 2024-01-01
 */
@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwt.secret:heikeji-mall-secret-key-2024-black-technology-university-campus-mall-system}")
    private String jwtSecret;

    @Value("${jwt.expiration:3600000}")
    private long jwtExpiration;
    
    @Value("${jwt.refresh-expiration:86400000}")
    private long refreshExpiration;

    // 使用强密钥生成器，提高安全性
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    /**
     * 生成Token
     * @param userId 用户ID
     * @param username 用户名
     * @return Token字符串
     */
    public String generateToken(String userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        
        return generateToken(claims, jwtExpiration);
    }
    
    /**
     * 生成刷新Token
     * @param userId 用户ID
     * @param username 用户名
     * @return 刷新Token字符串
     */
    public String generateRefreshToken(String userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        claims.put("refresh", true);
        
        return generateToken(claims, refreshExpiration);
    }
    
    /**
     * 生成Token（内部使用）
     * @param claims JWT载荷
     * @param expiration 过期时间（毫秒）
     * @return Token字符串
     */
    private String generateToken(Map<String, Object> claims, long expiration) {
        Date now = new Date();
        Date expireDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expireDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 从Token中获取Claims
     * @param token Token字符串
     * @return Claims对象
     */
    public Claims extractClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            logger.error("解析Token失败: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * 从Token中获取用户ID
     * @param token Token字符串
     * @return 用户ID
     */
    public String getUserIdFromToken(String token) {
        return extractClaims(token).get("userId", String.class);
    }

    /**
     * 从Token中获取用户名
     * @param token Token字符串
     * @return 用户名
     */
    public String getUsernameFromToken(String token) {
        return extractClaims(token).get("username", String.class);
    }
    
    /**
     * 获取Token的过期时间
     * @param token Token字符串
     * @return 过期时间
     */
    public Date getExpirationDateFromToken(String token) {
        return extractClaims(token).getExpiration();
    }
    
    /**
     * 检查Token是否过期
     * @param token Token字符串
     * @return 是否已过期
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getExpirationDateFromToken(token);
            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            logger.warn("Token已过期: {}", e.getMessage());
            return true;
        }
    }
    
    /**
     * 验证Token是否有效
     * @param token Token字符串
     * @return 是否有效
     */
    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return !isTokenExpired(token);
        } catch (SignatureException e) {
            logger.error("无效的JWT签名: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("无效的JWT令牌: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT令牌已过期: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT令牌不受支持: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT声明字符串为空: {}", e.getMessage());
        }
        return false;
    }
    
    /**
     * 从请求头中提取Token
     * @param authorizationHeader Authorization请求头
     * @return Token字符串（去除Bearer前缀）
     */
    public String extractTokenFromHeader(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }


    /**
     * 刷新Token
     * @param token 原Token
     * @return 新Token
     */
    public String refreshToken(String token) {
        Claims claims = extractClaims(token);
        String userId = claims.get("userId", String.class);
        String username = claims.get("username", String.class);
        return generateToken(userId, username);
    }
}