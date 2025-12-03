package com.heikeji.mall.user.component;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * 密码强度检查器
 * 用于检查密码的强度，确保密码符合安全要求
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Component
public class PasswordStrengthChecker {

    // 正则表达式：包含至少一个小写字母
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile("[a-z]");
    // 正则表达式：包含至少一个大写字母
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile("[A-Z]");
    // 正则表达式：包含至少一个数字
    private static final Pattern DIGIT_PATTERN = Pattern.compile("[0-9]");
    // 正则表达式：包含至少一个特殊字符
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile("[!@#$%^&*()_+\\-=\\[\\]{};':\\\"\\|,.<>\\/?]");

    // 密码强度等级
    public enum StrengthLevel {
        WEAK(1, "弱"),
        MEDIUM(2, "中"),
        STRONG(3, "强");

        private final int level;
        private final String description;

        StrengthLevel(int level, String description) {
            this.level = level;
            this.description = description;
        }

        public int getLevel() {
            return level;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * 检查密码强度
     *
     * @param password 密码
     * @return 密码强度等级
     */
    public StrengthLevel checkPasswordStrength(String password) {
        if (password == null || password.isEmpty()) {
            return StrengthLevel.WEAK;
        }

        int strengthScore = 0;

        // 长度检查
        if (password.length() >= 8) {
            strengthScore++;
        }
        if (password.length() >= 12) {
            strengthScore++;
        }

        // 包含小写字母
        if (LOWERCASE_PATTERN.matcher(password).find()) {
            strengthScore++;
        }

        // 包含大写字母
        if (UPPERCASE_PATTERN.matcher(password).find()) {
            strengthScore++;
        }

        // 包含数字
        if (DIGIT_PATTERN.matcher(password).find()) {
            strengthScore++;
        }

        // 包含特殊字符
        if (SPECIAL_CHAR_PATTERN.matcher(password).find()) {
            strengthScore++;
        }

        // 确定强度等级
        if (strengthScore <= 2) {
            return StrengthLevel.WEAK;
        } else if (strengthScore <= 4) {
            return StrengthLevel.MEDIUM;
        } else {
            return StrengthLevel.STRONG;
        }
    }

    /**
     * 验证密码是否符合安全要求
     *
     * @param password 密码
     * @return 是否符合要求
     */
    public boolean validatePassword(String password) {
        if (password == null) {
            return false;
        }

        // 长度至少8位
        if (password.length() < 8) {
            return false;
        }

        // 包含至少三种字符类型
        int charTypeCount = 0;
        if (LOWERCASE_PATTERN.matcher(password).find()) {
            charTypeCount++;
        }
        if (UPPERCASE_PATTERN.matcher(password).find()) {
            charTypeCount++;
        }
        if (DIGIT_PATTERN.matcher(password).find()) {
            charTypeCount++;
        }
        if (SPECIAL_CHAR_PATTERN.matcher(password).find()) {
            charTypeCount++;
        }

        return charTypeCount >= 3;
    }

    /**
     * 获取密码强度检查的提示信息
     *
     * @return 提示信息
     */
    public String getPasswordTips() {
        return "密码长度至少8位，包含至少三种字符类型（小写字母、大写字母、数字、特殊字符）";
    }

    /**
     * 生成一个强密码
     *
     * @return 生成的强密码
     */
    public String generateStrongPassword() {
        String uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        String digitChars = "0123456789";
        String specialChars = "!@#$%^&*()_+-=[]{};':\"\\|,.<>/?";

        // 确保密码包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符
        StringBuilder password = new StringBuilder();
        password.append(uppercaseChars.charAt((int) (Math.random() * uppercaseChars.length())));
        password.append(lowercaseChars.charAt((int) (Math.random() * lowercaseChars.length())));
        password.append(digitChars.charAt((int) (Math.random() * digitChars.length())));
        password.append(specialChars.charAt((int) (Math.random() * specialChars.length())));

        // 填充剩余长度（总共12位）
        String allChars = uppercaseChars + lowercaseChars + digitChars + specialChars;
        for (int i = 4; i < 12; i++) {
            password.append(allChars.charAt((int) (Math.random() * allChars.length())));
        }

        // 打乱密码字符顺序
        return shuffleString(password.toString());
    }

    /**
     * 打乱字符串的字符顺序
     *
     * @param input 输入字符串
     * @return 打乱后的字符串
     */
    private String shuffleString(String input) {
        char[] chars = input.toCharArray();
        for (int i = chars.length - 1; i > 0; i--) {
            int j = (int) (Math.random() * (i + 1));
            // 交换字符
            char temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
        }
        return new String(chars);
    }
}
