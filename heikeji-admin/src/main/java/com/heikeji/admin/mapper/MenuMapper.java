package com.heikeji.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.admin.entity.Menu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 菜单Mapper接口
 */
@Mapper
public interface MenuMapper extends BaseMapper<Menu> {

    /**
     * 根据角色ID查询菜单列表
     */
    @Select("SELECT m.* FROM sys_menu m " +
            "INNER JOIN sys_role_menu rm ON m.id = rm.menu_id " +
            "WHERE rm.role_id = #{roleId} AND m.status = 1 " +
            "ORDER BY m.sort ASC")
    List<Menu> selectMenusByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据角色ID列表查询菜单列表
     */
    @Select("SELECT DISTINCT m.* FROM sys_menu m " +
            "INNER JOIN sys_role_menu rm ON m.id = rm.menu_id " +
            "WHERE rm.role_id IN (${roleIds}) AND m.status = 1 " +
            "ORDER BY m.sort ASC")
    List<Menu> selectMenusByRoleIds(@Param("roleIds") String roleIds);

    /**
     * 查询所有启用菜单
     */
    @Select("SELECT * FROM sys_menu WHERE status = 1 ORDER BY sort ASC")
    List<Menu> selectAllEnabledMenus();

    /**
     * 根据父ID查询子菜单
     */
    @Select("SELECT * FROM sys_menu WHERE parent_id = #{parentId} AND status = 1 ORDER BY sort ASC")
    List<Menu> selectChildrenByParentId(@Param("parentId") Long parentId);
}
