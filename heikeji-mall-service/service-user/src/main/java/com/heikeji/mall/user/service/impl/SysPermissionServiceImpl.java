package com.heikeji.mall.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.user.entity.SysPermission;
import com.heikeji.mall.user.mapper.SysPermissionMapper;
import com.heikeji.mall.user.service.SysPermissionService;
import com.heikeji.mall.user.vo.PageData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * 系统权限服务实现类
 * 处理系统权限相关的业务逻辑
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Service
public class SysPermissionServiceImpl extends ServiceImpl<SysPermissionMapper, SysPermission> implements SysPermissionService {

    @Autowired
    private SysPermissionMapper sysPermissionMapper;

    /**
     * 新增权限
     *
     * @param sysPermission 权限信息
     * @return 新增结果
     */
    public boolean add(SysPermission sysPermission) {
        return this.save(sysPermission);
    }

    /**
     * 更新权限
     *
     * @param sysPermission 权限信息
     * @return 更新结果
     */
    public boolean update(SysPermission sysPermission) {
        return this.updateById(sysPermission);
    }

    /**
     * 删除权限
     *
     * @param id 权限ID
     * @return 删除结果
     */
    public boolean delete(Long id) {
        return this.removeById(id);
    }

    /**
     * 批量删除权限
     *
     * @param ids 权限ID列表
     * @return 删除结果
     */
    public boolean deleteBatch(List<Long> ids) {
        if (CollectionUtils.isEmpty(ids)) {
            return false;
        }
        return this.removeByIds(ids);
    }

    /**
     * 根据ID查询权限
     *
     * @param id 权限ID
     * @return 权限信息
     */
    public SysPermission getById(Long id) {
        return super.getById(id);
    }

    /**
     * 查询权限列表
     *
     * @param sysPermission 权限信息
     * @return 权限列表
     */
    public List<SysPermission> listByCondition(SysPermission sysPermission) {
        QueryWrapper<SysPermission> queryWrapper = new QueryWrapper<>(sysPermission);
        return sysPermissionMapper.selectList(queryWrapper);
    }

    /**
     * 分页查询权限列表
     *
     * @param pageNum 页码
     * @param pageSize 每页条数
     * @param sysPermission 权限信息
     * @return 分页数据
     */
    public PageData<SysPermission> page(Integer pageNum, Integer pageSize, SysPermission sysPermission) {
        Page<SysPermission> page = new Page<>(pageNum, pageSize);
        QueryWrapper<SysPermission> queryWrapper = new QueryWrapper<>(sysPermission);
        page = sysPermissionMapper.selectPage(page, queryWrapper);
        return new PageData<>(page.getRecords(), page.getTotal(), page.getSize(), page.getCurrent(), page.getPages());
    }

    /**
     * 查询所有权限
     *
     * @return 权限列表
     */
    public List<SysPermission> listAll() {
        return sysPermissionMapper.selectList(null);
    }

    /**
     * 根据角色ID查询权限列表
     *
     * @param roleId 角色ID
     * @return 权限列表
     */
    public List<SysPermission> listByRoleId(Long roleId) {
        // TODO: 实现根据角色ID查询权限列表的逻辑
        return sysPermissionMapper.selectList(null);
    }
    
    /**
     * 根据角色ID获取权限列表（接口实现）
     *
     * @param roleId 角色ID
     * @return 权限列表
     */
    @Override
    public List<SysPermission> getPermissionsByRoleId(Long roleId) {
        return this.listByRoleId(roleId);
    }

    /**
     * 根据角色ID查询权限编码列表
     *
     * @param roleId 角色ID
     * @return 权限编码列表
     */
    public List<String> listPermissionCodesByRoleId(Long roleId) {
        // TODO: 实现根据角色ID查询权限编码列表的逻辑
        return null;
    }

    /**
     * 根据用户ID查询权限列表
     *
     * @param userId 用户ID
     * @return 权限列表
     */
    public List<SysPermission> listByUserId(Long userId) {
        // TODO: 实现根据用户ID查询权限列表的逻辑
        return this.listByCondition(null);
    }
    
    /**
     * 根据用户ID获取权限列表（接口实现）
     *
     * @param userId 用户ID
     * @return 权限列表
     */
    @Override
    public List<SysPermission> getPermissionsByUserId(Long userId) {
        return this.listByUserId(userId);
    }

    /**
     * 根据用户ID查询权限编码列表
     *
     * @param userId 用户ID
     * @return 权限编码列表
     */
    public List<String> listPermissionCodesByUserId(Long userId) {
        // TODO: 实现根据用户ID查询权限编码列表的逻辑
        return null;
    }

