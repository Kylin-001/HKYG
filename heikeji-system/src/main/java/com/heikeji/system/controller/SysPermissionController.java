package com.heikeji.system.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.heikeji.common.api.Result;
import com.heikeji.common.api.ResultCode;
import com.heikeji.system.entity.SysPermission;
import com.heikeji.system.service.SysPermissionService;
import com.heikeji.system.vo.PermissionQueryVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 系统权限控制器
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Tag(name = "系统权限管理", description = "系统权限管理相关接口")
@RestController
@RequestMapping("/api/system/permission")
public class SysPermissionController {

    @Autowired
    private SysPermissionService sysPermissionService;

    @Operation(summary = "获取权限列表", description = "获取权限分页列表")
    @GetMapping("/list")
    public Result<IPage<SysPermission>> list(PermissionQueryVO queryVO) {
        IPage<SysPermission> page = sysPermissionService.page(queryVO);
        return Result.ok(page);
    }

    @Operation(summary = "获取所有菜单列表", description = "获取所有权限菜单列表")
    @GetMapping("/listAllMenus")
    public Result<List<SysPermission>> listAllMenus() {
        List<SysPermission> menus = sysPermissionService.listAllMenus();
        return Result.ok(menus);
    }

    @Operation(summary = "获取权限信息", description = "根据ID获取权限详细信息")
    @GetMapping("/{id}")
    public Result<SysPermission> get(@PathVariable Long id) {
        SysPermission permission = sysPermissionService.getById(id);
        if (permission == null) {
            return Result.failed(ResultCode.PERMISSION_NOT_EXIST);
        }
        return Result.ok(permission);
    }

    @Operation(summary = "创建权限", description = "创建新的权限记录")
    @PostMapping
    public Result<Boolean> create(@RequestBody SysPermission permission) {
        // 验证权限编码唯一性
        if (!sysPermissionService.checkCodeUnique(permission.getCode(), null)) {
            return Result.failed("权限编码已存在");
        }
        
        boolean success = sysPermissionService.create(permission);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "更新权限", description = "更新权限信息")
    @PutMapping
    public Result<Boolean> update(@RequestBody SysPermission permission) {
        // 验证权限编码唯一性
        if (!sysPermissionService.checkCodeUnique(permission.getCode(), permission.getId())) {
            return Result.failed("权限编码已存在");
        }
        
        boolean success = sysPermissionService.update(permission);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "删除权限", description = "删除权限记录")
    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        boolean success = sysPermissionService.delete(id);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "批量删除权限", description = "批量删除权限记录")
    @DeleteMapping("/batch")
    public Result<Boolean> deleteBatch(@RequestBody List<Long> ids) {
        boolean success = sysPermissionService.deleteBatch(ids);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "更新权限状态", description = "启用或禁用权限")
    @PutMapping("/status")
    public Result<Boolean> updateStatus(@RequestParam Long id, @RequestParam Integer status) {
        boolean success = sysPermissionService.updateStatus(id, status);
        return success ? Result.ok() : Result.failed();
    }

    @Operation(summary = "根据角色ID获取权限列表", description = "获取指定角色的权限列表")
    @GetMapping("/listByRoleId")
    public Result<List<SysPermission>> listByRoleId(@RequestParam Long roleId) {
        List<SysPermission> permissions = sysPermissionService.listByRoleId(roleId);
        return Result.ok(permissions);
    }

    @Operation(summary = "根据用户ID获取权限列表", description = "获取指定用户的权限列表")
    @GetMapping("/listByUserId")
    public Result<List<SysPermission>> listByUserId(@RequestParam Long userId) {
        List<SysPermission> permissions = sysPermissionService.listByUserId(userId);
        return Result.ok(permissions);
    }

    @Operation(summary = "根据父权限ID获取子权限列表", description = "获取指定父权限的子权限列表")
    @GetMapping("/listByParentId")
    public Result<List<SysPermission>> listByParentId(@RequestParam Long parentId) {
        List<SysPermission> permissions = sysPermissionService.listByParentId(parentId);
        return Result.ok(permissions);
    }

    @Operation(summary = "获取菜单树", description = "获取完整的权限菜单树结构")
    @GetMapping("/menuTree")
    public Result<List<SysPermission>> getMenuTree() {
        List<SysPermission> menus = sysPermissionService.listAllMenus();
        List<SysPermission> menuTree = sysPermissionService.buildMenuTree(menus);
        return Result.ok(menuTree);
    }

    @Operation(summary = "根据用户ID获取菜单树", description = "获取指定用户的菜单树结构")
    @GetMapping("/menuTreeByUserId")
    public Result<List<SysPermission>> getMenuTreeByUserId(@RequestParam Long userId) {
        List<SysPermission> menus = sysPermissionService.getMenusByUserId(userId);
        List<SysPermission> menuTree = sysPermissionService.buildMenuTree(menus);
        return Result.ok(menuTree);
    }

    @Operation(summary = "校验权限编码唯一性", description = "检查权限编码是否已存在")
    @GetMapping("/checkCodeUnique")
    public Result<Boolean> checkCodeUnique(@RequestParam String permissionCode, @RequestParam(required = false) Long id) {
        boolean unique = sysPermissionService.checkCodeUnique(permissionCode, id);
        return Result.ok(unique);
    }
}
