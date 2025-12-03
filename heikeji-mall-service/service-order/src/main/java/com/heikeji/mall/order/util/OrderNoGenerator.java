package com.heikeji.mall.order.util;

import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 统一订单号生成器
 * 生成格式：yyyyMMddHHmmss + 4位随机数 + 3位序列号
 */
@Component
public class OrderNoGenerator {

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMddHHmmss");
    private static final Random RANDOM = new Random();
    private static final AtomicInteger SEQUENCE = new AtomicInteger(0);
    private static String lastTimeStr = "";
    private static final Object LOCK = new Object();

    /**
     * 生成订单号
     * @return 唯一订单号
     */
    public String generateOrderNo() {
        synchronized (LOCK) {
            String currentTimeStr = DATE_FORMAT.format(new Date());
            int randomNum = RANDOM.nextInt(10000);
            String randomStr = String.format("%04d", randomNum);
            
            // 如果是同一时间，序列号自增，否则重置为0
            if (!currentTimeStr.equals(lastTimeStr)) {
                SEQUENCE.set(0);
                lastTimeStr = currentTimeStr;
            }
            
            // 序列号确保不超过999
            int sequenceValue = SEQUENCE.getAndIncrement() % 1000;
            String sequenceStr = String.format("%03d", sequenceValue);
            
            return currentTimeStr + randomStr + sequenceStr;
        }
    }
    
    /**
     * 生成带前缀的订单号
     * @param prefix 订单前缀（如：P-普通订单，D-配送订单，T-外卖订单）
     * @return 带前缀的订单号
     */
    public String generateOrderNoWithPrefix(String prefix) {
        return prefix + "-" + generateOrderNo();
    }
}