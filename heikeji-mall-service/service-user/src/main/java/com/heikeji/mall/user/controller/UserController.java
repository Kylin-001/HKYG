package com.heikeji.mall.user.controller;

import com.heikeji.common.core.annotation.RequiresLogin;
import com.heikeji.common.core.annotation.RequiresAdmin;
import com.heikeji.common.core.security.UserContextHolderAdapter;
import com.heikeji.mall.common.auth.PublicApi;
import com.heikeji.mall.common.response.R;
import com.heikeji.mall.user.dto.LoginDTO;
import com.heikeji.mall.user.dto.PersonalStatisticsDTO;
import com.heikeji.mall.user.dto.RegisterDTO;
import com.heikeji.mall.user.dto.ResetPasswordDTO;
import com.heikeji.mall.user.dto.UserDTO;
import com.heikeji.mall.user.dto.UserUpdateDTO;
import com.heikeji.mall.user.dto.UserVO;
import com.heikeji.mall.user.entity.User;
import com.heikeji.mall.user.entity.UserAuth;
import com.heikeji.mall.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.heikeji.common.core.validation.annotation.StudentNo;
import com.heikeji.common.core.security.JwtUtils;
import com.heikeji.mall.user.component.CaptchaComponent;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/user")
@Tag(name = "用户管理接口")
@Validated
public class UserController {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private CaptchaComponent captchaComponent;

    /**
     * 微信登录
     */
    @PostMapping("/wechatLogin")
    @PublicApi
    @Operation(summary = "微信登录")
    public R<Map<String, Object>> wechatLogin(@Valid @NotBlank @RequestParam String code) {
        log.info("用户进行微信登录");
        Map<String, Object> result = userService.wechatLogin(code);
        if (result != null && !result.isEmpty()) {
            return R.success("登录成功", result);
        }
        return R.error("登录失败");
    }
    
