package com.heikeji.mall.delivery.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 配送数据分析服务接口
 */
public interface DeliveryAnalysisService {
    
    /**
     * 获取配送概览数据
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 配送概览数据
     */
    Map<String, Object> getDeliveryOverview(Date startDate, Date endDate);
    
    /**
     * 获取配送趋势数据
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param interval 时间间隔：day, week, month
     * @return 配送趋势数据
     */
    Map<String, Object> getDeliveryTrend(Date startDate, Date endDate, String interval);
    
    /**
     * 获取配送状态分布
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 配送状态分布数据
     */
    Map<String, Object> getDeliveryStatusDistribution(Date startDate, Date endDate);
    
    /**
     * 获取配送效率分析
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 配送效率分析数据
     */
    Map<String, Object> getDeliveryEfficiencyAnalysis(Date startDate, Date endDate);
    
    /**
     * 获取配送员绩效分析
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 配送员绩效分析数据
     */
    List<Map<String, Object>> getDeliverymanPerformance(Date startDate, Date endDate);
    
    /**
     * 获取配送地域分布
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 配送地域分布数据
     */
    List<Map<String, Object>> getDeliveryRegionDistribution(Date startDate, Date endDate);
    
    /**
     * 获取配送类型分布
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 配送类型分布数据
     */
    Map<String, Object> getDeliveryTypeDistribution(Date startDate, Date endDate);
    
    /**
     * 获取配送时间分析
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 配送时间分析数据
     */
    Map<String, Object> getDeliveryTimeAnalysis(Date startDate, Date endDate);
}