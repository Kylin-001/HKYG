package com.heikeji.mall.product.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 用户行为分析Feign客户端
 * 用于商品服务调用用户服务的API接口
 */
@FeignClient(name = "heikeji-user", url = "http://localhost:8081")
public interface UserBehaviorFeignClient {
    
    /**
     * 获取用户偏好分析
     *
     * @param userId 用户ID
     * @return 用户偏好数据
     */
    @GetMapping("/api/user/behavior/preferences")
    Map<String, Object> getUserPreferences(@RequestParam("userId") Long userId);
    
    /**
     * 获取用户热门商品
     *
     * @param userId 用户ID
     * @param limit 限制数量
     * @return 热门商品列表
     */
    @GetMapping("/api/user/behavior/hot-products")
    List<Map<String, Object>> getUserHotProducts(@RequestParam("userId") Long userId, 
                                                @RequestParam(defaultValue = "10") Integer limit);
    
    /**
     * 获取用户活跃度
     *
     * @param userId 用户ID
     * @param days 天数
     * @return 活跃度数据
     */
    @GetMapping("/api/user/behavior/activity")
    double getUserActivity(@RequestParam("userId") Long userId, 
                          @RequestParam(defaultValue = "30") Integer days);
}