package com.heikeji.mall.user.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.user.entity.User;
import com.heikeji.mall.user.entity.UserAuth;
import com.heikeji.mall.user.mapper.UserAuthMapper;
import com.heikeji.mall.user.mapper.UserMapper;
import com.heikeji.mall.user.service.UserAuthService;
import com.heikeji.mall.user.service.UserService;
import com.heikeji.mall.user.vo.AuthTokenVO;
import com.heikeji.mall.user.dto.UserLoginDTO;
import com.heikeji.mall.user.dto.UserRegisterDTO;
import com.heikeji.mall.user.exception.PasswordStrengthException;
import com.heikeji.mall.user.constant.UserConstant;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * <p>
 * 用户认证服务实现类
 * </p>
 *
 * @author heikeji
 * @since 2024-05-20
 */
@Slf4j
@Service
public class UserAuthServiceImpl extends ServiceImpl<UserAuthMapper, UserAuth> implements UserAuthService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AuthTokenVO login(UserLoginDTO loginDTO) {
        // 实现登录逻辑
        // 1. 根据用户名/邮箱/手机号查询用户认证信息
        UserAuth userAuth = null;
        if (loginDTO.getUsername() != null) {
            userAuth = getBaseMapper().selectByUsername(loginDTO.getUsername());
        } else if (loginDTO.getEmail() != null) {
            userAuth = getBaseMapper().selectByEmail(loginDTO.getEmail());
        } else if (loginDTO.getPhone() != null) {
            userAuth = getBaseMapper().selectByPhone(loginDTO.getPhone());
        }

        // 2. 验证用户是否存在
        if (userAuth == null) {
            throw new RuntimeException("用户不存在");
        }

        // 3. 验证密码
        if (!passwordEncoder.matches(loginDTO.getPassword(), userAuth.getAuthCredential())) {
            throw new RuntimeException("密码错误");
        }

        // 5. 生成JWT令牌
        // 这里需要集成JWT工具类来生成token
        String accessToken = generateAccessToken(userAuth.getUserId());
        String refreshToken = generateRefreshToken(userAuth.getUserId());

        // 6. 返回令牌信息
        return AuthTokenVO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(3600L) // 1小时过期
                .tokenType("Bearer")
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long register(UserRegisterDTO registerDTO) {
        // 1. 验证用户名是否已存在
        if (getBaseMapper().selectByUsername(registerDTO.getUsername()) != null) {
            throw new RuntimeException("用户名已存在");
        }

        // 2. 验证邮箱是否已存在
        if (registerDTO.getEmail() != null && getBaseMapper().selectByEmail(registerDTO.getEmail()) != null) {
            throw new RuntimeException("邮箱已被注册");
        }

        // 3. 验证手机号是否已存在
        if (registerDTO.getPhone() != null && getBaseMapper().selectByPhone(registerDTO.getPhone()) != null) {
            throw new RuntimeException("手机号已被注册");
        }

        // 4. 验证密码强度
        validatePasswordStrength(registerDTO.getPassword());

        // 5. 创建用户基本信息
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setNickname(registerDTO.getNickname());
        user.setEmail(registerDTO.getEmail());
        user.setPhone(registerDTO.getPhone());
        user.setStatus(1); // 1表示启用，0表示禁用
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        userMapper.insert(user);

        // 6. 创建用户认证信息
        UserAuth userAuth = new UserAuth();
        userAuth.setUserId(user.getId());
        userAuth.setAuthType("password");
        userAuth.setAuthIdentifier(registerDTO.getUsername());
        userAuth.setAuthCredential(passwordEncoder.encode(registerDTO.getPassword()));
        userAuth.setCreateTime(LocalDateTime.now());
        userAuth.setUpdateTime(LocalDateTime.now());
        getBaseMapper().insert(userAuth);

        return userAuth.getId();
    }

    @Override
    public AuthTokenVO refreshToken(String refreshToken) {
        // 实现刷新令牌逻辑
        // 1. 验证刷新令牌的有效性
        // 2. 解析令牌获取用户ID
        // 3. 生成新的访问令牌
        Long userId = parseRefreshToken(refreshToken);
        String newAccessToken = generateAccessToken(userId);
        String newRefreshToken = generateRefreshToken(userId);

        return AuthTokenVO.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn(3600L) // 1小时过期
                .tokenType("Bearer")
                .build();
    }

