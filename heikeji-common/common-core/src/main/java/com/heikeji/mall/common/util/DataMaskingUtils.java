package com.heikeji.mall.common.util;

/**
 * 数据脱敏工具类
 *
 * 提供各种敏感数据的脱敏处理方法，
 * 用于在日志、响应、审计记录中保护用户隐私。
 *
 * 支持的脱敏类型：
 * - 手机号: 138****5678
 * - 邮箱: ab***@example.com
 * - 身份证号: 110101********1234
 * - 银行卡号: 6222 **** **** 1234
 * - 姓名: 张*
 * - 地址: 北京市******区
 */
public class DataMaskingUtils {

    private DataMaskingUtils() {}

    /**
     * 根据数据类型自动选择脱敏策略
     *
     * @param data 原始数据
     * @return 脱敏后的数据
     */
    public static String autoMask(String data) {
        if (data == null || data.isEmpty()) {
            return data;
        }

        if (isPhoneNumber(data)) {
            return maskPhone(data);
        } else if (isEmail(data)) {
            return maskEmail(data);
        } else if (isIdCard(data)) {
            return maskIdCard(data);
        } else if (isBankCard(data)) {
            return maskBankCard(data);
        } else if (isChineseName(data)) {
            return maskChineseName(data);
        }

        return data;
    }

    /**
     * 手机号脱敏: 138****5678
     */
    public static String maskPhone(String phone) {
        if (phone == null || phone.length() < 7) {
            return "****";
        }
        return phone.substring(0, 3) + "****" + phone.substring(phone.length() - 4);
    }

    /**
     * 邮箱脱敏: ab***@example.com
     */
    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***@***";
        }
        int atIndex = email.indexOf('@');
        String prefix = email.substring(0, Math.min(atIndex, 3));
        String suffix = email.substring(atIndex);
        int maskLength = Math.max(atIndex - prefix.length(), 3);
        return prefix + "*".repeat(Math.min(maskLength, 5)) + suffix;
    }

    /**
     * 身份证号脱敏: 110101********1234
     */
    public static String maskIdCard(String idCard) {
        if (idCard == null) return "***********";

        if (idCard.length() == 18) {
            return idCard.substring(0, 6) + "********" + idCard.substring(14);
        } else if (idCard.length() == 15) {
            return idCard.substring(0, 6) + "*****" + idCard.substring(11);
        }
        return "***********";
    }

    /**
     * 银行卡号脱敏: 6222 **** **** 1234
     */
    public static String maskBankCard(String cardNo) {
        if (cardNo == null || cardNo.length() < 8) {
            return "****";
        }
        cardNo = cardNo.replaceAll("\\s+", "");
        String first4 = cardNo.substring(0, 4);
        String last4 = cardNo.substring(cardNo.length() - 4);
        int middleLength = cardNo.length() - 8;
        return first4 + " " + "*".repeat(middleLength).replaceAll(".{4}", "$0 ") + last4;
    }

    /**
     * 中文姓名脱敏: 张*
     */
    public static String maskChineseName(String name) {
        if (name == null || name.isEmpty()) {
            return "*";
        }
        if (name.length() <= 1) {
            return "*";
        }
        return name.charAt(0) + "*".repeat(name.length() - 1);
    }

    /**
     * 地址部分脱敏: 北京市******区
     */
    public static String maskAddress(String address) {
        if (address == null || address.length() < 6) {
            return address;
        }
        int midStart = address.length() / 3;
        int midEnd = address.length() * 2 / 3;
        return address.substring(0, midStart) + "******" + address.substring(midEnd);
    }

    /**
     * 密码完全隐藏
     */
    public static String maskPassword() {
        return "******";
    }

    private static boolean isPhoneNumber(String str) {
        return str.matches("^1[3-9]\\d{9}$");
    }

    private static boolean isEmail(String str) {
        return str.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    }

    private static boolean isIdCard(String str) {
        return str.matches("^\\d{17}[\\dXx]$") || str.matches("^\\d{15}$");
    }

    private static boolean isBankCard(String str) {
        String cleaned = str.replaceAll("\\s+", "");
        return cleaned.matches("^\\d{13,19}$");
    }

    private static boolean isChineseName(String str) {
        return str.matches("^[\\u4e00-\\u9fa5]{2,4}$");
    }
}
