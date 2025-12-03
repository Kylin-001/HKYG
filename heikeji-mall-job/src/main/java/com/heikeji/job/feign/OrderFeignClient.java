package com.heikeji.job.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 订单服务Feign客户端
 * 用于调用订单服务的接口
 * 
 * @author heikeji
 */
@FeignClient(name = "heikeji-service-order", fallback = OrderFeignClientFallback.class)
public interface OrderFeignClient {

    /**
     * 取消超时未支付的订单
     * 
     * @param minutes 超时分钟数
     * @return 取消的订单数量
     */
    @PostMapping("/order/auto-cancel")
    Integer cancelTimeoutOrders(@RequestParam("minutes") Integer minutes);

    /**
     * 自动确认超时未收货的订单
     * 
     * @param days 超时天数
     * @return 确认收货的订单数量
     */
    @PostMapping("/order/auto-confirm")
    Integer confirmTimeoutOrders(@RequestParam("days") Integer days);

    /**
     * 释放超时占用的外卖柜
     * 
     * @param hours 超时小时数
     * @return 释放的外卖柜数量
     */
    @PostMapping("/api/takeout/order/release-timeout-lockers")
    Integer releaseTimeoutLockers(@RequestParam("hours") Integer hours);

}
