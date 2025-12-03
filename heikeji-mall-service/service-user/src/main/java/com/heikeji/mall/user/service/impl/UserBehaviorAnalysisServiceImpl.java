package com.heikeji.mall.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.heikeji.mall.user.dto.UserBehaviorDTO;
import com.heikeji.mall.user.entity.UserBehaviorLog;
import com.heikeji.mall.user.mapper.UserBehaviorLogMapper;
import com.heikeji.mall.user.service.UserBehaviorAnalysisService;
import com.heikeji.mall.user.vo.UserStatisticsVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 用户行为分析服务实现类
 */
@Service
public class UserBehaviorAnalysisServiceImpl implements UserBehaviorAnalysisService {

    @Autowired
    private UserBehaviorLogMapper userBehaviorLogMapper;

    @Override
    public boolean recordUserBehavior(UserBehaviorDTO behaviorDTO) {
        // 转换DTO为实体类
        UserBehaviorLog behaviorLog = new UserBehaviorLog();
        behaviorLog.setUserId(behaviorDTO.getUserId());
        behaviorLog.setBehaviorType(behaviorDTO.getBehaviorType().toString());
        behaviorLog.setBehaviorContent(behaviorDTO.getProductId().toString());
        behaviorLog.setBehaviorTime(LocalDateTime.now());
        
        // 保存到数据库
        return userBehaviorLogMapper.insert(behaviorLog) > 0;
    }

    @Override
    public UserStatisticsVO getUserStatistics(Long userId, Date startDate, Date endDate) {
        // 转换Date为LocalDateTime
        LocalDateTime startTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        
        // 查询指定时间范围内的用户行为日志
        QueryWrapper<UserBehaviorLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        queryWrapper.between("behavior_time", startTime, endTime);
        List<UserBehaviorLog> logs = userBehaviorLogMapper.selectList(queryWrapper);
        
        // 统计各项指标
        long browsingCount = logs.stream().filter(log -> "browse".equals(log.getBehaviorType())).count();
        long purchaseCount = logs.stream().filter(log -> "purchase".equals(log.getBehaviorType())).count();
        long favoritesCount = logs.stream().filter(log -> "favorite".equals(log.getBehaviorType())).count();
        long commentsCount = logs.stream().filter(log -> "comment".equals(log.getBehaviorType())).count();
        
        // 计算总订单金额（假设行为内容存储了订单金额）
        double totalOrderAmount = logs.stream()
                .filter(log -> "purchase".equals(log.getBehaviorType()))
                .mapToDouble(log -> {
                    try {
                        return Double.parseDouble(log.getBehaviorContent());
                    } catch (NumberFormatException e) {
                        return 0.0;
                    }
                })
                .sum();
        
        // 构建并返回统计结果
        UserStatisticsVO statisticsVO = new UserStatisticsVO();
        statisticsVO.setUserId(userId);
        statisticsVO.setStartDate(startDate);
        statisticsVO.setEndDate(endDate);
        statisticsVO.setTotalBrowsingCount((int) browsingCount);
        statisticsVO.setTotalPurchaseCount((int) purchaseCount);
        statisticsVO.setTotalFavoritesCount((int) favoritesCount);
        statisticsVO.setTotalCommentsCount((int) commentsCount);
        statisticsVO.setTotalOrderAmount(totalOrderAmount);
        return statisticsVO;
    }

    @Override
    public List<Map<String, Object>> getUserBehaviorTrend(Long userId, String behaviorType, int days) {
        List<Map<String, Object>> trendList = new ArrayList<>();
        
        // 计算起始时间
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime = endTime.minusDays(days);
        
        // 查询指定时间范围内的用户行为日志
        QueryWrapper<UserBehaviorLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        if (behaviorType != null && !behaviorType.isEmpty()) {
            queryWrapper.eq("behavior_type", behaviorType);
        }
        queryWrapper.between("behavior_time", startTime, endTime);
        queryWrapper.orderByAsc("behavior_time");
        List<UserBehaviorLog> logs = userBehaviorLogMapper.selectList(queryWrapper);
        
        // 按日期分组统计行为次数
        Map<String, Long> dailyCount = logs.stream()
                .collect(Collectors.groupingBy(
                        log -> log.getBehaviorTime().toLocalDate().toString(),
                        Collectors.counting()
                ));
        
        // 构建趋势数据
        dailyCount.forEach((date, count) -> {
            Map<String, Object> trend = new HashMap<>();
            trend.put("date", date);
            trend.put("count", count);
            trendList.add(trend);
        });
        
        return trendList;
    }

