package com.heikeji.mall.payment.util;

import cn.hutool.crypto.SecureUtil;
import cn.hutool.crypto.digest.DigestAlgorithm;
import cn.hutool.crypto.digest.Digester;
import com.heikeji.mall.payment.constants.PaymentConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

/**
 * 支付安全工具类
 */
@Component
public class PaymentSecurityUtil {
    private static final Logger log = LoggerFactory.getLogger(PaymentSecurityUtil.class);
    
    @Value("${payment.security.key}")
    private String securityKey;
    
    @Value("${payment.security.sign-type:MD5}")
    private String signType;
    
    private Digester digester;
    
    @PostConstruct
    public void init() {
        if ("SHA256".equalsIgnoreCase(signType)) {
            digester = new Digester(DigestAlgorithm.SHA256);
        } else {
            digester = new Digester(DigestAlgorithm.MD5);
        }
    }
    
    /**
     * 生成支付签名
     * @param params 参数Map
     * @return 签名结果
     */
    public String generateSign(Map<String, String> params) {
        return generateSign(params, securityKey);
    }
    
    /**
     * 生成支付签名（带自定义密钥）
     * @param params 参数Map
     * @param key 密钥
     * @return 签名结果
     */
    public String generateSign(Map<String, String> params, String key) {
        return generateSign(params, key, signType);
    }
    
    /**
     * 生成支付签名（带自定义密钥和签名类型）
     * @param params 参数Map
     * @param key 密钥
     * @param signType 签名类型（MD5/SHA256等）
     * @return 签名结果
     */
    public String generateSign(Map<String, String> params, String key, String signType) {
        // 排序参数
        SortedMap<String, String> sortedParams = new TreeMap<>(params);
        
        // 构建签名字符串
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            String k = entry.getKey();
            String v = entry.getValue();
            // 跳过sign字段，不参与签名
            if ("sign".equals(k) || v == null || v.isEmpty()) {
                continue;
            }
            sb.append(k).append("=").append(v).append("&");
        }
        
        // 添加密钥
        sb.append("key=").append(key);
        
        String signContent = sb.toString();
        log.debug("生成签名内容: {}", signContent);
        
        // 生成签名
        String sign;
        if ("SHA256".equalsIgnoreCase(signType)) {
            sign = SecureUtil.sha256(signContent).toUpperCase();
        } else {
            // 默认使用MD5
            sign = SecureUtil.md5(signContent).toUpperCase();
        }
        
