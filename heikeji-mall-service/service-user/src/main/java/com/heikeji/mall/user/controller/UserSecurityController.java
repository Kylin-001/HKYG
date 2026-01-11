package com.heikeji.mall.user.controller;

import com.heikeji.common.core.annotation.RequiresLogin;
import com.heikeji.common.core.security.UserContextHolderAdapter;
import com.heikeji.mall.common.response.R;
import com.heikeji.mall.user.dto.ChangePasswordDTO;
import com.heikeji.mall.user.dto.LoginDTO;
import com.heikeji.mall.user.dto.ResetPasswordDTO;
import com.heikeji.mall.user.service.UserSecurityService;
import com.heikeji.mall.user.service.UserLoginHistoryService;
import com.heikeji.mall.user.vo.UserSecurityVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

/**
 * 用户安全控制器
 */
@RestController
@RequestMapping("/api/security")
@Tag(name = "用户安全")
@Validated
public class UserSecurityController {
    private static final Logger log = LoggerFactory.getLogger(UserSecurityController.class);

    @Autowired
    private UserSecurityService userSecurityService;

    @Autowired
    private UserLoginHistoryService userLoginHistoryService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public R<UserSecurityVO> login(@Valid @RequestBody LoginDTO loginDTO) {
        log.info("用户登录: {}", loginDTO.getAccount());
        UserSecurityVO userSecurityVO = userSecurityService.login(loginDTO);
        if (userSecurityVO != null) {
            return R.success("登录成功", userSecurityVO);
        }
        return R.error("登录失败，用户名或密码错误");
    }

    /**
     * 用户退出登录
     */
    @PostMapping("/logout")
    @RequiresLogin
    @Operation(summary = "用户退出登录")
    public R<Boolean> logout() {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        log.info("用户{}退出登录", userId);
        userSecurityService.logout(userId);
        return R.success("退出登录成功", true);
    }

    /**
     * 修改密码
     */
    @PutMapping("/changePassword")
    @RequiresLogin
    @Operation(summary = "修改密码")
    public R<Boolean> changePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        log.info("用户{}修改密码", userId);
        boolean result = userSecurityService.changePassword(userId, changePasswordDTO);
        return result ? R.success("密码修改成功", true) : R.error("密码修改失败");
    }

    /**
     * 重置密码
     */
    @PutMapping("/resetPassword")
    @Operation(summary = "重置密码")
    public R<Boolean> resetPassword(@Valid @RequestBody ResetPasswordDTO resetPasswordDTO) {
        log.info("用户重置密码: {}", resetPasswordDTO.getPhone());
        boolean result = userSecurityService.resetPassword(resetPasswordDTO);
        return result ? R.success("密码重置成功", true) : R.error("密码重置失败");
    }

    /**
     * 验证密码强度
     */
    @PostMapping("/validatePassword")
    @Operation(summary = "验证密码强度")
    public R<Boolean> validatePassword(@RequestParam @NotBlank String password) {
        boolean isStrong = userSecurityService.validatePasswordStrength(password);
        return R.success(isStrong);
    }

    /**
     * 生成强密码
     */
    @PostMapping("/generatePassword")
    @Operation(summary = "生成强密码")
    public R<String> generatePassword() {
        String password = userSecurityService.generateStrongPassword();
        return R.success(password);
    }

    /**
     * 检查账户是否被锁定
     */
    @GetMapping("/checkAccountLocked/{username}")
    @Operation(summary = "检查账户是否被锁定")
    public R<Boolean> checkAccountLocked(@PathVariable @NotBlank String username) {
        boolean isLocked = userSecurityService.isAccountLocked(username);
        return R.success(isLocked);
    }

    /**
     * 获取用户登录历史
     */
    @GetMapping("/loginHistory")
    @RequiresLogin
    @Operation(summary = "获取用户登录历史")
    public R<?> getLoginHistory(@RequestParam(defaultValue = "1") int page,
                                @RequestParam(defaultValue = "10") int size) {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        return R.success(userLoginHistoryService.getUserLoginHistory(userId, page, size));
    }

    /**
     * 清除用户登录失败次数
     */
    @DeleteMapping("/clearFailedAttempts/{username}")
    @Operation(summary = "清除用户登录失败次数")
    public R<Boolean> clearFailedAttempts(@PathVariable @NotBlank String username) {
        userSecurityService.clearFailedAttempts(username);
        return R.success("清除失败次数成功", true);
    }

    /**
     * 锁定账户
     */
    @PutMapping("/lockAccount/{username}")
    @Operation(summary = "锁定账户")
    public R<Boolean> lockAccount(@PathVariable @NotBlank String username) {
        userSecurityService.lockAccount(username);
        return R.success("账户锁定成功", true);
    }

    /**
     * 解锁账户
     */
    @PutMapping("/unlockAccount/{username}")
    @Operation(summary = "解锁账户")
    public R<Boolean> unlockAccount(@PathVariable @NotBlank String username) {
        userSecurityService.unlockAccount(username);
        return R.success("账户解锁成功", true);
    }
}