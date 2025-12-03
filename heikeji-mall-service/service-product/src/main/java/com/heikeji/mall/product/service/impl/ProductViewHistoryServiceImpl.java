package com.heikeji.mall.product.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.product.entity.ProductViewHistory;
import com.heikeji.mall.product.mapper.ProductViewHistoryMapper;
import com.heikeji.mall.product.service.ProductViewHistoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 用户浏览历史服务实现类
 * @author heikeji
 * @date 2024-04-21
 */
@Slf4j
@Service
public class ProductViewHistoryServiceImpl extends ServiceImpl<ProductViewHistoryMapper, ProductViewHistory> implements ProductViewHistoryService {

    @Override
    public boolean recordView(Long userId, Long productId) {
        if (userId == null || productId == null) {
            log.warn("用户ID或商品ID为空，无法记录浏览历史");
            return false;
        }

        try {
            int result = baseMapper.recordOrUpdateViewHistory(userId, productId);
            log.info("记录用户浏览历史成功，用户ID: {}, 商品ID: {}", userId, productId);
            return result > 0;
        } catch (Exception e) {
            log.error("记录用户浏览历史失败，用户ID: {}, 商品ID: {}", userId, productId, e);
            return false;
        }
    }

    @Override
    public List<Long> getRecentViewedProductIds(Long userId, Integer limit) {
        if (userId == null || limit == null || limit <= 0) {
            log.warn("无效的参数，用户ID或限制数量不合法");
            return List.of();
        }

        try {
            return baseMapper.getRecentViewedProductIds(userId, limit);
        } catch (Exception e) {
            log.error("获取用户最近浏览商品ID列表失败，用户ID: {}", userId, e);
            return List.of();
        }
    }

    @Override
    public List<Long> getMostViewedCategoryIds(Long userId, Integer limit) {
        if (userId == null || limit == null || limit <= 0) {
            log.warn("无效的参数，用户ID或限制数量不合法");
            return List.of();
        }

        try {
            return baseMapper.getMostViewedCategoryIds(userId, limit);
        } catch (Exception e) {
            log.error("获取用户浏览最多的分类ID列表失败，用户ID: {}", userId, e);
            return List.of();
        }
    }

    @Override
    public boolean deleteViewHistory(Long userId, Long productId) {
        if (userId == null || productId == null) {
            log.warn("用户ID或商品ID为空，无法删除浏览记录");
            return false;
        }

        try {
            int result = baseMapper.deleteByUserIdAndProductId(userId, productId);
            log.info("删除用户浏览记录成功，用户ID: {}, 商品ID: {}", userId, productId);
            return result > 0;
        } catch (Exception e) {
            log.error("删除用户浏览记录失败，用户ID: {}, 商品ID: {}", userId, productId, e);
            return false;
        }
    }

    @Override
    public boolean clearAllViewHistory(Long userId) {
        if (userId == null) {
            log.warn("用户ID为空，无法清空浏览记录");
            return false;
        }

        try {
            int result = baseMapper.deleteByUserId(userId);
            log.info("清空用户所有浏览记录成功，用户ID: {}, 删除条数: {}", userId, result);
            return result >= 0;
        } catch (Exception e) {
            log.error("清空用户所有浏览记录失败，用户ID: {}", userId, e);
            return false;
        }
    }
}