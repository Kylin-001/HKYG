package com.heikeji.common.core.cache;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.BitSet;
import java.util.concurrent.TimeUnit;

/**
 * 布隆过滤器实现
 * 用于防止缓存穿透，判断一个元素是否可能存在于集合中
 *
 * @author generator
 * @date 2024-01-01
 */
@Component
public class BloomFilter {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 默认位数组大小
     */
    private static final int DEFAULT_SIZE = 1000000;

    /**
     * 默认哈希函数个数
     */
    private static final int DEFAULT_HASH_NUMBERS = 3;

    /**
     * 添加元素到布隆过滤器
     *
     * @param filterKey 过滤器的键
     * @param value     要添加的值
     */
    public void add(String filterKey, String value) {
        add(filterKey, value, DEFAULT_SIZE, DEFAULT_HASH_NUMBERS);
    }

    /**
     * 添加元素到布隆过滤器
     *
     * @param filterKey    过滤器的键
     * @param value        要添加的值
     * @param expectedSize 预期元素数量
     * @param hashNumbers  哈希函数个数
     */
    public void add(String filterKey, String value, int expectedSize, int hashNumbers) {
        for (int i = 0; i < hashNumbers; i++) {
            int index = getIndex(value, i, expectedSize);
            redisTemplate.opsForValue().setBit(filterKey, index, true);
        }
        // 设置过期时间，默认30天
        redisTemplate.expire(filterKey, 30, TimeUnit.DAYS);
    }

    /**
     * 批量添加元素到布隆过滤器
     *
     * @param filterKey 过滤器的键
     * @param values    要添加的值数组
     */
    public void addBatch(String filterKey, String[] values) {
        for (String value : values) {
            add(filterKey, value);
        }
    }

    /**
     * 判断元素是否可能存在于布隆过滤器中
     *
     * @param filterKey 过滤器的键
     * @param value     要检查的值
     * @return 如果返回false，则元素一定不存在；如果返回true，则元素可能存在
     */
    public boolean mightContain(String filterKey, String value) {
        return mightContain(filterKey, value, DEFAULT_SIZE, DEFAULT_HASH_NUMBERS);
    }

    /**
     * 判断元素是否可能存在于布隆过滤器中
     *
     * @param filterKey    过滤器的键
     * @param value        要检查的值
     * @param expectedSize 预期元素数量
     * @param hashNumbers  哈希函数个数
     * @return 如果返回false，则元素一定不存在；如果返回true，则元素可能存在
     */
    public boolean mightContain(String filterKey, String value, int expectedSize, int hashNumbers) {
        for (int i = 0; i < hashNumbers; i++) {
            int index = getIndex(value, i, expectedSize);
            Boolean exists = redisTemplate.opsForValue().getBit(filterKey, index);
            if (exists == null || !exists) {
                // 只要有一个位为false，则元素一定不存在
                return false;
            }
        }
        // 所有位都为true，元素可能存在
        return true;
    }

    /**
     * 计算值在位数组中的索引位置
     *
     * @param value     要计算的值
     * @param seed      哈希种子
     * @param size      位数组大小
     * @return 索引位置
     */
    private static int getIndex(String value, int seed, int size) {
        try {
            MessageDigest digest = MessageDigest.getInstance("MD5");
            String valueWithSeed = value + seed;
            byte[] bytes = digest.digest(valueWithSeed.getBytes(StandardCharsets.UTF_8));
            int index = 0;
            for (int i = 0; i < 4; i++) {
                index += ((int) bytes[i] & 0xFF) << (i * 8);
            }
            return Math.abs(index % size);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not found", e);
        }
    }

    /**
     * 清除布隆过滤器
     *
     * @param filterKey 过滤器的键
     */
    public void clear(String filterKey) {
        redisTemplate.delete(filterKey);
    }

    /**
     * 获取布隆过滤器的信息
     *
     * @param filterKey 过滤器的键
     * @return 布隆过滤器是否存在
     */
    public boolean exists(String filterKey) {
        return redisTemplate.hasKey(filterKey);
    }

    /**
     * 创建一个本地布隆过滤器（用于临时使用）
     *
     * @param expectedSize 预期元素数量
     * @param errorRate    误判率
     * @return 本地布隆过滤器实例
     */
    public LocalBloomFilter createLocalFilter(int expectedSize, double errorRate) {
        return new LocalBloomFilter(expectedSize, errorRate);
    }

    /**
     * 本地布隆过滤器实现
     * 用于不需要分布式的场景
     */
    public static class LocalBloomFilter {
        private BitSet bits;
        private int size;
        private int hashNumbers;

        public LocalBloomFilter(int expectedSize, double errorRate) {
            // 计算最佳位数组大小
            this.size = (int) Math.ceil(-expectedSize * Math.log(errorRate) / (Math.log(2) * Math.log(2)));
            // 计算最佳哈希函数个数
            this.hashNumbers = (int) Math.ceil((size / expectedSize) * Math.log(2));
            this.bits = new BitSet(size);
        }

        public void add(String value) {
            for (int i = 0; i < hashNumbers; i++) {
                int index = getIndex(value, i, size);
                bits.set(index);
            }
        }

        public boolean mightContain(String value) {
            for (int i = 0; i < hashNumbers; i++) {
                int index = getIndex(value, i, size);
                if (!bits.get(index)) {
                    return false;
                }
            }
            return true;
        }

        public void clear() {
            bits.clear();
        }
    }
}