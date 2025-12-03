package com.heikeji.admin.security;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Token服务接口
 */
public interface TokenService {

    /**
     * 生成token
     */
    String createToken(UserDetails userDetails);

    /**
     * 验证token
     */
    boolean validateToken(String token, UserDetails userDetails);

    /**
     * 从token中获取用户名
     */
    String getUsernameFromToken(String token);

    /**
     * 刷新token
     */
    String refreshToken(String token);

    /**
     * 使token失效
     */
    void invalidateToken(String token);

    /**
     * 获取当前用户的权限信息
     */
    Map<String, Object> getCurrentUserPermissions();
}
