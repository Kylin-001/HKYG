package com.heikeji.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.admin.entity.OperationLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
 * 操作日志Mapper接口
 */
@Mapper
public interface OperationLogMapper extends BaseMapper<OperationLog> {

    /**
     * 清空操作日志
     */
    @Select("TRUNCATE TABLE sys_operation_log")
    void cleanOperationLog();

    /**
     * 统计操作类型分布
     */
    @Select("SELECT business_type as type, COUNT(*) as count FROM sys_operation_log GROUP BY business_type")
    List<Map<String, Object>> countByBusinessType();

    /**
     * 统计操作人员操作次数
     */
    @Select("SELECT oper_name as name, COUNT(*) as count FROM sys_operation_log GROUP BY oper_name ORDER BY count DESC LIMIT #{limit}")
    List<Map<String, Object>> countByOperator(@Param("limit") Integer limit);
}
