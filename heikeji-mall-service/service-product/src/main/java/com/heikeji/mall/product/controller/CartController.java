package com.heikeji.mall.product.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.product.entity.Cart;
import com.heikeji.mall.product.service.CartService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 购物车控制器
 */
@RestController
@RequestMapping("/api/cart")
@Api(tags = "购物车管理")
public class CartController {

    @Autowired
    private CartService cartService;

    /**
     * 添加商品到购物车
     */
    @PostMapping
    @ApiOperation("添加商品到购物车")
    public R<Cart> addToCart(@RequestParam Long userId, @RequestParam Long productId, @RequestParam Integer quantity) {
        Cart cart = cartService.addToCart(userId, productId, quantity);
        return R.success(cart);
    }

    /**
     * 更新购物车商品数量
     */
    @PutMapping("/quantity")
    @ApiOperation("更新购物车商品数量")
    public R<Boolean> updateQuantity(@RequestParam Long userId, @RequestParam Long productId, @RequestParam Integer quantity) {
        boolean result = cartService.updateQuantity(userId, productId, quantity);
        return R.success(result);
    }

    /**
     * 更新购物车商品选中状态
     */
    @PutMapping("/selected")
    @ApiOperation("更新购物车商品选中状态")
    public R<Boolean> updateSelectedStatus(@RequestParam Long userId, @RequestParam Long productId, @RequestParam Integer selected) {
        boolean result = cartService.updateSelectedStatus(userId, productId, selected);
        return R.success(result);
    }

    /**
     * 批量更新购物车商品选中状态
     */
    @PutMapping("/selected/batch")
    @ApiOperation("批量更新购物车商品选中状态")
    public R<Boolean> updateBatchSelectedStatus(@RequestBody List<Long> productIds, @RequestParam Long userId, @RequestParam Integer selected) {
        boolean result = cartService.updateBatchSelectedStatus(userId, productIds, selected);
        return R.success(result);
    }

    /**
     * 更新用户所有购物车商品选中状态（全选/取消全选）
     */
    @PutMapping("/selected/all")
    @ApiOperation("全选/取消全选购物车商品")
    public R<Boolean> updateAllSelectedStatus(@RequestParam Long userId, @RequestParam Integer selected) {
        boolean result = cartService.updateAllSelectedStatus(userId, selected);
        return R.success(result);
    }

    /**
     * 从购物车删除商品
     */
    @DeleteMapping("/{productId}")
    @ApiOperation("删除购物车商品")
    public R<Boolean> removeFromCart(@PathVariable Long productId, @RequestParam Long userId) {
        boolean result = cartService.deleteCart(userId, productId);
        return R.success(result);
    }

    /**
     * 批量删除购物车商品
     */
    @DeleteMapping("/batch")
    @ApiOperation("批量删除购物车商品")
    public R<Boolean> removeBatchFromCart(@RequestBody List<Long> productIds, @RequestParam Long userId) {
        boolean result = cartService.deleteBatchCart(userId, productIds);
        return R.success(result);
    }

    /**
     * 清空购物车
     */
    @DeleteMapping
    @ApiOperation("清空购物车")
    public R<Boolean> clearCart(@RequestParam Long userId) {
        boolean result = cartService.clearCart(userId);
        return R.success(result);
    }

    /**
     * 获取用户购物车列表
     */
    @GetMapping
    @ApiOperation("获取购物车列表")
    public R<List<Cart>> getCartList(@RequestParam Long userId) {
        List<Cart> cartList = cartService.getCartList(userId);
        return R.success(cartList);
    }

    /**
     * 获取用户选中的购物车商品
     */
    @GetMapping("/selected")
    @ApiOperation("获取选中的购物车商品")
    public R<List<Cart>> getSelectedCartItems(@RequestParam Long userId) {
        List<Cart> selectedCartItems = cartService.getSelectedCartItems(userId);
        return R.success(selectedCartItems);
    }

    /**
     * 获取购物车商品数量
     */
    @GetMapping("/count")
    @ApiOperation("获取购物车商品数量")
    public R<Integer> getCartItemCount(@RequestParam Long userId) {
        Integer count = cartService.getCartItemCount(userId);
        return R.success(count);
    }

    /**
     * 检查购物车商品库存
     */
    @GetMapping("/check-stock")
    @ApiOperation("检查购物车商品库存")
    public R<List<String>> checkCartStock(@RequestParam Long userId) {
        List<String> outOfStockItems = cartService.checkCartStock(userId);
        return R.success(outOfStockItems);
    }
}