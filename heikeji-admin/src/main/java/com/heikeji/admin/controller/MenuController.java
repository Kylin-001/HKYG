package com.heikeji.admin.controller;

import com.heikeji.admin.common.R;
import com.heikeji.admin.entity.Menu;
import com.heikeji.admin.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 菜单管理控制器
 */
@Tag(name = "菜单管理")
@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuService menuService;

    /**
     * 获取菜单树形结构
     */
    @Operation(summary = "获取菜单树形结构")
    @GetMapping("/tree")
    public R tree() {
        List<Menu> menus = menuService.getMenuTree();
        return R.ok().data(menus);
    }

    /**
     * 获取所有菜单列表
     */
    @Operation(summary = "获取所有菜单列表")
    @GetMapping("/list")
    public R list() {
        List<Menu> menus = menuService.getAllMenus();
        return R.ok().data(menus);
    }

    /**
     * 根据ID获取菜单详情
     */
    @Operation(summary = "根据ID获取菜单详情")
    @GetMapping("/{id}")
    public R getById(@Parameter(description = "菜单ID") @PathVariable("id") Long id) {
        Menu menu = menuService.getMenuById(id);
        if (menu == null) {
            return R.error(404, "菜单不存在");
        }
        return R.ok().data(menu);
    }

    /**
     * 添加菜单
     */
    @Operation(summary = "添加菜单")
    @PostMapping("/")
    public R add(@Parameter(description = "菜单信息") @RequestBody Menu menu) {
        try {
            boolean success = menuService.addMenu(menu);
            if (success) {
                return R.ok("添加菜单成功");
            } else {
                return R.error(500, "添加菜单失败");
            }
        } catch (RuntimeException e) {
            return R.error(400, e.getMessage());
        }
    }

    /**
     * 修改菜单
     */
    @Operation(summary = "修改菜单")
    @PutMapping("/{id}")
    public R update(@Parameter(description = "菜单ID") @PathVariable("id") Long id,
                    @Parameter(description = "菜单信息") @RequestBody Menu menu) {
        try {
            menu.setId(id);
            boolean success = menuService.updateMenu(menu);
            if (success) {
                return R.ok("修改菜单成功");
            } else {
                return R.error(500, "修改菜单失败");
            }
        } catch (RuntimeException e) {
            return R.error(400, e.getMessage());
        }
    }

    /**
     * 删除菜单
     */
    @Operation(summary = "删除菜单")
    @DeleteMapping("/{id}")
    public R delete(@Parameter(description = "菜单ID") @PathVariable("id") Long id) {
        try {
            boolean success = menuService.deleteMenu(id);
            if (success) {
                return R.ok("删除菜单成功");
            } else {
                return R.error(500, "删除菜单失败");
            }
        } catch (RuntimeException e) {
            return R.error(400, e.getMessage());
        }
    }

    /**
     * 更新菜单状态
     */
    @Operation(summary = "更新菜单状态")
    @PutMapping("/{id}/status")
    public R updateStatus(@Parameter(description = "菜单ID") @PathVariable("id") Long id,
                          @Parameter(description = "状态 0禁用 1启用") @RequestParam Integer status) {
        try {
            boolean success = menuService.updateMenuStatus(id, status);
            if (success) {
                return R.ok("修改菜单状态成功");
            } else {
                return R.error(500, "修改菜单状态失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "修改菜单状态失败");
        }
    }

    /**
     * 根据角色ID获取菜单列表
     */
    @Operation(summary = "根据角色ID获取菜单列表")
    @GetMapping("/role/{roleId}")
    public R getMenusByRoleId(@Parameter(description = "角色ID") @PathVariable("roleId") Long roleId) {
        List<Menu> menus = menuService.getMenusByRoleId(roleId);
        return R.ok().data(menus);
    }
}
