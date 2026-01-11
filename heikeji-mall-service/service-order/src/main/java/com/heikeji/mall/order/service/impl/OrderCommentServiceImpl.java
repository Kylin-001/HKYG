package com.heikeji.mall.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.order.entity.OrderComment;
import com.heikeji.mall.order.mapper.OrderCommentMapper;
import com.heikeji.mall.order.service.OrderCommentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Date;

/**
 * 订单评价Service实现类
 */
@Service
public class OrderCommentServiceImpl extends ServiceImpl<OrderCommentMapper, OrderComment> implements OrderCommentService {
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean submitOrderComment(OrderComment orderComment) {
        try {
            orderComment.setCreateTime(new Date());
            orderComment.setUpdateTime(new Date());
            orderComment.setStatus(1); // 默认状态为已审核
            return this.save(orderComment);
        } catch (Exception e) {
            log.error("提交订单评价失败：", e);
            return false;
        }
    }
    
    @Override
    public List<OrderComment> getOrderCommentsByOrderId(Long orderId) {
        QueryWrapper<OrderComment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_id", orderId);
        return baseMapper.selectList(queryWrapper);
    }
    
    @Override
    public List<OrderComment> getProductComments(Long productId) {
        QueryWrapper<OrderComment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("product_id", productId)
                    .eq("status", 1)
                    .orderByDesc("create_time");
        return baseMapper.selectList(queryWrapper);
    }
    
    @Override
    public Map<String, Object> getProductCommentsByPage(Long productId, Integer page, Integer limit) {
        Map<String, Object> result = new HashMap<>();
        
        Page<OrderComment> pageParam = new Page<>(page, limit);
        QueryWrapper<OrderComment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("product_id", productId)
                    .eq("status", 1)
                    .orderByDesc("create_time");
        
        Page<OrderComment> pageResult = baseMapper.selectPage(pageParam, queryWrapper);
        
        result.put("total", pageResult.getTotal());
        result.put("list", pageResult.getRecords());
        result.put("page", page);
        result.put("limit", limit);
        
        return result;
    }
    
    @Override
    public Map<String, Object> getProductCommentStatistics(Long productId) {
        Map<String, Object> statistics = new HashMap<>();
        
        // 查询商品评价总数
        Integer totalComments = Math.toIntExact(baseMapper.selectCount(new QueryWrapper<OrderComment>()
                .eq("product_id", productId)
                .eq("status", 1)));
        statistics.put("totalComments", totalComments);
        
        if (totalComments == 0) {
            // 如果没有评价，返回默认值
            statistics.put("avgRating", 0.0);
            statistics.put("fiveStarCount", 0);
            statistics.put("fourStarCount", 0);
            statistics.put("threeStarCount", 0);
            statistics.put("twoStarCount", 0);
            statistics.put("oneStarCount", 0);
            return statistics;
        }
        
        // 查询各星级评价数量
        Integer fiveStarCount = Math.toIntExact(baseMapper.selectCount(new QueryWrapper<OrderComment>()
                .eq("product_id", productId)
                .eq("status", 1)
                .eq("rating", 5)));
        Integer fourStarCount = Math.toIntExact(baseMapper.selectCount(new QueryWrapper<OrderComment>()
                .eq("product_id", productId)
                .eq("status", 1)
                .eq("rating", 4)));
        Integer threeStarCount = Math.toIntExact(baseMapper.selectCount(new QueryWrapper<OrderComment>()
                .eq("product_id", productId)
                .eq("status", 1)
                .eq("rating", 3)));
        Integer twoStarCount = Math.toIntExact(baseMapper.selectCount(new QueryWrapper<OrderComment>()
                .eq("product_id", productId)
                .eq("status", 1)
                .eq("rating", 2)));
        Integer oneStarCount = Math.toIntExact(baseMapper.selectCount(new QueryWrapper<OrderComment>()
                .eq("product_id", productId)
                .eq("status", 1)
                .eq("rating", 1)));
        
        // 计算平均评分
        double totalRating = fiveStarCount * 5 + fourStarCount * 4 + threeStarCount * 3 + twoStarCount * 2 + oneStarCount * 1;
        double avgRating = totalRating / totalComments;
        
        statistics.put("avgRating", avgRating);
        statistics.put("fiveStarCount", fiveStarCount);
        statistics.put("fourStarCount", fourStarCount);
        statistics.put("threeStarCount", threeStarCount);
        statistics.put("twoStarCount", twoStarCount);
        statistics.put("oneStarCount", oneStarCount);
        
        return statistics;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateCommentStatus(Long id, Integer status) {
        OrderComment orderComment = new OrderComment();
        orderComment.setId(id);
        orderComment.setStatus(status);
        orderComment.setUpdateTime(new Date());
        return this.updateById(orderComment);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean replyOrderComment(Long id, String replyContent) {
        OrderComment orderComment = new OrderComment();
        orderComment.setId(id);
        orderComment.setReplyContent(replyContent);
        orderComment.setReplyTime(new Date());
        orderComment.setUpdateTime(new Date());
        return this.updateById(orderComment);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteOrderComment(Long id) {
        return this.removeById(id);
    }
}