package com.heikeji.mall.product.controller;

import com.heikeji.common.core.web.ApiResult;
import com.heikeji.mall.product.service.ProductCommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 商品评价图片上传控制器
 */
@Tag(name = "商品评价图片管理")
@RestController
@RequestMapping("/product/comment/image")
public class ProductCommentImageController {
    
    @Autowired
    private ProductCommentService productCommentService;
    
    /**
     * 上传单张评价图片
     */
    @Operation(summary = "上传单张评价图片")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResult<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = productCommentService.uploadImage(file);
            return ApiResult.success("图片上传成功", imageUrl);
        } catch (Exception e) {
            return ApiResult.error("图片上传失败: " + e.getMessage());
        }
    }
    
    /**
     * 批量上传评价图片
     */
    @Operation(summary = "批量上传评价图片")
    @PostMapping(value = "/batch-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResult<List<String>> batchUploadImages(@RequestParam("files") List<MultipartFile> files) {
        try {
            List<String> imageUrls = productCommentService.batchUploadImages(files);
            return ApiResult.success("图片批量上传成功", imageUrls);
        } catch (Exception e) {
            return ApiResult.error("图片批量上传失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除评价图片
     */
    @Operation(summary = "删除评价图片")
    @DeleteMapping("/delete/{imageUrl}")
    public ApiResult<Boolean> deleteImage(@PathVariable String imageUrl) {
        try {
            boolean result = productCommentService.deleteImage(imageUrl);
            return ApiResult.success("图片删除成功", result);
        } catch (Exception e) {
            return ApiResult.error("图片删除失败: " + e.getMessage());
        }
    }
}
