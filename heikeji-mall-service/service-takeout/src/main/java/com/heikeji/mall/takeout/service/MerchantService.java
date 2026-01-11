package com.heikeji.mall.takeout.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.mall.takeout.entity.Merchant;

import java.util.List;
import java.util.Map;

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

    /**
     * 商家入驻
     */
    boolean merchantEntry(Merchant merchant);

    /**
     * 更新商家信息
     */
    boolean updateMerchantInfo(Merchant merchant);

    /**
     * 更新商家状态
     */
    boolean updateMerchantStatus(Long id, Integer status);

    /**
     * 删除商家
     */
    boolean deleteMerchant(Long id);

    /**
     * 获取商家统计信息
     */
    Map<String, Object> getMerchantStats(Long merchantId);

    /**
     * 获取商家订单统计
     */
    Map<String, Object> getMerchantOrderStats(Long merchantId, String startTime, String endTime);

    /**
     * 获取商家销售统计
     */
    Map<String, Object> getMerchantSalesStats(Long merchantId, String startTime, String endTime);

    /**
     * 获取商家评分统计
     */
    Map<String, Object> getMerchantRatingStats(Long merchantId);

    /**
     * 批量更新商家状态
     */
    boolean batchUpdateMerchantStatus(List<Long> ids, Integer status);

    /**
     * 获取商家详情（包含统计信息）
     */
    Map<String, Object> getMerchantDetailWithStats(Long merchantId);

} 