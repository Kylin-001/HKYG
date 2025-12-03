package com.heikeji.mall.user.controller;

import com.heikeji.common.core.annotation.RequiresLogin;
import com.heikeji.common.core.annotation.RequiresAdmin;
import com.heikeji.common.core.security.UserContextHolderAdapter;
import com.heikeji.mall.common.auth.PublicApi;
import com.heikeji.mall.common.response.R;
import com.heikeji.mall.user.entity.User;
import com.heikeji.mall.user.entity.UserAuth;
import com.heikeji.mall.user.dto.UserDTO;
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
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
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
     * 获取当前用户信息
     */
    @GetMapping("/me")
    @RequiresLogin
    @Operation(summary = "获取当前用户信息")
    public R<User> getCurrentUserInfo() {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        if (userId == null) {
            return R.error(400, "用户未登录");
        }
        User user = userService.getById(userId);
        return R.success("查询成功", user != null ? user : null);
    }

    /**
     * 绑定学号
     */
    @PostMapping("/bindStudentNo")
    @RequiresLogin
    @Operation(summary = "绑定学号")
    public R<User> bindStudentNo(@Valid @StudentNo @RequestParam String studentNo,
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
            return R.success("学号绑定成功", user);
        }
        return R.error(409, "学号已被其他用户绑定");
    }

    /**
     * 根据手机号获取用户信息（管理员接口）
     */
    @GetMapping("/admin/getByPhone/{phone}")
    @RequiresAdmin
    @Operation(summary = "根据手机号获取用户信息")
    public R<User> getUserByPhone(@Valid @NotBlank @PathVariable String phone) {
        Long adminId = UserContextHolderAdapter.getCurrentUserId();
        log.info("管理员{}根据手机号获取用户信息: phone = {}", adminId, phone);
        User user = userService.getUserByPhone(phone);
        return user != null ? R.success("查询成功", user) : R.error(R.USER_NOT_FOUND, "用户不存在");
    }

    /**
     * 根据学号获取用户信息（管理员接口）
     */
    @GetMapping("/admin/getByStudentNo/{studentNo}")
    @RequiresAdmin
    @Operation(summary = "根据学号获取用户信息")
    public R<User> getUserByStudentNo(@Valid @StudentNo @PathVariable String studentNo) {
        Long adminId = UserContextHolderAdapter.getCurrentUserId();
        log.info("管理员{}根据学号获取用户信息: studentNo = {}", adminId, studentNo);
        User user = userService.getUserByStudentNo(studentNo);
        return user != null ? R.success(user) : R.error(R.USER_NOT_FOUND, "用户不存在");
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/info/{userId}")
    @RequiresLogin
    @Operation(summary = "获取用户信息")
    public R<User> getUserInfo(@PathVariable Long userId) {
        User user = userService.getById(userId);
        return user != null ? R.success(user) : R.error(R.USER_NOT_FOUND, "用户不存在");
    }

    /**
     * 更新用户信息
     */
    @PutMapping("/info/{userId}")
    @RequiresLogin
    @Operation(summary = "更新用户信息")
    public R<Boolean> updateUserInfo(@PathVariable Long userId, @Valid @RequestBody UserDTO userDTO) {
        // TODO: 将UserDTO转换为UserUpdateDTO
        return R.error(501, "此功能尚未实现");
    }

    /**
     * 获取用户余额
     */
    @GetMapping("/balance/{userId}")
    @RequiresLogin
    @Operation(summary = "获取用户余额")
    public R<BigDecimal> getBalance(@PathVariable Long userId) {
        // TODO: 实现获取用户余额逻辑
        return R.error(501, "此功能尚未实现");
    }

    /**
     * 更新用户余额
     */
    @PutMapping("/updateBalance/{userId}")
    @RequiresLogin
    @Operation(summary = "更新用户余额")
    public R<Boolean> updateBalance(@PathVariable Long userId, @RequestParam BigDecimal amount) {
        // TODO: 实现余额更新逻辑
        return R.error(501, "此功能尚未实现");
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
    public R<User> getUserDetail(@RequestParam Long userId) {
        User user = userService.getById(userId);
        return R.success(user);
    }
    
    /**
     * 扣除用户余额（供其他服务调用）
     */
    @PutMapping("/balance/deduct/{userId}")
    @RequiresLogin
    @Operation(summary = "扣除用户余额")
    public R<Boolean> deductBalance(@PathVariable Long userId, @RequestParam BigDecimal amount) {
        // TODO: 实现余额扣除逻辑
        return R.error(501, "此功能尚未实现");
    }
    
    /**
     * 充值用户余额
     */
    @PutMapping("/balance/recharge/{userId}")
    @RequiresLogin
    @Operation(summary = "充值用户余额")
    public R<Boolean> rechargeBalance(@PathVariable Long userId, @RequestParam BigDecimal amount) {
        // TODO: 实现余额充值逻辑
        return R.error(501, "此功能尚未实现");
    }
    
    /**
     * 检查余额
     */
    @GetMapping("/balance/check/{userId}")
    @RequiresLogin
    @Operation(summary = "检查余额")
    public R<Boolean> checkBalance(@PathVariable Long userId, @RequestParam BigDecimal amount) {
        User user = userService.getById(userId);
        // 注意：User实体类中没有balance字段，只有points字段
        return R.success(false);
    }
}