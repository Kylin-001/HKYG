package com.heikeji.mall.delivery.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heikeji.common.core.exception.BaseException;
import com.heikeji.mall.delivery.constant.DeliveryConstant;
import com.heikeji.mall.delivery.entity.DeliveryOrder;
import com.heikeji.mall.delivery.entity.DeliveryUser;
import com.heikeji.mall.delivery.service.DeliveryAssignService;
import com.heikeji.mall.delivery.service.DeliveryOrderService;
import com.heikeji.mall.delivery.service.DeliveryUserService;
import com.heikeji.mall.delivery.vo.AssignResultVO;
import com.heikeji.mall.delivery.vo.OrderAcceptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 配送订单分配服务实现
 */
@Service
public class DeliveryAssignServiceImpl implements DeliveryAssignService {

    @Autowired
    private DeliveryOrderService deliveryOrderService;

    @Autowired
    private DeliveryUserService deliveryUserService;

    /**
     * 自动分配订单给最合适的配送员
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public AssignResultVO assignOrder(Long orderId) {
        // 查询订单信息
        DeliveryOrder order = deliveryOrderService.getById(orderId);
        if (order == null) {
            AssignResultVO result = new AssignResultVO();
            result.setStatus(0);
            result.setMessage("订单不存在");
            return result;
        }

        // 检查订单状态
        if (order.getStatus() != DeliveryConstant.OrderStatus.PENDING) {
            AssignResultVO result = new AssignResultVO();
            result.setStatus(0);
            result.setMessage("订单已被分配或取消");
            return result;
        }

        // 获取可分配的配送员列表
        List<DeliveryUser> availableUsers = getAvailableDeliveryUsers();
        if (availableUsers.isEmpty()) {
            AssignResultVO result = new AssignResultVO();
            result.setStatus(0);
            result.setMessage("暂无可用配送员");
            return result;
        }

        // 计算每个配送员的匹配度
        List<Map<String, Object>> userScores = new ArrayList<>();
        for (DeliveryUser user : availableUsers) {
            int matchScore = calculateMatchScore(user.getId(), orderId);
            Map<String, Object> userScore = new HashMap<>();
            userScore.put("user", user);
            userScore.put("score", matchScore);
            userScores.add(userScore);
        }

        // 按匹配度降序排序
        userScores.sort((a, b) -> {
            Integer scoreA = (Integer) a.get("score");
            Integer scoreB = (Integer) b.get("score");
            return scoreB.compareTo(scoreA);
        });

        // 分配给匹配度最高的配送员
        DeliveryUser bestMatchUser = (DeliveryUser) userScores.get(0).get("user");
        Integer bestMatchScore = (Integer) userScores.get(0).get("score");

        // 调用接单逻辑
        OrderAcceptRequest acceptRequest = new OrderAcceptRequest();
        acceptRequest.setOrderId(orderId);
        acceptRequest.setDeliveryUserId(bestMatchUser.getId());

        boolean success = deliveryOrderService.acceptOrder(acceptRequest);
        AssignResultVO result = new AssignResultVO();
        if (success) {
            result.setStatus(1);
            result.setMessage("订单分配成功");
            result.setOrderId(orderId);
            result.setDeliveryUserId(bestMatchUser.getId());
            result.setDeliveryUserName(bestMatchUser.getName());
            result.setDeliveryUserPhone(bestMatchUser.getPhone());
            result.setMatchScore(bestMatchScore);
        } else {
            result.setStatus(0);
            result.setMessage("订单分配失败");
        }

        return result;
    }

    /**
     * 手动分配订单给指定配送员
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public AssignResultVO assignOrderManual(Long orderId, Long deliveryUserId) {
        // 查询配送员信息
        DeliveryUser user = deliveryUserService.getById(deliveryUserId);
        if (user == null) {
            AssignResultVO result = new AssignResultVO();
            result.setStatus(0);
            result.setMessage("配送员不存在");
            return result;
        }

        // 检查配送员状态
        if (user.getStatus() != 1) { // 1-已审核通过
            AssignResultVO result = new AssignResultVO();
            result.setStatus(0);
            result.setMessage("配送员状态异常，无法分配订单");
            return result;
        }

        // 计算匹配度
        int matchScore = calculateMatchScore(deliveryUserId, orderId);

        // 调用接单逻辑
        OrderAcceptRequest acceptRequest = new OrderAcceptRequest();
        acceptRequest.setOrderId(orderId);
        acceptRequest.setDeliveryUserId(deliveryUserId);

        boolean success = deliveryOrderService.acceptOrder(acceptRequest);
        AssignResultVO result = new AssignResultVO();
        if (success) {
            result.setStatus(1);
            result.setMessage("订单分配成功");
            result.setOrderId(orderId);
            result.setDeliveryUserId(deliveryUserId);
            result.setDeliveryUserName(user.getName());
            result.setDeliveryUserPhone(user.getPhone());
            result.setMatchScore(matchScore);
        } else {
            result.setStatus(0);
            result.setMessage("订单分配失败");
        }

        return result;
    }

    /**
     * 获取可分配的配送员列表
     */
    @Override
    public Map<String, Object> getAvailableDeliveryUsers(Long orderId) {
        // 获取所有已审核通过的配送员
        List<DeliveryUser> availableUsers = getAvailableDeliveryUsers();

        // 计算每个配送员与订单的匹配度
        List<Map<String, Object>> userMatchList = availableUsers.stream()
                .map(user -> {
                    Map<String, Object> userMatch = new HashMap<>();
                    userMatch.put("deliveryUserId", user.getId());
                    userMatch.put("name", user.getName());
                    userMatch.put("phone", user.getPhone());
                    userMatch.put("status", user.getStatus());
                    userMatch.put("matchScore", calculateMatchScore(user.getId(), orderId));
                    return userMatch;
                })
                .sorted((a, b) -> {
                    Integer scoreA = (Integer) a.get("matchScore");
                    Integer scoreB = (Integer) b.get("matchScore");
                    return scoreB.compareTo(scoreA);
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("deliveryUsers", userMatchList);
        result.put("total", userMatchList.size());
        return result;
    }

    /**
     * 计算配送员与订单的匹配度
     */
    @Override
    public int calculateMatchScore(Long deliveryUserId, Long orderId) {
        // 获取配送员信息
        DeliveryUser user = deliveryUserService.getById(deliveryUserId);
        if (user == null) {
            return 0;
        }

        // 获取订单信息
        DeliveryOrder order = deliveryOrderService.getById(orderId);
        if (order == null) {
            return 0;
        }

        int score = 0;

        // 1. 配送员状态（最高20分）
        if (user.getStatus() == 1) { // 已审核通过
            score += 20;
        }

        // 2. 配送员与订单的距离评分（最高40分）
        // 这里简化处理，实际应该计算真实距离
        // 假设订单起点坐标为(116.3, 39.9)，配送员坐标为user.getLatitude()和user.getLongitude()
        double orderLat = 116.3;
        double orderLng = 39.9;
        double userLat = user.getLatitude() != null ? user.getLatitude() : 0;
        double userLng = user.getLongitude() != null ? user.getLongitude() : 0;
        
        // 简化的距离计算（实际应该使用Haversine公式）
        double distance = Math.sqrt(Math.pow(orderLat - userLat, 2) + Math.pow(orderLng - userLng, 2));
        
        // 距离越近，分数越高
        if (distance < 0.1) {
            score += 40;
        } else if (distance < 0.3) {
            score += 30;
        } else if (distance < 0.5) {
            score += 20;
        } else if (distance < 1.0) {
            score += 10;
        } else {
            score += 5;
        }

        // 3. 配送员历史表现（最高20分）
        // 这里简化处理，实际应该查询配送员历史订单完成率和评分
        // 假设配送员的历史表现良好
        score += 20;

        // 4. 配送员当前负载（最高20分）
        // 这里简化处理，实际应该查询配送员当前待完成的订单数量
        // 假设配送员当前负载较低
        score += 20;

        // 确保分数在0-100之间
        return Math.min(Math.max(score, 0), 100);
    }

    /**
     * 获取所有可用的配送员（已审核通过且在线的配送员）
     */
    private List<DeliveryUser> getAvailableDeliveryUsers() {
        LambdaQueryWrapper<DeliveryUser> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DeliveryUser::getStatus, 1); // 1-已审核通过
        return deliveryUserService.list(queryWrapper);
    }
}