    @Override
    public List<Map<String, Object>> getUserHotProducts(Long userId, int limit) {
        List<Map<String, Object>> hotProducts = new ArrayList<>();
        
        // 查询用户的浏览、购买、收藏行为
        QueryWrapper<UserBehaviorLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        queryWrapper.in("behavior_type", Arrays.asList("browse", "purchase", "favorite"));
        List<UserBehaviorLog> logs = userBehaviorLogMapper.selectList(queryWrapper);
        
        // 统计商品热度（购买权重为3，收藏权重为2，浏览权重为1）
        Map<String, Integer> productHeat = new HashMap<>();
        for (UserBehaviorLog log : logs) {
            String productId = log.getBehaviorContent();
            int weight = 1;
            if ("favorite".equals(log.getBehaviorType())) {
                weight = 2;
            } else if ("purchase".equals(log.getBehaviorType())) {
                weight = 3;
            }
            productHeat.put(productId, productHeat.getOrDefault(productId, 0) + weight);
        }
        
        // 按热度排序，取前N个商品
        productHeat.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(limit)
                .forEach(entry -> {
                    Map<String, Object> product = new HashMap<>();
                    product.put("productId", entry.getKey());
                    product.put("heat", entry.getValue());
                    hotProducts.add(product);
                });
        
        return hotProducts;
    }

    @Override
    public double getUserActivity(Long userId, int days) {
        // 计算时间范围内的总天数
        long totalDays = days;
        
        // 计算起始时间
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime = endTime.minusDays(days);
        
        // 查询用户在时间范围内的活跃天数
        QueryWrapper<UserBehaviorLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        queryWrapper.between("behavior_time", startTime, endTime);
        queryWrapper.select("DISTINCT DATE(behavior_time) as active_date");
        List<UserBehaviorLog> activeDays = userBehaviorLogMapper.selectList(queryWrapper);
        
        // 计算活跃天数比例
        double activeRatio = (double) activeDays.size() / totalDays;
        
        // 查询用户在时间范围内的行为次数
        QueryWrapper<UserBehaviorLog> countQueryWrapper = new QueryWrapper<>();
        countQueryWrapper.eq("user_id", userId);
        countQueryWrapper.between("behavior_time", startTime, endTime);
        long totalBehaviorCount = userBehaviorLogMapper.selectCount(countQueryWrapper);
        
        // 计算行为频率（平均每天行为次数）
        double avgDailyBehavior = (double) totalBehaviorCount / totalDays;
        
        // 综合计算活跃度得分（0-100）
        // 活跃天数占比（40%） + 行为频率（60%），频率上限设为20次/天
        double activityScore = activeRatio * 40 + Math.min(avgDailyBehavior / 20, 1) * 60;
        
        return activityScore;
    }

    @Override
    public Map<String, Object> getUserPreferences(Long userId) {
        Map<String, Object> preferences = new HashMap<>();
        
        // 查询用户的浏览和购买行为
        QueryWrapper<UserBehaviorLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        queryWrapper.in("behavior_type", Arrays.asList("browse", "purchase", "favorite"));
        List<UserBehaviorLog> logs = userBehaviorLogMapper.selectList(queryWrapper);
        
        // 统计用户对不同商品的兴趣度（购买权重为3，收藏权重为2，浏览权重为1）
        Map<String, Integer> productInterest = new HashMap<>();
        for (UserBehaviorLog log : logs) {
            String productId = log.getBehaviorContent();
            int weight = 1;
            if ("favorite".equals(log.getBehaviorType())) {
                weight = 2;
            } else if ("purchase".equals(log.getBehaviorType())) {
                weight = 3;
            }
            productInterest.put(productId, productInterest.getOrDefault(productId, 0) + weight);
        }
        
        // 按兴趣度排序，取前10个商品
        List<String> preferredProductIds = productInterest.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(10)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
        
        // 统计行为类型分布
        Map<String, Long> behaviorTypeCount = logs.stream()
                .collect(Collectors.groupingBy(UserBehaviorLog::getBehaviorType, Collectors.counting()));
        
        preferences.put("preferredProductIds", preferredProductIds);
        preferences.put("productInterest", productInterest);
        preferences.put("behaviorTypeDistribution", behaviorTypeCount);
        
        return preferences;
    }

