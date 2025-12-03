package com.heikeji.mall.takeout.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.mall.takeout.entity.Merchant;

import java.util.List;

/**
 * 商家服务接口
 */
public interface MerchantService extends IService<Merchant> {

    /**
     * 获取营业中的商家列表
     */
    List<Merchant> getActiveMerchants();

    /**
     * 分页查询商家
     */
    Page<Merchant> pageMerchants(Page<Merchant> page);

    /**
     * 搜索商家
     */
    List<Merchant> searchMerchants(String keyword);

}