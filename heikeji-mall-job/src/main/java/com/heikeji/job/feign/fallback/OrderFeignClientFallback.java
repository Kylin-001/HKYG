package com.heikeji.job.feign.fallback;

import com.heikeji.job.feign.OrderFeignClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 订单服务Feign客户端降级类
 * 用于服务熔断时提供降级处理
 * 
 * @author heikeji
 */
@Component
@Slf4j
public class OrderFeignClientFallback implements OrderFeignClient {

    /**
     * 取消超时未支付的订单 - 降级实现
     * 
     * @param minutes 超时分钟数
     * @return 0
     */
    @Override
    public Integer cancelTimeoutOrders(Integer minutes) {
        log.error("调用订单服务取消超时订单失败，执行降级处理");
        return 0;
    }

    /**
     * 自动确认超时未收货的订单 - 降级实现
     * 
     * @param days 超时天数
     * @return 0
     */
    @Override
    public Integer confirmTimeoutOrders(Integer days) {
        log.error("调用订单服务自动确认收货失败，执行降级处理");
        return 0;
    }

}
