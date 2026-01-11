package com.heikeji.mall.order.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 订单数据分析服务接口
 */
public interface OrderAnalysisService {
    
    /**
     * 获取订单概览数据
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单概览数据
     */
    Map<String, Object> getOrderOverview(Date startDate, Date endDate);
    
    /**
     * 获取订单趋势数据
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param interval 时间间隔：day, week, month
     * @return 订单趋势数据
     */
    Map<String, Object> getOrderTrend(Date startDate, Date endDate, String interval);
    
    /**
     * 获取订单状态分布
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单状态分布数据
     */
    Map<String, Object> getOrderStatusDistribution(Date startDate, Date endDate);
    
    /**
     * 获取订单金额分布
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单金额分布数据
     */
    Map<String, Object> getOrderAmountDistribution(Date startDate, Date endDate);
    
    /**
     * 获取订单来源分布
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单来源分布数据
     */
    Map<String, Object> getOrderSourceDistribution(Date startDate, Date endDate);
    
    /**
     * 获取订单时间分布
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单时间分布数据
     */
    Map<String, Object> getOrderTimeDistribution(Date startDate, Date endDate);
    
    /**
     * 获取订单取消原因分析
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单取消原因分析数据
     */
    List<Map<String, Object>> getOrderCancelReasonAnalysis(Date startDate, Date endDate);
    
    /**
     * 获取订单转化率分析
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单转化率分析数据
     */
    Map<String, Object> getOrderConversionAnalysis(Date startDate, Date endDate);
    
    /**
     * 获取订单平均处理时间分析
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单平均处理时间分析数据
     */
    Map<String, Object> getOrderProcessingTimeAnalysis(Date startDate, Date endDate);
    
    /**
     * 获取订单地域分布
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单地域分布数据
     */
    List<Map<String, Object>> getOrderRegionDistribution(Date startDate, Date endDate);
}