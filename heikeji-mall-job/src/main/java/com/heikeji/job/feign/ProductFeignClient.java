package com.heikeji.job.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 商品服务Feign客户端
 * 用于调用商品服务的接口
 * 
 * @author heikeji
 */
@FeignClient(name = "heikeji-service-product", fallback = ProductFeignClientFallback.class)
public interface ProductFeignClient {

    /**
     * 检查商品库存预警
     * 
     * @param threshold 库存预警阈值
     * @return 预警商品数量
     */
    @PostMapping("/product/stock-warning")
    Integer checkStockWarning(@RequestParam("threshold") Integer threshold);
}
