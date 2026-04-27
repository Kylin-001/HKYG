package com.heikeji.admin.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 文件记录实体类
 */
@Data
@TableName("sys_file")
public class FileRecord implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 文件ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 文件名
     */
    private String fileName;

    /**
     * 原始文件名
     */
    private String originalName;

    /**
     * 文件后缀
     */
    private String fileSuffix;

    /**
     * 文件URL
     */
    private String fileUrl;

    /**
     * 存储路径
     */
    private String filePath;

    /**
     * 文件大小（字节）
     */
    private Long fileSize;

    /**
     * MIME类型
     */
    private String mimeType;

    /**
     * 文件类型：1图片，2文档，3视频，4音频，5其他
     */
    private Integer fileType;

    /**
     * 存储类型：1本地，2OSS，3MinIO
     */
    private Integer storageType;

    /**
     * 模块名称
     */
    private String module;

    /**
     * 上传者ID
     */
    private Long uploadBy;

    /**
     * 上传者名称
     */
    private String uploadName;

    /**
     * 使用次数
     */
    private Integer useCount;

    /**
     * 状态：0禁用，1启用
     */
    private Integer status;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;
}
