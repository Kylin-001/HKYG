package com.heikeji.admin.feign;

import com.heikeji.admin.common.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 校园信息服务Feign客户端
 * 用于后台管理系统调用校园信息服务的接口
 */
@FeignClient(name = "heikeji-campus")
public interface CampusInfoFeignClient {
    
    /**
     * 获取校园公告列表
     */
    @GetMapping("/api/notice/list")
    R getNoticeList(@RequestParam(required = false) Integer page,
                    @RequestParam(required = false) Integer limit,
                    @RequestParam(required = false) String keyword);
    
    /**
     * 获取空教室列表
     */
    @GetMapping("/api/classroom/empty/list")
    R getEmptyClassroomList(@RequestParam(required = false) Integer campusId,
                            @RequestParam(required = false) Integer buildingId,
                            @RequestParam(required = false) Integer weekday,
                            @RequestParam(required = false) Integer classSection);
    
    /**
     * 发布校园公告
     */
    @PostMapping("/api/notice/publish")
    R publishNotice(@RequestBody Map<String, Object> notice);
    
    /**
     * 更新校园公告
     */
    @PutMapping("/api/notice/{id}")
    R updateNotice(@PathVariable Long id, @RequestBody Map<String, Object> notice);
    
    /**
     * 删除校园公告
     */
    @DeleteMapping("/api/notice/{id}")
    R deleteNotice(@PathVariable Long id);
    
    /**
     * 更新公告状态
     */
    @PutMapping("/api/notice/{id}/status")
    R updateNoticeStatus(@PathVariable Long id, @RequestParam Integer status);
    
    /**
     * 更新公告置顶状态
     */
    @PutMapping("/api/notice/{id}/top")
    R updateNoticeTopStatus(@PathVariable Long id, @RequestParam Integer isTop);
}
