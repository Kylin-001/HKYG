package com.heikeji.mall.takeout.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.TakeoutCategory;
import com.heikeji.mall.takeout.service.TakeoutCategoryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 外卖商品分类控制器
 */
@RestController
@RequestMapping("/api/takeout/category")
@Api(tags = "外卖商品分类管理")
public class TakeoutCategoryController {

    @Autowired
    private TakeoutCategoryService takeoutCategoryService;

    /**
     * 根据商家ID获取分类列表
     */
    @GetMapping("/merchant/{merchantId}")
    @ApiOperation("根据商家ID获取分类列表")
    public R<List<TakeoutCategory>> getCategoriesByMerchantId(@PathVariable Long merchantId) {
        List<TakeoutCategory> categories = takeoutCategoryService.getCategoriesByMerchantId(merchantId);
        return R.success(categories);
    }

}