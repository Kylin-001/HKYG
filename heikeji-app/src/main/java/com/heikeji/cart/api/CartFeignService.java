package com.heikeji.cart.api;

import com.heikeji.cart.dto.CartDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * 购物车服务Feign接口
 */
@FeignClient(name = "heikeji-product")
public interface CartFeignService {

    /**
     * 获取用户购物车列表
     */
    @GetMapping("/api/cart/list")
    List<CartDTO> getCartList(@RequestParam("userId") Long userId);

    /**
     * 添加商品到购物车
     */
    @PostMapping("/api/cart/add")
    boolean addToCart(@RequestParam("userId") Long userId,
                      @RequestParam("productId") Long productId,
                      @RequestParam("quantity") Integer quantity,
                      @RequestParam("skuId") String skuId);

    /**
     * 更新购物车商品数量
     */
    @PostMapping("/api/cart/update")
    boolean updateCartItem(@RequestParam("userId") Long userId,
                          @RequestParam("id") Long id,
                          @RequestParam("quantity") Integer quantity);

    /**
     * 删除购物车商品
     */
    @PostMapping("/api/cart/delete")
    boolean deleteCartItem(@RequestParam("userId") Long userId,
                          @RequestParam("id") Long id);

    /**
     * 清空购物车
     */
    @PostMapping("/api/cart/clear")
    void clearCart(@RequestParam("userId") Long userId);

    /**
     * 批量删除购物车商品
     */
    @PostMapping("/api/cart/batch-delete")
    boolean batchDeleteCartItems(@RequestParam("userId") Long userId,
                                @RequestParam("ids") Long[] ids);
}