    @Override
    public void logout(String token) {
        // 实现登出逻辑
        // 1. 将令牌加入黑名单
        // 2. 清除用户相关的缓存信息
    }

    @Override
    public UserAuth getUserAuthByUserId(Long userId) {
        return getBaseMapper().selectByUserId(userId);
    }

    @Override
    public UserAuth getUserAuthByUsername(String username) {
        return getBaseMapper().selectByUsername(username);
    }

    @Override
    public UserAuth getUserAuthByEmail(String email) {
        return getBaseMapper().selectByEmail(email);
    }

    @Override
    public UserAuth getUserAuthByPhone(String phone) {
        return getBaseMapper().selectByPhone(phone);
    }

    @Override
    public boolean updatePassword(Long userId, String oldPassword, String newPassword) {
        // 1. 查询用户认证信息
        UserAuth userAuth = getBaseMapper().selectByUserId(userId);
        if (userAuth == null) {
            throw new RuntimeException("用户不存在");
        }

        // 2. 验证旧密码
        if (!passwordEncoder.matches(oldPassword, userAuth.getAuthCredential())) {
            throw new RuntimeException("旧密码错误");
        }

        // 3. 验证新密码强度
        validatePasswordStrength(newPassword);

        // 4. 更新密码
        userAuth.setAuthCredential(passwordEncoder.encode(newPassword));
        userAuth.setUpdateTime(LocalDateTime.now());
        return getBaseMapper().updateById(userAuth) > 0;
    }

    @Override
    public boolean resetPassword(Long userId, String newPassword) {
        // 1. 查询用户认证信息
        UserAuth userAuth = getBaseMapper().selectByUserId(userId);
        if (userAuth == null) {
            throw new RuntimeException("用户不存在");
        }

        // 2. 验证新密码强度
        validatePasswordStrength(newPassword);

        // 3. 更新密码
        userAuth.setAuthCredential(passwordEncoder.encode(newPassword));
        userAuth.setUpdateTime(LocalDateTime.now());
        return getBaseMapper().updateById(userAuth) > 0;
    }

    @Override
    public boolean bindEmail(Long userId, String email) {
        // 1. 验证邮箱是否已被其他用户绑定
        UserAuth existingAuth = getBaseMapper().selectByEmail(email);
        if (existingAuth != null && !existingAuth.getUserId().equals(userId)) {
            throw new RuntimeException("邮箱已被其他用户绑定");
        }

        // 2. 更新用户认证信息
        UserAuth userAuth = getBaseMapper().selectByUserId(userId);
        if (userAuth == null) {
            throw new RuntimeException("用户不存在");
        }

        // 注意：UserAuth实体类中没有email字段，这里假设email存储在User实体中
        // 如果需要实现邮箱绑定功能，可能需要修改数据库结构或使用其他方式存储
        userAuth.setUpdateTime(LocalDateTime.now());
        return getBaseMapper().updateById(userAuth) > 0;
    }

    @Override
    public boolean unbindEmail(Long userId) {
        // 更新用户认证信息，清除邮箱
        UserAuth userAuth = getBaseMapper().selectByUserId(userId);
        if (userAuth == null) {
            throw new RuntimeException("用户不存在");
        }

        // 注意：UserAuth实体类中没有email字段，这里假设email存储在User实体中
        // 如果需要实现邮箱解绑功能，可能需要修改数据库结构或使用其他方式存储
        userAuth.setUpdateTime(LocalDateTime.now());
        return getBaseMapper().updateById(userAuth) > 0;
    }

    @Override
    public boolean bindPhone(Long userId, String phone) {
        // 1. 验证手机号是否已被其他用户绑定
        UserAuth existingAuth = getBaseMapper().selectByPhone(phone);
        if (existingAuth != null && !existingAuth.getUserId().equals(userId)) {
            throw new RuntimeException("手机号已被其他用户绑定");
        }

        // 2. 更新用户认证信息
        UserAuth userAuth = getBaseMapper().selectByUserId(userId);
        if (userAuth == null) {
            throw new RuntimeException("用户不存在");
        }

        // 注意：UserAuth实体类中没有phone字段，这里假设phone存储在User实体中
        // 如果需要实现手机号绑定功能，可能需要修改数据库结构或使用其他方式存储
        userAuth.setUpdateTime(LocalDateTime.now());
        return getBaseMapper().updateById(userAuth) > 0;
    }