        log.debug("生成签名结果: {}", sign);
        return sign;
    }
    
    /**
     * 验证签名
     * @param params 参数Map
     * @return 是否验证通过
     */
    public boolean verifySign(Map<String, String> params) {
        return verifySign(params, securityKey);
    }
    
    /**
     * 验证签名（带自定义密钥）
     * @param params 参数Map
     * @param key 密钥
     * @return 是否验证通过
     */
    public boolean verifySign(Map<String, String> params, String key) {
        if (!params.containsKey("sign")) {
            log.error("签名验证失败：参数中不包含sign字段");
            return false;
        }
        
        String sign = params.get("sign");
        if (sign == null || sign.isEmpty()) {
            log.error("签名验证失败：sign值为空");
            return false;
        }
        
        // 复制参数，移除sign字段
        Map<String, String> tempParams = new TreeMap<>(params);
        tempParams.remove("sign");
        
        // 生成待验证签名
        String verifySign = generateSign(tempParams, key);
        
        // 验证签名（忽略大小写）
        boolean result = sign.equalsIgnoreCase(verifySign);
        if (!result) {
            log.error("签名验证失败：期望签名[{}]，实际签名[{}]", verifySign, sign);
        }
        
        return result;
    }
    
    /**
     * 生成微信支付V3签名
     * @param method HTTP请求方法
     * @param url 请求URL
     * @param timestamp 时间戳
     * @param nonce 随机字符串
     * @param body 请求体
     * @param privateKey 私钥
     * @return 签名结果
     */
    public String generateWechatV3Sign(String method, String url, long timestamp, String nonce, String body, String privateKey) {
        try {
            // 构建签名字符串
            StringBuilder sb = new StringBuilder();
            sb.append(method).append("\n");
            sb.append(url).append("\n");
            sb.append(timestamp).append("\n");
            sb.append(nonce).append("\n");
            sb.append(body).append("\n");
            
            String signContent = sb.toString();
            log.debug("生成微信V3签名内容: {}", signContent);
            
            // 使用私钥生成签名
            // 移除私钥字符串中的换行和空格
            String privateKeyContent = privateKey.replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "")
                    .replaceAll("\\s+", "");
            
            // 解码Base64私钥
            byte[] decodedKey = Base64.getDecoder().decode(privateKeyContent);
            
            // 创建PKCS8KeySpec
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decodedKey);
            
            // 获取KeyFactory
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            
            // 生成私钥对象
            PrivateKey rsaPrivateKey = keyFactory.generatePrivate(keySpec);
            
            // 创建Signature对象
            Signature signature = Signature.getInstance("SHA256withRSA");
            
            // 初始化签名
            signature.initSign(rsaPrivateKey);
            
            // 更新签名内容
            signature.update(signContent.getBytes(StandardCharsets.UTF_8));
            
            // 生成签名
            byte[] signBytes = signature.sign();
            
            // Base64编码签名结果
            String sign = Base64.getEncoder().encodeToString(signBytes);
            log.debug("生成微信V3签名结果: {}", sign);
            
            return sign;
        } catch (Exception e) {
            log.error("生成微信V3签名失败", e);
            throw new RuntimeException("生成微信V3签名失败", e);
        }
    }
    
    /**
     * 加密支付数据
     * @param data 原始数据
     * @return 加密后的数据
     */
    public String encryptData(String data) {
        try {
            // 使用HMAC-SHA256进行数据加密
            String encrypted = SecureUtil.hmacSha256(securityKey).digestHex(data);
            return encrypted;
        } catch (Exception e) {
            log.error("数据加密失败", e);
            throw new RuntimeException("数据加密失败", e);
        }
    }
    
    /**
     * 生成交易流水号的安全哈希
     * @param paymentNo 支付流水号
     * @param timestamp 时间戳
     * @return 哈希值
     */
    public String generatePaymentHash(String paymentNo, long timestamp) {
        String content = paymentNo + "|" + timestamp + "|" + securityKey;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(content.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            log.error("生成支付哈希失败", e);
            throw new RuntimeException("生成支付哈希失败", e);
        }
    }
    
    /**
     * 验证支付请求的时效性
     * @param timestamp 时间戳
     * @param maxTimeDifference 最大时间差（毫秒）
     * @return 是否在有效时间内
     */
    public boolean verifyTimestamp(long timestamp, long maxTimeDifference) {
        long now = System.currentTimeMillis();
        long diff = Math.abs(now - timestamp);
        boolean result = diff <= maxTimeDifference;
        
        if (!result) {
            log.warn("时间戳验证失败：当前时间[{}]，请求时间[{}]，差值[{}]ms", 
                     now, timestamp, diff);
        }
        
        return result;
    }
    
    /**
     * 敏感信息脱敏
     * @param text 原始文本
     * @param start 开始位置
     * @param end 结束位置
     * @return 脱敏后的文本
     */
    public String maskSensitiveInfo(String text, int start, int end) {
        if (text == null || text.length() <= start || end <= start) {
            return text;
        }
        
        StringBuilder sb = new StringBuilder(text);
        for (int i = start; i < end && i < sb.length(); i++) {
            sb.setCharAt(i, '*');
        }
        
        return sb.toString();
    }
    
    /**
     * 手机号脱敏
     * @param phone 手机号
     * @return 脱敏后的手机号
     */
    public String maskPhone(String phone) {
        if (phone == null || phone.length() < 11) {
            return phone;
        }
        return maskSensitiveInfo(phone, 3, 7);
    }
    
    /**
     * 银行卡号脱敏
     * @param cardNo 银行卡号
     * @return 脱敏后的银行卡号
     */
    public String maskCardNo(String cardNo) {
        if (cardNo == null || cardNo.length() < 8) {
            return cardNo;
        }
        int start = 4;
        int end = Math.max(start, cardNo.length() - 4);
        return maskSensitiveInfo(cardNo, start, end);
    }
    
    /**
     * 生成幂等性token
     * @param userId 用户ID
     * @param orderId 订单ID
     * @return 幂等性token
     */
    public String generateIdempotentToken(Long userId, Long orderId) {
        String content = userId + "|" + orderId + "|" + System.currentTimeMillis() + "|" + securityKey;
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(content.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            log.error("生成幂等性token失败", e);
            throw new RuntimeException("生成幂等性token失败", e);
        }
    }
    
    /**
     * 验证IP地址是否在允许列表中
     * @param ip IP地址
     * @param allowedIps 允许的IP列表
     * @return 是否允许
     */
    public boolean isIpAllowed(String ip, String[] allowedIps) {
        if (allowedIps == null || allowedIps.length == 0) {
            return true; // 允许列表为空时，允许所有IP
        }
        
        for (String allowedIp : allowedIps) {
            if (allowedIp.equals("*")) {
                return true;
            }
            if (allowedIp.equals(ip)) {
                return true;
            }
            // 支持CIDR格式，如 192.168.1.0/24
            if (allowedIp.contains("/") && isIpInCidr(ip, allowedIp)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 检查IP是否在CIDR范围内
     */
    private boolean isIpInCidr(String ip, String cidr) {
        try {
            String[] parts = cidr.split("/");
            String cidrIp = parts[0];
            int prefixLength = Integer.parseInt(parts[1]);
            
            long ipLong = ipToLong(ip);
            long cidrIpLong = ipToLong(cidrIp);
            long mask = (prefixLength == 0) ? 0 : 0xFFFFFFFFL << (32 - prefixLength);
            
            return (ipLong & mask) == (cidrIpLong & mask);
        } catch (Exception e) {
            log.error("CIDR验证失败: ip={}, cidr={}", ip, cidr, e);
            return false;
        }
    }
    
    /**
     * IP地址转长整型
     */
    private long ipToLong(String ip) {
        String[] parts = ip.split("\\.");
        long result = 0;
        for (int i = 0; i < 4; i++) {
            result |= Long.parseLong(parts[i]) << (3 - i) * 8;
        }
        return result & 0xFFFFFFFFL;
    }
}