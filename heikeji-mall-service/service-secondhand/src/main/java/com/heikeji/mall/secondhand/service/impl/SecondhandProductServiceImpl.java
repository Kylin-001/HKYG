package com.heikeji.mall.secondhand.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.secondhand.entity.SecondhandProduct;
import com.heikeji.mall.secondhand.mapper.SecondhandProductMapper;
import com.heikeji.mall.secondhand.service.SecondhandProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * 二手商品服务实现类
 */
@Service
@Slf4j
public class SecondhandProductServiceImpl extends ServiceImpl<SecondhandProductMapper, SecondhandProduct> implements SecondhandProductService {

    @Autowired
    private SecondhandProductMapper secondhandProductMapper;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long publishProduct(SecondhandProduct product) {
        // 设置默认值
        product.setStatus(0); // 待审核
        product.setViewCount(0);
        product.setCollectCount(0);
        product.setCommentCount(0);
        product.setCreateTime(new Date());
        product.setUpdateTime(new Date());
        product.setDelFlag(0);

        // 保存商品
        secondhandProductMapper.insert(product);
        return product.getId();
    }

    @Override
    public SecondhandProduct getProductDetail(Long productId) {
        // 先从Redis获取
        String redisKey = "secondhand:product:" + productId;
        SecondhandProduct product = (SecondhandProduct) redisTemplate.opsForValue().get(redisKey);

        if (product == null) {
            // 从数据库获取
            product = secondhandProductMapper.selectById(productId);
            if (product != null) {
                // 存入Redis，过期时间1小时
                redisTemplate.opsForValue().set(redisKey, product, 1, TimeUnit.HOURS);
            }
        }

        // 增加浏览量
        increaseViewCount(productId);

        return product;
    }

