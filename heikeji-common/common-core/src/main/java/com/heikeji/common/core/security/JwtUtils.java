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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

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
    
    // Redis中令牌黑名单的前缀
    private static final String TOKEN_BLACKLIST_PREFIX = "jwt:blacklist:";
    
    // 从Redis中获取令牌的TTL（过期时间）前缀
    private static final String TOKEN_TTL_PREFIX = "jwt:ttl:";
    
    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    @Value("${jwt.secret:heikeji-mall-secret-key-2024-black-technology-university-campus-mall-system}")
    private String jwtSecret;

    @Value("${jwt.expiration:3600000}")
    private long jwtExpiration;
    
    @Value("${jwt.refresh-expiration:86400000}")
    private long refreshExpiration;

    // 使用强密钥生成器，提高安全性
    private SecretKey getSigningKey() {
        try {
            // 尝试从Base64解码密钥
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            // 如果解码失败，直接使用原始字符串作为密钥
            logger.warn("JWT密钥不是有效的Base64字符串，使用原始字符串作为密钥");
            return Keys.hmacShaKeyFor(jwtSecret.getBytes());
        }
    }
    
    /**
     * 生成Token
     * @param userId 用户ID
     * @param username 用户名
     * @param additionalClaims 额外的自定义声明
     * @return Token字符串
     */
    public String generateToken(String userId, String username, Map<String, Object> additionalClaims) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        
        // 添加额外的自定义声明
        if (additionalClaims != null && !additionalClaims.isEmpty()) {
            claims.putAll(additionalClaims);
        }
        
        return generateToken(claims, jwtExpiration);
    }
    
    /**
     * 生成Token
     * @param userId 用户ID
     * @param username 用户名
     * @return Token字符串
     */
    public String generateToken(String userId, String username) {
        return generateToken(userId, username, null);
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
     * 获取Token的剩余有效期（毫秒）
     * @param token Token字符串
     * @return 剩余有效期（毫秒）
     */
    public long getRemainingExpiration(String token) {
        try {
            Date expiration = getExpirationDateFromToken(token);
            return expiration.getTime() - new Date().getTime();
        } catch (ExpiredJwtException e) {
            logger.warn("Token已过期: {}", e.getMessage());
            return 0;
        }
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
     * 检查Token是否在黑名单中
     * @param token Token字符串
     * @return 是否在黑名单中
     */
    public boolean isTokenInBlacklist(String token) {
        if (redisTemplate == null) {
            // Redis不可用时，默认Token不在黑名单中
            return false;
        }
        String blacklistKey = TOKEN_BLACKLIST_PREFIX + token;
        return Boolean.TRUE.equals(redisTemplate.hasKey(blacklistKey));
    }
    
    /**
     * 将Token加入黑名单
     * @param token Token字符串
     */
    public void addTokenToBlacklist(String token) {
        if (redisTemplate == null) {
            // Redis不可用时，记录日志并返回
            logger.info("Redis不可用，无法将Token加入黑名单: {}", token);
            return;
        }
        
        try {
            // 获取Token剩余有效期
            long remainingExpiration = getRemainingExpiration(token);
            
            if (remainingExpiration > 0) {
                // 如果Token还有效，将其加入黑名单并设置过期时间
                String blacklistKey = TOKEN_BLACKLIST_PREFIX + token;
                redisTemplate.opsForValue().set(blacklistKey, "1", remainingExpiration, TimeUnit.MILLISECONDS);
                logger.info("Token已加入黑名单: {}, 剩余有效期: {}ms", token, remainingExpiration);
            } else {
                logger.info("Token已过期，无需加入黑名单: {}", token);
            }
        } catch (Exception e) {
            logger.error("将Token加入黑名单失败: {}", e.getMessage());
        }
    }
    
    /**
     * 验证Token是否有效
     * @param token Token字符串
     * @return 是否有效
     */
    public boolean validateToken(String token) {
        try {
            // 检查Token是否在黑名单中
            if (isTokenInBlacklist(token)) {
                logger.warn("Token已被列入黑名单: {}", token);
                return false;
            }
            
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
     * @param refreshToken 刷新Token
     * @return 新Token
     */
    public String refreshToken(String refreshToken) {
        // 验证刷新Token是否有效
        if (!validateToken(refreshToken)) {
            logger.error("刷新Token无效: {}", refreshToken);
            throw new RuntimeException("无效的刷新Token");
        }
        
        // 检查是否为刷新Token
        Claims claims = extractClaims(refreshToken);
        Boolean isRefreshToken = claims.get("refresh", Boolean.class);
        if (isRefreshToken == null || !isRefreshToken) {
            logger.error("不是有效的刷新Token: {}", refreshToken);
            throw new RuntimeException("无效的刷新Token");
        }
        
        String userId = claims.get("userId", String.class);
        String username = claims.get("username", String.class);
        
        // 生成新的访问Token
        return generateToken(userId, username);
    }
    
    /**
     * 清理过期的令牌
     */
    public void cleanExpiredTokens() {
        // Redis会自动清理过期的键，无需手动清理
        logger.info("已触发过期令牌清理（Redis自动清理）");
    }
    
    /**
     * 获取Token黑名单大小
     * @return 黑名单大小
     */
    public long getBlacklistSize() {
        if (redisTemplate == null) {
            // Redis不可用时，返回0
            return 0;
        }
        
        try {
            return redisTemplate.keys(TOKEN_BLACKLIST_PREFIX + "*").size();
        } catch (Exception e) {
            logger.error("获取Token黑名单大小失败: {}", e.getMessage());
            return 0;
        }
    }
}