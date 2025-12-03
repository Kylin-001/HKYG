package com.heikeji.admin.controller;

import com.heikeji.admin.common.R;
import com.heikeji.admin.entity.AdminUser;
import com.heikeji.admin.service.AdminUserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 管理员用户控制器
 */
@Api(tags = "用户管理")
@RestController
@RequestMapping("/api/user")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    /**
     * 分页查询用户列表
     */
    @ApiOperation("分页查询用户列表")
    @GetMapping("/list")
    public R userList(@ApiParam("查询参数，包括page和limit等") @RequestParam Map<String, Object> params) {
        Map<String, Object> result = adminUserService.pageUser(params);
        return R.ok().data(result);
    }

    /**
     * 根据ID获取用户信息
     */
    @ApiOperation("根据ID获取用户信息")
    @GetMapping("/{id}")
    public R getUserById(@ApiParam("用户ID") @PathVariable("id") Long id) {
        AdminUser user = adminUserService.getUserInfo(id);
        if (user == null) {
            return R.error(404, "用户不存在");
        }
        return R.ok().data(user);
    }

    /**
     * 添加用户
     */
    @ApiOperation("添加用户")
    @PostMapping("/")
    public R addUser(@ApiParam("用户信息") @RequestBody AdminUser user) {
        // 验证参数
        if (user.getUsername() == null || user.getPassword() == null) {
            return R.error(400, "用户名和密码不能为空");
        }

        boolean success = adminUserService.addUser(user);
        if (success) {
            return R.ok("添加用户成功");
        } else {
            return R.error(500, "添加用户失败");
        }
    }

    /**
     * 修改用户
     */
    @ApiOperation("修改用户")
    @PutMapping("/{id}")
    public R updateUser(@ApiParam("用户ID") @PathVariable("id") Long id, 
                       @ApiParam("用户信息") @RequestBody AdminUser user) {
        // 设置用户ID
        user.setId(id);

        boolean success = adminUserService.updateUser(user);
        if (success) {
            return R.ok("修改用户成功");
        } else {
            return R.error(500, "修改用户失败");
        }
    }

    /**
     * 删除用户
     */
    @ApiOperation("删除用户")
    @DeleteMapping("/{id}")
    public R deleteUser(@ApiParam("用户ID") @PathVariable("id") Long id) {
        try {
            boolean success = adminUserService.deleteUser(id);
            if (success) {
                return R.ok("删除用户成功");
            } else {
                return R.error(500, "删除用户失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "删除用户失败");
        }
    }

    /**
     * 批量删除用户
     */
    @ApiOperation("批量删除用户")
    @DeleteMapping("/batch")
    public R batchDeleteUser(@ApiParam("用户ID列表") @RequestBody List<Long> ids) {
        try {
            if (ids == null || ids.isEmpty()) {
                return R.error(400, "请选择要删除的用户");
            }

            boolean success = adminUserService.batchDeleteUser(ids);
            if (success) {
                return R.ok("批量删除用户成功");
            } else {
                return R.error(500, "批量删除用户失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "批量删除用户失败");
        }
    }

    /**
     * 更新用户状态
     */
    @ApiOperation("更新用户状态")
    @PutMapping("/{id}/status")
    public R updateUserStatus(@ApiParam("用户ID") @PathVariable("id") Long id, 
                             @ApiParam("状态码 0禁用 1启用") @RequestParam Integer status) {
        try {
            boolean success = adminUserService.updateUserStatus(id, status);
            if (success) {
                return R.ok("修改用户状态成功");
            } else {
                return R.error(500, "修改用户状态失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "修改用户状态失败");
        }
    }

    /**
     * 修改密码
     */
    @ApiOperation("修改密码")
    @PutMapping("/password")
    public R changePassword(@ApiParam("密码信息，包括oldPassword和newPassword") @RequestBody Map<String, Object> params) {
        Long userId = Long.parseLong(params.get("userId").toString());
        String oldPassword = (String) params.get("oldPassword");
        String newPassword = (String) params.get("newPassword");

        if (oldPassword == null || newPassword == null) {
            return R.error(400, "密码不能为空");
        }

        boolean success = adminUserService.changePassword(userId, oldPassword, newPassword);
        if (success) {
            return R.ok("修改密码成功");
        } else {
            return R.error(500, "修改密码失败");
        }
    }

    /**
     * 重置密码
     */
    @ApiOperation("重置密码")
    @PutMapping("/{id}/reset")
    public R resetPassword(@ApiParam("用户ID") @PathVariable("id") Long id) {
        boolean success = adminUserService.resetPassword(id);
        if (success) {
            return R.ok("重置密码成功，默认密码：123456");
        } else {
            return R.error(500, "重置密码失败");
        }
    }
}
