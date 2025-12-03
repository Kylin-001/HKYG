package com.heikeji.admin.controller;

import com.heikeji.admin.common.R;
import com.heikeji.admin.service.AdminUserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * 登录控制器
 */
@RestController
@RequestMapping("/api/auth")
@Api(tags = "登录认证")
public class LoginController {

    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Value("${admin.security.token.expireTime}")
    private Integer expireTime;

    /**
     * 管理员登录
     */
    @PostMapping("/login")
    @ApiOperation("管理员登录")
    public R login(@RequestBody Map<String, String> params) {
        try {
            String username = params.get("username");
            String password = params.get("password");
            String captcha = params.get("captcha");
            String uuid = params.get("uuid");

            // 验证参数
            if (username == null || password == null) {
                return R.error(400, "用户名或密码不能为空");
            }

            // 执行登录
            Map<String, Object> result = adminUserService.login(username, password, captcha, uuid);
            return R.ok().data(result);
        } catch (RuntimeException e) {
            return R.error(401, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "登录失败，请稍后重试");
        }
    }

    /**
     * 管理员登出
     */
    @PostMapping("/logout")
    @ApiOperation("管理员登出")
    public R logout(HttpServletRequest request) {
        try {
            // 从请求头获取token
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // 执行登出
            adminUserService.logout(token);
            return R.ok("登出成功");
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "登出失败");
        }
    }

    /**
     * 获取当前登录用户信息
     */
    @GetMapping("/info")
    @ApiOperation("获取当前登录用户信息")
    public R getInfo(@RequestParam("userId") Long userId) {
        try {
            // 获取用户信息
            Object userInfo = adminUserService.getUserInfo(userId);
            if (userInfo == null) {
                return R.error(404, "用户不存在");
            }
            return R.ok().data(userInfo);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "获取用户信息失败");
        }
    }

    /**
     * 获取验证码
     */
    @GetMapping("/captcha")
    @ApiOperation("获取验证码")
    public R getCaptcha() {
        try {
            // 生成简单的数字验证码
            String captchaCode = generateSimpleCaptcha(6);
            String uuid = UUID.randomUUID().toString();
            String captchaKey = "captcha:" + uuid;
            
            // 将验证码存入Redis，设置过期时间
            redisTemplate.opsForValue().set(captchaKey, captchaCode, expireTime, TimeUnit.MINUTES);
            
            // 返回验证码和对应的uuid（简化版，实际应该返回图片）
            Map<String, Object> result = new HashMap<>(2);
            result.put("uuid", uuid);
            result.put("code", captchaCode); // 仅用于开发环境测试
            result.put("img", "data:image/png;base64,简化的验证码图片");
            
            return R.ok().data(result);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "获取验证码失败");
        }
    }
    
    /**
     * 生成简单的数字验证码
     */
    private String generateSimpleCaptcha(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
