package com.heikeji.mall.product.utils;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 * 商品评价图片上传工具类
 */
@Component
public class ProductCommentImageUtil {

    /**
     * 图片存储路径
     */
    @Value("${file.upload.path:./upload/images/comment}")
    private String uploadPath;

    /**
     * 允许的图片类型
     */
    private static final List<String> ALLOWED_IMAGE_TYPES = List.of(
            ".jpg", ".jpeg", ".png", ".gif", ".bmp"
    );

    /**
     * 单张图片最大大小（10MB）
     */
    private static final long MAX_IMAGE_SIZE = 10 * 1024 * 1024;

    /**
     * 上传单张图片
     * @param file 图片文件
     * @return 图片URL
     */
    public String uploadImage(MultipartFile file) throws IOException {
        validateImageFile(file);
        
        String fileName = generateUniqueFileName(file.getOriginalFilename());
        Path filePath = Paths.get(uploadPath, fileName);
        
        // 创建目录（如果不存在）
        FileUtil.mkdir(filePath.getParent().toString());
        
        // 保存文件
        file.transferTo(filePath.toFile());
        
        // 返回相对路径作为URL
        return "/upload/images/comment/" + fileName;
    }

    /**
     * 批量上传图片
     * @param files 图片文件列表
     * @return 图片URL列表
     */
    public List<String> uploadImages(List<MultipartFile> files) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            imageUrls.add(uploadImage(file));
        }
        return imageUrls;
    }

    /**
     * 验证图片文件
     * @param file 图片文件
     */
    private void validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("上传文件不能为空");
        }
        
        // 验证文件大小
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new RuntimeException("上传文件大小不能超过10MB");
        }
        
        // 验证文件类型
        String originalFilename = file.getOriginalFilename();
        if (StrUtil.isBlank(originalFilename)) {
            throw new RuntimeException("文件名不能为空");
        }
        
        String fileExtension = FileUtil.extName(originalFilename).toLowerCase();
        if (!ALLOWED_IMAGE_TYPES.contains("." + fileExtension)) {
            throw new RuntimeException("不支持的图片类型，仅支持jpg、jpeg、png、gif、bmp格式");
        }
    }

    /**
     * 生成唯一文件名
     * @param originalFilename 原始文件名
     * @return 唯一文件名
     */
    private String generateUniqueFileName(String originalFilename) {
        String fileExtension = FileUtil.extName(originalFilename);
        String uuid = IdUtil.simpleUUID();
        return uuid + "." + fileExtension;
    }

    /**
     * 删除图片
     * @param imageUrl 图片URL
     */
    public void deleteImage(String imageUrl) {
        if (StrUtil.isNotBlank(imageUrl)) {
            // 从URL中提取文件名
            String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadPath, fileName);
            FileUtil.del(filePath.toFile());
        }
    }

    /**
     * 批量删除图片
     * @param imageUrls 图片URL列表
     */
    public void deleteImages(List<String> imageUrls) {
        for (String imageUrl : imageUrls) {
            deleteImage(imageUrl);
        }
    }
}
