package com.heikeji.system.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.system.dto.LoginDTO;
import com.heikeji.system.dto.RegisterDTO;
import com.heikeji.system.entity.SysUser;
import com.heikeji.system.security.JwtTokenProvider;
import com.heikeji.system.service.SysUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 */
@Tag(name = "系统认证管理", description = "系统认证管理相关接口")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private SysUserService sysUserService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Operation(summary = "用户登录", description = "用户登录接口，支持用户名密码登录")
    @PostMapping("/login")
    public R<Map<String, Object>> login(@RequestBody LoginDTO loginDTO) {
        try {
            // 验证用户名密码
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword())
            );

            // 设置认证信息到上下文
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 生成JWT令牌
            String token = jwtTokenProvider.generateToken(authentication);

            // 获取用户信息
            SysUser user = sysUserService.getByUsername(loginDTO.getUsername());

            // 构建返回结果
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("user", user);
            
            return R.success(result);
        } catch (Exception e) {
            return R.error("用户名或密码错误");
        }
    }

    @Operation(summary = "用户注册", description = "用户注册接口，需要提供用户名和密码")
    @PostMapping("/register")
    public R<Boolean> register(@RequestBody RegisterDTO registerDTO) {
        // 验证参数
        Assert.hasText(registerDTO.getUsername(), "用户名不能为空");
        Assert.hasText(registerDTO.getPassword(), "密码不能为空");
        Assert.isTrue(registerDTO.getPassword().equals(registerDTO.getConfirmPassword()), "两次输入的密码不一致");

        // 检查用户名是否已存在
        if (sysUserService.getByUsername(registerDTO.getUsername()) != null) {
            return R.error("用户名已存在");
        }

        // 创建用户
        SysUser user = new SysUser();
        user.setUsername(registerDTO.getUsername());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setPhone(registerDTO.getPhone());
        user.setEmail(registerDTO.getEmail());
        user.setStatus(0); // 禁用状态
        boolean saved = sysUserService.save(user);
        if (saved) {
            return R.success(true);
        } else {
            return R.error("注册失败");
        }
    }

    @Operation(summary = "用户登出", description = "用户登出接口")
    @PostMapping("/logout")
    public R<Boolean> logout() {
        // 清除认证信息
        SecurityContextHolder.clearContext();
        return R.success(true);
    }

    @Operation(summary = "获取当前用户信息", description = "获取当前登录用户的信息")
    @GetMapping("/currentUser")
    public R<SysUser> currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return R.error(401, "未授权");
        }

        String username = authentication.getName();
        SysUser user = sysUserService.getByUsername(username);
        return R.success(user);
    }

    @Operation(summary = "刷新令牌", description = "刷新用户令牌")
    @PostMapping("/refresh")
    public R<Map<String, String>> refreshToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return R.error(401, "未授权");
        }

        String username = authentication.getName();
        String newToken = jwtTokenProvider.generateRefreshToken(username);

        Map<String, String> result = new HashMap<>();
        result.put("token", newToken);
        
        return R.success(result);
    }
}
