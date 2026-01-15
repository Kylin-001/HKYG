package com.heikeji.mall.user.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heikeji.common.security.utils.JwtUtils;
import java.util.HashMap;
import java.util.Map;
import com.heikeji.mall.user.dto.ChangePasswordDTO;
import com.heikeji.mall.user.dto.LoginDTO;
import com.heikeji.mall.user.dto.ResetPasswordDTO;
import com.heikeji.mall.user.dto.UserSecurityDTO;
import com.heikeji.mall.user.vo.UserSecurityVO;
import com.heikeji.mall.user.entity.User;
import com.heikeji.mall.user.component.PasswordStrengthChecker;
import com.heikeji.mall.user.service.UserLoginHistoryService;
import com.heikeji.mall.user.service.UserSecurityService;
import com.heikeji.mall.user.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 用户安全服务实现类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Service
public class UserSecurityServiceImpl implements UserSecurityService {
    private static final Logger log = LoggerFactory.getLogger(UserSecurityServiceImpl.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserLoginHistoryService loginHistoryService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired(required = false)
    private RedisTemplate<String, String> redisTemplate;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private PasswordStrengthChecker passwordStrengthChecker;

    // 使用common-security模块中的JwtUtils类，无需注入



    @Value("${spring.mail.username:}")
    private String fromEmail;

    private static final String SMS_CODE_PREFIX = "sms:code:";
    private static final String EMAIL_CODE_PREFIX = "email:code:";
    private static final String RESET_PASSWORD_PREFIX = "reset:password:";
    private static final String SECURITY_SETTINGS_PREFIX = "security:settings:";

    @Override
    public UserSecurityVO login(LoginDTO loginDTO) {
        String account = loginDTO.getAccount();
        String password = loginDTO.getPassword();

        // 查找用户 - 根据account类型（用户名/手机号/邮箱）分别处理
        User user = null;
        if (account.contains("@")) {
            user = userService.getUserByEmail(account);
        } else if (account.matches("^1[3-9]\\d{9}$")) {
            user = userService.getUserByPhone(account);
        } else {
            user = userService.getUserByUsername(account);
        }

        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 验证密码
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        // 检查用户状态
        if (user.getStatus() == 0) {
            throw new RuntimeException("用户已禁用");
        }

        // 生成JWT令牌
        String token = JwtUtils.generateToken(user.getId(), null);

        // 获取当前请求
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        String remoteAddr = "unknown";
        String userAgent = "unknown";
        if (attributes != null) {
            HttpServletRequest currentRequest = attributes.getRequest();
            remoteAddr = currentRequest.getRemoteAddr();
            userAgent = currentRequest.getHeader("User-Agent");
        }
        
        // 更新登录信息
        user.setLastLoginTime(LocalDateTime.now());
        user.setLastLoginIp(remoteAddr);
        userService.updateById(user);

        // 记录登录历史
        loginHistoryService.recordLoginHistory(user.getId(), user.getUsername(), remoteAddr, 
                                              userAgent, "success", "登录成功");

        // 构建返回对象
        UserSecurityVO userSecurityVO = new UserSecurityVO();
        userSecurityVO.setUserId(user.getId());
        userSecurityVO.setUsername(user.getUsername());
        userSecurityVO.setToken(token);
        userSecurityVO.setExpireTime(System.currentTimeMillis() + 24 * 60 * 60 * 1000); // 默认24小时过期
        userSecurityVO.setStatus(user.getStatus());
        userSecurityVO.setLastLoginTime(user.getLastLoginTime().toString());
        userSecurityVO.setLastLoginIp(user.getLastLoginIp());
        userSecurityVO.setIsLocked(user.getStatus() == 0);

        return userSecurityVO;
    }

    @Override
    public void logout(Long userId) {
        // TODO: 实现退出登录逻辑（如加入黑名单等）
        // 在实际项目中，这里可以添加令牌黑名单或其他退出登录逻辑
        // 由于当前使用的是无状态JWT，我们可以不做特殊处理，让令牌自然过期
        log.info("用户退出登录: {}", userId);
    }

    @Override
    public boolean changePassword(Long userId, ChangePasswordDTO changePasswordDTO) {
        try {
            User user = userService.getById(userId);
            if (user == null) {
                return false;
            }

            // 验证旧密码
            if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getPassword())) {
                return false;
            }

            // 验证新密码和确认密码是否一致
            if (!changePasswordDTO.getNewPassword().equals(changePasswordDTO.getConfirmPassword())) {
                return false;
            }

            // 更新密码
            user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
            userService.updateById(user);
            return true;
        } catch (Exception e) {
            log.error("修改密码失败: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean resetPassword(ResetPasswordDTO resetPasswordDTO) {
        try {
            String phone = resetPasswordDTO.getPhone();
            String code = resetPasswordDTO.getCode();
            String newPassword = resetPasswordDTO.getNewPassword();

            // 验证验证码
            if (!verifySmsCode(phone, code)) {
                return false;
            }

            // 验证新密码和确认密码是否一致
            if (!newPassword.equals(resetPasswordDTO.getConfirmPassword())) {
                return false;
            }

            // 更新密码
            User user = userService.getUserByPhone(phone);
            if (user == null) {
                return false;
            }
            user.setPassword(passwordEncoder.encode(newPassword));
            userService.updateById(user);

            // 清除验证码（如果Redis可用）
            if (redisTemplate != null) {
                redisTemplate.delete(SMS_CODE_PREFIX + phone);
            }
            return true;
        } catch (Exception e) {
            log.error("重置密码失败", e);
            return false;
        }
    }

    @Override
    public void updatePassword(Long userId, String oldPassword, String newPassword) {
        User user = userService.getById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 验证旧密码
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("旧密码错误");
        }

        // 更新新密码
        user.setPassword(passwordEncoder.encode(newPassword));
        userService.updateById(user);
    }