    @Override
    public Map<String, Object> getUserChurnRisk(Long userId) {
        Map<String, Object> churnRisk = new HashMap<>();
        List<String> riskFactors = new ArrayList<>();
        
        // 查询用户最近的行为日志
        QueryWrapper<UserBehaviorLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        queryWrapper.orderByDesc("behavior_time");
        queryWrapper.last("LIMIT 1");
        UserBehaviorLog lastBehavior = userBehaviorLogMapper.selectOne(queryWrapper);
        
        String riskLevel = "低";
        double riskScore = 0.0;
        
        if (lastBehavior != null) {
            // 计算最后活跃时间到当前的天数
            long daysSinceLastActive = ChronoUnit.DAYS.between(lastBehavior.getBehaviorTime(), LocalDateTime.now());
            
            // 评估流失风险
            if (daysSinceLastActive > 30) {
                riskLevel = "高";
                riskScore = 0.8;
                riskFactors.add("超过30天未活跃");
            } else if (daysSinceLastActive > 15) {
                riskLevel = "中";
                riskScore = 0.5;
                riskFactors.add("超过15天未活跃");
            }
            
            churnRisk.put("lastActiveTime", lastBehavior.getBehaviorTime());
            churnRisk.put("daysSinceLastActive", daysSinceLastActive);
        } else {
            // 没有行为记录，视为高风险
            riskLevel = "高";
            riskScore = 0.9;
            riskFactors.add("无任何行为记录");
        }
        
        // 计算最近30天的购买频率
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        QueryWrapper<UserBehaviorLog> purchaseQueryWrapper = new QueryWrapper<>();
        purchaseQueryWrapper.eq("user_id", userId);
        purchaseQueryWrapper.eq("behavior_type", "purchase");
        purchaseQueryWrapper.between("behavior_time", thirtyDaysAgo, LocalDateTime.now());
        long recentPurchases = userBehaviorLogMapper.selectCount(purchaseQueryWrapper);
        
        if (recentPurchases == 0) {
            riskScore += 0.1;
            riskFactors.add("最近30天无购买记录");
        }
        
        // 确保风险得分在0-1之间
        riskScore = Math.min(riskScore, 1.0);
        
        churnRisk.put("riskLevel", riskLevel);
        churnRisk.put("riskScore", riskScore);
        churnRisk.put("riskFactors", riskFactors);
        
        return churnRisk;
    }

    @Override
    public Map<String, Object> getUserGroupBehaviorAnalysis(String userGroup, String behaviorType, Date startDate, Date endDate) {
        Map<String, Object> groupAnalysis = new HashMap<>();
        
        // 转换Date为LocalDateTime
        LocalDateTime startTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        
        // 查询指定用户群体在指定时间范围内的行为数据
        QueryWrapper<UserBehaviorLog> queryWrapper = new QueryWrapper<>();
        // 假设user_group字段存储了用户群体信息
        queryWrapper.eq("user_group", userGroup);
        if (behaviorType != null && !behaviorType.isEmpty()) {
            queryWrapper.eq("behavior_type", behaviorType);
        }
        queryWrapper.between("behavior_time", startTime, endTime);
        List<UserBehaviorLog> logs = userBehaviorLogMapper.selectList(queryWrapper);
        
        // 分析群体行为特征和趋势
        long totalBehaviorCount = logs.size();
        Set<Long> uniqueUserIds = logs.stream().map(UserBehaviorLog::getUserId).collect(Collectors.toSet());
        long uniqueUserCount = uniqueUserIds.size();
        
        // 计算人均行为次数
        double avgBehaviorPerUser = uniqueUserCount > 0 ? (double) totalBehaviorCount / uniqueUserCount : 0;
        
        // 统计各行为类型的分布
        Map<String, Long> behaviorTypeDistribution = logs.stream()
                .collect(Collectors.groupingBy(UserBehaviorLog::getBehaviorType, Collectors.counting()));
        
        // 按日期分组统计行为趋势
        Map<String, Long> dailyBehaviorTrend = logs.stream()
                .collect(Collectors.groupingBy(
                        log -> log.getBehaviorTime().toLocalDate().toString(),
                        Collectors.counting()
                ));
        
        // 计算购买相关统计（如果是购买行为）
        double totalPurchaseAmount = 0.0;
        if ("purchase".equals(behaviorType) || behaviorType == null || behaviorType.isEmpty()) {
            totalPurchaseAmount = logs.stream()
                    .filter(log -> "purchase".equals(log.getBehaviorType()))
                    .mapToDouble(log -> {
                        try {
                            return Double.parseDouble(log.getBehaviorContent());
                        } catch (NumberFormatException e) {
                            return 0.0;
                        }
                    })
                    .sum();
        }
        
        // 构建并返回分析结果
        groupAnalysis.put("userGroup", userGroup);
        groupAnalysis.put("behaviorType", behaviorType);
        groupAnalysis.put("startDate", startDate);
        groupAnalysis.put("endDate", endDate);
        groupAnalysis.put("totalBehaviorCount", totalBehaviorCount);
        groupAnalysis.put("uniqueUserCount", uniqueUserCount);
        groupAnalysis.put("avgBehaviorPerUser", avgBehaviorPerUser);
        groupAnalysis.put("behaviorTypeDistribution", behaviorTypeDistribution);
        groupAnalysis.put("dailyBehaviorTrend", dailyBehaviorTrend);
        groupAnalysis.put("totalPurchaseAmount", totalPurchaseAmount);
        
        return groupAnalysis;
    }

