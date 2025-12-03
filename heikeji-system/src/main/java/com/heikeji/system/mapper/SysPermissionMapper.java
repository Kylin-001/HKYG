package com.heikeji.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.system.entity.SysPermission;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 系统权限Mapper接口
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public interface SysPermissionMapper extends BaseMapper<SysPermission> {
    
    /**
     * 根据权限编码查询权限
     *
     * @param code 权限编码
     * @return 权限信息
     */
    SysPermission selectByCode(@Param("code") String code);

    /**
     * 分页查询权限列表
     *
     * @param page 分页对象
     * @param permission 查询条件
     * @return 分页结果
     */
    IPage<SysPermission> selectPage(Page<SysPermission> page, @Param("permission") SysPermission permission);

    /**
     * 根据角色ID查询权限列表
     *
     * @param roleId 角色ID
     * @return 权限列表
     */
    List<SysPermission> selectByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据用户ID查询权限列表
     *
     * @param userId 用户ID
     * @return 权限列表
     */
    List<SysPermission> selectByUserId(@Param("userId") Long userId);

    /**
     * 查询所有菜单权限
     *
     * @return 菜单列表
     */
    List<SysPermission> selectAllMenus();

    /**
     * 根据父ID查询子权限列表
     *
     * @param parentId 父级权限ID
     * @return 子权限列表
     */
    List<SysPermission> selectByParentId(@Param("parentId") Long parentId);

    /**
     * 批量删除权限
     *
     * @param ids 权限ID列表
     * @return 影响行数
     */
    int deleteBatchIds(@Param("ids") List<Long> ids);

    /**
     * 检查权限编码是否已存在
     *
     * @param code 权限编码
     * @param id 排除的权限ID
     * @return 数量
     */
    int checkCodeUnique(@Param("code") String code, @Param("id") Long id);
}
