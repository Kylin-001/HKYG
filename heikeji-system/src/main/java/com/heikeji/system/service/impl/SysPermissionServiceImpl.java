package com.heikeji.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.system.entity.SysPermission;
import com.heikeji.system.mapper.SysPermissionMapper;
import com.heikeji.system.mapper.SysRolePermissionMapper;
import com.heikeji.system.mapper.SysUserRoleMapper;
import com.heikeji.system.service.SysPermissionService;
import com.heikeji.system.vo.PermissionQueryVO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 系统权限服务实现类
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Service
public class SysPermissionServiceImpl extends ServiceImpl<SysPermissionMapper, SysPermission> implements SysPermissionService {

    @Autowired
    private SysPermissionMapper sysPermissionMapper;

    @Autowired
    private SysRolePermissionMapper sysRolePermissionMapper;

    @Autowired
    private SysUserRoleMapper sysUserRoleMapper;

    @Override
    public SysPermission getByCode(String permissionCode) {
        return sysPermissionMapper.selectByCode(permissionCode);
    }

    @Override
    public List<Long> getAllChildPermissionIds(Long permissionId) {
        List<Long> childIds = new ArrayList<>();
        List<SysPermission> children = sysPermissionMapper.selectByParentId(permissionId);
        if (children != null && !children.isEmpty()) {
            for (SysPermission child : children) {
                childIds.add(child.getId());
                // 递归获取所有子权限ID
                childIds.addAll(getAllChildPermissionIds(child.getId()));
            }
        }
        return childIds;
    }

    @Override
    public IPage<SysPermission> page(PermissionQueryVO queryVO) {
        Page<SysPermission> page = new Page<>(queryVO.getPageNum(), queryVO.getPageSize());
        SysPermission permission = new SysPermission();
        if (StringUtils.isNotBlank(queryVO.getPermissionName())) {
            permission.setName(queryVO.getPermissionName());
        }
        if (StringUtils.isNotBlank(queryVO.getPermissionCode())) {
            permission.setCode(queryVO.getPermissionCode());
        }
        if (queryVO.getStatus() != null) {
            permission.setStatus(queryVO.getStatus());
        }
        if (queryVO.getType() != null) {
            permission.setType(queryVO.getType());
        }
        return sysPermissionMapper.selectPage(page, permission);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean create(SysPermission permission) {
        return this.save(permission);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean update(SysPermission permission) {
        return this.updateById(permission);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean delete(Long id) {
        // 删除角色权限关联
        sysRolePermissionMapper.deleteByPermissionId(id);
        
        // 检查是否有子权限
        List<SysPermission> children = sysPermissionMapper.selectByParentId(id);
        if (children != null && !children.isEmpty()) {
            // 递归删除子权限
            for (SysPermission child : children) {
                delete(child.getId());
            }
        }
        
        return this.removeById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteBatch(List<Long> ids) {
        // 批量删除角色权限关联
        for (Long id : ids) {
            sysRolePermissionMapper.deleteByPermissionId(id);
            
            // 检查并删除子权限
            List<SysPermission> children = sysPermissionMapper.selectByParentId(id);
            if (children != null && !children.isEmpty()) {
                for (SysPermission child : children) {
                    delete(child.getId());
                }
            }
        }
        return this.removeByIds(ids);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateStatus(Long id, Integer status) {
        SysPermission permission = new SysPermission();
        permission.setId(id);
        permission.setStatus(status);
        return this.updateById(permission);
    }

    @Override
    public List<SysPermission> listByRoleId(Long roleId) {
        return sysPermissionMapper.selectByRoleId(roleId);
    }

    @Override
    public List<SysPermission> listByUserId(Long userId) {
        return sysPermissionMapper.selectByUserId(userId);
    }

    @Override
    public List<SysPermission> listAllMenus() {
        return sysPermissionMapper.selectAllMenus();
    }

    @Override
    public List<SysPermission> listByParentId(Long parentId) {
        return sysPermissionMapper.selectByParentId(parentId);
    }

    @Override
    public Set<String> getPermissionCodesByUserId(Long userId) {
        List<SysPermission> permissions = sysPermissionMapper.selectByUserId(userId);
        return permissions.stream()
                .map(SysPermission::getCode)
                .filter(StringUtils::isNotBlank)
                .collect(Collectors.toSet());
    }

    @Override
    public boolean hasPermission(Long userId, String permissionCode) {
        Set<String> permissionCodes = getPermissionCodesByUserId(userId);
        return permissionCodes.contains(permissionCode);
    }

    @Override
    public boolean hasAnyPermission(Long userId, String[] permissionCodes) {
        if (permissionCodes == null || permissionCodes.length == 0) {
            return true;
        }
        Set<String> userPermissionCodes = getPermissionCodesByUserId(userId);
        for (String permissionCode : permissionCodes) {
            if (userPermissionCodes.contains(permissionCode)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean hasAllPermissions(Long userId, String[] permissionCodes) {
        if (permissionCodes == null || permissionCodes.length == 0) {
            return true;
        }
        Set<String> userPermissionCodes = getPermissionCodesByUserId(userId);
        for (String permissionCode : permissionCodes) {
            if (!userPermissionCodes.contains(permissionCode)) {
                return false;
            }
        }
        return true;
    }

    @Override
    public List<SysPermission> buildMenuTree(List<SysPermission> permissions) {
        List<SysPermission> menuTree = new ArrayList<>();
        
        // 构建权限ID到权限对象的映射
        Map<Long, SysPermission> permissionMap = new HashMap<>();
        for (SysPermission permission : permissions) {
            permissionMap.put(permission.getId(), permission);
            // 初始化子权限列表
            permission.setChildren(new ArrayList<SysPermission>());
        }
        
        // 构建菜单树
        for (SysPermission permission : permissions) {
            if (permission.getParentId() == 0L) {
                // 根节点
                menuTree.add(permission);
            } else {
                // 子节点，添加到父节点中
                SysPermission parent = permissionMap.get(permission.getParentId());
                if (parent != null) {
                    parent.getChildren().add(permission);
                }
            }
        }
        
        // 对子节点进行排序
        sortMenuTree(menuTree);
        
        return menuTree;
    }

    /**
     * 对菜单树进行排序
     */
    private void sortMenuTree(List<SysPermission> permissions) {
        if (permissions == null || permissions.isEmpty()) {
            return;
        }
        
        // 先按sort排序
        permissions.sort(Comparator.comparing(SysPermission::getSort));
        
        // 递归对子节点进行排序
        for (SysPermission permission : permissions) {
            if (permission.getChildren() != null && !permission.getChildren().isEmpty()) {
                sortMenuTree(permission.getChildren());
            }
        }
    }

    @Override
    public List<SysPermission> getMenusByUserId(Long userId) {
        return sysPermissionMapper.selectByUserId(userId);
    }

    public List<SysPermission> getMenuTreeByUserId(Long userId) {
        List<SysPermission> permissions = sysPermissionMapper.selectByUserId(userId);
        // 过滤出菜单类型的权限
        List<SysPermission> menus = permissions.stream()
                .filter(p -> p.getType() == 1 || p.getType() == 2) // 菜单或目录
                .filter(p -> p.getStatus() == 1) // 启用状态
                .collect(Collectors.toList());
        return buildMenuTree(menus);
    }

    @Override
    public boolean checkCodeUnique(String code, Long id) {
        return sysPermissionMapper.checkCodeUnique(code, id) == 0;
    }
}
