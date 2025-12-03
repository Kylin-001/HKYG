package com.heikeji.system.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 密码加密工具类
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public class PasswordUtils {

    private static final BCryptPasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    /**
     * 加密密码
     *
     * @param rawPassword 原始密码
     * @return 加密后的密码
     */
    public static String encode(String rawPassword) {
        return PASSWORD_ENCODER.encode(rawPassword);
    }

    /**
     * 验证密码
     *
     * @param rawPassword     原始密码
     * @param encodedPassword 加密后的密码
     * @return 是否匹配
     */
    public static boolean matches(String rawPassword, String encodedPassword) {
        return PASSWORD_ENCODER.matches(rawPassword, encodedPassword);
    }

    /**
     * 生成默认密码
     *
     * @return 默认密码
     */
    public static String getDefaultPassword() {
        return "123456";
    }

    /**
     * 加密默认密码
     *
     * @return 加密后的默认密码
     */
    public static String getEncodedDefaultPassword() {
        return encode(getDefaultPassword());
    }
}
