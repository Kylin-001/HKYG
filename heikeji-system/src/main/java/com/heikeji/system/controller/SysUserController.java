package com.heikeji.system.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.heikeji.common.api.Result;
import com.heikeji.common.api.ResultCode;
import com.heikeji.system.entity.SysUser;
import com.heikeji.system.service.SysUserService;
import com.heikeji.system.vo.UserQueryVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 系统用户控制器
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Tag(name = "系统用户管理", description = "系统用户管理相关接口")
@RestController
@RequestMapping("/api/system/user")
public class SysUserController {

    @Autowired
    private SysUserService sysUserService;

    @Operation(summary = "获取用户列表", description = "分页查询系统用户列表，支持按条件筛选")
    @GetMapping("/list")
    public Result<IPage<SysUser>> list(UserQueryVO queryVO) {
        IPage<SysUser> page = sysUserService.page(queryVO);
        return Result.ok(page);
    }

    @Operation(summary = "获取用户信息", description = "根据用户ID获取用户详细信息")
    @GetMapping("/{id}")
    public Result<SysUser> get(@PathVariable Long id) {
        SysUser user = sysUserService.getById(id);
        if (user == null) {
            return Result.failed(ResultCode.USER_NOT_EXIST);
        }
        return Result.ok(user);
    }

    @Operation(summary = "创建用户", description = "创建新的系统用户，需要验证用户名、手机号、邮箱的唯一性")
    @PostMapping
    public Result<Boolean> create(@RequestBody SysUser user) {
        // 验证用户名唯一性
        if (!sysUserService.checkUsernameUnique(user.getUsername(), null)) {
            return Result.failed("用户名已存在");
        }
        
        // 验证手机号唯一性
        if (StringUtils.isNotBlank(user.getPhone()) && !sysUserService.checkPhoneUnique(user.getPhone(), null)) {
            return Result.failed("手机号已存在");
        }
        
        // 验证邮箱唯一性
        if (StringUtils.isNotBlank(user.getEmail()) && !sysUserService.checkEmailUnique(user.getEmail(), null)) {
            return Result.failed("邮箱已存在");
        }
        
        boolean success = sysUserService.create(user);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "更新用户", description = "更新用户信息，需要验证用户名、手机号、邮箱的唯一性")
    @PutMapping
    public Result<Boolean> update(@RequestBody SysUser user) {
        // 验证用户名唯一性
        if (!sysUserService.checkUsernameUnique(user.getUsername(), user.getId())) {
            return Result.failed("用户名已存在");
        }
        
        // 验证手机号唯一性
        if (StringUtils.isNotBlank(user.getPhone()) && !sysUserService.checkPhoneUnique(user.getPhone(), user.getId())) {
            return Result.failed("手机号已存在");
        }
        
        // 验证邮箱唯一性
        if (StringUtils.isNotBlank(user.getEmail()) && !sysUserService.checkEmailUnique(user.getEmail(), user.getId())) {
            return Result.failed("邮箱已存在");
        }
        
        boolean success = sysUserService.update(user);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "删除用户", description = "根据用户ID删除用户")
    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        boolean success = sysUserService.delete(id);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "批量删除用户", description = "批量删除多个用户")
    @DeleteMapping("/batch")
    public Result<Boolean> deleteBatch(@RequestBody List<Long> ids) {
        boolean success = sysUserService.deleteBatch(ids);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "更新用户状态", description = "启用或禁用用户账户")
    @PutMapping("/status")
    public Result<Boolean> updateStatus(@RequestParam Long id, @RequestParam Integer status) {
        boolean success = sysUserService.updateStatus(id, status);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "重置密码", description = "重置用户的登录密码")
    @PutMapping("/resetPassword")
    public Result<Boolean> resetPassword(@RequestParam Long id, @RequestParam String password) {
        boolean success = sysUserService.resetPassword(id, password);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "根据角色ID获取用户列表", description = "查询指定角色下的所有用户")
    @GetMapping("/listByRoleId")
    public Result<List<SysUser>> listByRoleId(@RequestParam Long roleId) {
        List<SysUser> users = sysUserService.listByRoleId(roleId);
        return Result.ok(users);
    }

    @Operation(summary = "根据部门ID获取用户列表", description = "查询指定部门下的所有用户")
    @GetMapping("/listByDeptId")
    public Result<List<SysUser>> listByDeptId(@RequestParam Long deptId) {
        List<SysUser> users = sysUserService.listByDeptId(deptId);
        return Result.ok(users);
    }

    @Operation(summary = "检查用户名唯一性", description = "验证用户名的唯一性，返回true表示可用")
    @GetMapping("/checkUsernameUnique")
    public Result<Boolean> checkUsernameUnique(@RequestParam String username, @RequestParam(required = false) Long id) {
        boolean unique = sysUserService.checkUsernameUnique(username, id);
        return Result.ok(unique);
    }

    @Operation(summary = "检查手机号唯一性", description = "验证手机号的唯一性，返回true表示可用")
    @GetMapping("/checkPhoneUnique")
    public Result<Boolean> checkPhoneUnique(@RequestParam String phone, @RequestParam(required = false) Long id) {
        boolean unique = sysUserService.checkPhoneUnique(phone, id);
        return Result.ok(unique);
    }

    @Operation(summary = "检查邮箱唯一性", description = "验证邮箱的唯一性，返回true表示可用")
    @GetMapping("/checkEmailUnique")
    public Result<Boolean> checkEmailUnique(@RequestParam String email, @RequestParam(required = false) Long id) {
        boolean unique = sysUserService.checkEmailUnique(email, id);
        return Result.ok(unique);
    }
}
