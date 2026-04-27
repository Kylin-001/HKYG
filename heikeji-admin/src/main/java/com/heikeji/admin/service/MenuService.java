package com.heikeji.admin.service;

import com.heikeji.admin.entity.Menu;

import java.util.List;
import java.util.Map;

/**
 * 菜单Service接口
 */
public interface MenuService {

    /**
     * 获取菜单树形结构
     */
    List<Menu> getMenuTree();

    /**
     * 获取所有菜单列表
     */
    List<Menu> getAllMenus();

    /**
     * 根据ID获取菜单
     */
    Menu getMenuById(Long id);

    /**
     * 添加菜单
     */
    boolean addMenu(Menu menu);

    /**
     * 修改菜单
     */
    boolean updateMenu(Menu menu);

    /**
     * 删除菜单
     */
    boolean deleteMenu(Long id);

    /**
     * 更新菜单状态
     */
    boolean updateMenuStatus(Long id, Integer status);

    /**
     * 根据角色ID获取菜单列表
     */
    List<Menu> getMenusByRoleId(Long roleId);

    /**
     * 根据角色ID列表获取菜单树
     */
    List<Menu> getMenuTreeByRoleIds(String roleIds);

    /**
     * 获取当前登录用户的菜单树
     */
    List<Menu> getCurrentUserMenuTree(Long userId);
}
