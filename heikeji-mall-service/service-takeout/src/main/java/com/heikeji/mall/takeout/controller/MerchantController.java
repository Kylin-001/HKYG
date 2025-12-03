package com.heikeji.mall.takeout.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.Merchant;
import com.heikeji.mall.takeout.service.MerchantService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 商家控制器
 */
@RestController
@RequestMapping("/api/takeout/merchant")
@Api(tags = "外卖商家管理")
public class MerchantController {

    @Autowired
    private MerchantService merchantService;

    /**
     * 获取营业中的商家列表
     */
    @GetMapping("/active")
    @ApiOperation("获取营业中的商家列表")
    public R<List<Merchant>> getActiveMerchants() {
        List<Merchant> merchants = merchantService.getActiveMerchants();
        return R.success(merchants);
    }

    /**
     * 分页查询商家
     */
    @GetMapping("/page")
    @ApiOperation("分页查询商家")
    public R<Page<Merchant>> pageMerchants(@RequestParam Integer pageNum, @RequestParam Integer pageSize) {
        Page<Merchant> page = new Page<>(pageNum, pageSize);
        Page<Merchant> merchantPage = merchantService.pageMerchants(page);
        return R.success(merchantPage);
    }

    /**
     * 搜索商家
     */
    @GetMapping("/search")
    @ApiOperation("搜索商家")
    public R<List<Merchant>> searchMerchants(@RequestParam String keyword) {
        List<Merchant> merchants = merchantService.searchMerchants(keyword);
        return R.success(merchants);
    }

    /**
     * 获取商家详情
     */
    @GetMapping("/{id}")
    @ApiOperation("获取商家详情")
    public R<Merchant> getMerchantById(@PathVariable Long id) {
        Merchant merchant = merchantService.getById(id);
        return R.success(merchant);
    }

}