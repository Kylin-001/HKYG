package com.heikeji.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.system.entity.SysRole;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 系统角色Mapper接口
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public interface SysRoleMapper extends BaseMapper<SysRole> {
    
    /**
     * 根据角色编码查询角色
     * @param roleCode 角色编码
     * @return 角色信息
     */
    SysRole selectByCode(@Param("roleCode") String roleCode);

    /**
     * 分页查询角色列表
     * @param page 分页对象
     * @param role 查询条件
     * @return 分页结果
     */
    IPage<SysRole> selectPage(Page<SysRole> page, @Param("role") SysRole role);

    /**
     * 根据用户ID查询角色列表
     * @param userId 用户ID
     * @return 角色列表
     */
    List<SysRole> selectByUserId(@Param("userId") Long userId);

    /**
     * 查询所有启用的角色
     * @return 角色列表
     */
    List<SysRole> selectAllEnabled();

    /**
     * 批量删除角色
     * @param ids 角色ID列表
     * @return 影响行数
     */
    int deleteBatchIds(@Param("ids") List<Long> ids);

    /**
     * 校验角色名称是否已存在
     * @param roleName 角色名称
     * @param id 排除的角色ID
     * @return 数量
     */
    int checkRoleNameUnique(@Param("roleName") String roleName, @Param("id") Long id);

    /**
     * 校验角色编码是否已存在
     * @param roleCode 角色编码
     * @param id 排除的角色ID
     * @return 数量
     */
    int checkRoleCodeUnique(@Param("roleCode") String roleCode, @Param("id") Long id);
}
