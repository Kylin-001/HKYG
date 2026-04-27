package com.heikeji.admin.controller;

import com.heikeji.admin.common.R;
import com.heikeji.admin.entity.Dept;
import com.heikeji.admin.service.DeptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 部门管理控制器
 */
@Tag(name = "部门管理")
@RestController
@RequestMapping("/api/dept")
public class DeptController {

    @Autowired
    private DeptService deptService;

    /**
     * 获取部门树形结构
     */
    @Operation(summary = "获取部门树形结构")
    @GetMapping("/tree")
    public R tree() {
        List<Dept> depts = deptService.getDeptTree();
        return R.ok().data(depts);
    }

    /**
     * 获取所有部门列表
     */
    @Operation(summary = "获取所有部门列表")
    @GetMapping("/list")
    public R list() {
        List<Dept> depts = deptService.getAllDepts();
        return R.ok().data(depts);
    }

    /**
     * 根据ID获取部门详情
     */
    @Operation(summary = "根据ID获取部门详情")
    @GetMapping("/{id}")
    public R getById(@Parameter(description = "部门ID") @PathVariable("id") Long id) {
        Dept dept = deptService.getDeptById(id);
        if (dept == null) {
            return R.error(404, "部门不存在");
        }
        return R.ok().data(dept);
    }

    /**
     * 添加部门
     */
    @Operation(summary = "添加部门")
    @PostMapping("/")
    public R add(@Parameter(description = "部门信息") @RequestBody Dept dept) {
        try {
            boolean success = deptService.addDept(dept);
            if (success) {
                return R.ok("添加部门成功");
            } else {
                return R.error(500, "添加部门失败");
            }
        } catch (RuntimeException e) {
            return R.error(400, e.getMessage());
        }
    }

    /**
     * 修改部门
     */
    @Operation(summary = "修改部门")
    @PutMapping("/{id}")
    public R update(@Parameter(description = "部门ID") @PathVariable("id") Long id,
                    @Parameter(description = "部门信息") @RequestBody Dept dept) {
        try {
            dept.setId(id);
            boolean success = deptService.updateDept(dept);
            if (success) {
                return R.ok("修改部门成功");
            } else {
                return R.error(500, "修改部门失败");
            }
        } catch (RuntimeException e) {
            return R.error(400, e.getMessage());
        }
    }

    /**
     * 删除部门
     */
    @Operation(summary = "删除部门")
    @DeleteMapping("/{id}")
    public R delete(@Parameter(description = "部门ID") @PathVariable("id") Long id) {
        try {
            boolean success = deptService.deleteDept(id);
            if (success) {
                return R.ok("删除部门成功");
            } else {
                return R.error(500, "删除部门失败");
            }
        } catch (RuntimeException e) {
            return R.error(400, e.getMessage());
        }
    }

    /**
     * 更新部门状态
     */
    @Operation(summary = "更新部门状态")
    @PutMapping("/{id}/status")
    public R updateStatus(@Parameter(description = "部门ID") @PathVariable("id") Long id,
                          @Parameter(description = "状态 0禁用 1启用") @RequestParam Integer status) {
        try {
            boolean success = deptService.updateDeptStatus(id, status);
            if (success) {
                return R.ok("修改部门状态成功");
            } else {
                return R.error(500, "修改部门状态失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "修改部门状态失败");
        }
    }
}
