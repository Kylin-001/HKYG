package com.heikeji.mall.user.controller;

import com.heikeji.mall.common.auth.PublicApi;
import com.heikeji.mall.common.response.R;
import com.heikeji.mall.user.dto.LoginDTO;
import com.heikeji.mall.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 认证控制器 - 处理登录注册等认证请求
 * 路径为 /api/auth/**，与前端请求保持一致
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "认证接口")
@Validated
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    /**
     * 用户名/密码登录
     */
    @PostMapping("/login")
    @PublicApi
    @Operation(summary = "用户登录")
    public R<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginDTO) {
        log.info("========== 登录请求开始 ==========");
        log.info("登录账号: {}", loginDTO.getAccount());
        
        try {
            Map<String, Object> result = userService.login(loginDTO);
            
            if (result != null && !result.isEmpty()) {
                log.info("登录成功");
                log.info("========== 登录请求结束 ==========");
                return R.success("登录成功", result);
            }
            log.info("用户名或密码错误");
            log.info("========== 登录请求结束 ==========");
            return R.error("用户名或密码错误");
        } catch (Exception e) {
            log.error("登录过程发生异常", e);
            log.error("异常类型: {}", e.getClass().getName());
            log.error("异常信息: {}", e.getMessage());
            log.info("========== 登录请求异常结束 ==========");
            throw e;
        }
    }
}
