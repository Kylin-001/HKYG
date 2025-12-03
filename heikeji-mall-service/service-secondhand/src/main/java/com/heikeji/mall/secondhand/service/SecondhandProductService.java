package com.heikeji.mall.secondhand.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.secondhand.entity.SecondhandProduct;

import java.util.List;
import java.util.Map;

/**
 * 二手商品服务接口
 */
public interface SecondhandProductService extends IService<SecondhandProduct> {

    /**
     * 发布二手商品
     * @param product 商品信息
     * @return 商品ID
     */
    Long publishProduct(SecondhandProduct product);

    /**
     * 获取商品详情
     * @param productId 商品ID
     * @return 商品详情
     */
    SecondhandProduct getProductDetail(Long productId);

    /**
     * 商品列表查询
     * @param params 查询参数
     * @return 商品列表
     */
    List<SecondhandProduct> getProductList(Map<String, Object> params);

    /**
     * 商品审核
     * @param productId 商品ID
     * @param status 审核状态
     * @param auditRemark 审核意见
     * @return 是否成功
     */
    boolean auditProduct(Long productId, Integer status, String auditRemark);

    /**
     * 上下架商品
     * @param productId 商品ID
     * @param status 商品状态
     * @return 是否成功
     */
    boolean updateProductStatus(Long productId, Integer status);

    /**
     * 增加商品浏览量
     * @param productId 商品ID
     */
    void increaseViewCount(Long productId);

    /**
     * 获取热门商品
     * @param limit 数量限制
     * @return 热门商品列表
     */
    List<SecondhandProduct> getHotProducts(Integer limit);

    /**
     * 获取推荐商品
     * @param userId 用户ID
     * @param limit 数量限制
     * @return 推荐商品列表
     */
    List<SecondhandProduct> getRecommendProducts(Long userId, Integer limit);

    /**
     * 商品搜索
     * @param keyword 搜索关键词
     * @param categoryId 分类ID
     * @param sort 排序方式
     * @param page 页码
     * @param size 每页大小
     * @return 搜索结果
     */
    Map<String, Object> searchProducts(String keyword, Long categoryId, String sort, Integer page, Integer size);

}