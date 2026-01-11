package com.heikeji.mall.product.controller;

import com.heikeji.common.core.web.ApiResult;
import com.heikeji.mall.product.entity.ProductComment;
import com.heikeji.mall.product.entity.ProductCommentStats;
import com.heikeji.mall.product.service.ProductCommentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 商品评价Controller
 */
@Api(tags = "商品评价管理")
@RestController
@RequestMapping("/product/comment")
public class ProductCommentController {
    
    @Autowired
    private ProductCommentService productCommentService;
    
    /**
     * 新增商品评价
     */
    @ApiOperation("新增商品评价")
    @PostMapping("/add")
    public ApiResult<Boolean> addComment(@RequestBody ProductComment comment) {
        boolean result = productCommentService.addComment(comment);
        return ApiResult.success(result);
    }
    
    /**
     * 删除商品评价
     */
    @ApiOperation("删除商品评价")
    @PreAuthorize("hasAuthority('product:comment:delete')")
    @DeleteMapping("/delete/{id}")
    public ApiResult<Boolean> deleteComment(@PathVariable Long id) {
        boolean result = productCommentService.deleteComment(id);
        return ApiResult.success(result);
    }
    
    /**
     * 更新商品评价
     */
    @ApiOperation("更新商品评价")
    @PreAuthorize("hasAuthority('product:comment:update')")
    @PutMapping("/update")
    public ApiResult<Boolean> updateComment(@RequestBody ProductComment comment) {
        boolean result = productCommentService.updateComment(comment);
        return ApiResult.success(result);
    }
    
    /**
     * 获取商品评价详情
     */
    @ApiOperation("获取商品评价详情")
    @GetMapping("/detail/{id}")
    public ApiResult<ProductComment> getCommentById(@PathVariable Long id) {
        ProductComment comment = productCommentService.getCommentById(id);
        return ApiResult.success(comment);
    }
    
    /**
     * 获取商品评价统计
     */
    @ApiOperation("获取商品评价统计")
    @GetMapping("/stats/{productId}")
    public ApiResult<ProductCommentStats> getCommentStats(@PathVariable Long productId) {
        ProductCommentStats stats = productCommentService.getCommentStats(productId);
        return ApiResult.success(stats);
    }
    
    /**
     * 获取商品评价列表
     */
    @ApiOperation("获取商品评价列表")
    @GetMapping("/list")
    public ApiResult<Map<String, Object>> getCommentList(@RequestParam Long productId, 
                                                       @RequestParam(required = false) Integer score, 
                                                       @RequestParam(required = false) Integer hasImage, 
                                                       @RequestParam(defaultValue = "1") Integer page, 
                                                       @RequestParam(defaultValue = "10") Integer size) {
        Map<String, Object> result = productCommentService.getCommentList(productId, score, hasImage, page, size);
        return ApiResult.success(result);
    }
    
    /**
     * 获取用户评价列表
     */
    @ApiOperation("获取用户评价列表")
    @GetMapping("/user/list")
    public ApiResult<Map<String, Object>> getUserCommentList(@RequestParam Long userId, 
                                                          @RequestParam(defaultValue = "1") Integer page, 
                                                          @RequestParam(defaultValue = "10") Integer size) {
        Map<String, Object> result = productCommentService.getUserCommentList(userId, page, size);
        return ApiResult.success(result);
    }
    
    /**
     * 回复商品评价
     */
    @ApiOperation("回复商品评价")
    @PreAuthorize("hasAuthority('product:comment:reply')")
    @PostMapping("/reply")
    public ApiResult<Boolean> replyComment(@RequestParam Long id, 
                                         @RequestParam String replyContent) {
        boolean result = productCommentService.replyComment(id, replyContent);
        return ApiResult.success(result);
    }
    
    /**
     * 更新商品评价状态
     */
    @ApiOperation("更新商品评价状态")
    @PreAuthorize("hasAuthority('product:comment:status')")
    @PostMapping("/status")
    public ApiResult<Boolean> updateCommentStatus(@RequestParam Long id, 
                                                @RequestParam Integer status) {
        boolean result = productCommentService.updateCommentStatus(id, status);
        return ApiResult.success(result);
    }
    
    /**
     * 统计商品评价数量
     */
    @ApiOperation("统计商品评价数量")
    @GetMapping("/count")
    public ApiResult<Integer> countComments(@RequestParam Long productId, 
                                          @RequestParam(required = false) Integer score, 
                                          @RequestParam(required = false) Integer hasImage) {
        Integer count = productCommentService.countComments(productId, score, hasImage);
        return ApiResult.success(count);
    }
}
