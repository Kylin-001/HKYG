package com.heikeji.mall.campus.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.campus.entity.CampusNotice;
import com.heikeji.mall.campus.service.CampusNoticeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 校园公告控制器
 */
@RestController
@RequestMapping("/api/campus/notice")
@Tag(name = "校园公告管理")
public class CampusNoticeController {

    @Autowired
    private CampusNoticeService campusNoticeService;

    /**
     * 获取公告列表
     */
    @GetMapping("/list")
    @Operation(summary = "获取公告列表")
    public R<List<CampusNotice>> getNoticeList(@RequestParam Map<String, Object> params) {
        List<CampusNotice> notices = campusNoticeService.getNoticeList(params);
        return R.success(notices);
    }

    /**
     * 根据ID获取公告详情
     */
    @GetMapping("/info/{id}")
    @Operation(summary = "获取公告详情")
    public R<CampusNotice> getNoticeById(@PathVariable Long id) {
        CampusNotice notice = campusNoticeService.getNoticeById(id);
        // 增加点击量
        campusNoticeService.incrementClickCount(id);
        return R.success(notice);
    }

    /**
     * 新增公告
     */
    @PostMapping("/save")
    @Operation(summary = "新增公告")
    public R<Boolean> addNotice(@RequestBody CampusNotice notice) {
        boolean success = campusNoticeService.addNotice(notice);
        return R.success(success);
    }

    /**
     * 修改公告
     */
    @PostMapping("/update")
    @Operation(summary = "修改公告")
    public R<Boolean> updateNotice(@RequestBody CampusNotice notice) {
        boolean success = campusNoticeService.updateNotice(notice);
        return R.success(success);
    }

    /**
     * 删除公告
     */
    @DeleteMapping("/delete/{id}")
    @Operation(summary = "删除公告")
    public R<Boolean> deleteNotice(@PathVariable Long id) {
        boolean success = campusNoticeService.deleteNotice(id);
        return R.success(success);
    }

    /**
     * 批量删除公告
     */
    @DeleteMapping("/batch-delete")
    @Operation(summary = "批量删除公告")
    public R<Boolean> batchDeleteNotices(@RequestBody List<Long> ids) {
        boolean success = campusNoticeService.batchDeleteNotices(ids);
        return R.success(success);
    }

    /**
     * 更新公告状态
     */
    @PutMapping("/status/{id}")
    @Operation(summary = "更新公告状态")
    public R<Boolean> updateNoticeStatus(@PathVariable Long id, @RequestParam Integer status) {
        boolean success = campusNoticeService.updateNoticeStatus(id, status);
        return R.success(success);
    }

    /**
     * 更新公告置顶状态
     */
    @PutMapping("/top/{id}")
    @Operation(summary = "更新公告置顶状态")
    public R<Boolean> updateNoticeTopStatus(@PathVariable Long id, @RequestParam Integer isTop) {
        boolean success = campusNoticeService.updateNoticeTopStatus(id, isTop);
        return R.success(success);
    }

    /**
     * 获取已发布的公告列表
     */
    @GetMapping("/published")
    @Operation(summary = "获取已发布的公告列表")
    public R<List<CampusNotice>> getPublishedNotices() {
        List<CampusNotice> notices = campusNoticeService.getPublishedNotices();
        return R.success(notices);
    }

    /**
     * 获取置顶公告
     */
    @GetMapping("/top")
    @Operation(summary = "获取置顶公告")
    public R<List<CampusNotice>> getTopNotices() {
        List<CampusNotice> notices = campusNoticeService.getTopNotices();
        return R.success(notices);
    }

    /**
     * 同步校园公告
     */
    @PostMapping("/sync")
    @Operation(summary = "同步校园公告")
    public R<Boolean> syncCampusNotices() {
        boolean success = campusNoticeService.syncCampusNotices();
        return R.success(success);
    }
}
