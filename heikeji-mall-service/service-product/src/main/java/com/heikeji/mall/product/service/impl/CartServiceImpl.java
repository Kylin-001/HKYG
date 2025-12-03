package com.heikeji.mall.product.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.product.entity.Cart;
import com.heikeji.mall.product.entity.Product;
import com.heikeji.mall.product.mapper.CartMapper;
import com.heikeji.mall.product.service.CartService;
import com.heikeji.mall.product.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 购物车服务实现类
 */
@Service
public class CartServiceImpl extends ServiceImpl<CartMapper, Cart> implements CartService {

    @Autowired
    private CartMapper cartMapper;
    
    @Autowired
    private ProductService productService;

    /**
     * 添加购物车
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean addCart(Cart cart) {
        if (cart == null || cart.getUserId() == null || cart.getProductId() == null || cart.getQuantity() <= 0) {
            throw new RuntimeException("参数错误");
        }
        
        // 验证商品是否存在
        Product product = productService.getById(cart.getProductId());
        if (product == null) {
            throw new RuntimeException("商品不存在");
        }
        
        // 检查库存
        if (product.getStock() < cart.getQuantity()) {
            throw new RuntimeException("商品库存不足");
        }
        
        // 查询购物车中是否已存在该商品
        Cart existingCart = cartMapper.selectByUserIdAndProductId(cart.getUserId(), cart.getProductId());
        if (existingCart != null) {
            // 已存在则更新数量
            existingCart.setQuantity(existingCart.getQuantity() + cart.getQuantity());
            // 如果传入了选中状态，则更新选中状态
            if (cart.getSelected() != null) {
                existingCart.setSelected(cart.getSelected());
            }
            return this.updateById(existingCart);
        } else {
            // 不存在则创建新记录，默认选中
            if (cart.getSelected() == null) {
                cart.setSelected(1);
            }
            return this.save(cart);
        }
    }

    /**
     * 更新购物车商品数量
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateQuantity(Long userId, Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new RuntimeException("商品数量必须大于0");
        }
        
        // 检查库存
        Product product = productService.getById(productId);
        if (product == null) {
            throw new RuntimeException("商品不存在");
        }
        if (product.getStock() < quantity) {
            throw new RuntimeException("商品库存不足");
        }
        
        return cartMapper.updateQuantity(userId, productId, quantity) > 0;
    }

    /**
     * 更新购物车商品选中状态
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateSelectedStatus(Long userId, Long productId, Integer selected) {
        if (selected != 0 && selected != 1) {
            throw new RuntimeException("选中状态参数错误");
        }
        return cartMapper.updateSelectedStatus(userId, productId, selected) > 0;
    }

    /**
     * 批量更新购物车商品选中状态
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateBatchSelectedStatus(Long userId, List<Long> productIds, Integer selected) {
        if (selected != 0 && selected != 1) {
            throw new RuntimeException("选中状态参数错误");
        }
        if (productIds == null || productIds.isEmpty()) {
            throw new RuntimeException("商品ID列表不能为空");
        }
        return cartMapper.updateBatchSelectedStatus(userId, productIds, selected) > 0;
    }

    /**
     * 更新用户所有购物车商品选中状态
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateAllSelectedStatus(Long userId, Integer selected) {
        if (selected != 0 && selected != 1) {
            throw new RuntimeException("选中状态参数错误");
        }
        return cartMapper.updateAllSelectedStatus(userId, selected) > 0;
    }

    /**
     * 删除购物车商品
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteCart(Long userId, Long productId) {
        return cartMapper.deleteByUserIdAndProductId(userId, productId) > 0;
    }

    /**
     * 批量删除购物车商品
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteBatchCart(Long userId, List<Long> productIds) {
        return cartMapper.deleteByUserIdAndProductIds(userId, productIds) > 0;
    }

    /**
     * 清空购物车
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean clearCart(Long userId) {
        return cartMapper.deleteByUserId(userId) > 0;
    }

    /**
     * 根据用户ID获取购物车列表
     */
    @Override
    public List<Cart> getCartList(Long userId) {
        return cartMapper.selectByUserId(userId);
    }

    /**
     * 获取用户购物车商品总数
     */
    @Override
    public int getCartItemCount(Long userId) {
        List<Cart> cartList = cartMapper.selectByUserId(userId);
        return cartList.stream().mapToInt(Cart::getQuantity).sum();
    }

    /**
     * 获取用户选中的购物车商品
     */
    @Override
    public List<Cart> getSelectedCartItems(Long userId) {
        return cartMapper.selectSelectedCartItems(userId);
    }

    /**
     * 检查购物车商品库存
     */
    @Override
    public List<String> checkCartStock(Long userId) {
        List<Cart> cartList = cartMapper.selectByUserId(userId);
        List<String> stockErrorList = new ArrayList<>();
        
        for (Cart cart : cartList) {
            Product product = productService.getById(cart.getProductId());
            if (product != null && product.getStock() < cart.getQuantity()) {
                stockErrorList.add(product.getName() + " 库存不足");
            }
        }
        
        return stockErrorList;
    }
    
    /**
     * 添加商品到购物车（兼容旧接口）
     */
    public Cart addToCart(Long userId, Long productId, Integer quantity) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setProductId(productId);
        cart.setQuantity(quantity);
        cart.setSelected(1); // 默认选中
        
        addCart(cart);
        return cartMapper.selectByUserIdAndProductId(userId, productId);
    }
    
    /**
     * 更新购物车商品数量（兼容旧接口）
     */
    public boolean updateCartQuantity(Long userId, Long productId, Integer quantity) {
        return updateQuantity(userId, productId, quantity);
    }
    
    /**
     * 从购物车删除商品（兼容旧接口）
     */
    public boolean removeFromCart(Long userId, Long productId) {
        return deleteCart(userId, productId);
    }
    
    /**
     * 批量删除购物车商品（兼容旧接口）
     */
    public boolean removeBatchFromCart(Long userId, List<Long> productIds) {
        return deleteBatchCart(userId, productIds);
    }
    
    /**
     * 获取用户购物车列表（兼容旧接口）
     */
    public List<Cart> getUserCartList(Long userId) {
        return getCartList(userId);
    }
}