    @Override
    public List<SecondhandProduct> getProductList(Map<String, Object> params) {
        // 构建查询条件
        QueryWrapper<SecondhandProduct> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("del_flag", 0);
        queryWrapper.eq("status", 1); // 只查询已上架商品

        // 分类筛选
        if (params.containsKey("categoryId")) {
            queryWrapper.eq("category_id", params.get("categoryId"));
        }

        // 价格区间筛选
        if (params.containsKey("minPrice")) {
            queryWrapper.ge("price", params.get("minPrice"));
        }
        if (params.containsKey("maxPrice")) {
            queryWrapper.le("price", params.get("maxPrice"));
        }

        // 成色筛选
        if (params.containsKey("condition")) {
            queryWrapper.eq("condition", params.get("condition"));
        }

        // 交易方式筛选
        if (params.containsKey("tradeType")) {
            queryWrapper.eq("trade_type", params.get("tradeType"));
        }

        // 排序
        if (params.containsKey("sort")) {
            String sort = (String) params.get("sort");
            switch (sort) {
                case "price_asc":
                    queryWrapper.orderByAsc("price");
                    break;
                case "price_desc":
                    queryWrapper.orderByDesc("price");
                    break;
                case "newest":
                    queryWrapper.orderByDesc("create_time");
                    break;
                case "hot":
                    queryWrapper.orderByDesc("view_count");
                    break;
                default:
                    queryWrapper.orderByDesc("create_time");
            }
        } else {
            queryWrapper.orderByDesc("create_time");
        }

        return secondhandProductMapper.selectList(queryWrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean auditProduct(Long productId, Integer status, String auditRemark) {
        SecondhandProduct product = new SecondhandProduct();
        product.setId(productId);
        product.setStatus(status);
        product.setAuditRemark(auditRemark);
        product.setUpdateTime(new Date());

        int result = secondhandProductMapper.updateById(product);

        // 清除Redis缓存
        String redisKey = "secondhand:product:" + productId;
        redisTemplate.delete(redisKey);

        return result > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateProductStatus(Long productId, Integer status) {
        SecondhandProduct product = new SecondhandProduct();
        product.setId(productId);
        product.setStatus(status);
        product.setUpdateTime(new Date());

        int result = secondhandProductMapper.updateById(product);

        // 清除Redis缓存
        String redisKey = "secondhand:product:" + productId;
        redisTemplate.delete(redisKey);

        return result > 0;
    }

    @Override
    public void increaseViewCount(Long productId) {
        // 异步增加浏览量，减少主流程耗时
        new Thread(() -> {
            // 更新数据库
            secondhandProductMapper.increaseViewCount(productId);

            // 更新Redis缓存
            String redisKey = "secondhand:product:" + productId;
            SecondhandProduct product = (SecondhandProduct) redisTemplate.opsForValue().get(redisKey);
            if (product != null) {
                product.setViewCount(product.getViewCount() + 1);
                redisTemplate.opsForValue().set(redisKey, product, 1, TimeUnit.HOURS);
            }
        }).start();
    }

    @Override
    public List<SecondhandProduct> getHotProducts(Integer limit) {
        // 先从Redis获取
        String redisKey = "secondhand:hot_products:" + limit;
        List<SecondhandProduct> hotProducts = (List<SecondhandProduct>) redisTemplate.opsForValue().get(redisKey);

        if (hotProducts == null) {
            // 从数据库获取
            QueryWrapper<SecondhandProduct> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("del_flag", 0);
            queryWrapper.eq("status", 1); // 只查询已上架商品
            queryWrapper.orderByDesc("view_count");
            queryWrapper.last("LIMIT " + limit);

            hotProducts = secondhandProductMapper.selectList(queryWrapper);

            if (hotProducts != null && !hotProducts.isEmpty()) {
                // 存入Redis，过期时间1小时
                redisTemplate.opsForValue().set(redisKey, hotProducts, 1, TimeUnit.HOURS);
            }
        }

        return hotProducts;
    }

    @Override
    public List<SecondhandProduct> getRecommendProducts(Long userId, Integer limit) {
        // 简单实现，根据浏览历史推荐相似商品
        // 实际项目中可以使用更复杂的推荐算法
        QueryWrapper<SecondhandProduct> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("del_flag", 0);
        queryWrapper.eq("status", 1); // 只查询已上架商品
        queryWrapper.orderByDesc("create_time");
        queryWrapper.last("LIMIT " + limit);

        return secondhandProductMapper.selectList(queryWrapper);
    }

    @Override
    public Map<String, Object> searchProducts(String keyword, Long categoryId, String sort, Integer page, Integer size) {
        // 构建查询条件
        QueryWrapper<SecondhandProduct> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("del_flag", 0);
        queryWrapper.eq("status", 1); // 只查询已上架商品

        // 关键词搜索
        if (keyword != null && !keyword.isEmpty()) {
            queryWrapper.and(wrapper -> wrapper.like("product_name", keyword).or().like("product_desc", keyword));
        }

        // 分类筛选
        if (categoryId != null) {
            queryWrapper.eq("category_id", categoryId);
        }

        // 排序
        if (sort != null) {
            switch (sort) {
                case "price_asc":
                    queryWrapper.orderByAsc("price");
                    break;
                case "price_desc":
                    queryWrapper.orderByDesc("price");
                    break;
                case "newest":
                    queryWrapper.orderByDesc("create_time");
                    break;
                case "hot":
                    queryWrapper.orderByDesc("view_count");
                    break;
                default:
                    queryWrapper.orderByDesc("create_time");
            }
        } else {
            queryWrapper.orderByDesc("create_time");
        }

        // 分页查询
        Page<SecondhandProduct> pageParam = new Page<>(page, size);
        IPage<SecondhandProduct> productPage = secondhandProductMapper.selectPage(pageParam, queryWrapper);

        // 构建返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("records", productPage.getRecords());
        result.put("total", productPage.getTotal());
        result.put("pages", productPage.getPages());
        result.put("current", productPage.getCurrent());
        result.put("size", productPage.getSize());

        return result;
    }
}
