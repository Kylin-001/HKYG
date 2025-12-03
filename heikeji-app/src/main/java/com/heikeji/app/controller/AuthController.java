package com.heikeji.app.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.heikeji.app.model.response.AppResponse;
import com.heikeji.app.model.dto.LoginRequest;
import com.heikeji.app.model.dto.RegisterRequest;
import com.heikeji.app.model.dto.SendCodeRequest;
import com.heikeji.app.service.AuthService;

/**
 * 认证控制器
 * 处理APP端的登录、注册、发送验证码等功能
 */
@RestController
@RequestMapping("/api/app/auth")
@Api(tags = "认证管理")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    @ApiOperation("用户登录")
    public AppResponse<?> login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    /**
     * 用户注册
     */
    @PostMapping("/register")
    @ApiOperation("用户注册")
    public AppResponse<?> register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    /**
     * 发送验证码
     */
    @PostMapping("/send-code")
    @ApiOperation("发送验证码")
    public AppResponse<?> sendCode(@RequestBody SendCodeRequest request) {
        return authService.sendCode(request);
    }

    /**
     * 刷新token
     */
    @PostMapping("/refresh-token")
    @ApiOperation("刷新token")
    public AppResponse<?> refreshToken(@RequestBody String refreshToken) {
        return authService.refreshToken(refreshToken);
    }
}