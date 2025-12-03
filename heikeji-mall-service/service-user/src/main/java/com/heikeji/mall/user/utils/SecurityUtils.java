package com.heikeji.mall.user.utils;

import com.heikeji.mall.common.auth.UserLoginInfo;
import com.heikeji.mall.common.auth.UserContextHolder;
import com.heikeji.mall.common.exception.BusinessException;
import com.heikeji.mall.user.dto.UserLoginDTO;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.regex.Pattern;

/**
 * 安全工具类
 *
 * @author heikeji
 * @date 2024-12-19
 */
public class SecurityUtils {

    private static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    /**
     * 密码加密
     */
    public static String encryptPassword(String password) {
        return PASSWORD_ENCODER.encode(password);
    }

    /**
     * 密码匹配
     */
    public static boolean matchesPassword(String rawPassword, String encodedPassword) {
        return PASSWORD_ENCODER.matches(rawPassword, encodedPassword);
    }

    /**
     * 获取当前登录用户ID
     */
    public static Long getCurrentUserId() {
        UserLoginDTO userLoginInfo = UserContextHolder.getUserLoginInfo();
        if (userLoginInfo == null) {
            throw new BusinessException("用户未登录");
        }
        return userLoginInfo.getId();
    }

    /**
     * 获取当前登录用户
     */
    public static UserLoginDTO getCurrentUser() {
        UserLoginDTO userLoginInfo = UserContextHolder.getUserLoginInfo();
        if (userLoginInfo == null) {
            throw new BusinessException("用户未登录");
        }
        return userLoginInfo;
    }

    /**
     * 验证手机号格式
     */
    public static boolean validatePhone(String phone) {
        if (phone == null || phone.length() != 11) {
            return false;
        }
        String regex = "^1[3-9]\\d{9}$";
        return Pattern.matches(regex, phone);
    }

    /**
     * 验证邮箱格式
     */
    public static boolean validateEmail(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        String regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return Pattern.matches(regex, email);
    }

    /**
     * 验证密码强度
     */
    public static boolean validatePasswordStrength(String password) {
        if (password == null || password.length() < 6) {
            return false;
        }
        // 密码至少包含字母和数字
        String regex = "^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$";
        return Pattern.matches(regex, password);
    }

    /**
     * 生成随机验证码
     */
    public static String generateVerificationCode(int length) {
        if (length <= 0) {
            length = 6;
        }
        String chars = "0123456789";
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * chars.length());
            code.append(chars.charAt(index));
        }
        return code.toString();
    }
}
