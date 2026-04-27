package com.heikeji.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.admin.entity.Role;
import com.heikeji.admin.entity.RoleMenu;
import com.heikeji.admin.mapper.RoleMapper;
import com.heikeji.admin.mapper.RoleMenuMapper;
import com.heikeji.admin.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 角色Service实现类
 */
@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleMapper roleMapper;

    @Autowired
    private RoleMenuMapper roleMenuMapper;

    @Override
    public Map<String, Object> pageRole(Map<String, Object> params) {
        Integer pageNo = params.get("page") != null ? Integer.parseInt(params.get("page").toString()) : 1;
        Integer pageSize = params.get("limit") != null ? Integer.parseInt(params.get("limit").toString()) : 10;
        String keyword = (String) params.get("keyword");

        IPage<Role> page = new Page<>(pageNo, pageSize);
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(keyword)) {
            wrapper.like(Role::getRoleName, keyword)
                   .or()
                   .like(Role::getRoleCode, keyword);
        }

        wrapper.orderByAsc(Role::getSort);
        roleMapper.selectPage(page, wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", page.getRecords());
        result.put("total", page.getTotal());
        result.put("pages", page.getPages());
        result.put("page", pageNo);
        result.put("limit", pageSize);

        return result;
    }

    @Override
    public List<Role> getAllRoles() {
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Role::getStatus, 1);
        wrapper.orderByAsc(Role::getSort);
        return roleMapper.selectList(wrapper);
    }

    @Override
    public Role getRoleById(Long id) {
        return roleMapper.selectById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean addRole(Role role) {
        // 检查角色编码是否已存在
        Role existRole = roleMapper.selectByRoleCode(role.getRoleCode());
        if (existRole != null) {
            throw new RuntimeException("角色编码已存在");
        }

        int result = roleMapper.insert(role);

        // 分配菜单权限
        if (result > 0 && role.getMenuIds() != null && role.getMenuIds().length > 0) {
            assignRoleMenus(role.getId(), Arrays.asList(role.getMenuIds()));
        }

        return result > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateRole(Role role) {
        // 检查角色编码是否已被其他角色使用
        Role existRole = roleMapper.selectByRoleCode(role.getRoleCode());
        if (existRole != null && !existRole.getId().equals(role.getId())) {
            throw new RuntimeException("角色编码已存在");
        }

        int result = roleMapper.updateById(role);

        // 更新菜单权限
        if (result > 0 && role.getMenuIds() != null) {
            assignRoleMenus(role.getId(), Arrays.asList(role.getMenuIds()));
        }

        return result > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteRole(Long id) {
        // 删除角色菜单关联
        roleMenuMapper.deleteByRoleId(id);
        return roleMapper.deleteById(id) > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean batchDeleteRole(List<Long> ids) {
        for (Long id : ids) {
            roleMenuMapper.deleteByRoleId(id);
        }
        return roleMapper.deleteBatchIds(ids) > 0;
    }

    @Override
    public boolean updateRoleStatus(Long id, Integer status) {
        Role role = new Role();
        role.setId(id);
        role.setStatus(status);
        return roleMapper.updateById(role) > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean assignRoleMenus(Long roleId, List<Long> menuIds) {
        // 先删除原有权限
        roleMenuMapper.deleteByRoleId(roleId);

        // 插入新权限
        if (menuIds != null && !menuIds.isEmpty()) {
            return roleMenuMapper.batchInsert(roleId, menuIds) > 0;
        }
        return true;
    }

    @Override
    public List<Role> getRolesByUserId(Long userId) {
        return roleMapper.selectRolesByUserId(userId);
    }
}
