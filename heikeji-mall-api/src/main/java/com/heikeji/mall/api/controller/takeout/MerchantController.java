package com.heikeji.mall.api.controller.takeout;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.Merchant;
import com.heikeji.mall.takeout.service.MerchantService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 商家Controller
 */
@RestController
@RequestMapping("/api/takeout/merchant")
@Api(tags = "商家接口")
public class MerchantController {
    
    @Autowired
    private MerchantService merchantService;
    
    @ApiOperation("获取营业中的商家列表")
    @GetMapping("/operating")
    public R<List<Merchant>> getOperatingMerchants() {
        List<Merchant> merchants = merchantService.getActiveMerchants();
        return R.success(merchants);
    }
    
    @ApiOperation("搜索商家")
    @GetMapping("/search")
    public R<List<Merchant>> searchMerchants(@RequestParam String keyword) {
        List<Merchant> merchants = merchantService.searchMerchants(keyword);
        return R.success(merchants);
    }
    
    @ApiOperation("获取商家详情")
    @GetMapping("/detail/{merchantId}")
    public R<Merchant> getMerchantDetail(@PathVariable Long merchantId) {
        Merchant merchant = merchantService.getById(merchantId);
        return R.success(merchant);
    }
}