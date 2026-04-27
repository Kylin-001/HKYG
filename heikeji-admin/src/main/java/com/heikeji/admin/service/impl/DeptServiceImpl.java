package com.heikeji.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heikeji.admin.entity.Dept;
import com.heikeji.admin.mapper.DeptMapper;
import com.heikeji.admin.service.DeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * 部门Service实现类
 */
@Service
public class DeptServiceImpl implements DeptService {

    @Autowired
    private DeptMapper deptMapper;

    @Override
    public List<Dept> getDeptTree() {
        List<Dept> allDepts = deptMapper.selectAllEnabledDepts();
        return buildDeptTree(allDepts, 0L);
    }

    @Override
    public List<Dept> getAllDepts() {
        LambdaQueryWrapper<Dept> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Dept::getSort);
        return deptMapper.selectList(wrapper);
    }

    @Override
    public Dept getDeptById(Long id) {
        return deptMapper.selectById(id);
    }

    @Override
    public boolean addDept(Dept dept) {
        return deptMapper.insert(dept) > 0;
    }

    @Override
    public boolean updateDept(Dept dept) {
        return deptMapper.updateById(dept) > 0;
    }

    @Override
    public boolean deleteDept(Long id) {
        // 检查是否有子部门
        List<Dept> children = deptMapper.selectChildrenByParentId(id);
        if (!CollectionUtils.isEmpty(children)) {
            throw new RuntimeException("该部门存在子部门，无法删除");
        }
        return deptMapper.deleteById(id) > 0;
    }

    @Override
    public boolean updateDeptStatus(Long id, Integer status) {
        Dept dept = new Dept();
        dept.setId(id);
        dept.setStatus(status);
        return deptMapper.updateById(dept) > 0;
    }

    /**
     * 构建部门树
     */
    private List<Dept> buildDeptTree(List<Dept> depts, Long parentId) {
        List<Dept> tree = new ArrayList<>();
        for (Dept dept : depts) {
            if (parentId.equals(dept.getParentId())) {
                dept.setChildren(buildDeptTree(depts, dept.getId()));
                tree.add(dept);
            }
        }
        tree.sort(Comparator.comparingInt(Dept::getSort));
        return tree;
    }
}
