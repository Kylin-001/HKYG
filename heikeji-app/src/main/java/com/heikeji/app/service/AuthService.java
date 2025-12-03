package com.heikeji.app.service;

import com.heikeji.app.model.response.AppResponse;
import com.heikeji.app.model.dto.LoginRequest;
import com.heikeji.app.model.dto.RegisterRequest;
import com.heikeji.app.model.dto.SendCodeRequest;

/**
 * 认证服务接口
 */
public interface AuthService {

    /**
     * 用户登录
     */
    AppResponse<?> login(LoginRequest request);

    /**
     * 用户注册
     */
    AppResponse<?> register(RegisterRequest request);

    /**
     * 发送验证码
     */
    AppResponse<?> sendCode(SendCodeRequest request);

    /**
     * 刷新token
     */
    AppResponse<?> refreshToken(String refreshToken);
}