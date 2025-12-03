package com.heikeji.admin.security.impl;

import com.heikeji.admin.security.TokenService;
import com.heikeji.common.core.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Token服务实现类- 简化版本
 */
@Service
public class JwtTokenServiceImpl implements TokenService {

    @Autowired
    private JwtUtils jwtUtils;

    // 存储已失效的token，防止重复攻击
    private final Map<String, Date> invalidatedTokens = new ConcurrentHashMap<>();

    @Override
    public String createToken(UserDetails userDetails) {
        // 使用common-core的JwtUtils生成标准JWT token
        // 注意：这里需要userId和username，暂时使用username作为userId
        String username = userDetails.getUsername();
        return jwtUtils.generateToken(username, username);
    }

    @Override
    public boolean validateToken(String token, UserDetails userDetails) {
        // 检查token是否已失效
        if (invalidatedTokens.containsKey(token)) {
            return false;
        }

        // 使用common-core的JwtUtils验证token
        return jwtUtils.validateToken(token);
    }

    @Override
    public String getUsernameFromToken(String token) {
        // 使用common-core的JwtUtils从token中获取用户名
        return jwtUtils.getUsernameFromToken(token);
    }

    @Override
    public String refreshToken(String token) {
        // 使用common-core的JwtUtils刷新token
        try {
            return jwtUtils.refreshToken(token);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public void invalidateToken(String token) {
        invalidatedTokens.put(token, new Date());
    }

    @Override
    public Map<String, Object> getCurrentUserPermissions() {
        // TODO: 从当前认证的用户中获取权限信息
        Map<String, Object> permissions = new HashMap<>();
        permissions.put("roles", new String[]{"admin"});
        permissions.put("permissions", new String[]{"*:*:*"});
        return permissions;
    }
}
