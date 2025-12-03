package com.heikeji.system.controller;

import com.heikeji.common.api.Result;
import com.heikeji.system.config.FileUploadConfig;
import com.heikeji.system.exception.BusinessException;
import com.heikeji.system.utils.IdUtils;
import com.heikeji.system.utils.LogUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 文件上传控制器
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Tag(name = "文件上传", description = "文件上传相关接口")
@RestController
@RequestMapping("/api/file")
public class FileController {

    private static final Logger logger = LogUtils.getLogger(FileController.class);

    @Autowired
    private FileUploadConfig fileUploadConfig;

    /**
     * 上传文件
     */
    @PostMapping("/upload")
    @Operation(summary = "上传文件", description = "上传单个文件，支持常见文件格式")
    public Result upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException("文件不能为空");
        }

        // 获取文件名
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new BusinessException("文件名不能为空");
        }

        // 检验文件类型
        if (!fileUploadConfig.isAllowedType(originalFilename)) {
            throw new BusinessException("不支持的文件类型，请上传" + fileUploadConfig.getAllowedTypes());
        }

        // 检验文件大小
        if (file.getSize() > fileUploadConfig.getMaxFileSize() * 1024 * 1024) {
            throw new BusinessException("文件大小不能超过" + fileUploadConfig.getMaxFileSize() + "MB");
        }

        // 获取文件扩展名
        String extension = getFileExtension(originalFilename);
        
        // 生成新文件名
        String newFilename = IdUtils.getRandomString(32) + "." + extension;
        
        // 按日期创建目录
        String dateDir = new SimpleDateFormat("yyyyMMdd").format(new Date());
        String uploadPath = fileUploadConfig.getPath() + "/" + dateDir;
        
        // 创建目录
        File dir = new File(uploadPath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // 保存文件
        File dest = new File(uploadPath + "/" + newFilename);
        try {
            file.transferTo(dest);
            LogUtils.info(logger, "文件上传成功: {}, 保存路径: {}", originalFilename, dest.getAbsolutePath());
            
            // 返回文件信息
            Map<String, Object> fileInfo = new HashMap<>();
            fileInfo.put("originalName", originalFilename);
            fileInfo.put("fileName", newFilename);
            fileInfo.put("filePath", "/upload/files/" + dateDir + "/" + newFilename);
            fileInfo.put("fileSize", file.getSize());
            fileInfo.put("fileType", extension);
            fileInfo.put("uploadTime", new Date());
            
            return Result.ok(fileInfo);
        } catch (IOException e) {
            LogUtils.error(logger, "文件上传失败: {}", e.getMessage());
            throw new BusinessException("文件上传失败");
        }
    }

    /**
     * 批量上传文件
     */
    @PostMapping("/batchUpload")
    @Operation(summary = "批量上传文件", description = "批量上传多个文件，一次最多10个文件")
    public Result batchUpload(@RequestParam("files") MultipartFile[] files) {
        if (files == null || files.length == 0) {
            throw new BusinessException("文件不能为空");
        }

        if (files.length > 10) {
            throw new BusinessException("一次最多上传10个文件");
        }

        // 检验总文件大小
        long totalSize = 0;
        for (MultipartFile file : files) {
            totalSize += file.getSize();
        }
        if (totalSize > fileUploadConfig.getMaxRequestSize() * 1024 * 1024) {
            throw new BusinessException("总文件大小不能超过" + fileUploadConfig.getMaxRequestSize() + "MB");
        }

        // 逐个上传文件
        for (MultipartFile file : files) {
            upload(file);
        }

        return Result.ok("文件上传成功，共上传" + files.length + "个文件");
    }

    /**
     * 获取文件扩展名
     */
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex < 0) {
            return "";
        }
        return filename.substring(lastDotIndex + 1).toLowerCase();
    }
}
