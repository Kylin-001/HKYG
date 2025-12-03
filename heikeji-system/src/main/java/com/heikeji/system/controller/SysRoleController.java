package com.heikeji.system.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.heikeji.common.api.Result;
import com.heikeji.common.api.ResultCode;
import com.heikeji.system.entity.SysRole;
import com.heikeji.system.service.SysRoleService;
import com.heikeji.system.vo.RoleQueryVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 系统角色控制器
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Tag(name = "系统角色管理", description = "系统角色管理相关接口")
@RestController
@RequestMapping("/api/system/role")
public class SysRoleController {

    @Autowired
    private SysRoleService sysRoleService;

    @Operation(summary = "获取角色列表", description = "获取系统角色列表，支持分页查询")
    @GetMapping("/list")
    public Result<IPage<SysRole>> list(RoleQueryVO queryVO) {
        IPage<SysRole> page = sysRoleService.page(queryVO);
        return Result.ok(page);
    }

    @Operation(summary = "获取所有启用的角色列表", description = "获取所有启用状态的系统角色列表")
    @GetMapping("/listAllEnabled")
    public Result<List<SysRole>> listAllEnabled() {
        List<SysRole> roles = sysRoleService.listAllEnabled();
        return Result.ok(roles);
    }

    @Operation(summary = "获取角色信息", description = "根据角色ID获取角色详细信息")
    @GetMapping("/{id}")
    public Result<SysRole> get(@PathVariable Long id) {
        SysRole role = sysRoleService.getById(id);
        if (role == null) {
            return Result.failed(ResultCode.ROLE_NOT_EXIST);
        }
        return Result.ok(role);
    }

    @Operation(summary = "创建角色", description = "创建新的系统角色，包含名称和编码的唯一性验证")
    @PostMapping
    public Result<Boolean> create(@RequestBody SysRole role) {
        // 验证角色名称唯一性
        if (!sysRoleService.checkRoleNameUnique(role.getRoleName(), null)) {
            return Result.failed("角色名称已存在");
        }
        
        // 验证角色编码唯一性
        if (!sysRoleService.checkRoleCodeUnique(role.getRoleCode(), null)) {
            return Result.failed("角色编码已存在");
        }
        
        boolean success = sysRoleService.create(role);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "更新角色", description = "更新现有系统角色信息，包含名称和编码的唯一性验证")
    @PutMapping
    public Result<Boolean> update(@RequestBody SysRole role) {
        // 验证角色名称唯一性
        if (!sysRoleService.checkRoleNameUnique(role.getRoleName(), role.getId())) {
            return Result.failed("角色名称已存在");
        }
        
        // 验证角色编码唯一性
        if (!sysRoleService.checkRoleCodeUnique(role.getRoleCode(), role.getId())) {
            return Result.failed("角色编码已存在");
        }
        
        boolean success = sysRoleService.update(role);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "删除角色", description = "根据角色ID删除指定角色")
    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        boolean success = sysRoleService.delete(id);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "批量删除角色", description = "批量删除多个指定角色")
    @DeleteMapping("/batch")
    public Result<Boolean> deleteBatch(@RequestBody List<Long> ids) {
        boolean success = sysRoleService.deleteBatch(ids);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "更新角色状态", description = "启用或禁用指定角色")
    @PutMapping("/status")
    public Result<Boolean> updateStatus(@RequestParam Long id, @RequestParam Integer status) {
        boolean success = sysRoleService.updateStatus(id, status);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "根据用户ID获取角色列表", description = "获取指定用户拥有的所有角色")
    @GetMapping("/listByUserId")
    public Result<List<SysRole>> listByUserId(@RequestParam Long userId) {
        List<SysRole> roles = sysRoleService.listByUserId(userId);
        return Result.ok(roles);
    }

    @Operation(summary = "分配权限给角色", description = "为指定角色分配多个权限")
    @PutMapping("/assignPermissions")
    public Result<Boolean> assignPermissions(@RequestParam Long roleId, @RequestBody List<Long> permissionIds) {
        boolean success = sysRoleService.assignPermissions(roleId, permissionIds);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "分配角色给用户", description = "为指定用户分配多个角色")
    @PutMapping("/assignRoles")
    public Result<Boolean> assignRoles(@RequestParam Long userId, @RequestBody List<Long> roleIds) {
        boolean success = sysRoleService.assignRoles(userId, roleIds);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "获取角色拥有的权限ID列表", description = "获取指定角色分配的所有权限ID")
    @GetMapping("/getPermissionIds/{roleId}")
    public Result<List<Long>> getPermissionIds(@PathVariable Long roleId) {
        List<Long> permissionIds = sysRoleService.getPermissionIdsByRoleId(roleId);
        return Result.ok(permissionIds);
    }

    @Operation(summary = "获取用户拥有的角色ID列表", description = "获取指定用户拥有的所有角色ID")
    @GetMapping("/getRoleIds/{userId}")
    public Result<List<Long>> getRoleIds(@PathVariable Long userId) {
        List<Long> roleIds = sysRoleService.getRoleIdsByUserId(userId);
        return Result.ok(roleIds);
    }

    @Operation(summary = "检查角色名称唯一性", description = "验证角色名称在系统中是否唯一")
    @GetMapping("/checkRoleNameUnique")
    public Result<Boolean> checkRoleNameUnique(@RequestParam String roleName, @RequestParam(required = false) Long id) {
        boolean unique = sysRoleService.checkRoleNameUnique(roleName, id);
        return Result.ok(unique);
    }

    @Operation(summary = "检查角色编码唯一性", description = "验证角色编码在系统中是否唯一")
    @GetMapping("/checkRoleCodeUnique")
    public Result<Boolean> checkRoleCodeUnique(@RequestParam String roleCode, @RequestParam(required = false) Long id) {
        boolean unique = sysRoleService.checkRoleCodeUnique(roleCode, id);
        return Result.ok(unique);
    }
}
