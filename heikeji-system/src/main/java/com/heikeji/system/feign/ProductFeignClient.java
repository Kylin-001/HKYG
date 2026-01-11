package com.heikeji.system.feign;

import com.heikeji.common.core.domain.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 商品服务Feign客户端
 */
@FeignClient(name = "heikeji-product", fallback = ProductFeignClientFallback.class)
public interface ProductFeignClient {

    /**
     * 校验商品是否存在
     */
    @GetMapping("/api/product/check")
    R<Boolean> checkProductExists(@RequestParam("productId") Long productId);

    /**
     * 获取商品库存信息
     */
    @GetMapping("/api/product/stock")
    R<Integer> getProductStock(@RequestParam("productId") Long productId);
    
    /**
     * 获取商品总数
     */
    @GetMapping("/api/product/count")
    R<Integer> getProductCount();
}
