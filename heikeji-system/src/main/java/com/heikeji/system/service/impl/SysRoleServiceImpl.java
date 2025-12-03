package com.heikeji.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.system.entity.SysRole;
import com.heikeji.system.entity.SysUserRole;
import com.heikeji.system.entity.SysRolePermission;
import com.heikeji.system.mapper.SysRoleMapper;
import com.heikeji.system.mapper.SysUserRoleMapper;
import com.heikeji.system.mapper.SysRolePermissionMapper;
import com.heikeji.system.service.SysRoleService;
import com.heikeji.system.vo.RoleQueryVO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 系统角色服务实现类
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
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
    public SysRole getByCode(String roleCode) {
        return sysRoleMapper.selectByCode(roleCode);
    }

    @Override
    public IPage<SysRole> page(RoleQueryVO queryVO) {
        Page<SysRole> page = new Page<>(queryVO.getPageNum(), queryVO.getPageSize());
        SysRole role = new SysRole();
        if (StringUtils.isNotBlank(queryVO.getRoleName())) {
            role.setRoleName(queryVO.getRoleName());
        }
        if (StringUtils.isNotBlank(queryVO.getRoleCode())) {
            role.setRoleCode(queryVO.getRoleCode());
        }
        if (queryVO.getStatus() != null) {
            role.setStatus(queryVO.getStatus());
        }
        return sysRoleMapper.selectPage(page, role);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean create(SysRole role) {
        return this.save(role);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean update(SysRole role) {
        return this.updateById(role);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean delete(Long id) {
        // 删除角色权限关联
        sysRolePermissionMapper.deleteByRoleId(id);
        // 删除用户角色关联
        sysUserRoleMapper.deleteByRoleId(id);
        return this.removeById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteBatch(List<Long> ids) {
        // 批量删除角色权限关联
        for (Long id : ids) {
            sysRolePermissionMapper.deleteByRoleId(id);
            sysUserRoleMapper.deleteByRoleId(id);
        }
        return this.removeByIds(ids);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateStatus(Long id, Integer status) {
        SysRole role = new SysRole();
        role.setId(id);
        role.setStatus(status);
        return this.updateById(role);
    }

    @Override
    public List<SysRole> listByUserId(Long userId) {
        return sysRoleMapper.selectByUserId(userId);
    }

    @Override
    public List<SysRole> listAllEnabled() {
        return sysRoleMapper.selectAllEnabled();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean assignPermissions(Long roleId, List<Long> permissionIds) {
        // 先删除原有的权限关联
        sysRolePermissionMapper.deleteByRoleId(roleId);
        
        // 批量插入新的权限关联
        if (permissionIds != null && !permissionIds.isEmpty()) {
            List<SysRolePermission> rolePermissions = new ArrayList<>();
            for (Long permissionId : permissionIds) {
                SysRolePermission rolePermission = new SysRolePermission();
                rolePermission.setRoleId(roleId);
                rolePermission.setPermissionId(permissionId);
                rolePermissions.add(rolePermission);
            }
            sysRolePermissionMapper.insertBatch(rolePermissions);
        }
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean assignRoles(Long userId, List<Long> roleIds) {
        // 先删除原有的角色关联
        sysUserRoleMapper.deleteByUserId(userId);
        
        // 批量插入新的角色关联
        if (roleIds != null && !roleIds.isEmpty()) {
            List<SysUserRole> userRoles = new ArrayList<>();
            for (Long roleId : roleIds) {
                SysUserRole userRole = new SysUserRole();
                userRole.setUserId(userId);
                userRole.setRoleId(roleId);
                userRoles.add(userRole);
            }
            sysUserRoleMapper.insertBatch(userRoles);
        }
        return true;
    }

    @Override
    public List<Long> getPermissionIdsByRoleId(Long roleId) {
        return sysRolePermissionMapper.selectPermissionIdsByRoleId(roleId);
    }

    @Override
    public List<Long> getRoleIdsByUserId(Long userId) {
        return sysUserRoleMapper.selectRoleIdsByUserId(userId);
    }

    @Override
    public boolean checkRoleNameUnique(String roleName, Long id) {
        return sysRoleMapper.checkRoleNameUnique(roleName, id) == 0;
    }

    @Override
    public boolean checkRoleCodeUnique(String roleCode, Long id) {
        return sysRoleMapper.checkRoleCodeUnique(roleCode, id) == 0;
    }
}
