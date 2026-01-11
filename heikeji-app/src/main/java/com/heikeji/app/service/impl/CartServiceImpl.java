package com.heikeji.app.service.impl;

import com.heikeji.app.model.response.AppResponse;
import com.heikeji.app.service.CartService;
import com.heikeji.cart.api.CartFeignService;
import com.heikeji.cart.dto.CartDTO;
import com.heikeji.member.api.MemberFeignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 购物车服务实现类
 */
@Service
public class CartServiceImpl implements CartService {

    @Autowired(required = false)
    private CartFeignService cartFeignService;
    
    @Autowired(required = false)
    private MemberFeignService memberFeignService;

    /**
     * 获取当前登录用户ID
     */
    private Long getCurrentUserId() {
        // 从Spring Security上下文获取用户信息
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof String) {
            return Long.parseLong((String) principal);
        } else {
            // 这里可以根据实际情况获取用户ID
            return 0L;
        }
    }

    @Override
    public AppResponse<?> getCartList() {
        Long userId = getCurrentUserId();
        List<CartDTO> cartList = cartFeignService.getCartList(userId);
        return AppResponse.success(cartList);
    }

    @Override
    public AppResponse<?> addToCart(Long productId, Integer quantity, String skuId) {
        Long userId = getCurrentUserId();
        
        // 验证商品是否存在和库存
        boolean added = cartFeignService.addToCart(userId, productId, quantity, skuId);
        
        if (added) {
            return AppResponse.success("添加成功");
        } else {
            return AppResponse.error(400, "添加失败，商品可能不存在或库存不足");
        }
    }

    @Override
    public AppResponse<?> updateCartItem(Long id, Integer quantity) {
        Long userId = getCurrentUserId();
        
        boolean updated = cartFeignService.updateCartItem(userId, id, quantity);
        
        if (updated) {
            return AppResponse.success("更新成功");
        } else {
            return AppResponse.error(400, "更新失败，购物车商品不存在");
        }
    }

    @Override
    public AppResponse<?> deleteCartItem(Long id) {
        Long userId = getCurrentUserId();
        
        boolean deleted = cartFeignService.deleteCartItem(userId, id);
        
        if (deleted) {
            return AppResponse.success("删除成功");
        } else {
            return AppResponse.error(400, "删除失败");
        }
    }

    @Override
    public AppResponse<?> clearCart() {
        Long userId = getCurrentUserId();
        cartFeignService.clearCart(userId);
        return AppResponse.success("购物车已清空");
    }

    @Override
    public AppResponse<?> batchDeleteCartItems(Long[] ids) {
        Long userId = getCurrentUserId();
        
        boolean deleted = cartFeignService.batchDeleteCartItems(userId, ids);
        
        if (deleted) {
            return AppResponse.success("批量删除成功");
        } else {
            return AppResponse.error(400, "批量删除失败");
        }
    }
}