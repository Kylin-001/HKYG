package com.heikeji.mall.order.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 销售数据分析服务接口
 */
public interface SalesAnalysisService {
    
    /**
     * 获取销售概览数据
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 销售概览数据
     */
    Map<String, Object> getSalesOverview(Date startDate, Date endDate);
    
    /**
     * 获取销售趋势数据
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param interval 时间间隔：day, week, month
     * @return 销售趋势数据
     */
    Map<String, Object> getSalesTrend(Date startDate, Date endDate, String interval);
    
    /**
     * 获取商品销售排名
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param limit 限制数量
     * @return 商品销售排名数据
     */
    List<Map<String, Object>> getProductSalesRanking(Date startDate, Date endDate, int limit);
    
    /**
     * 获取分类销售占比
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 分类销售占比数据
     */
    Map<String, Object> getCategorySalesDistribution(Date startDate, Date endDate);
    
    /**
     * 获取商家销售排名
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param limit 限制数量
     * @return 商家销售排名数据
     */
    List<Map<String, Object>> getMerchantSalesRanking(Date startDate, Date endDate, int limit);
    
    /**
     * 获取支付方式分布
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 支付方式分布数据
     */
    Map<String, Object> getPaymentMethodDistribution(Date startDate, Date endDate);
}
