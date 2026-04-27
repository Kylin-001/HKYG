package com.heikeji.admin.service;

import com.heikeji.admin.entity.Dept;

import java.util.List;
import java.util.Map;

/**
 * 部门Service接口
 */
public interface DeptService {

    /**
     * 获取部门树形结构
     */
    List<Dept> getDeptTree();

    /**
     * 获取所有部门列表
     */
    List<Dept> getAllDepts();

    /**
     * 根据ID获取部门
     */
    Dept getDeptById(Long id);

    /**
     * 添加部门
     */
    boolean addDept(Dept dept);

    /**
     * 修改部门
     */
    boolean updateDept(Dept dept);

    /**
     * 删除部门
     */
    boolean deleteDept(Long id);

    /**
     * 更新部门状态
     */
    boolean updateDeptStatus(Long id, Integer status);
}
