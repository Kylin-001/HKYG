package com.heikeji.admin.security.impl;

import com.heikeji.admin.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Token服务实现类- 简化版本
 */
@Service
@Primary
public class TokenServiceImpl implements TokenService {

    @Value("${admin.security.token.expireTime}")
    private Integer expireTime;

    @Value("${admin.security.token.tokenHead}")
    private String tokenHead;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // 用于存储已失效的token，避免重复验证
    private Map<String, Boolean> invalidatedTokens = new ConcurrentHashMap<>();

    /**
     * 生成token
     */
    @Override
    public String createToken(UserDetails userDetails) {
        // 生成简化版token，username:timestamp
        String username = userDetails.getUsername();
        long timestamp = System.currentTimeMillis();
        String token = username + ":" + timestamp;

        // 将token存入Redis，用于快速校验和注销
        String tokenKey = "admin:token:" + token;
        redisTemplate.opsForValue().set(tokenKey, userDetails, expireTime, TimeUnit.MINUTES);

        return token;
    }

    /**
     * 验证token
     */
    @Override
    public boolean validateToken(String token, UserDetails userDetails) {
        // 检查token是否已失效
        if (invalidatedTokens.containsKey(token)) {
            return false;
        }

        // 检查Redis中是否还存在token
        String tokenKey = "admin:token:" + token;
        Object cachedUser = redisTemplate.opsForValue().get(tokenKey);
        if (cachedUser == null) {
            return false;
        }

        // 从token中提取用户名并验证
        String username = getUsernameFromToken(token);
        return StringUtils.hasText(username) && username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    /**
     * 从token中获取用户名
     */
    @Override
    public String getUsernameFromToken(String token) {
        if (token != null && token.contains(":")) {
            return token.split(":")[0];
        }
        return null;
    }

    /**
     * 刷新token
     */
    @Override
    public String refreshToken(String token) {
        try {
            // 获取原始token的用户名
            String username = getUsernameFromToken(token);
            if (username == null) {
                return null;
            }

            // 使旧token失效
            invalidateToken(token);

            // 生成新token
            long timestamp = System.currentTimeMillis();
            String newToken = username + ":" + timestamp;

            // 将新token存入Redis
            String newTokenKey = "admin:token:" + newToken;
            redisTemplate.opsForValue().set(newTokenKey, username, expireTime, TimeUnit.MINUTES);

            return newToken;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 使token失效
     */
    @Override
    public void invalidateToken(String token) {
        // 添加到本地缓存
        invalidatedTokens.put(token, true);
        
        // 从Redis中删除
        String tokenKey = "admin:token:" + token;
        redisTemplate.delete(tokenKey);
    }

    /**
     * 获取当前用户的权限信息
     */
    @Override
    public Map<String, Object> getCurrentUserPermissions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Collections.emptyMap();
        }

        Map<String, Object> result = new HashMap<>();
        
        // 获取用户名
        result.put("username", authentication.getName());
        
        // 获取权限列表
        List<String> permissions = new ArrayList<>();
        authentication.getAuthorities().forEach(auth -> permissions.add(auth.getAuthority()));
        result.put("permissions", permissions);
        
        // 获取角色列表
        List<String> roles = new ArrayList<>();
        permissions.forEach(perm -> {
            if (perm.startsWith("ROLE_")) {
                roles.add(perm.substring(5));
            }
        });
        result.put("roles", roles);
        
        return result;
    }

    /**
     * 从请求头中获取token
     */
    public String getToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(tokenHead)) {
            return bearerToken.substring(tokenHead.length());
        }
        return null;
    }

    /**
     * 检查token是否过期
     */
    private boolean isTokenExpired(String token) {
        if (token != null && token.contains(":")) {
            try {
                String[] parts = token.split(":");
                if (parts.length >= 2) {
                    long timestamp = Long.parseLong(parts[1]);
                    // 检查是否过期（基于配置的过期时间）
                    return System.currentTimeMillis() > timestamp + (expireTime * 60 * 1000);
                }
            } catch (NumberFormatException e) {
                // 时间格式错误，视为过期
                return true;
            }
        }
        return true;
    }
}
