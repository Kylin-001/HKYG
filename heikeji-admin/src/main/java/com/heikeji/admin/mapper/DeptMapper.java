package com.heikeji.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.admin.entity.Dept;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 部门Mapper接口
 */
@Mapper
public interface DeptMapper extends BaseMapper<Dept> {

    /**
     * 根据父ID查询子部门
     */
    @Select("SELECT * FROM sys_dept WHERE parent_id = #{parentId} AND status = 1 ORDER BY sort ASC")
    List<Dept> selectChildrenByParentId(@Param("parentId") Long parentId);

    /**
     * 查询所有启用部门
     */
    @Select("SELECT * FROM sys_dept WHERE status = 1 ORDER BY sort ASC")
    List<Dept> selectAllEnabledDepts();
}
