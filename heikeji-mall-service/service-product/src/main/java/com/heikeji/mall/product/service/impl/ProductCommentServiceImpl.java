package com.heikeji.mall.product.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.product.entity.ProductComment;
import com.heikeji.mall.product.entity.ProductCommentStats;
import com.heikeji.mall.product.mapper.ProductCommentMapper;
import com.heikeji.mall.product.service.ProductCommentService;
import com.heikeji.mall.product.utils.ProductCommentImageUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 商品评价Service实现类
 */
@Service
public class ProductCommentServiceImpl extends ServiceImpl<ProductCommentMapper, ProductComment> implements ProductCommentService {
    
    private static final Logger log = LoggerFactory.getLogger(ProductCommentServiceImpl.class);
    
    @Autowired
    private ProductCommentMapper productCommentMapper;
    
    @Autowired
    private ProductCommentImageUtil productCommentImageUtil;
    
    @Override
    @Transactional
    public boolean addComment(ProductComment comment) {
        comment.setStatus(1);
        comment.setReplyStatus(0);
        comment.setCreateTime(new Date());
        comment.setUpdateTime(new Date());
        comment.setDelFlag(0);
        boolean result = save(comment);
        if (result) {
            // 更新商品评价统计
            updateProductCommentStats(comment.getProductId());
        }
        return result;
    }
    
    @Override
    @Transactional
    public boolean deleteComment(Long id) {
        ProductComment comment = getById(id);
        if (comment != null) {
            comment.setDelFlag(1);
            comment.setUpdateTime(new Date());
            boolean result = updateById(comment);
            if (result) {
                // 更新商品评价统计
                updateProductCommentStats(comment.getProductId());
            }
            return result;
        }
        return false;
    }
    
    @Override
    @Transactional
    public boolean updateComment(ProductComment comment) {
        comment.setUpdateTime(new Date());
        boolean result = updateById(comment);
        if (result) {
            // 更新商品评价统计
            updateProductCommentStats(comment.getProductId());
        }
        return result;
    }
    
    /**
     * 更新商品评价统计
     * @param productId 商品ID
     */
    private void updateProductCommentStats(Long productId) {
        log.info("更新商品评价统计，商品ID：{}", productId);
        productCommentMapper.updateCommentStats(productId);
    }
    
    @Override
    public ProductComment getCommentById(Long id) {
        return getById(id);
    }
    
    @Override
    public ProductCommentStats getCommentStats(Long productId) {
        return productCommentMapper.getCommentStats(productId);
    }
    
    @Override
    public Map<String, Object> getCommentList(Long productId, Integer score, Integer hasImage, Integer page, Integer size) {
        Map<String, Object> result = new HashMap<>();
        
        // 计算总数量
        Integer total = productCommentMapper.countComments(productId, score, hasImage);
        
        // 计算分页参数
        int offset = (page - 1) * size;
        
        // 获取评价列表
        List<ProductComment> commentList = productCommentMapper.getCommentList(productId, score, hasImage, offset, size);
        
        result.put("total", total);
        result.put("list", commentList);
        result.put("page", page);
        result.put("size", size);
        result.put("pages", (int) Math.ceil((double) total / size));
        
        return result;
    }
    
    @Override
    public Map<String, Object> getUserCommentList(Long userId, Integer page, Integer size) {
        Map<String, Object> result = new HashMap<>();
        
        // 计算分页参数
        int offset = (page - 1) * size;
        
        // 获取评价列表
        List<ProductComment> commentList = productCommentMapper.getUserCommentList(userId, offset, size);
        
        result.put("list", commentList);
        result.put("page", page);
        result.put("size", size);
        
        return result;
    }
    
    @Override
    @Transactional
    public boolean replyComment(Long id, String replyContent) {
        ProductComment comment = getById(id);
        if (comment != null) {
            comment.setReplyStatus(1);
            comment.setReplyContent(replyContent);
            comment.setReplyTime(new Date());
            comment.setUpdateTime(new Date());
            boolean result = updateById(comment);
            if (result) {
                // 更新商品评价统计
                updateProductCommentStats(comment.getProductId());
            }
            return result;
        }
        return false;
    }
    
    @Override
    @Transactional
    public boolean updateCommentStatus(Long id, Integer status) {
        ProductComment comment = getById(id);
        if (comment != null) {
            comment.setStatus(status);
            comment.setUpdateTime(new Date());
            boolean result = updateById(comment);
            if (result) {
                // 更新商品评价统计
                updateProductCommentStats(comment.getProductId());
            }
            return result;
        }
        return false;
    }
    
    @Override
    public Integer countComments(Long productId, Integer score, Integer hasImage) {
        return productCommentMapper.countComments(productId, score, hasImage);
    }
    
    @Override
    public String uploadImage(MultipartFile file) throws Exception {
        return productCommentImageUtil.uploadImage(file);
    }
    
    @Override
    public List<String> batchUploadImages(List<MultipartFile> files) throws Exception {
        return productCommentImageUtil.uploadImages(files);
    }
    
    @Override
    public boolean deleteImage(String imageUrl) {
        try {
            productCommentImageUtil.deleteImage(imageUrl);
            return true;
        } catch (Exception e) {
            log.error("删除评价图片失败: {}", imageUrl, e);
            return false;
        }
    }
}
