package com.heikeji.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heikeji.admin.entity.Menu;
import com.heikeji.admin.mapper.MenuMapper;
import com.heikeji.admin.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 菜单Service实现类
 */
@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private MenuMapper menuMapper;

    @Override
    public List<Menu> getMenuTree() {
        List<Menu> allMenus = menuMapper.selectAllEnabledMenus();
        return buildMenuTree(allMenus, 0L);
    }

    @Override
    public List<Menu> getAllMenus() {
        LambdaQueryWrapper<Menu> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Menu::getSort);
        return menuMapper.selectList(wrapper);
    }

    @Override
    public Menu getMenuById(Long id) {
        return menuMapper.selectById(id);
    }

    @Override
    public boolean addMenu(Menu menu) {
        return menuMapper.insert(menu) > 0;
    }

    @Override
    public boolean updateMenu(Menu menu) {
        return menuMapper.updateById(menu) > 0;
    }

    @Override
    public boolean deleteMenu(Long id) {
        // 检查是否有子菜单
        List<Menu> children = menuMapper.selectChildrenByParentId(id);
        if (!CollectionUtils.isEmpty(children)) {
            throw new RuntimeException("该菜单存在子菜单，无法删除");
        }
        return menuMapper.deleteById(id) > 0;
    }

    @Override
    public boolean updateMenuStatus(Long id, Integer status) {
        Menu menu = new Menu();
        menu.setId(id);
        menu.setStatus(status);
        return menuMapper.updateById(menu) > 0;
    }

    @Override
    public List<Menu> getMenusByRoleId(Long roleId) {
        return menuMapper.selectMenusByRoleId(roleId);
    }

    @Override
    public List<Menu> getMenuTreeByRoleIds(String roleIds) {
        if (!org.springframework.util.StringUtils.hasText(roleIds)) {
            return new ArrayList<>();
        }
        List<Menu> menus = menuMapper.selectMenusByRoleIds(roleIds);
        return buildMenuTree(menus, 0L);
    }

    @Override
    public List<Menu> getCurrentUserMenuTree(Long userId) {
        // 这里简化处理，实际应该根据用户角色查询
        // 先返回所有菜单
        return getMenuTree();
    }

    /**
     * 构建菜单树
     */
    private List<Menu> buildMenuTree(List<Menu> menus, Long parentId) {
        List<Menu> tree = new ArrayList<>();
        for (Menu menu : menus) {
            if (parentId.equals(menu.getParentId())) {
                menu.setChildren(buildMenuTree(menus, menu.getId()));
                tree.add(menu);
            }
        }
        tree.sort(Comparator.comparingInt(Menu::getSort));
        return tree;
    }
}
