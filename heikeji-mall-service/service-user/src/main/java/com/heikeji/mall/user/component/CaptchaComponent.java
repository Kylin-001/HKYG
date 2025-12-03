package com.heikeji.mall.user.component;

import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.LineCaptcha;
import cn.hutool.core.lang.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.time.Duration;

/**
 * 验证码组件
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Slf4j
@Component
public class CaptchaComponent {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    /**
     * 生成验证码
     */
    public CaptchaResult generateCaptcha() {
        // 生成验证码图片
        LineCaptcha captcha = CaptchaUtil.createLineCaptcha(150, 48, 4, 50);
        captcha.setFont(new Font("Arial", Font.BOLD, 28));

        // 生成唯一ID
        String captchaId = UUID.randomUUID().toString().replaceAll("-", "");
        // 保存验证码到Redis，有效期5分钟
        redisTemplate.opsForValue().set("captcha:" + captchaId, captcha.getCode(), Duration.ofMinutes(5));

        CaptchaResult result = new CaptchaResult();
        result.setCaptchaId(captchaId);
        result.setBase64(captcha.getImageBase64());
        
        log.info("生成验证码，ID: {}, 验证码: {}", captchaId, captcha.getCode());
        return result;
    }

    /**
     * 验证验证码
     */
    public boolean validateCaptcha(String captchaId, String code) {
        if (captchaId == null || code == null) {
            return false;
        }

        String key = "captcha:" + captchaId;
        String storedCode = redisTemplate.opsForValue().get(key);
        if (storedCode == null) {
            log.info("验证码已过期或不存在，ID: {}", captchaId);
            return false;
        }

        boolean match = storedCode.equalsIgnoreCase(code);
        if (match) {
            // 验证成功后删除验证码
            redisTemplate.delete(key);
        }

        log.info("验证验证码，ID: {}, 输入: {}, 存储: {}, 结果: {}", captchaId, code, storedCode, match);
        return match;
    }

    /**
     * 验证码结果
     */
    public static class CaptchaResult {
        /**
         * 验证码ID
         */
        private String captchaId;

        /**
         * 验证码图片Base64
         */
        private String base64;

        public String getCaptchaId() {
            return captchaId;
        }

        public void setCaptchaId(String captchaId) {
            this.captchaId = captchaId;
        }

        public String getBase64() {
            return base64;
        }

        public void setBase64(String base64) {
            this.base64 = base64;
        }
    }
}
