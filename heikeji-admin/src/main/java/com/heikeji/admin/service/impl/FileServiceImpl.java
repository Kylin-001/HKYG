package com.heikeji.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.admin.entity.FileRecord;
import com.heikeji.admin.mapper.FileMapper;
import com.heikeji.admin.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 文件Service实现类
 */
@Service
public class FileServiceImpl implements FileService {

    @Autowired
    private FileMapper fileMapper;

    @Value("${file.upload.path:uploads/}")
    private String uploadPath;

    @Value("${file.access.url:/uploads/}")
    private String accessUrl;

    @Override
    public Map<String, Object> pageFile(Map<String, Object> params) {
        Integer pageNo = params.get("page") != null ? Integer.parseInt(params.get("page").toString()) : 1;
        Integer pageSize = params.get("limit") != null ? Integer.parseInt(params.get("limit").toString()) : 10;
        String fileName = (String) params.get("fileName");
        Integer fileType = params.get("fileType") != null ? Integer.parseInt(params.get("fileType").toString()) : null;
        String module = (String) params.get("module");

        IPage<FileRecord> page = new Page<>(pageNo, pageSize);
        LambdaQueryWrapper<FileRecord> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(fileName)) {
            wrapper.like(FileRecord::getFileName, fileName)
                   .or()
                   .like(FileRecord::getOriginalName, fileName);
        }
        if (fileType != null) {
            wrapper.eq(FileRecord::getFileType, fileType);
        }
        if (StringUtils.hasText(module)) {
            wrapper.eq(FileRecord::getModule, module);
        }

        wrapper.orderByDesc(FileRecord::getCreateTime);
        fileMapper.selectPage(page, wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", page.getRecords());
        result.put("total", page.getTotal());
        result.put("pages", page.getPages());
        result.put("page", pageNo);
        result.put("limit", pageSize);

        return result;
    }

    @Override
    public FileRecord getFileById(Long id) {
        return fileMapper.selectById(id);
    }

    @Override
    public FileRecord uploadFile(MultipartFile file, String module, Long userId, String userName) {
        if (file.isEmpty()) {
            throw new RuntimeException("上传文件不能为空");
        }

        try {
            // 生成文件名
            String originalName = file.getOriginalFilename();
            String suffix = originalName != null ? originalName.substring(originalName.lastIndexOf(".") + 1) : "";
            String newFileName = UUID.randomUUID().toString().replace("-", "") + "." + suffix;

            // 按日期创建目录
            String datePath = new SimpleDateFormat("yyyy/MM/dd").format(new Date());
            String relativePath = module + "/" + datePath + "/" + newFileName;
            String fullPath = uploadPath + relativePath;

            // 创建目录
            File destFile = new File(fullPath);
            if (!destFile.getParentFile().exists()) {
                destFile.getParentFile().mkdirs();
            }

            // 保存文件
            file.transferTo(destFile);

            // 保存记录
            FileRecord record = new FileRecord();
            record.setFileName(newFileName);
            record.setOriginalName(originalName);
            record.setFileSuffix(suffix.toLowerCase());
            record.setFileUrl(accessUrl + relativePath);
            record.setFilePath(fullPath);
            record.setFileSize(file.getSize());
            record.setMimeType(file.getContentType());
            record.setFileType(getFileType(suffix));
            record.setStorageType(1); // 本地存储
            record.setModule(module);
            record.setUploadBy(userId);
            record.setUploadName(userName);
            record.setUseCount(0);
            record.setStatus(1);

            fileMapper.insert(record);
            return record;

        } catch (IOException e) {
            throw new RuntimeException("文件上传失败：" + e.getMessage());
        }
    }

    @Override
    public List<FileRecord> batchUploadFile(MultipartFile[] files, String module, Long userId, String userName) {
        List<FileRecord> records = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                records.add(uploadFile(file, module, userId, userName));
            }
        }
        return records;
    }

    @Override
    public boolean deleteFile(Long id) {
        FileRecord record = fileMapper.selectById(id);
        if (record != null) {
            // 删除物理文件
            try {
                Path path = Paths.get(record.getFilePath());
                Files.deleteIfExists(path);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return fileMapper.deleteById(id) > 0;
        }
        return false;
    }

    @Override
    public boolean batchDeleteFile(List<Long> ids) {
        for (Long id : ids) {
            deleteFile(id);
        }
        return true;
    }

    @Override
    public boolean updateFileStatus(Long id, Integer status) {
        FileRecord record = new FileRecord();
        record.setId(id);
        record.setStatus(status);
        return fileMapper.updateById(record) > 0;
    }

    @Override
    public List<Map<String, Object>> countByFileType() {
        return fileMapper.countByFileType();
    }

    @Override
    public List<Map<String, Object>> countByModule() {
        return fileMapper.countByModule();
    }

    @Override
    public Long sumFileSize() {
        return fileMapper.sumFileSize();
    }

    @Override
    public boolean incrementUseCount(Long id) {
        FileRecord record = fileMapper.selectById(id);
        if (record != null) {
            record.setUseCount(record.getUseCount() + 1);
            return fileMapper.updateById(record) > 0;
        }
        return false;
    }

    /**
     * 根据后缀获取文件类型
     */
    private Integer getFileType(String suffix) {
        if (suffix == null) return 5;
        suffix = suffix.toLowerCase();
        
        // 图片
        if (Arrays.asList("jpg", "jpeg", "png", "gif", "bmp", "webp", "svg").contains(suffix)) {
            return 1;
        }
        // 文档
        if (Arrays.asList("doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "txt", "csv").contains(suffix)) {
            return 2;
        }
        // 视频
        if (Arrays.asList("mp4", "avi", "mov", "wmv", "flv", "mkv").contains(suffix)) {
            return 3;
        }
        // 音频
        if (Arrays.asList("mp3", "wav", "wma", "ogg", "aac", "flac").contains(suffix)) {
            return 4;
        }
        // 其他
        return 5;
    }
}
