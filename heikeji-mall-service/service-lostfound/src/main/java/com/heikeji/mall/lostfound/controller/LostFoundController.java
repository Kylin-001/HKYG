package com.heikeji.mall.lostfound.controller;

import com.heikeji.mall.lostfound.entity.LostFound;
import com.heikeji.mall.lostfound.service.LostFoundService;
import com.heikeji.common.core.domain.R;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lostfound")
@Tag(name = "失物招领管理", description = "失物招领相关接口")
@Slf4j
public class LostFoundController {

    @Autowired
    private LostFoundService lostFoundService;

    @PostMapping("/publish")
    @Operation(summary = "发布失物招领信息")
    public R<Long> publishLostFound(@RequestBody LostFound lostFound) {
        try {
            Long id = lostFoundService.publishLostFound(lostFound);
            return R.success(id);
        } catch (Exception e) {
            log.error("发布失物招领信息失败", e);
            return R.error("发布失败: " + e.getMessage());
        }
    }

    @GetMapping("/detail/{id}")
    @Operation(summary = "获取失物招领详情")
    public R<LostFound> getLostFoundDetail(@PathVariable Long id) {
        try {
            LostFound lostFound = lostFoundService.getLostFoundDetail(id);
            if (lostFound == null) {
                return R.error("信息不存在");
            }
            return R.success(lostFound);
        } catch (Exception e) {
            log.error("获取详情失败", e);
            return R.error("获取详情失败: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    @Operation(summary = "获取失物招领列表")
    public R<List<LostFound>> getLostFoundList(@RequestParam Map<String, Object> params) {
        try {
            List<LostFound> list = lostFoundService.getLostFoundList(params);
            return R.success(list);
        } catch (Exception e) {
            log.error("获取列表失败", e);
            return R.error("获取列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    @Operation(summary = "搜索失物招领信息")
    public R<Map<String, Object>> searchLostFound(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        try {
            Map<String, Object> result = lostFoundService.searchLostFound(keyword, type, categoryId, sort, page, size);
            return R.success(result);
        } catch (Exception e) {
            log.error("搜索失败", e);
            return R.error("搜索失败: " + e.getMessage());
        }
    }

    @GetMapping("/hot")
    @Operation(summary = "获取热门失物招领")
    public R<List<LostFound>> getHotLostFound(@RequestParam(defaultValue = "10") Integer limit) {
        try {
            List<LostFound> list = lostFoundService.getHotLostFound(limit);
            return R.success(list);
        } catch (Exception e) {
            log.error("获取热门失物招领失败", e);
            return R.error("获取热门失物招领失败: " + e.getMessage());
        }
    }

    @PutMapping("/audit/{id}")
    @Operation(summary = "审核失物招领信息")
    public R<Boolean> auditLostFound(
            @PathVariable Long id,
            @RequestParam Integer status,
            @RequestParam(required = false) String auditRemark) {
        try {
            boolean result = lostFoundService.auditLostFound(id, status, auditRemark);
            return R.success(result);
        } catch (Exception e) {
            log.error("审核失败", e);
            return R.error("审核失败: " + e.getMessage());
        }
    }

    @PutMapping("/status/{id}")
    @Operation(summary = "更新失物招领状态")
    public R<Boolean> updateLostFoundStatus(@PathVariable Long id, @RequestParam Integer status) {
        try {
            boolean result = lostFoundService.updateLostFoundStatus(id, status);
            return R.success(result);
        } catch (Exception e) {
            log.error("更新状态失败", e);
            return R.error("更新状态失败: " + e.getMessage());
        }
    }
}
