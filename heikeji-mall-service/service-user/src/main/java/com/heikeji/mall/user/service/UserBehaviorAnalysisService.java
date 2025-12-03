package com.heikeji.mall.user.service;

import com.heikeji.mall.user.dto.UserBehaviorDTO;
import com.heikeji.mall.user.vo.UserStatisticsVO;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 用户行为分析服务接口
 */
public interface UserBehaviorAnalysisService {

    /**
     * 记录用户行为
     *
     * @param behaviorDTO 用户行为数据传输对象
     * @return 是否记录成功
     */
    boolean recordUserBehavior(UserBehaviorDTO behaviorDTO);

    /**
     * 获取用户行为统计
     *
     * @param userId 用户ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 用户统计信息
     */
    UserStatisticsVO getUserStatistics(Long userId, Date startDate, Date endDate);

    /**
     * 获取用户行为趋势
     *
     * @param userId 用户ID
     * @param behaviorType 行为类型
     * @param days 天数
     * @return 行为趋势数据
     */
    List<Map<String, Object>> getUserBehaviorTrend(Long userId, String behaviorType, int days);

    /**
     * 获取用户热门商品
     *
     * @param userId 用户ID
     * @param limit 限制数量
     * @return 热门商品列表
     */
    List<Map<String, Object>> getUserHotProducts(Long userId, int limit);

    /**
     * 获取用户活跃度
     *
     * @param userId 用户ID
     * @param days 天数
     * @return 活跃度数据
     */
    double getUserActivity(Long userId, int days);

    /**
     * 获取用户偏好分析
     *
     * @param userId 用户ID
     * @return 用户偏好数据
     */
    Map<String, Object> getUserPreferences(Long userId);

    /**
     * 获取用户流失风险分析
     *
     * @param userId 用户ID
     * @return 流失风险数据
     */
    Map<String, Object> getUserChurnRisk(Long userId);

    /**
     * 获取用户群体行为分析
     *
     * @param userGroup 用户群体
     * @param behaviorType 行为类型
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 群体行为分析数据
     */
    Map<String, Object> getUserGroupBehaviorAnalysis(String userGroup, String behaviorType, Date startDate, Date endDate);

    /**
     * 预测用户购买意向
     *
     * @param userId 用户ID
     * @return 购买意向预测数据
     */
    Map<String, Object> predictPurchaseIntent(Long userId);
}