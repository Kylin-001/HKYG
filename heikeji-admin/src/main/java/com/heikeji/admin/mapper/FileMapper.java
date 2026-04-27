package com.heikeji.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.admin.entity.FileRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
 * 文件Mapper接口
 */
@Mapper
public interface FileMapper extends BaseMapper<FileRecord> {

    /**
     * 按文件类型统计
     */
    @Select("SELECT file_type as type, COUNT(*) as count FROM sys_file WHERE status = 1 GROUP BY file_type")
    List<Map<String, Object>> countByFileType();

    /**
     * 按模块统计
     */
    @Select("SELECT module, COUNT(*) as count FROM sys_file WHERE status = 1 GROUP BY module")
    List<Map<String, Object>> countByModule();

    /**
     * 统计总文件大小
     */
    @Select("SELECT SUM(file_size) FROM sys_file WHERE status = 1")
    Long sumFileSize();

    /**
     * 查询重复文件
     */
    @Select("SELECT file_name, COUNT(*) as count FROM sys_file GROUP BY file_name HAVING count > 1")
    List<Map<String, Object>> findDuplicateFiles();
}
