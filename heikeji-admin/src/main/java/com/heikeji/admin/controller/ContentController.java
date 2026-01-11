package com.heikeji.admin.controller;

import com.heikeji.admin.common.R;
import com.heikeji.admin.feign.CampusInfoFeignClient;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 内容管理控制器
 * 管理校园公告、空教室等内容
 */
@Api(tags = "内容管理")
@RestController
@RequestMapping("/api/content")
public class ContentController {
    
    @Autowired
    private CampusInfoFeignClient campusInfoFeignClient;

    /**
     * 获取校园公告列表
     */
    @ApiOperation("获取校园公告列表")
    @GetMapping("/notice/list")
    public R getNoticeList(@RequestParam(required = false) Integer page, 
                           @RequestParam(required = false) Integer limit, 
                           @RequestParam(required = false) String keyword) {
        // 调用校园信息服务获取真实数据
        return campusInfoFeignClient.getNoticeList(page, limit, keyword);
    }

    /**
     * 获取空教室列表
     */
    @ApiOperation("获取空教室列表")
    @GetMapping("/empty-classroom/list")
    public R getEmptyClassroomList(@RequestParam(required = false) Integer campusId, 
                                   @RequestParam(required = false) Integer buildingId, 
                                   @RequestParam(required = false) Integer weekday, 
                                   @RequestParam(required = false) Integer classSection) {
        // 调用校园信息服务获取真实数据
        return campusInfoFeignClient.getEmptyClassroomList(campusId, buildingId, weekday, classSection);
    }

    /**
     * 发布校园公告
     */
    @ApiOperation("发布校园公告")
    @PostMapping("/notice/publish")
    public R publishNotice(@RequestBody Map<String, Object> notice) {
        // 调用校园信息服务发布公告
        return campusInfoFeignClient.publishNotice(notice);
    }

    /**
     * 更新校园公告
     */
    @ApiOperation("更新校园公告")
    @PutMapping("/notice/{id}")
    public R updateNotice(@PathVariable Long id, @RequestBody Map<String, Object> notice) {
        // 调用校园信息服务更新公告
        return campusInfoFeignClient.updateNotice(id, notice);
    }

    /**
     * 删除校园公告
     */
    @ApiOperation("删除校园公告")
    @DeleteMapping("/notice/{id}")
    public R deleteNotice(@PathVariable Long id) {
        // 调用校园信息服务删除公告
        return campusInfoFeignClient.deleteNotice(id);
    }

    /**
     * 更新公告状态
     */
    @ApiOperation("更新公告状态")
    @PutMapping("/notice/{id}/status")
    public R updateNoticeStatus(@PathVariable Long id, @RequestParam Integer status) {
        // 调用校园信息服务更新公告状态
        return campusInfoFeignClient.updateNoticeStatus(id, status);
    }

    /**
     * 更新公告置顶状态
     */
    @ApiOperation("更新公告置顶状态")
    @PutMapping("/notice/{id}/top")
    public R updateNoticeTopStatus(@PathVariable Long id, @RequestParam Integer isTop) {
        // 调用校园信息服务更新公告置顶状态
        return campusInfoFeignClient.updateNoticeTopStatus(id, isTop);
    }
}
