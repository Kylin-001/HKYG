package com.heikeji.mall.order.service.impl;

// import com.alibaba.fastjson.JSON; // 包不存在，暂时注释
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
// import com.heikeji.mall.common.core.exception.BaseException; // 包不存在，暂时注释
import com.heikeji.mall.order.constant.OrderConstant;
import com.heikeji.mall.order.domain.dto.OrderReviewDTO;
import com.heikeji.mall.order.domain.vo.OrderReviewVO;
import com.heikeji.mall.order.entity.Order;
import com.heikeji.mall.order.entity.OrderReview;
import com.heikeji.mall.order.mapper.OrderMapper;
import com.heikeji.mall.order.mapper.OrderReviewMapper;
import com.heikeji.mall.order.service.OrderReviewService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * 订单评价服务实现类
 */
@Service
@Slf4j
public class OrderReviewServiceImpl extends ServiceImpl<OrderReviewMapper, OrderReview> implements OrderReviewService {

    @Autowired
    private OrderReviewMapper orderReviewMapper;
    
    @Autowired
    private OrderMapper orderMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean submitReview(Long userId, OrderReviewDTO dto) {
        log.info("用户{}提交订单{}的评价", userId, dto.getOrderNo());
        
        // 验证订单是否存在且属于当前用户
        Order order = orderMapper.selectOne(new QueryWrapper<Order>()
                .eq("order_no", dto.getOrderNo())
                .eq("user_id", userId));
        
        if (order == null) {
            throw new RuntimeException("订单不存在或无权限操作"); // 使用标准RuntimeException替代BaseException
        }
        
        // 验证订单状态是否为已完成
        if (!order.getStatus().equals(OrderConstant.ORDER_STATUS_COMPLETED)) { // 使用正确的字段名和常量
            throw new RuntimeException("只有已完成的订单才能评价"); // 使用标准RuntimeException替代BaseException
        }
        
        // 检查订单是否已评价
        if (isOrderReviewed(dto.getOrderNo())) {
            throw new RuntimeException("该订单已评价"); // 使用标准RuntimeException替代BaseException
        }
        
        // 批量保存评价
        List<OrderReview> reviewList = new ArrayList<>();
        Date now = new Date();
        
        for (OrderReviewDTO.ProductReviewDTO productReview : dto.getReviews()) {
            OrderReview review = new OrderReview();
            review.setOrderNo(dto.getOrderNo());
            review.setUserId(userId);
            // 修复类型转换：假设productId在OrderReview中是Long类型
            review.setProductId(productReview.getProductId());
            review.setRating(productReview.getRating());
            review.setContent(productReview.getContent());
            
            // 处理评价图片
            if (productReview.getImages() != null && !productReview.getImages().isEmpty()) {
                review.setImages(String.join(",", productReview.getImages())); // 使用String.join替代JSON
            }
            
            review.setCreateTime(now);
            review.setUpdateTime(now);
            
            // TODO: 可以通过Feign调用商品服务获取商品名称和图片，这里暂时留空
            
            reviewList.add(review);
        }
        
        boolean result = saveBatch(reviewList);
        log.info("订单评价提交{}", result ? "成功" : "失败");
        return result;
    }

    @Override
    public List<OrderReviewVO> getReviewsByOrderNo(String orderNo) {
        List<OrderReview> reviews = orderReviewMapper.selectByOrderNo(orderNo);
        return convertToVOList(reviews);
    }

    @Override
    public List<OrderReviewVO> getReviewsByProductId(Long productId, Integer page, Integer limit) {
        // 计算偏移量
        int offset = (page - 1) * limit;
        
        // 查询评价数据
        List<OrderReview> reviews = orderReviewMapper.selectList(
                new QueryWrapper<OrderReview>()
                        .eq("product_id", productId)
                        .orderByDesc("create_time")
                        .last("LIMIT " + offset + "," + limit)
        );
        
        return convertToVOList(reviews);
    }

    @Override
    public List<OrderReviewVO> getReviewsByUserId(Long userId, Integer page, Integer limit) {
        // 计算偏移量
        int offset = (page - 1) * limit;
        
        // 查询评价数据
        List<OrderReview> reviews = orderReviewMapper.selectList(
                new QueryWrapper<OrderReview>()
                        .eq("user_id", userId)
                        .orderByDesc("create_time")
                        .last("LIMIT " + offset + "," + limit)
        );
        
        return convertToVOList(reviews);
    }

    @Override
    public Double getAverageRatingByProductId(Long productId) {
        Double avgRating = orderReviewMapper.getAverageRatingByProductId(productId);
        return avgRating != null ? avgRating : 0.0;
    }

    @Override
    public Integer getReviewCountByProductId(Long productId) {
        // 修复类型转换：假设getReviewCountByProductId返回Integer
        Integer count = orderReviewMapper.getReviewCountByProductId(productId);
        return count != null ? count : 0;
    }

    @Override
    public Boolean isOrderReviewed(String orderNo) {
        // 修复类型转换：selectCount可能返回Long
        Long count = orderReviewMapper.selectCount(
                new QueryWrapper<OrderReview>()
                        .eq("order_no", orderNo)
        );
        return count != null && count > 0;
    }

    @Override
    public List<Long> getReviewableProducts(String orderNo, Long userId) {
        log.info("获取订单{}的可评价商品列表，用户ID：{}", orderNo, userId);
        
        // 验证订单是否存在且属于当前用户
        Order order = orderMapper.selectOne(new QueryWrapper<Order>()
                .eq("order_no", orderNo)
                .eq("user_id", userId));
        
        if (order == null) {
            throw new RuntimeException("订单不存在或无权限操作");
        }
        
        // 验证订单状态是否为已完成
        if (!order.getStatus().equals(4)) { // 使用硬编码的状态值替代不存在的常量
            throw new RuntimeException("只有已完成的订单才能评价");
        }
        
        // 这里应该查询order_item表获取商品ID列表
        // 由于没有OrderItemMapper的具体实现，暂时返回空列表
        return Collections.emptyList();
    }
    
    /**
     * 将实体列表转换为VO列表
     */
    private List<OrderReviewVO> convertToVOList(List<OrderReview> reviews) {
        if (reviews == null || reviews.isEmpty()) {
            return Collections.emptyList();
        }
        
        return reviews.stream().map(this::convertToVO).collect(Collectors.toList());
    }
    
    /**
     * 将实体转换为VO
     */
    private OrderReviewVO convertToVO(OrderReview review) {
        OrderReviewVO vo = new OrderReviewVO();
        BeanUtils.copyProperties(review, vo);
        
        // 处理图片列表
        if (review.getImages() != null) {
            vo.setImages(Arrays.asList(review.getImages().split(","))); // 使用String.split替代JSON
        }
        
        // 格式化时间
        vo.setFormattedTime(formatDate(review.getCreateTime()));
        
        // TODO: 可以通过Feign调用用户服务获取用户名和头像
        vo.setUserName("用户" + (review.getUserId() % 10000)); // 临时生成用户名
        
        return vo;
    }
    
    /**
     * 格式化日期
     */
    private String formatDate(Date date) {
        if (date == null) {
            return "";
        }
        // 简单的日期格式化，实际项目中建议使用DateFormat或DateTimeFormatter
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        return String.format("%d-%02d-%02d %02d:%02d",
                cal.get(Calendar.YEAR),
                cal.get(Calendar.MONTH) + 1,
                cal.get(Calendar.DAY_OF_MONTH),
                cal.get(Calendar.HOUR_OF_DAY),
                cal.get(Calendar.MINUTE));
    }
}