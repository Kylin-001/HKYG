package com.heikeji.admin.controller;

import com.heikeji.admin.common.R;
import com.heikeji.admin.entity.Role;
import com.heikeji.admin.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 角色管理控制器
 */
@Tag(name = "角色管理")
@RestController
@RequestMapping("/api/role")
public class RoleController {

    @Autowired
    private RoleService roleService;

    /**
     * 分页查询角色列表
     */
    @Operation(summary = "分页查询角色列表")
    @GetMapping("/list")
    public R list(@Parameter(description = "查询参数") @RequestParam Map<String, Object> params) {
        Map<String, Object> result = roleService.pageRole(params);
        return R.ok().data(result);
    }

    /**
     * 获取所有角色
     */
    @Operation(summary = "获取所有角色")
    @GetMapping("/all")
    public R all() {
        List<Role> roles = roleService.getAllRoles();
        return R.ok().data(roles);
    }

    /**
     * 根据ID获取角色详情
     */
    @Operation(summary = "根据ID获取角色详情")
    @GetMapping("/{id}")
    public R getById(@Parameter(description = "角色ID") @PathVariable("id") Long id) {
        Role role = roleService.getRoleById(id);
        if (role == null) {
            return R.error(404, "角色不存在");
        }
        return R.ok().data(role);
    }

    /**
     * 添加角色
     */
    @Operation(summary = "添加角色")
    @PostMapping("/")
    public R add(@Parameter(description = "角色信息") @RequestBody Role role) {
        try {
            boolean success = roleService.addRole(role);
            if (success) {
                return R.ok("添加角色成功");
            } else {
                return R.error(500, "添加角色失败");
            }
        } catch (RuntimeException e) {
            return R.error(400, e.getMessage());
        }
    }

    /**
     * 修改角色
     */
    @Operation(summary = "修改角色")
    @PutMapping("/{id}")
    public R update(@Parameter(description = "角色ID") @PathVariable("id") Long id,
                    @Parameter(description = "角色信息") @RequestBody Role role) {
        try {
            role.setId(id);
            boolean success = roleService.updateRole(role);
            if (success) {
                return R.ok("修改角色成功");
            } else {
                return R.error(500, "修改角色失败");
            }
        } catch (RuntimeException e) {
            return R.error(400, e.getMessage());
        }
    }

    /**
     * 删除角色
     */
    @Operation(summary = "删除角色")
    @DeleteMapping("/{id}")
    public R delete(@Parameter(description = "角色ID") @PathVariable("id") Long id) {
        try {
            boolean success = roleService.deleteRole(id);
            if (success) {
                return R.ok("删除角色成功");
            } else {
                return R.error(500, "删除角色失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "删除角色失败");
        }
    }

    /**
     * 批量删除角色
     */
    @Operation(summary = "批量删除角色")
    @DeleteMapping("/batch")
    public R batchDelete(@Parameter(description = "角色ID列表") @RequestBody List<Long> ids) {
        try {
            if (ids == null || ids.isEmpty()) {
                return R.error(400, "请选择要删除的角色");
            }
            boolean success = roleService.batchDeleteRole(ids);
            if (success) {
                return R.ok("批量删除角色成功");
            } else {
                return R.error(500, "批量删除角色失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "批量删除角色失败");
        }
    }

    /**
     * 更新角色状态
     */
    @Operation(summary = "更新角色状态")
    @PutMapping("/{id}/status")
    public R updateStatus(@Parameter(description = "角色ID") @PathVariable("id") Long id,
                          @Parameter(description = "状态 0禁用 1启用") @RequestParam Integer status) {
        try {
            boolean success = roleService.updateRoleStatus(id, status);
            if (success) {
                return R.ok("修改角色状态成功");
            } else {
                return R.error(500, "修改角色状态失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "修改角色状态失败");
        }
    }

    /**
     * 分配角色菜单权限
     */
    @Operation(summary = "分配角色菜单权限")
    @PutMapping("/{id}/menus")
    public R assignMenus(@Parameter(description = "角色ID") @PathVariable("id") Long id,
                         @Parameter(description = "菜单ID列表") @RequestBody List<Long> menuIds) {
        try {
            boolean success = roleService.assignRoleMenus(id, menuIds);
            if (success) {
                return R.ok("分配权限成功");
            } else {
                return R.error(500, "分配权限失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "分配权限失败");
        }
    }
}
