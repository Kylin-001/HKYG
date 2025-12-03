package com.heikeji.job.feign;

import org.springframework.stereotype.Component;

/**
 * 订单服务Feign客户端降级处理类
 * 当订单服务不可用时的降级处理
 * 
 * @author heikeji
 */
@Component
public class OrderFeignClientFallback implements OrderFeignClient {

    @Override
    public Integer cancelTimeoutOrders(Integer minutes) {
        System.out.println("订单服务不可用，无法取消超时订单");
        return 0;
    }

    @Override
    public Integer confirmTimeoutOrders(Integer days) {
        System.out.println("订单服务不可用，无法确认超时订单");
        return 0;
    }

    @Override
    public Integer releaseTimeoutLockers(Integer hours) {
        System.out.println("订单服务不可用，无法释放超时外卖柜");
        return 0;
    }

}
