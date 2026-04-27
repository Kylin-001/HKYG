package com.heikeji.admin.service;

import com.heikeji.admin.entity.FileRecord;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * 文件Service接口
 */
public interface FileService {

    /**
     * 分页查询文件列表
     */
    Map<String, Object> pageFile(Map<String, Object> params);

    /**
     * 根据ID获取文件
     */
    FileRecord getFileById(Long id);

    /**
     * 上传文件
     */
    FileRecord uploadFile(MultipartFile file, String module, Long userId, String userName);

    /**
     * 批量上传文件
     */
    List<FileRecord> batchUploadFile(MultipartFile[] files, String module, Long userId, String userName);

    /**
     * 删除文件
     */
    boolean deleteFile(Long id);

    /**
     * 批量删除文件
     */
    boolean batchDeleteFile(List<Long> ids);

    /**
     * 更新文件状态
     */
    boolean updateFileStatus(Long id, Integer status);

    /**
     * 按文件类型统计
     */
    List<Map<String, Object>> countByFileType();

    /**
     * 按模块统计
     */
    List<Map<String, Object>> countByModule();

    /**
     * 统计总文件大小
     */
    Long sumFileSize();

    /**
     * 增加文件使用次数
     */
    boolean incrementUseCount(Long id);
}