    @Override
    public boolean unbindPhone(Long userId) {
        // 更新用户认证信息，清除手机号
        UserAuth userAuth = getBaseMapper().selectByUserId(userId);
        if (userAuth == null) {
            throw new RuntimeException("用户不存在");
        }

        // 注意：UserAuth实体类中没有phone字段，这里假设phone存储在User实体中
        // 如果需要实现手机号解绑功能，可能需要修改数据库结构或使用其他方式存储
        userAuth.setUpdateTime(LocalDateTime.now());
        return getBaseMapper().updateById(userAuth) > 0;
    }

    @Override
    public boolean activateUser(Long userId) {
        // 更新用户状态为激活
        UserAuth userAuth = getBaseMapper().selectByUserId(userId);
        if (userAuth == null) {
            throw new RuntimeException("用户不存在");
        }

        // 注意：UserAuth实体类中没有status字段，用户状态可能存储在User实体中
        // 如果需要实现用户激活功能，可能需要修改User实体或使用其他方式存储
        userAuth.setUpdateTime(LocalDateTime.now());
        return getBaseMapper().updateById(userAuth) > 0;
    }

    @Override
    public boolean disableUser(Long userId) {
        // 更新用户状态为禁用
        UserAuth userAuth = getBaseMapper().selectByUserId(userId);
        if (userAuth == null) {
            throw new RuntimeException("用户不存在");
        }

        // 注意：UserAuth实体类中没有status字段，用户状态可能存储在User实体中
        // 如果需要实现用户禁用功能，可能需要修改User实体或使用其他方式存储
        userAuth.setUpdateTime(LocalDateTime.now());
        return getBaseMapper().updateById(userAuth) > 0;
    }

    @Override
    public List<UserAuth> getUserAuthsByUserIds(List<Long> userIds) {
        return getBaseMapper().selectBatchByUserIds(userIds);
    }

    /**
     * 验证密码强度
     *
     * @param password 密码
     */
    private void validatePasswordStrength(String password) {
        // 1. 检查密码长度
        if (password.length() < 8) {
            throw new PasswordStrengthException(PasswordStrengthException.ERROR_PASSWORD_LENGTH);
        }

        // 2. 检查是否包含小写字母
        if (!password.matches("[a-z]")) {
            throw new PasswordStrengthException(PasswordStrengthException.ERROR_MISSING_LOWERCASE);
        }

        // 3. 检查是否包含大写字母
        if (!password.matches("[A-Z]")) {
            throw new PasswordStrengthException(PasswordStrengthException.ERROR_MISSING_UPPERCASE);
        }

        // 4. 检查是否包含数字
        if (!password.matches("[0-9]")) {
            throw new PasswordStrengthException(PasswordStrengthException.ERROR_MISSING_NUMBER);
        }

        // 5. 检查是否包含特殊字符
        if (!password.matches("[!@#$%^&*(),.?\":{}|<>]") && password.length() < 12) {
            throw new PasswordStrengthException(PasswordStrengthException.ERROR_MISSING_SPECIAL);
        }
    }

    /**
     * 生成访问令牌
     *
     * @param userId 用户ID
     * @return 访问令牌
     */
    private String generateAccessToken(Long userId) {
        // 这里需要集成JWT工具类来生成token
        // 暂时返回模拟token
        return "access_token_" + UUID.randomUUID().toString() + "_" + userId;
    }

    /**
     * 生成刷新令牌
     *
     * @param userId 用户ID
     * @return 刷新令牌
     */
    private String generateRefreshToken(Long userId) {
        // 这里需要集成JWT工具类来生成token
        // 暂时返回模拟token
        return "refresh_token_" + UUID.randomUUID().toString() + "_" + userId;
    }

    /**
     * 解析刷新令牌
     *
     * @param refreshToken 刷新令牌
     * @return 用户ID
     */
    private Long parseRefreshToken(String refreshToken) {
        // 这里需要集成JWT工具类来解析token
        // 暂时模拟解析
        try {
            String[] parts = refreshToken.split("_");
            return Long.parseLong(parts[parts.length - 1]);
        } catch (Exception e) {
            throw new RuntimeException("无效的刷新令牌");
        }
    }
}