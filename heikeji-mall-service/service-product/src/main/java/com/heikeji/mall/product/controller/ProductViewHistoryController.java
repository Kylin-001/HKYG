package com.heikeji.mall.product.controller;

import com.heikeji.common.core.annotation.RequiresLogin;
import com.heikeji.common.core.domain.R;
import com.heikeji.common.core.security.UserContextHolderAdapter;
import com.heikeji.mall.product.service.ProductViewHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 用户浏览历史控制器
 * @author heikeji
 * @date 2024-04-21
 */
@Slf4j
@RestController
@RequestMapping("/api/product/view-history")
@Tag(name = "用户浏览历史管理")
public class ProductViewHistoryController {

    @Autowired
    private ProductViewHistoryService productViewHistoryService;

    /**
     * 记录商品浏览
     * @param productId 商品ID
     * @return 结果
     */
    @PostMapping("/record/{productId}")
    @Operation(summary = "记录商品浏览")
    public R<Boolean> recordView(@PathVariable Long productId) {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        if (userId == null) {
            // 未登录用户可以不记录浏览历史，或者用其他方式记录
            log.info("未登录用户浏览商品，不记录历史，商品ID: {}", productId);
            return R.success(true);
        }

        boolean result = productViewHistoryService.recordView(userId, productId);
        return result ? R.success(true) : R.error("记录浏览历史失败");
    }

    /**
     * 删除单个浏览记录
     * @param productId 商品ID
     * @return 结果
     */
    @DeleteMapping("/delete/{productId}")
    @RequiresLogin
    @Operation(summary = "删除单个浏览记录")
    public R<Boolean> deleteViewHistory(@PathVariable Long productId) {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        boolean result = productViewHistoryService.deleteViewHistory(userId, productId);
        return result ? R.success(true) : R.error("删除浏览记录失败");
    }

    /**
     * 清空所有浏览记录
     * @return 结果
     */
    @DeleteMapping("/clear-all")
    @RequiresLogin
    @Operation(summary = "清空所有浏览记录")
    public R<Boolean> clearAllViewHistory() {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        boolean result = productViewHistoryService.clearAllViewHistory(userId);
        return result ? R.success(true) : R.error("清空浏览记录失败");
    }
}