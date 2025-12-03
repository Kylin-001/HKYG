package com.heikeji.system.utils;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

/**
 * ID生成工具类
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public class IdUtils {

    private static final AtomicLong ATOMIC_LONG = new AtomicLong(0);
    private static final Random RANDOM = new Random();

    /**
     * 生成递增ID
     */
    public static long getId() {
        return ATOMIC_LONG.incrementAndGet();
    }

    /**
     * 生成随机数字
     *
     * @param len 长度
     */
    public static String getRandom(int len) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < len; i++) {
            sb.append(RANDOM.nextInt(10));
        }
        return sb.toString();
    }

    /**
     * 生成随机字符串
     *
     * @param len 长度
     */
    public static String getRandomString(int len) {
        String base = "abcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < len; i++) {
            int number = RANDOM.nextInt(base.length());
            sb.append(base.charAt(number));
        }
        return sb.toString();
    }

    /**
     * 生成订单号
     */
    public static String generateOrderNo() {
        StringBuilder sb = new StringBuilder();
        sb.append(DateUtils.formatNow("yyyyMMddHHmmssSSS"));
        sb.append(getRandom(4));
        return sb.toString();
    }

    /**
     * 生成商品编号
     */
    public static String generateProductNo() {
        StringBuilder sb = new StringBuilder("P");
        sb.append(DateUtils.formatNow("yyyyMMdd"));
        sb.append(getRandom(6));
        return sb.toString();
    }

    /**
     * 生成会员编号
     */
    public static String generateMemberNo() {
        StringBuilder sb = new StringBuilder("M");
        sb.append(DateUtils.formatNow("yyyyMMdd"));
        sb.append(getRandom(6));
        return sb.toString();
    }
}
