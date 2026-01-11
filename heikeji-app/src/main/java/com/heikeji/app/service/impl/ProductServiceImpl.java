package com.heikeji.app.service.impl;

import com.heikeji.app.model.response.AppResponse;
import com.heikeji.app.service.ProductService;
import com.heikeji.product.api.ProductFeignService;
import com.heikeji.product.dto.ProductDTO;
import com.heikeji.product.dto.ProductPageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 产品服务实现类
 */
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired(required = false)
    private ProductFeignService productFeignService;

    @Override
    public AppResponse<?> getProductList(Integer page, Integer limit, Long categoryId, String keyword, String sortBy) {
        // 构建查询参数
        ProductPageDTO pageDTO = new ProductPageDTO();
        pageDTO.setPage(page);
        pageDTO.setLimit(limit);
        pageDTO.setCategoryId(categoryId);
        pageDTO.setKeyword(keyword);
        pageDTO.setSortBy(sortBy);
        pageDTO.setStatus(1); // 只查询上架商品

        // 调用产品服务获取产品列表
        @SuppressWarnings("unchecked")
        com.heikeji.common.core.domain.R<com.heikeji.common.core.domain.PageResult<ProductDTO>> response = (com.heikeji.common.core.domain.R<com.heikeji.common.core.domain.PageResult<ProductDTO>>) productFeignService.page(pageDTO);
        
        return AppResponse.success(response.getData());
    }

    @Override
    public AppResponse<?> getProductDetail(Long productId) {
        // 调用产品服务获取产品详情
        ProductDTO productDTO = productFeignService.getById(productId);
        
        if (productDTO == null) {
            return AppResponse.error(404, "产品不存在");
        }

        if (productDTO.getStatus() != 1) {
            return AppResponse.error(400, "产品已下架");
        }

        return AppResponse.success(productDTO);
    }

    @Override
    public AppResponse<?> getRecommendProducts(Integer limit) {
        // 调用产品服务获取推荐产品
        return AppResponse.success(productFeignService.getRecommendProducts(limit));
    }

    @Override
    public AppResponse<?> getHotProducts(Integer limit) {
        // 调用产品服务获取热销产品
        return AppResponse.success(productFeignService.getHotProducts(limit));
    }
}