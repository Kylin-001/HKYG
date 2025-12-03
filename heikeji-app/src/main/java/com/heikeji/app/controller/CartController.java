package com.heikeji.app.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.heikeji.app.model.response.AppResponse;
import com.heikeji.app.service.CartService;

/**
 * 购物车控制器
 * 处理APP端的购物车功能
 */
@RestController
@RequestMapping("/api/app/cart")
@Api(tags = "购物车管理")
public class CartController {

    @Autowired
    private CartService cartService;

    /**
     * 获取购物车列表
     */
    @GetMapping("/list")
    @ApiOperation("获取购物车列表")
    public AppResponse<?> getCartList() {
        return cartService.getCartList();
    }

    /**
     * 添加商品到购物车
     */
    @PostMapping("/add")
    @ApiOperation("添加商品到购物车")
    public AppResponse<?> addToCart(
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestParam(required = false) String skuId) {
        return cartService.addToCart(productId, quantity, skuId);
    }

    /**
     * 更新购物车商品数量
     */
    @PutMapping("/update")
    @ApiOperation("更新购物车商品数量")
    public AppResponse<?> updateCartItem(
            @RequestParam Long id,
            @RequestParam Integer quantity) {
        return cartService.updateCartItem(id, quantity);
    }

    /**
     * 删除购物车商品
     */
    @DeleteMapping("/delete")
    @ApiOperation("删除购物车商品")
    public AppResponse<?> deleteCartItem(@RequestParam Long id) {
        return cartService.deleteCartItem(id);
    }

    /**
     * 清空购物车
     */
    @DeleteMapping("/clear")
    @ApiOperation("清空购物车")
    public AppResponse<?> clearCart() {
        return cartService.clearCart();
    }

    /**
     * 批量删除购物车商品
     */
    @DeleteMapping("/batchDelete")
    @ApiOperation("批量删除购物车商品")
    public AppResponse<?> batchDeleteCartItems(@RequestParam Long[] ids) {
        return cartService.batchDeleteCartItems(ids);
    }
}