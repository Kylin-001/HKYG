package com.heikeji.common.core.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.Collection;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.List;
import java.util.ArrayList;

/**
 * 字符串工具类
 */
@Slf4j
public class HeikejiStringUtils {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );
    
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^1[3-9]\\d{9}$"
    );
    
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,20}$"
    );
    
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile(
        "[<>'\"&]"
    );

    /**
     * 私有构造函数
     */
    private HeikejiStringUtils() {
        throw new UnsupportedOperationException("工具类不能实例化");
    }

    /**
     * 检查字符串是否为空或null
     * @param str 要检查的字符串
     * @return 是否为空
     */
    public static boolean isEmpty(String str) {
        return !StringUtils.hasText(str);
    }

    /**
     * 检查字符串是否不为空
     * @param str 要检查的字符串
     * @return 是否不为空
     */
    public static boolean isNotEmpty(String str) {
        return StringUtils.hasText(str);
    }

    /**
     * 检查字符串是否为空白
     * @param str 要检查的字符串
     * @return 是否为空白
     */
    public static boolean isBlank(String str) {
        return !StringUtils.hasText(str);
    }

    /**
     * 检查字符串是否不为空白
     * @param str 要检查的字符串
     * @return 是否不为空白
     */
    public static boolean isNotBlank(String str) {
        return StringUtils.hasText(str);
    }

    /**
     * 去除字符串两端的空格
     * @param str 原字符串
     * @return 去除空格后的字符串
     */
    public static String trim(String str) {
        return str != null ? str.trim() : null;
    }

    /**
     * 去除字符串两端的空格，如果为空则返回null
     * @param str 原字符串
     * @return 处理后的字符串
     */
    public static String trimToNull(String str) {
        String trimmed = trim(str);
        return isEmpty(trimmed) ? null : trimmed;
    }

    /**
     * 去除字符串两端的空格，如果为空则返回空字符串
     * @param str 原字符串
     * @return 处理后的字符串
     */
    public static String trimToEmpty(String str) {
        return str != null ? str.trim() : "";
    }

    /**
     * 截取字符串（如果超过最大长度）
     * @param str 原字符串
     * @param maxLength 最大长度
     * @return 截取后的字符串
     */
    public static String truncate(String str, int maxLength) {
        if (isBlank(str) || str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength);
    }

    /**
     * 截取字符串并添加省略号
     * @param str 原字符串
     * @param maxLength 最大长度（包含省略号）
     * @return 截取后的字符串
     */
    public static String truncateWithEllipsis(String str, int maxLength) {
        if (isBlank(str) || str.length() <= maxLength) {
            return str;
        }
        
        if (maxLength <= 1) {
            return "…";
        }
        
        return str.substring(0, maxLength - 1) + "…";
    }

    /**
     * 驼峰命名转下划线命名
     * @param camelCase 驼峰命名字符串
     * @return 下划线命名字符串
     */
    public static String camelToUnderline(String camelCase) {
        if (isBlank(camelCase)) {
            return camelCase;
        }
        
        StringBuilder result = new StringBuilder();
        char[] chars = camelCase.toCharArray();
        
        for (int i = 0; i < chars.length; i++) {
            char c = chars[i];
            if (Character.isUpperCase(c) && i > 0) {
                result.append('_');
            }
            result.append(Character.toLowerCase(c));
        }
        
        return result.toString();
    }

    /**
     * 下划线命名转驼峰命名
     * @param underline 下划线命名字符串
     * @return 驼峰命名字符串
     */
    public static String underlineToCamel(String underline) {
        if (isBlank(underline)) {
            return underline;
        }
        
        String[] parts = underline.toLowerCase().split("_");
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < parts.length; i++) {
            String part = parts[i];
            if (i == 0) {
                result.append(part);
            } else {
                result.append(Character.toUpperCase(part.charAt(0)));
                if (part.length() > 1) {
                    result.append(part.substring(1));
                }
            }
        }
        
        return result.toString();
    }

    /**
     * 首字母大写
     * @param str 原字符串
     * @return 首字母大写的字符串
     */
    public static String capitalize(String str) {
        if (isBlank(str)) {
            return str;
        }
        return Character.toUpperCase(str.charAt(0)) + 
               (str.length() > 1 ? str.substring(1) : "");
    }

    /**
     * 首字母小写
     * @param str 原字符串
     * @return 首字母小写的字符串
     */
    public static String uncapitalize(String str) {
        if (isBlank(str)) {
            return str;
        }
        return Character.toLowerCase(str.charAt(0)) + 
               (str.length() > 1 ? str.substring(1) : "");
    }

    /**
     * 隐藏字符串中间部分（用于隐藏敏感信息）
     * @param str 原字符串
     * @param start 保留开始字符数
     * @param end 保留结束字符数
     * @return 隐藏后的字符串
     */
    public static String mask(String str, int start, int end) {
        if (isBlank(str) || str.length() <= start + end) {
            return str;
        }
        
        StringBuilder masked = new StringBuilder();
        masked.append(str.substring(0, start));
        
        for (int i = 0; i < str.length() - start - end; i++) {
            masked.append('*');
        }
        
        masked.append(str.substring(str.length() - end));
        return masked.toString();
    }

    /**
     * 验证邮箱格式
     * @param email 邮箱字符串
     * @return 是否为有效邮箱
     */
    public static boolean isValidEmail(String email) {
        if (isBlank(email)) {
            return false;
        }
        Matcher matcher = EMAIL_PATTERN.matcher(email);
        return matcher.matches();
    }

    /**
     * 验证手机号格式
     * @param phone 手机号字符串
     * @return 是否为有效手机号
     */
    public static boolean isValidPhone(String phone) {
        if (isBlank(phone)) {
            return false;
        }
        Matcher matcher = PHONE_PATTERN.matcher(phone);
        return matcher.matches();
    }

    /**
     * 验证密码强度
     * @param password 密码字符串
     * @return 是否为强密码
     */
    public static boolean isStrongPassword(String password) {
        if (isBlank(password)) {
            return false;
        }
        Matcher matcher = PASSWORD_PATTERN.matcher(password);
        return matcher.matches();
    }

    /**
     * 移除特殊字符（用于防止XSS攻击）
     * @param str 原字符串
     * @return 移除特殊字符后的字符串
     */
    public static String removeSpecialChars(String str) {
        if (isBlank(str)) {
            return str;
        }
        return SPECIAL_CHAR_PATTERN.matcher(str).replaceAll("");
    }

    /**
     * 转义HTML字符
     * @param str 原字符串
     * @return 转义后的字符串
     */
    public static String escapeHtml(String str) {
        if (isBlank(str)) {
            return str;
        }
        
        return str.replace("&", "&amp;")
                  .replace("<", "&lt;")
                  .replace(">", "&gt;")
                  .replace("\"", "&quot;")
                  .replace("'", "&#x27;");
    }

    /**
     * 从字符串中提取数字
     * @param str 原字符串
     * @return 提取的数字字符串
     */
    public static String extractNumbers(String str) {
        if (isBlank(str)) {
            return "";
        }
        return str.replaceAll("[^\\d]", "");
    }

    /**
     * 分割字符串为数组
     * @param str 原字符串
     * @param separator 分隔符
     * @return 分割后的数组
     */
    public static String[] split(String str, String separator) {
        if (isBlank(str) || isBlank(separator)) {
            return new String[]{str};
        }
        return str.split(Pattern.quote(separator));
    }

    /**
     * 连接字符串数组
     * @param array 字符串数组
     * @param separator 分隔符
     * @return 连接后的字符串
     */
    public static String join(String[] array, String separator) {
        if (array == null || array.length == 0) {
            return "";
        }
        return join(Arrays.asList(array), separator);
    }

    /**
     * 连接字符串集合
     * @param collection 字符串集合
     * @param separator 分隔符
     * @return 连接后的字符串
     */
    public static String join(Collection<String> collection, String separator) {
        if (collection == null || collection.isEmpty()) {
            return "";
        }
        return String.join(separator, collection);
    }

    /**
     * 重复字符串
     * @param str 原字符串
     * @param count 重复次数
     * @return 重复后的字符串
     */
    public static String repeat(String str, int count) {
        if (str == null) {
            return null;
        }
        if (count <= 0) {
            return "";
        }
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < count; i++) {
            result.append(str);
        }
        return result.toString();
    }

    /**
     * 获取字符串长度（中文按2个字符计算）
     * @param str 原字符串
     * @return 字符串长度
     */
    public static int getLengthWithChinese(String str) {
        if (isBlank(str)) {
            return 0;
        }
        int length = 0;
        for (char c : str.toCharArray()) {
            if (c >= 0x4e00 && c <= 0x9fa5) {
                length += 2; // 中文字符
            } else {
                length += 1; // 英文字符
            }
        }
        return length;
    }

    /**
     * 判断字符串是否包含中文字符
     * @param str 原字符串
     * @return 是否包含中文字符
     */
    public static boolean containsChinese(String str) {
        if (isBlank(str)) {
            return false;
        }
        for (char c : str.toCharArray()) {
            if (c >= 0x4e00 && c <= 0x9fa5) {
                return true;
            }
        }
        return false;
    }

    /**
     * 生成随机字符串
     * @param length 长度
     * @return 随机字符串
     */
    public static String generateRandomString(int length) {
        if (length <= 0) {
            return "";
        }
        
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * chars.length());
            result.append(chars.charAt(index));
        }
        
        return result.toString();
    }

    /**
     * 生成随机数字字符串
     * @param length 长度
     * @return 随机数字字符串
     */
    public static String generateRandomNumber(int length) {
        if (length <= 0) {
            return "";
        }
        
        String chars = "0123456789";
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * chars.length());
            result.append(chars.charAt(index));
        }
        
        return result.toString();
    }

    /**
     * 获取字符串后缀
     * @param fileName 文件名
     * @return 文件后缀
     */
    public static String getFileExtension(String fileName) {
        if (isBlank(fileName) || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    /**
     * 检查是否为图片文件
     * @param fileName 文件名
     * @return 是否为图片文件
     */
    public static boolean isImageFile(String fileName) {
        if (isBlank(fileName)) {
            return false;
        }
        String extension = getFileExtension(fileName);
        return List.of("jpg", "jpeg", "png", "gif", "bmp", "svg", "webp").contains(extension);
    }

    /**
     * 检查是否为文档文件
     * @param fileName 文件名
     * @return 是否为文档文件
     */
    public static boolean isDocumentFile(String fileName) {
        if (isBlank(fileName)) {
            return false;
        }
        String extension = getFileExtension(fileName);
        return List.of("pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt").contains(extension);
    }

    /**
     * 转换字符串数组为List
     * @param array 字符串数组
     * @return 字符串列表
     */
    public static List<String> toList(String... array) {
        if (array == null) {
            return new ArrayList<>();
        }
        return Arrays.asList(array);
    }
}