    /**
     * 检查权限编码是否已存在
     *
     * @param permissionCode 权限编码
     * @param id 权限ID（更新时使用，用于排除自身）
     * @return 是否存在
     */
    public boolean checkPermissionCodeExist(String permissionCode, Long id) {
        QueryWrapper<SysPermission> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("permission_code", permissionCode);
        if (id != null) {
            queryWrapper.ne("id", id);
        }
        return sysPermissionMapper.selectCount(queryWrapper) > 0;
    }

    /**
     * 检查权限名称是否已存在
     *
     * @param permissionName 权限名称
     * @param id 权限ID（更新时使用，用于排除自身）
     * @return 是否存在
     */
    public boolean checkPermissionNameExist(String permissionName, Long id) {
        QueryWrapper<SysPermission> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("permission_name", permissionName);
        if (id != null) {
            queryWrapper.ne("id", id);
        }
        return sysPermissionMapper.selectCount(queryWrapper) > 0;
    }

    /**
     * 分配角色权限
     *
     * @param roleId 角色ID
     * @param permissionIds 权限ID列表
     * @return 分配结果
     */
    public boolean assignPermissions(Long roleId, List<Long> permissionIds) {
        // TODO: 实现分配角色权限的逻辑
        // 注意：当前SysPermissionMapper中不存在deleteRolePermissions和batchInsertRolePermissions方法
        return false;
    }
    
    /**
     * 给角色分配权限（接口实现）
     *
     * @param roleId 角色ID
     * @param permissionIds 权限ID列表
     * @return 是否分配成功
     */
    @Override
    public boolean assignPermissionsToRole(Long roleId, List<Long> permissionIds) {
        return this.assignPermissions(roleId, permissionIds);
    }

    /**
     * 根据角色ID查询权限ID列表
     *
     * @param roleId 角色ID
     * @return 权限ID列表
     */
    public List<Long> listPermissionIdsByRoleId(Long roleId) {
        // TODO: 实现根据角色ID查询权限ID列表的逻辑
        return null;
    }

    /**
     * 查询权限树
     *
     * @return 权限树列表
     */
    public List<SysPermission> listPermissionTree() {
        // 查询所有权限
        List<SysPermission> permissionList = sysPermissionMapper.selectList(null);
        
        // 构建权限树
        List<SysPermission> permissionTree = new ArrayList<>();
        if (!CollectionUtils.isEmpty(permissionList)) {
            for (SysPermission permission : permissionList) {
                // 找到根节点（parent_id为0或null）
                if (permission.getParentId() == null || permission.getParentId() == 0L) {
                    permissionTree.add(findChildren(permission, permissionList));
                }
            }
        }
        return permissionTree;
    }
    
    /**
     * 获取权限树（接口实现）
     *
     * @return 权限树结构
     */
    @Override
    public List<SysPermission> getPermissionTree() {
        return this.listPermissionTree();
    }
    
    /**
     * 获取用户的权限树（接口实现）
     *
     * @param userId 用户ID
     * @return 用户的权限树结构
     */
    @Override
    public List<SysPermission> getUserPermissionTree(Long userId) {
        // TODO: 实现获取用户权限树的逻辑
        return this.getPermissionTree();
    }
    
    /**
     * 检查用户是否有指定权限（接口实现）
     *
     * @param userId 用户ID
     * @param permissionCode 权限编码
     * @return 是否有该权限
     */
    @Override
    public boolean checkPermission(Long userId, String permissionCode) {
        // TODO: 实现检查用户权限的逻辑
        return false;
    }
    
    /**
     * 根据权限编码获取权限信息（接口实现）
     *
     * @param permissionCode 权限编码
     * @return 权限信息
     */
    @Override
    public SysPermission getPermissionByCode(String permissionCode) {
        // TODO: 实现根据权限编码获取权限信息的逻辑
        return null;
    }

    /**
     * 递归查找子权限
     *
     * @param parentPermission 父权限
     * @param permissionList 所有权限列表
     * @return 包含子权限的父权限
     */
    private SysPermission findChildren(SysPermission parentPermission, List<SysPermission> permissionList) {
        List<SysPermission> children = new ArrayList<>();
        for (SysPermission permission : permissionList) {
            if (permission.getParentId() != null && permission.getParentId().equals(parentPermission.getPermissionId())) {
                children.add(findChildren(permission, permissionList));
            }
        }
        // 注意：SysPermission实体类中可能没有setChildren方法
        // parentPermission.setChildren(children);
        return parentPermission;
    }
}
