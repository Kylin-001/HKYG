package com.heikeji.job.feign;

import org.springframework.stereotype.Component;

/**
 * 商品服务Feign客户端降级处理类
 * 当商品服务不可用时的降级处理
 * 
 * @author heikeji
 */
@Component
public class ProductFeignClientFallback implements ProductFeignClient {

    @Override
    public Integer checkStockWarning(Integer threshold) {
        System.out.println("商品服务不可用，无法检查库存预警");
        return 0;
    }
}
