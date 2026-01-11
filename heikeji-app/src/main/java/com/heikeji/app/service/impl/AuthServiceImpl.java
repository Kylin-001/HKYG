package com.heikeji.app.service.impl;

import cn.hutool.core.util.StrUtil;
import com.heikeji.app.config.JwtConfig;
import com.heikeji.app.model.response.AppResponse;
import com.heikeji.app.model.dto.LoginRequest;
import com.heikeji.app.model.dto.RegisterRequest;
import com.heikeji.app.model.dto.SendCodeRequest;
import com.heikeji.app.service.AuthService;
import com.heikeji.common.security.utils.JwtUtils;
import com.heikeji.common.util.RedisUtils;
import com.heikeji.member.api.MemberFeignService;
import com.heikeji.common.core.domain.MemberDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

/**
 * 认证服务实现类
 */
@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private JwtConfig jwtConfig;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RedisUtils redisUtils;

    @Autowired(required = false)
    private MemberFeignService memberFeignService;

    @Override
    public AppResponse<?> login(LoginRequest request) {
        // 1. 根据手机号查询用户信息
        MemberDTO memberDTO = memberFeignService.getByPhone(request.getPhone());
        if (memberDTO == null) {
            return AppResponse.error(400, "用户不存在");
        }

        // 2. 验证密码或验证码
        if ("password".equals(request.getLoginType())) {
            // 密码登录
            if (!passwordEncoder.matches(request.getPassword(), memberDTO.getPassword())) {
                return AppResponse.error(400, "密码错误");
            }
        } else if ("code".equals(request.getLoginType())) {
            // 验证码登录
            String redisCode = redisUtils.get("login_code:" + request.getPhone());
            if (StrUtil.isEmpty(redisCode) || !redisCode.equals(request.getCode())) {
                return AppResponse.error(400, "验证码错误或已过期");
            }
            // 验证码使用后删除
            redisUtils.delete("login_code:" + request.getPhone());
        } else {
            return AppResponse.error(400, "登录类型错误");
        }

        // 3. 生成token
        String token = generateToken(memberDTO.getId(), memberDTO.getPhone());
        String refreshToken = generateRefreshToken(memberDTO.getId());

        // 4. 构建返回数据
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("refreshToken", refreshToken);
        data.put("userInfo", memberDTO);

        return AppResponse.success(data);
    }

    @Override
    public AppResponse<?> register(RegisterRequest request) {
        // 1. 验证验证码
        String redisCode = redisUtils.get("register_code:" + request.getPhone());
        if (StrUtil.isEmpty(redisCode) || !redisCode.equals(request.getCode())) {
            return AppResponse.error(400, "验证码错误或已过期");
        }

        // 2. 检查手机号是否已注册
        MemberDTO existingMember = memberFeignService.getByPhone(request.getPhone());
        if (existingMember != null) {
            return AppResponse.error(400, "手机号已注册");
        }

        // 3. 创建用户
        MemberDTO memberDTO = new MemberDTO();
        memberDTO.setPhone(request.getPhone());
        memberDTO.setPassword(passwordEncoder.encode(request.getPassword()));
        memberDTO.setNickname(request.getNickname() != null ? request.getNickname() : "用户" + request.getPhone().substring(7));
        memberDTO.setInviteCode(request.getInviteCode());

        // 4. 调用会员服务注册用户
        boolean registerResult = memberFeignService.register(memberDTO);
        if (!registerResult) {
            return AppResponse.error(500, "注册失败，请稍后重试");
        }

        // 5. 注册成功后删除验证码
        redisUtils.delete("register_code:" + request.getPhone());

        return AppResponse.success("注册成功");
    }

    @Override
    public AppResponse<?> sendCode(SendCodeRequest request) {
        // 1. 检查发送频率
        String key = request.getType() + "_code:" + request.getPhone();
        if (redisUtils.hasKey(key)) {
            return AppResponse.error(400, "验证码已发送，请稍后再试");
        }

        // 2. 生成6位随机验证码
        String code = String.format("%06d", new Random().nextInt(999999));

        // 3. 模拟发送验证码（实际项目中需要对接短信服务）
        System.out.println("向手机号 " + request.getPhone() + " 发送验证码: " + code + "，类型: " + request.getType());

        // 4. 保存验证码到Redis，有效期5分钟
        redisUtils.set(key, code, 5, TimeUnit.MINUTES);

        return AppResponse.success("验证码发送成功");
    }

    @Override
    public AppResponse<?> refreshToken(String refreshToken) {
        if (StrUtil.isEmpty(refreshToken)) {
            return AppResponse.error(400, "刷新令牌不能为空");
        }

        // 1. 验证refreshToken
        Long userId = JwtUtils.getUserIdFromToken(refreshToken);
        if (userId == null) {
            return AppResponse.error(401, "刷新令牌无效");
        }

        // 2. 查询用户信息
        MemberDTO memberDTO = memberFeignService.getById(userId);
        if (memberDTO == null) {
            return AppResponse.error(401, "用户不存在");
        }

        // 3. 生成新的token和refreshToken
        String newToken = generateToken(userId, memberDTO.getPhone());
        String newRefreshToken = generateRefreshToken(userId);

        // 4. 构建返回数据
        Map<String, Object> data = new HashMap<>();
        data.put("token", newToken);
        data.put("refreshToken", newRefreshToken);

        return AppResponse.success(data);
    }

    /**
     * 生成访问令牌
     */
    private String generateToken(Long userId, String phone) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("phone", phone);
        return JwtUtils.generateToken(claims, jwtConfig.getSecret(), jwtConfig.getExpiration());
    }

    /**
     * 生成刷新令牌
     */
    private String generateRefreshToken(Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        return JwtUtils.generateToken(claims, jwtConfig.getSecret(), jwtConfig.getRefreshExpiration());
    }
}