    @Override
    public Map<String, Object> predictPurchaseIntent(Long userId) {
        Map<String, Object> purchaseIntent = new HashMap<>();
        
        // 计算最近7天和最近30天的行为数据
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysAgo = now.minusDays(7);
        LocalDateTime thirtyDaysAgo = now.minusDays(30);
        
        // 查询最近7天的浏览次数
        QueryWrapper<UserBehaviorLog> browse7Query = new QueryWrapper<>();
        browse7Query.eq("user_id", userId);
        browse7Query.eq("behavior_type", "browse");
        browse7Query.between("behavior_time", sevenDaysAgo, now);
        long browseCount7 = userBehaviorLogMapper.selectCount(browse7Query);
        
        // 查询最近7天的收藏次数
        QueryWrapper<UserBehaviorLog> favorite7Query = new QueryWrapper<>();
        favorite7Query.eq("user_id", userId);
        favorite7Query.eq("behavior_type", "favorite");
        favorite7Query.between("behavior_time", sevenDaysAgo, now);
        long favoriteCount7 = userBehaviorLogMapper.selectCount(favorite7Query);
        
        // 查询最近30天的购买次数
        QueryWrapper<UserBehaviorLog> purchase30Query = new QueryWrapper<>();
        purchase30Query.eq("user_id", userId);
        purchase30Query.eq("behavior_type", "purchase");
        purchase30Query.between("behavior_time", thirtyDaysAgo, now);
        long purchaseCount30 = userBehaviorLogMapper.selectCount(purchase30Query);
        
        // 简单规则引擎预测购买意向
        double intentScore = 0.0;
        
        // 浏览次数越多，购买意向越高
        intentScore += Math.min(browseCount7 / 20.0, 0.5);
        
        // 收藏次数越多，购买意向越高
        intentScore += Math.min(favoriteCount7 / 10.0, 0.3);
        
        // 近期有购买记录，购买意向较高
        if (purchaseCount30 > 0) {
            intentScore += 0.2;
        }
        
        // 确定意向等级
        String intentLevel;
        if (intentScore > 0.7) {
            intentLevel = "高";
        } else if (intentScore > 0.4) {
            intentLevel = "中";
        } else {
            intentLevel = "低";
        }
        
        purchaseIntent.put("intentLevel", intentLevel);
        purchaseIntent.put("confidence", intentScore);
        
        // 添加预测依据
        Map<String, Object> factors = new HashMap<>();
        factors.put("recentBrowseCount", browseCount7);
        factors.put("recentFavoriteCount", favoriteCount7);
        factors.put("recentPurchaseCount", purchaseCount30);
        purchaseIntent.put("factors", factors);
        
        return purchaseIntent;
    }
}