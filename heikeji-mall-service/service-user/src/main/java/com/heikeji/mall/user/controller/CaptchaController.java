package com.heikeji.mall.user.controller;

import com.heikeji.mall.common.auth.PublicApi;
import com.heikeji.mall.common.response.R;
import com.heikeji.mall.user.component.CaptchaComponent;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 验证码控制器
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Slf4j
@RestController
@RequestMapping("/api/user")
@Tag(name = "验证码接口")
public class CaptchaController {

    @Autowired
    private CaptchaComponent captchaComponent;

    /**
     * 获取图形验证码
     */
    @GetMapping("/captcha")
    @PublicApi
    @Operation(summary = "获取图形验证码")
    public R<Map<String, String>> getCaptcha() {
        try {
            // 生成验证码
            CaptchaComponent.CaptchaResult captchaResult = captchaComponent.generateCaptcha();

            // 构建返回结果
            Map<String, String> result = new HashMap<>();
            result.put("captchaId", captchaResult.getCaptchaId());
            // 返回 base64 图片数据，前端可以直接使用
            result.put("image", "data:image/png;base64," + captchaResult.getBase64());

            log.info("获取图形验证码成功，captchaId: {}", captchaResult.getCaptchaId());
            return R.success("获取验证码成功", result);
        } catch (Exception e) {
            log.error("获取图形验证码失败", e);
            return R.error("获取验证码失败");
        }
    }

    /**
     * 验证图形验证码（供内部使用或测试）
     */
    @PostMapping("/captcha/verify")
    @PublicApi
    @Operation(summary = "验证图形验证码")
    public R<Boolean> verifyCaptcha(@RequestParam String captchaId, @RequestParam String code) {
        try {
            boolean valid = captchaComponent.validateCaptcha(captchaId, code);
            if (valid) {
                return R.success("验证成功", true);
            } else {
                return R.error("验证码错误或已过期");
            }
        } catch (Exception e) {
            log.error("验证图形验证码失败", e);
            return R.error("验证失败");
        }
    }
}