    @Override
    public void changePassword(String oldPassword, String newPassword) {
        User currentUser = userService.getCurrentUser();
        updatePassword(currentUser.getId(), oldPassword, newPassword);
    }

    @Override
    public void sendResetPasswordEmail(String email) {
        User user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 生成重置令牌
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", email);
        String token = JwtUtils.generateCustomToken(claims, 60 * 60 * 1000L);
        String resetUrl = "http://localhost:8080/api/user/reset-password?token=" + token;

        // 发送邮件
        if (mailSender != null && StringUtils.isNotBlank(fromEmail)) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("密码重置请求");
            message.setText("请点击以下链接重置密码：" + resetUrl + "\n链接将在1小时后失效");
            mailSender.send(message);
        } else {
            // 如果mailSender未配置，只记录日志，不发送邮件
            log.warn("邮件发送功能未配置，跳过密码重置邮件发送，重置链接：{}", resetUrl);
        }

        // 保存重置令牌到Redis（如果Redis可用）
        if (redisTemplate != null) {
            redisTemplate.opsForValue().set(RESET_PASSWORD_PREFIX + token, user.getId().toString(), 3600, TimeUnit.SECONDS);
        }
    }

    @Override
    public void sendSmsCode(String phone) {
        // 检查用户是否存在
        User user = userService.getUserByPhone(phone);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 生成验证码
        String code = generateVerificationCode(6);

        // 保存验证码到Redis（如果Redis可用）
        if (redisTemplate != null) {
            redisTemplate.opsForValue().set(SMS_CODE_PREFIX + phone, code, 10, TimeUnit.MINUTES);
        }

        // TODO: 调用短信发送服务发送验证码
        System.out.println("向手机号 " + phone + " 发送验证码：" + code);
    }

    @Override
    public boolean verifySmsCode(String phone, String code) {
        if (redisTemplate == null) {
            // Redis不可用，直接返回true（仅用于测试环境）
            log.warn("Redis不可用，跳过短信验证码验证");
            return true;
        }
        String storedCode = redisTemplate.opsForValue().get(SMS_CODE_PREFIX + phone);
        return StringUtils.equals(code, storedCode);
    }

    @Override
    public boolean verifyEmailCode(String email, String code) {
        if (redisTemplate == null) {
            // Redis不可用，直接返回true（仅用于测试环境）
            log.warn("Redis不可用，跳过邮箱验证码验证");
            return true;
        }
        String storedCode = redisTemplate.opsForValue().get(EMAIL_CODE_PREFIX + email);
        return StringUtils.equals(code, storedCode);
    }

    @Override
    public boolean verifyPassword(Long userId, String password) {
        User user = userService.getById(userId);
        if (user == null) {
            return false;
        }
        return passwordEncoder.matches(password, user.getPassword());
    }

    @Override
    public boolean checkPasswordStrength(String password) {
        // 使用PasswordStrengthChecker检查密码强度，中等强度及以上认为是强密码
        PasswordStrengthChecker.StrengthLevel strengthLevel = passwordStrengthChecker.checkPasswordStrength(password);
        return strengthLevel != PasswordStrengthChecker.StrengthLevel.WEAK;
    }

    @Override
    public boolean validatePasswordStrength(String password) {
        // 使用PasswordStrengthChecker验证密码强度
        return passwordStrengthChecker.validatePassword(password);
    }

    @Override
    public String generateStrongPassword() {
        // 使用PasswordStrengthChecker生成强密码
        return passwordStrengthChecker.generateStrongPassword();
    }

    @Override
    public boolean isAccountLocked(String username) {
        User user = userService.getUserByUsername(username);
        return user != null && user.getStatus() == 0; // 0表示禁用状态
    }

    @Override
    public void clearFailedAttempts(String username) {
        // 清除登录失败次数的逻辑（如果Redis可用）
        if (redisTemplate != null) {
            String key = "login:fail:count:" + username;
            redisTemplate.delete(key);
        }
    }

    @Override
    public void lockAccount(String username) {
        User user = userService.getUserByUsername(username);
        if (user != null) {
            user.setStatus(0); // 0表示禁用状态
            userService.updateById(user);
        }
    }

    @Override
    public void unlockAccount(String username) {
        User user = userService.getUserByUsername(username);
        if (user != null) {
            user.setStatus(1); // 1表示启用状态
            userService.updateById(user);
        }
    }

    @Override
    public UserSecurityDTO getUserSecuritySettings(Long userId) {
        // 从Redis获取安全设置，如果不存在或Redis不可用则使用默认值
        UserSecurityDTO settings = null;
        if (redisTemplate != null) {
            String settingsJson = redisTemplate.opsForValue().get(SECURITY_SETTINGS_PREFIX + userId);
            if (StringUtils.isNotBlank(settingsJson)) {
                settings = JSON.parseObject(settingsJson, UserSecurityDTO.class);
            }
        }
        
        if (settings == null) {
            // 默认安全设置
            settings = new UserSecurityDTO();
            settings.setEnablePhoneVerification(true);
            settings.setEnableEmailVerification(false);
            settings.setEnableIpRestriction(false);
            settings.setEnableTwoFactorAuth(false);
            settings.setEnableRiskNotification(true);
            settings.setPasswordExpireDays(90);
            settings.setLoginFailLockCount(5);
            settings.setLoginFailLockTime(30);
            settings.setAllowRemoteLogin(true);

            // 保存到Redis（如果Redis可用）
            if (redisTemplate != null) {
                redisTemplate.opsForValue().set(SECURITY_SETTINGS_PREFIX + userId, JSON.toJSONString(settings), 30, TimeUnit.DAYS);
            }
        }

        return settings;
    }

    @Override
    public void updateUserSecuritySettings(Long userId, UserSecurityDTO userSecurityDTO) {
        // 保存到Redis（如果Redis可用）
        if (redisTemplate != null) {
            redisTemplate.opsForValue().set(SECURITY_SETTINGS_PREFIX + userId, JSON.toJSONString(userSecurityDTO), 30, TimeUnit.DAYS);
        }
    }

    @Override
    public void bindPhone(Long userId, String phone, String code) {
        // 验证验证码
        if (!verifySmsCode(phone, code)) {
            throw new RuntimeException("验证码错误或已过期");
        }

        // 检查手机号是否已被绑定
        User existingUser = userService.getUserByPhone(phone);
        if (existingUser != null && !existingUser.getId().equals(userId)) {
            throw new RuntimeException("该手机号已被其他用户绑定");
        }

        // 更新用户手机号
        User user = userService.getById(userId);
        user.setPhone(phone);
        userService.updateById(user);

        // 清除验证码（如果Redis可用）
        if (redisTemplate != null) {
            redisTemplate.delete(SMS_CODE_PREFIX + phone);
        }
    }

    @Override
    public void unbindPhone(Long userId) {
        User user = userService.getById(userId);
        user.setPhone(null);
        userService.updateById(user);
    }

    @Override
    public void bindEmail(Long userId, String email, String code) {
        // 验证邮箱验证码
        if (!verifyEmailCode(email, code)) {
            throw new RuntimeException("验证码错误或已过期");
        }

        // 检查邮箱是否已被绑定
        User existingUser = userService.getUserByEmail(email);
        if (existingUser != null && !existingUser.getId().equals(userId)) {
            throw new RuntimeException("该邮箱已被其他用户绑定");
        }

        // 更新用户邮箱
        User user = userService.getById(userId);
        user.setEmail(email);
        userService.updateById(user);

        // 清除验证码（如果Redis可用）
        if (redisTemplate != null) {
            redisTemplate.delete(EMAIL_CODE_PREFIX + email);
        }
    }

    @Override
    public void unbindEmail(Long userId) {
        User user = userService.getById(userId);
        user.setEmail(null);
        userService.updateById(user);
    }

    @Override
    public boolean detectRiskLogin(Long userId, String ip, String userAgent) {
        // 简单的风险检测逻辑：检查是否为异地登录
        // 这里可以根据实际需求实现更复杂的风险检测算法
        User user = userService.getById(userId);
        if (user.getLastLoginIp() != null && !user.getLastLoginIp().equals(ip)) {
            // IP发生变化，认为存在风险
            return true;
        }
        return false;
    }

    /**
     * 生成指定长度的验证码
     */
    private String generateVerificationCode(int length) {
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }
}