    /**
     * 用户名/密码登录
     */
    @PostMapping("/login")
    @PublicApi
    @Operation(summary = "用户名/密码登录")
    public R<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginDTO) {
        log.info("========== 登录请求开始 ==========");
        log.info("登录账号: {}", loginDTO.getAccount());
        log.info("验证码ID: {}", loginDTO.getCodeId());
        log.info("验证码: {}", loginDTO.getCode());
        
        try {
            // 验证验证码
            if (loginDTO.getCodeId() != null && loginDTO.getCode() != null) {
                log.info("开始验证验证码...");
                boolean captchaValid = captchaComponent.validateCaptcha(loginDTO.getCodeId(), loginDTO.getCode());
                log.info("验证码验证结果: {}", captchaValid);
                if (!captchaValid) {
                    log.info("验证码验证失败");
                    return R.error("验证码错误或已过期");
                }
            }
            
            log.info("开始调用 userService.login...");
            Map<String, Object> result = userService.login(loginDTO);
            log.info("userService.login 返回结果: {}", result);
            
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
            e.printStackTrace();
            log.info("========== 登录请求异常结束 ==========");
            throw e;
        }
    }
    
    /**
     * 手机号验证码登录
     */
    @PostMapping("/phoneLogin")
    @PublicApi
    @Operation(summary = "手机号验证码登录")
    public R<Map<String, Object>> phoneLogin(@Valid @NotBlank @RequestParam String phone, 
                                            @Valid @NotBlank @RequestParam String code) {
        log.info("用户进行手机号验证码登录");
        Map<String, Object> result = userService.phoneLogin(phone, code);
        if (result != null && !result.isEmpty()) {
            return R.success("登录成功", result);
        }
        return R.error("验证码错误或已过期");
    }
    
    /**
     * 发送验证码
     */
    @PostMapping("/sendCode")
    @PublicApi
    @Operation(summary = "发送验证码")
    public R<String> sendCode(@Valid @NotBlank @RequestParam String phone) {
        log.info("发送验证码到手机号: {}", phone);
        boolean result = userService.sendVerificationCode(phone);
        if (result) {
            return R.success("验证码发送成功");
        }
        return R.error("验证码发送失败");
    }
    
    /**
     * 用户注册
     */
    @PostMapping("/register")
    @PublicApi
    @Operation(summary = "用户注册")
    public R<UserVO> register(@Valid @RequestBody RegisterDTO registerDTO) {
        log.info("用户注册: {}", registerDTO.getUsername());
        User user = userService.register(registerDTO);
        if (user != null) {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            return R.success("注册成功", userVO);
        }
        return R.error("注册失败");
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    @RequiresLogin
    @Operation(summary = "获取当前用户信息")
    public R<UserVO> getCurrentUserInfo() {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        if (userId == null) {
            return R.error(400, "用户未登录");
        }
        User user = userService.getById(userId);
        if (user != null) {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            // 设置默认角色和权限
            userVO.setRoles(java.util.Arrays.asList("user"));
            userVO.setPermissions(java.util.Arrays.asList("read"));
            return R.success("查询成功", userVO);
        }
        return R.success("查询成功", null);
    }

    /**
     * 获取当前用户信息 - 兼容前端路径
     */
    @GetMapping("/info")
    @RequiresLogin
    @Operation(summary = "获取当前用户信息")
    public R<UserVO> getCurrentUserInfoForFrontend() {
        return getCurrentUserInfo();
    }

    /**
     * 绑定学号
     */
    @PostMapping("/bindStudentNo")
    @RequiresLogin
    @Operation(summary = "绑定学号")
    public R<UserVO> bindStudentNo(@Valid @StudentNo @RequestParam String studentNo,
                                 @RequestParam(required = false) String realName,
                                 @RequestParam(required = false) String college,
                                 @RequestParam(required = false) String major,
                                 @RequestParam(required = false) String grade) {
        // 从token中获取当前用户ID
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        
        if (userId == null) {
            return R.error(400, "用户ID不能为空");
        }
        
        log.info("用户{}绑定学号: {}", userId, studentNo);
        // 调用接口中定义的bindStudentId方法
        User user = userService.bindStudentId(studentNo, realName, college, major, grade);
        
        if (user != null) {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            return R.success("学号绑定成功", userVO);
        }
        return R.error(409, "学号已被其他用户绑定");
    }

    /**
     * 根据手机号获取用户信息（管理员接口）
     */
    @GetMapping("/admin/getByPhone/{phone}")
    @RequiresAdmin
    @Operation(summary = "根据手机号获取用户信息")
    public R<UserVO> getUserByPhone(@Valid @NotBlank @PathVariable String phone) {
        Long adminId = UserContextHolderAdapter.getCurrentUserId();
        log.info("管理员{}根据手机号获取用户信息: phone = {}", adminId, phone);
        User user = userService.getUserByPhone(phone);
        if (user != null) {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            return R.success("查询成功", userVO);
        }
        return R.error(R.USER_NOT_FOUND, "用户不存在");
    }

    /**
     * 根据学号获取用户信息（管理员接口）
     */
    @GetMapping("/admin/getByStudentNo/{studentNo}")
    @RequiresAdmin
    @Operation(summary = "根据学号获取用户信息")
    public R<UserVO> getUserByStudentNo(@Valid @StudentNo @PathVariable String studentNo) {
        Long adminId = UserContextHolderAdapter.getCurrentUserId();
        log.info("管理员{}根据学号获取用户信息: studentNo = {}", adminId, studentNo);
        User user = userService.getUserByStudentNo(studentNo);
        if (user != null) {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            return R.success(userVO);
        }
        return R.error(R.USER_NOT_FOUND, "用户不存在");
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/info/{userId}")
    @RequiresLogin
    @Operation(summary = "获取用户信息")
    public R<UserVO> getUserInfo(@PathVariable Long userId) {
        User user = userService.getById(userId);
        if (user != null) {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            return R.success(userVO);
        }
        return R.error(R.USER_NOT_FOUND, "用户不存在");
    }

    /**
     * 更新用户信息
     */
    @PutMapping("/info/{userId}")
    @RequiresLogin
    @Operation(summary = "更新用户信息")
    public R<Boolean> updateUserInfo(@PathVariable Long userId, @Valid @RequestBody UserDTO userDTO) {
        try {
            // 获取当前登录用户ID，确保只能更新自己的信息
            Long currentUserId = UserContextHolderAdapter.getCurrentUserId();
            if (!currentUserId.equals(userId)) {
                return R.error(403, "无权更新其他用户信息");
            }
            
            // 转换为UserUpdateDTO
            UserUpdateDTO userUpdateDTO = new UserUpdateDTO();
            BeanUtils.copyProperties(userDTO, userUpdateDTO);
            
            User updatedUser = userService.updateUser(userUpdateDTO);
            return R.success("更新成功", updatedUser != null);
        } catch (RuntimeException e) {
            return R.error(400, e.getMessage());
        }
    }

    /**
     * 获取用户余额
     */
    @GetMapping("/balance/{userId}")
    @RequiresLogin
    @Operation(summary = "获取用户余额")
    public R<BigDecimal> getBalance(@PathVariable Long userId) {
        try {
            BigDecimal balance = userService.getBalance(userId);
            return R.success("查询成功", balance);
        } catch (RuntimeException e) {
            return R.error(400, e.getMessage());
        }
    }

    /**
     * 更新用户余额
     */
    @PutMapping("/updateBalance/{userId}")
    @RequiresLogin
    @Operation(summary = "更新用户余额")
    public R<Boolean> updateBalance(@PathVariable Long userId, @RequestParam BigDecimal amount) {
        try {
            userService.updateBalance(userId, amount);
            return R.success("更新成功", true);
        } catch (RuntimeException e) {
            return R.error(400, e.getMessage());
        }
    }

    /**
     * 验证用户身份
     */
    @PostMapping("/verify/{userId}")
    @RequiresLogin
    @Operation(summary = "验证用户身份")
    public R<Boolean> verifyUser(@PathVariable Long userId, @RequestParam String realName, @RequestParam String idCard) {
        // TODO: 实现用户验证逻辑
        return R.error(501, "此功能尚未实现");
    }

    /**
     * 根据用户ID查询用户信息
     */
    @GetMapping("/detail")
    @RequiresLogin
    @Operation(summary = "查询用户详情")
    public R<UserVO> getUserDetail(@RequestParam Long userId) {
        User user = userService.getById(userId);
        if (user != null) {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            return R.success(userVO);
        }
        return R.success(null);
    }
    
    /**
     * 扣除用户余额（供其他服务调用）
     */
    @PutMapping("/balance/deduct/{userId}")
    @RequiresLogin
    @Operation(summary = "扣除用户余额")
    public R<Boolean> deductBalance(@PathVariable Long userId, @RequestParam BigDecimal amount) {
        try {
            boolean success = userService.deductBalance(userId, amount);
            if (success) {
                return R.success("扣除成功", true);
            } else {
                return R.error(400, "余额不足");
            }
        } catch (RuntimeException e) {
            return R.error(400, e.getMessage());
        }
    }
    
    /**
     * 充值用户余额
     */
    @PutMapping("/balance/recharge/{userId}")
    @RequiresLogin
    @Operation(summary = "充值用户余额")
    public R<Boolean> rechargeBalance(@PathVariable Long userId, @RequestParam BigDecimal amount) {
        try {
            userService.rechargeBalance(userId, amount);
            return R.success("充值成功", true);
        } catch (RuntimeException e) {
            return R.error(400, e.getMessage());
        }
    }
    
    /**
     * 检查余额
     */
    @GetMapping("/balance/check/{userId}")
    @RequiresLogin
    @Operation(summary = "检查余额")
    public R<Boolean> checkBalance(@PathVariable Long userId, @RequestParam BigDecimal amount) {
        User user = userService.getById(userId);
        if (user == null) {
            return R.error(400, "用户不存在");
        }
        BigDecimal balance = user.getBalance() != null ? user.getBalance() : BigDecimal.ZERO;
        return R.success(balance.compareTo(amount) >= 0);
    }
    
    /**
     * 重置密码
     */
    @PostMapping("/resetPassword")
    @PublicApi
    @Operation(summary = "重置密码")
    public R<String> resetPassword(@Valid @RequestBody ResetPasswordDTO resetPasswordDTO) {
        log.info("用户重置密码: {}", resetPasswordDTO.getPhone());
        userService.resetPassword(resetPasswordDTO);
        return R.success("密码重置成功");
    }
    
    /**
     * 刷新Token
     */
    @PostMapping("/refresh")
    @PublicApi
    @Operation(summary = "刷新Token")
    public R<Map<String, Object>> refreshToken(@RequestParam String refreshToken) {
        log.info("用户请求刷新Token");
        try {
            // 调用JWT工具类刷新Token
            String newToken = jwtUtils.refreshToken(refreshToken);
            
            Map<String, Object> result = new HashMap<>();
            result.put("token", newToken);
            result.put("refreshToken", refreshToken); // 保留原刷新Token，直到其过期
            
            return R.success("Token刷新成功", result);
        } catch (RuntimeException e) {
            log.error("刷新Token失败: {}", e.getMessage());
            return R.error("刷新Token失败: " + e.getMessage());
        }
    }
    
    /**
     * 登出
     */
    @PostMapping("/logout")
    @RequiresLogin
    @Operation(summary = "登出")
    public R<String> logout(@RequestHeader("Authorization") String authorizationHeader) {
        log.info("用户请求登出");
        try {
            // 从请求头中提取Token
            String token = jwtUtils.extractTokenFromHeader(authorizationHeader);
            if (token != null) {
                userService.logout(token);
                return R.success("登出成功");
            }
            return R.error("无效的Token");
        } catch (RuntimeException e) {
            log.error("登出失败: {}", e.getMessage());
            return R.error("登出失败: " + e.getMessage());
        }
    }

    /**
     * 获取个人统计数据
     */
    @GetMapping("/statistics")
    @RequiresLogin
    @Operation(summary = "获取个人统计数据")
    public R<PersonalStatisticsDTO> getPersonalStatistics() {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        if (userId == null) {
            return R.error(400, "用户未登录");
        }

        log.info("获取用户{}的个人统计数据", userId);

        User user = userService.getById(userId);
        if (user == null) {
            return R.error(R.USER_NOT_FOUND, "用户不存在");
        }

        PersonalStatisticsDTO statistics = new PersonalStatisticsDTO();

        // 基础统计数据（从用户实体获取）
        statistics.setOrderCount(0); // TODO: 从订单服务获取
        statistics.setReviewCount(0); // TODO: 从评价服务获取
        statistics.setFavoriteCount(0); // TODO: 从收藏服务获取
        statistics.setFollowerCount(0); // TODO: 从关注服务获取
        statistics.setFollowingCount(0); // TODO: 从关注服务获取
        statistics.setPoints(user.getPoints() != null ? user.getPoints() : 0);
        statistics.setLevel(1); // TODO: 根据积分计算等级
        statistics.setJoinDays(0); // TODO: 计算加入天数

        // 社区相关统计（从用户实体获取）
        statistics.setPostCount(user.getPostCount() != null ? user.getPostCount() : 0);
        statistics.setLikeCount(user.getLikeCount() != null ? user.getLikeCount() : 0);
        statistics.setCommentCount(user.getCommentCount() != null ? user.getCommentCount() : 0);
        statistics.setCreditScore(user.getCreditScore() != null ? user.getCreditScore() : new BigDecimal("5.0"));

        // 消费统计（默认值）
        statistics.setTotalSpent(BigDecimal.ZERO);
        statistics.setAverageOrderValue(BigDecimal.ZERO);
        statistics.setFavoriteCategories(new java.util.ArrayList<>());
        statistics.setRecentActivity(new java.util.ArrayList<>());

        return R.success("查询成功", statistics);
    }
}