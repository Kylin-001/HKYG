package com.heikeji.mall.product.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.product.entity.ProductComment;
import com.heikeji.mall.product.entity.ProductCommentStats;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * 商品评价Service接口
 */
public interface ProductCommentService extends IService<ProductComment> {
    /**
     * 新增商品评价
     * @param comment 评价信息
     * @return 是否成功
     */
    boolean addComment(ProductComment comment);
    
    /**
     * 删除商品评价
     * @param id 评价ID
     * @return 是否成功
     */
    boolean deleteComment(Long id);
    
    /**
     * 更新商品评价
     * @param comment 评价信息
     * @return 是否成功
     */
    boolean updateComment(ProductComment comment);
    
    /**
     * 获取商品评价详情
     * @param id 评价ID
     * @return 评价详情
     */
    ProductComment getCommentById(Long id);
    
    /**
     * 获取商品评价统计
     * @param productId 商品ID
     * @return 评价统计
     */
    ProductCommentStats getCommentStats(Long productId);
    
    /**
     * 获取商品评价列表
     * @param productId 商品ID
     * @param score 评分
     * @param hasImage 是否有图片
     * @param page 页码
     * @param size 每页大小
     * @return 评价列表
     */
    Map<String, Object> getCommentList(Long productId, Integer score, Integer hasImage, Integer page, Integer size);
    
    /**
     * 获取用户评价列表
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页大小
     * @return 评价列表
     */
    Map<String, Object> getUserCommentList(Long userId, Integer page, Integer size);
    
    /**
     * 回复商品评价
     * @param id 评价ID
     * @param replyContent 回复内容
     * @return 是否成功
     */
    boolean replyComment(Long id, String replyContent);
    
    /**
     * 更新商品评价状态
     * @param id 评价ID
     * @param status 状态
     * @return 是否成功
     */
    boolean updateCommentStatus(Long id, Integer status);
    
    /**
     * 统计商品评价数量
     * @param productId 商品ID
     * @param score 评分
     * @param hasImage 是否有图片
     * @return 评价数量
     */
    Integer countComments(Long productId, Integer score, Integer hasImage);
    
    /**
     * 上传单张评价图片
     * @param file 图片文件
     * @return 图片URL
     */
    String uploadImage(MultipartFile file) throws Exception;
    
    /**
     * 批量上传评价图片
     * @param files 图片文件列表
     * @return 图片URL列表
     */
    List<String> batchUploadImages(List<MultipartFile> files) throws Exception;
    
    /**
     * 删除评价图片
     * @param imageUrl 图片URL
     * @return 是否成功
     */
    boolean deleteImage(String imageUrl);
}
