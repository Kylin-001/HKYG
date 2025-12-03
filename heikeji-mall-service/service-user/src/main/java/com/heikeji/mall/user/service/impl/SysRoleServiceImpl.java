package com.heikeji.mall.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.user.entity.SysRole;
import com.heikeji.mall.user.entity.SysUserRole;
import com.heikeji.mall.user.entity.SysRolePermission;
import com.heikeji.mall.user.mapper.SysRoleMapper;
import com.heikeji.mall.user.mapper.SysRolePermissionMapper;
import com.heikeji.mall.user.mapper.SysUserRoleMapper;
import com.heikeji.mall.user.service.SysRoleService;
import com.heikeji.mall.user.vo.PageData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 系统角色服务实现类
 * 用于处理角色相关的业务逻辑
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Service
public class SysRoleServiceImpl extends ServiceImpl<SysRoleMapper, SysRole> implements SysRoleService {

    @Autowired
    private SysRoleMapper sysRoleMapper;

    @Autowired
    private SysUserRoleMapper sysUserRoleMapper;
    
    @Autowired
    private SysRolePermissionMapper sysRolePermissionMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean add(SysRole sysRole) {
        // 检查角色名称和编码是否已存在
        if (checkRoleNameExist(sysRole.getRoleName(), null)) {
            throw new IllegalArgumentException("角色名称已存在");
        }
        if (checkRoleCodeExist(sysRole.getRoleCode(), null)) {
            throw new IllegalArgumentException("角色编码已存在");
        }
        return save(sysRole);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean update(SysRole sysRole) {
        // 检查角色名称和编码是否已存在
        if (checkRoleNameExist(sysRole.getRoleName(), sysRole.getId())) {
            throw new IllegalArgumentException("角色名称已存在");
        }
        if (checkRoleCodeExist(sysRole.getRoleCode(), sysRole.getId())) {
            throw new IllegalArgumentException("角色编码已存在");
        }
        return updateById(sysRole);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean delete(Long id) {
        // 检查角色是否有用户使用
        if (countUsersByRoleId(id) > 0) {
            throw new IllegalArgumentException("该角色已有用户使用，不能删除");
        }
        return removeById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteBatch(List<Long> ids) {
        // 检查每个角色是否有用户使用
        for (Long id : ids) {
            if (countUsersByRoleId(id) > 0) {
                SysRole role = getById(id);
                throw new IllegalArgumentException("角色\"" + role.getRoleName() + "\"已有用户使用，不能删除");
            }
        }
        return removeByIds(ids);
    }

    @Override
    public SysRole getById(Long id) {
        return sysRoleMapper.selectById(id);
    }

    @Override
    public List<SysRole> list(SysRole sysRole) {
        QueryWrapper<SysRole> queryWrapper = new QueryWrapper<>(sysRole);
        return sysRoleMapper.selectList(queryWrapper);
    }

    @Override
    public PageData<SysRole> page(Integer pageNum, Integer pageSize, SysRole sysRole) {
        IPage<SysRole> page = new Page<>(pageNum, pageSize);
        QueryWrapper<SysRole> queryWrapper = new QueryWrapper<>(sysRole);
        IPage<SysRole> result = sysRoleMapper.selectPage(page, queryWrapper);
        return new PageData<>(result.getRecords(), result.getTotal(), result.getSize(), result.getCurrent(), result.getPages());
    }

    @Override
    public List<SysRole> listAll() {
        return sysRoleMapper.selectList(null);
    }

    @Override
    public List<SysRole> listByUserId(Long userId) {
        return sysRoleMapper.selectRolesByUserId(userId);
    }

    @Override
    public boolean checkRoleNameExist(String roleName, Long id) {
        QueryWrapper<SysRole> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("role_name", roleName);
        if (id != null) {
            queryWrapper.ne("id", id);
        }
        return sysRoleMapper.selectCount(queryWrapper) > 0;
    }

    @Override
    public boolean checkRoleCodeExist(String roleCode, Long id) {
        QueryWrapper<SysRole> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("role_code", roleCode);
        if (id != null) {
            queryWrapper.ne("id", id);
        }
        return sysRoleMapper.selectCount(queryWrapper) > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean assignPermissions(Long roleId, List<Long> permissionIds) {
        // 先删除原有权限
        QueryWrapper<SysRolePermission> deleteWrapper = new QueryWrapper<>();
        deleteWrapper.eq("role_id", roleId);
        sysRolePermissionMapper.delete(deleteWrapper);
        // 再添加新权限
        if (permissionIds != null && !permissionIds.isEmpty()) {
            for (Long permissionId : permissionIds) {
                SysRolePermission rolePermission = new SysRolePermission();
                rolePermission.setRoleId(roleId);
                rolePermission.setPermissionId(permissionId);
                sysRolePermissionMapper.insert(rolePermission);
            }
        }
        return true;
    }

    @Override
    public List<Long> listPermissionIdsByRoleId(Long roleId) {
        QueryWrapper<SysRolePermission> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("role_id", roleId);
        return sysRolePermissionMapper.selectList(queryWrapper)
                .stream()
                .map(SysRolePermission::getPermissionId)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean assignRoles(Long userId, List<Long> roleIds) {
        // 先删除原有角色
        QueryWrapper<SysUserRole> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        sysUserRoleMapper.delete(queryWrapper);
        // 再添加新角色
        if (roleIds != null && !roleIds.isEmpty()) {
            for (Long roleId : roleIds) {
                SysUserRole userRole = new SysUserRole();
                userRole.setUserId(userId);
                userRole.setRoleId(roleId);
                sysUserRoleMapper.insert(userRole);
            }
        }
        return true;
    }

    @Override
    public List<Long> listRoleIdsByUserId(Long userId) {
        QueryWrapper<SysUserRole> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        List<SysUserRole> userRoles = sysUserRoleMapper.selectList(queryWrapper);
        return userRoles.stream().map(SysUserRole::getRoleId).collect(Collectors.toList());
    }

    @Override
    public int countUsersByRoleId(Long roleId) {
        QueryWrapper<SysUserRole> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("role_id", roleId);
        return Math.toIntExact(sysUserRoleMapper.selectCount(queryWrapper));
    }
}
