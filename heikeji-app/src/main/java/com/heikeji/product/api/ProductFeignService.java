package com.heikeji.product.api;

import com.heikeji.common.core.domain.R;
import com.heikeji.product.dto.ProductDTO;
import com.heikeji.product.dto.ProductPageDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * 产品服务Feign接口
 */
@FeignClient(name = "heikeji-product")
public interface ProductFeignService {

    /**
     * 分页查询产品列表
     */
    @GetMapping("/api/product/page")
    R<?> page(@RequestBody ProductPageDTO pageDTO);

    /**
     * 根据ID获取产品详情
     */
    @GetMapping("/api/product/getById")
    ProductDTO getById(@RequestParam("id") Long id);

    /**
     * 获取推荐产品列表
     */
    @GetMapping("/api/product/recommend")
    List<ProductDTO> getRecommendProducts(@RequestParam("limit") Integer limit);

    /**
     * 获取热销产品列表
     */
    @GetMapping("/api/product/hot")
    List<ProductDTO> getHotProducts(@RequestParam("limit") Integer limit);
}
