package com.heikeji.common.security.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * JWT工具类
 */
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
    
    // JWT签名密钥，建议从配置文件读取
    private static final String SECRET = "heikeji-mall-secret-key-2024-black-technology-university-campus-mall-system";
    // 默认过期时间，7天
    private static final Long DEFAULT_EXPIRATION = 7 * 24 * 60 * 60 * 1000L;
    // 短期过期时间，2小时（用于特殊场景）
    private static final Long SHORT_EXPIRATION = 2 * 60 * 60 * 1000L;
    // JWT密钥实例
    private static final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());
    // Token前缀
    public static final String TOKEN_PREFIX = "Bearer ";
    // Token请求头名
    public static final String TOKEN_HEADER = "Authorization";
    
    // Token黑名单（简单实现，实际项目中应使用Redis等持久化存储）
    private static final Map<String, Long> TOKEN_BLACKLIST = new HashMap<>();

    /**
     * 生成token
     * 
     * @param userId 用户ID
     * @param openId 微信OpenID
     * @return JWT token
     */
    public static String generateToken(Long userId, String openId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("openId", openId);
        return createToken(claims, DEFAULT_EXPIRATION);
    }

    /**
     * 生成短期token（用于特殊场景）
     * 
     * @param userId 用户ID
     * @param openId 微信OpenID
     * @return JWT token
     */
    public static String generateShortToken(Long userId, String openId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("openId", openId);
        return createToken(claims, SHORT_EXPIRATION);
    }

    /**
     * 生成自定义token
     * 
     * @param claims 自定义载荷
     * @param expiration 过期时间（毫秒）
     * @return JWT token
     */
    public static String generateCustomToken(Map<String, Object> claims, Long expiration) {
        return createToken(claims, expiration);
    }

    /**
     * 生成自定义token
     * 
     * @param claims 自定义载荷
     * @param secret 密钥
     * @param expiration 过期时间（毫秒）
     * @return JWT token
     */
    public static String generateToken(Map<String, Object> claims, String secret, long expiration) {
        // 注意：这里忽略了传入的secret，使用默认密钥
        // 如果需要支持自定义密钥，可以修改此方法
        return createToken(claims, expiration);
    }

    /**
     * 创建token
     */
    private static String createToken(Map<String, Object> claims, Long expiration) {
        Date now = new Date();
        Date expireDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expireDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 从Token中获取Claims
     */
    public static Claims getClaimsFromToken(String token) {
        if (StringUtils.isBlank(token)) {
            throw new IllegalArgumentException("Token cannot be blank");
        }
        
        // 移除可能的Bearer前缀
        if (token.startsWith(TOKEN_PREFIX)) {
            token = token.substring(TOKEN_PREFIX.length());
        }
        
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 从Token中获取UserId
     */
    public static Long getUserIdFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("userId", Long.class);
    }

    /**
     * 从Token中获取OpenId
     */
    public static String getOpenIdFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("openId", String.class);
    }

    /**
     * 从Token中获取指定载荷的值
     */
    public static <T> T getClaimFromToken(String token, String claimName, Class<T> requiredType) {
        Claims claims = getClaimsFromToken(token);
        return claims.get(claimName, requiredType);
    }

    /**
     * 获取token的过期时间
     */
    public static Date getExpirationDateFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getExpiration();
    }

    /**
     * 获取token的创建时间
     */
    public static Date getIssuedAtFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getIssuedAt();
    }
    
    /**
     * 获取Token的剩余有效期（毫秒）
     */
    public static long getRemainingExpiration(String token) {
        try {
            Date expiration = getExpirationDateFromToken(token);
            return expiration.getTime() - new Date().getTime();
        } catch (Exception e) {
            logger.warn("Token已过期: {}", e.getMessage());
            return 0;
        }
    }
    
    /**
     * 将Token加入黑名单
     * @param token Token字符串
     */
    public static void addTokenToBlacklist(String token) {
        try {
            // 清理Token前缀
            String cleanToken = cleanTokenPrefix(token);
            
            // 获取Token剩余有效期
            long remainingExpiration = getRemainingExpiration(cleanToken);
            
            if (remainingExpiration > 0) {
                // 如果Token还有效，将其加入黑名单并设置过期时间
                TOKEN_BLACKLIST.put(cleanToken, System.currentTimeMillis() + remainingExpiration);
                logger.info("Token已加入黑名单: {}, 剩余有效期: {}ms", cleanToken, remainingExpiration);
            } else {
                logger.info("Token已过期，无需加入黑名单: {}", cleanToken);
            }
            
            // 清理过期的黑名单条目
            cleanExpiredBlacklist();
        } catch (Exception e) {
            logger.error("将Token加入黑名单失败: {}", e.getMessage());
        }
    }
    
    /**
     * 检查Token是否在黑名单中
     * @param token Token字符串
     * @return 是否在黑名单中
     */
    public static boolean isTokenInBlacklist(String token) {
        // 清理Token前缀
        String cleanToken = cleanTokenPrefix(token);
        
        // 清理过期的黑名单条目
        cleanExpiredBlacklist();
        
        return TOKEN_BLACKLIST.containsKey(cleanToken);
    }
    
    /**
     * 清理过期的黑名单条目
     */
    private static void cleanExpiredBlacklist() {
        long now = System.currentTimeMillis();
        TOKEN_BLACKLIST.entrySet().removeIf(entry -> entry.getValue() < now);
    }

    /**
     * 验证token是否有效
     */
    public static Boolean validateToken(String token) {
        try {
            // 检查Token是否在黑名单中
            if (isTokenInBlacklist(token)) {
                logger.warn("Token已被列入黑名单: {}", token);
                return false;
            }
            
            Claims claims = getClaimsFromToken(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            logger.error("验证Token失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 刷新token
     * 
     * @param token 旧token
     * @return 新token
     */
    public static String refreshToken(String token) {
        // 验证刷新Token是否有效
        if (!validateToken(token)) {
            logger.error("刷新Token无效: {}", token);
            throw new RuntimeException("无效的刷新Token");
        }
        
        Claims claims = getClaimsFromToken(token);
        // 重新生成token，而不是修改原claims
        Map<String, Object> newClaims = new HashMap<>();
        // 复制原有的claims
        for (Map.Entry<String, Object> entry : claims.entrySet()) {
            newClaims.put(entry.getKey(), entry.getValue());
        }
        return createToken(newClaims, DEFAULT_EXPIRATION);
    }

    /**
     * 检查token是否即将过期（默认30分钟内过期视为即将过期）
     */
    public static boolean isTokenExpiringSoon(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            Date expiration = claims.getExpiration();
            long timeUntilExpiration = expiration.getTime() - System.currentTimeMillis();
            // 30分钟 = 30 * 60 * 1000 毫秒
            return timeUntilExpiration < 30 * 60 * 1000L && timeUntilExpiration > 0;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 清理token前缀
     */
    public static String cleanTokenPrefix(String token) {
        if (StringUtils.isNotBlank(token) && token.startsWith(TOKEN_PREFIX)) {
            return token.substring(TOKEN_PREFIX.length());
        }
        return token;
    }
    
    /**
     * 清理过期的令牌
     */
    public static void cleanExpiredTokens() {
        cleanExpiredBlacklist();
        logger.info("已清理过期令牌和黑名单条目");
    }
    
    /**
     * 获取Token黑名单大小
     * @return 黑名单大小
     */
    public static int getBlacklistSize() {
        cleanExpiredBlacklist();
        return TOKEN_BLACKLIST.size();
    }
}



