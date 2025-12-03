package com.heikeji.common.core.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.time.temporal.Temporal;
import java.util.List;
import java.util.ArrayList;

/**
 * 日期工具类
 */
public class DateUtils {

    private static final Logger log = LoggerFactory.getLogger(DateUtils.class);



    public static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
    public static final String DEFAULT_TIME_FORMAT = "HH:mm:ss";
    public static final String DEFAULT_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String TIMESTAMP_FORMAT = "yyyyMMddHHmmss";
    public static final String DATE_FORMAT_YMD = "yyyyMMdd";
    public static final String TIME_FORMAT_HMS = "HHmmss";

    private static final List<DateTimeFormatter> FORMATTERS = new ArrayList<>();

    static {
        FORMATTERS.add(DateTimeFormatter.ofPattern(DEFAULT_DATETIME_FORMAT));
        FORMATTERS.add(DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT));
        FORMATTERS.add(DateTimeFormatter.ofPattern(DEFAULT_TIME_FORMAT));
        FORMATTERS.add(DateTimeFormatter.ofPattern(TIMESTAMP_FORMAT));
        FORMATTERS.add(DateTimeFormatter.ofPattern(DATE_FORMAT_YMD));
        FORMATTERS.add(DateTimeFormatter.ofPattern(TIME_FORMAT_HMS));
    }

    /**
     * 私有构造函数
     */
    private DateUtils() {
        throw new UnsupportedOperationException("工具类不能实例化");
    }

    /**
     * 获取当前日期时间
     * @return 当前日期时间
     */
    public static LocalDateTime now() {
        return LocalDateTime.now();
    }

    /**
     * 获取当前日期
     * @return 当前日期
     */
    public static LocalDate today() {
        return LocalDate.now();
    }

    /**
     * 获取当前时间
     * @return 当前时间
     */
    public static LocalTime nowTime() {
        return LocalTime.now();
    }

    /**
     * 格式化日期时间
     * @param temporal 时间对象
     * @param pattern 格式模式
     * @return 格式化后的字符串
     */
    public static String format(Temporal temporal, String pattern) {
        if (temporal == null || !StringUtils.hasText(pattern)) {
            return null;
        }
        
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
            // Temporal接口没有format方法，需要根据具体类型调用相应的format方法
            if (temporal instanceof LocalDateTime) {
                return ((LocalDateTime) temporal).format(formatter);
            } else if (temporal instanceof LocalDate) {
                return ((LocalDate) temporal).format(formatter);
            } else if (temporal instanceof LocalTime) {
                return ((LocalTime) temporal).format(formatter);
            } else {
                // 对于其他Temporal类型，尝试使用ISO格式器
                return temporal.toString();
            }
        } catch (Exception e) {
            log.warn("格式化日期失败: {}, 格式: {}", temporal, pattern, e);
            return null;
        }
    }

    /**
     * 格式化日期时间（使用默认格式）
     * @param temporal 时间对象
     * @return 格式化后的字符串
     */
    public static String format(Temporal temporal) {
        if (temporal instanceof LocalDateTime) {
            return format(temporal, DEFAULT_DATETIME_FORMAT);
        } else if (temporal instanceof LocalDate) {
            return format(temporal, DEFAULT_DATE_FORMAT);
        } else if (temporal instanceof LocalTime) {
            return format(temporal, DEFAULT_TIME_FORMAT);
        }
        return null;
    }

    /**
     * 解析日期字符串
     * @param dateStr 日期字符串
     * @param pattern 格式模式
     * @return 日期对象
     */
    public static LocalDateTime parseDateTime(String dateStr, String pattern) {
        if (!StringUtils.hasText(dateStr) || !StringUtils.hasText(pattern)) {
            return null;
        }
        
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
            return LocalDateTime.parse(dateStr, formatter);
        } catch (DateTimeParseException e) {
            log.warn("解析日期时间失败: {}, 格式: {}", dateStr, pattern, e);
            return null;
        }
    }

    /**
     * 解析日期字符串（仅日期部分）
     * @param dateStr 日期字符串
     * @param pattern 格式模式
     * @return 日期对象
     */
    public static LocalDate parseDate(String dateStr, String pattern) {
        if (!StringUtils.hasText(dateStr) || !StringUtils.hasText(pattern)) {
            return null;
        }
        
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
            return LocalDate.parse(dateStr, formatter);
        } catch (DateTimeParseException e) {
            log.warn("解析日期失败: {}, 格式: {}", dateStr, pattern, e);
            return null;
        }
    }

    /**
     * 解析时间字符串
     * @param timeStr 时间字符串
     * @param pattern 格式模式
     * @return 时间对象
     */
    public static LocalTime parseTime(String timeStr, String pattern) {
        if (!StringUtils.hasText(timeStr) || !StringUtils.hasText(pattern)) {
            return null;
        }
        
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
            return LocalTime.parse(timeStr, formatter);
        } catch (DateTimeParseException e) {
            log.warn("解析时间失败: {}, 格式: {}", timeStr, pattern, e);
            return null;
        }
    }

    /**
     * 自动解析日期字符串（尝试多种格式）
     * @param dateStr 日期字符串
     * @return 日期时间对象
     */
    public static LocalDateTime parseDateTimeAuto(String dateStr) {
        if (!StringUtils.hasText(dateStr)) {
            return null;
        }
        
        // 尝试各种格式
        for (DateTimeFormatter formatter : FORMATTERS) {
            try {
                return LocalDateTime.parse(dateStr, formatter);
            } catch (DateTimeParseException ignored) {
            }
        }
        
        log.warn("无法解析日期时间字符串: {}", dateStr);
        return null;
    }

    /**
     * 计算两个日期之间的天数
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 天数差
     */
    public static long daysBetween(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return 0;
        }
        return ChronoUnit.DAYS.between(startDate, endDate);
    }

    /**
     * 计算两个日期时间之间的小时数
     * @param startDateTime 开始日期时间
     * @param endDateTime 结束日期时间
     * @return 小时数差
     */
    public static long hoursBetween(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (startDateTime == null || endDateTime == null) {
            return 0;
        }
        return ChronoUnit.HOURS.between(startDateTime, endDateTime);
    }

    /**
     * 计算两个日期时间之间的分钟数
     * @param startDateTime 开始日期时间
     * @param endDateTime 结束日期时间
     * @return 分钟数差
     */
    public static long minutesBetween(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (startDateTime == null || endDateTime == null) {
            return 0;
        }
        return ChronoUnit.MINUTES.between(startDateTime, endDateTime);
    }

    /**
     * 获取日期的开始时间（00:00:00）
     * @param date 日期
     * @return 日期开始时间
     */
    public static LocalDateTime startOfDay(LocalDate date) {
        if (date == null) {
            return null;
        }
        return LocalDateTime.of(date, LocalTime.MIN);
    }

    /**
     * 获取日期的结束时间（23:59:59）
     * @param date 日期
     * @return 日期结束时间
     */
    public static LocalDateTime endOfDay(LocalDate date) {
        if (date == null) {
            return null;
        }
        return LocalDateTime.of(date, LocalTime.MAX);
    }

    /**
     * 添加天数
     * @param date 原日期
     * @param days 天数
     * @return 新日期
     */
    public static LocalDate plusDays(LocalDate date, long days) {
        if (date == null) {
            return null;
        }
        return date.plusDays(days);
    }

    /**
     * 添加小时
     * @param dateTime 原日期时间
     * @param hours 小时数
     * @return 新日期时间
     */
    public static LocalDateTime plusHours(LocalDateTime dateTime, long hours) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.plusHours(hours);
    }

    /**
     * 添加分钟
     * @param dateTime 原日期时间
     * @param minutes 分钟数
     * @return 新日期时间
     */
    public static LocalDateTime plusMinutes(LocalDateTime dateTime, long minutes) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.plusMinutes(minutes);
    }

    /**
     * 生成时间戳字符串
     * @return 时间戳字符串
     */
    public static String generateTimestamp() {
        return format(now(), TIMESTAMP_FORMAT);
    }

    /**
     * 生成日期字符串（yyyyMMdd）
     * @return 日期字符串
     */
    public static String generateDateStr() {
        return format(today(), DATE_FORMAT_YMD);
    }

    /**
     * 生成时间字符串（HHmmss）
     * @return 时间字符串
     */
    public static String generateTimeStr() {
        return format(nowTime(), TIME_FORMAT_HMS);
    }

    /**
     * 检查是否为今天
     * @param date 要检查的日期
     * @return 是否为今天
     */
    public static boolean isToday(LocalDate date) {
        if (date == null) {
            return false;
        }
        return date.equals(today());
    }

    /**
     * 检查是否为工作日（周一到周五）
     * @param date 要检查的日期
     * @return 是否为工作日
     */
    public static boolean isWeekday(LocalDate date) {
        if (date == null) {
            return false;
        }
        int dayOfWeek = date.getDayOfWeek().getValue();
        return dayOfWeek >= 1 && dayOfWeek <= 5;
    }

    /**
     * 检查是否为周末
     * @param date 要检查的日期
     * @return 是否为周末
     */
    public static boolean isWeekend(LocalDate date) {
        return !isWeekday(date);
    }
}