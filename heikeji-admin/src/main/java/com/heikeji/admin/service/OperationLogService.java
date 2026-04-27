package com.heikeji.admin.service;

import com.heikeji.admin.entity.OperationLog;

import java.util.List;
import java.util.Map;

/**
 * 操作日志Service接口
 */
public interface OperationLogService {

    /**
     * 分页查询操作日志列表
     */
    Map<String, Object> pageOperationLog(Map<String, Object> params);

    /**
     * 根据ID获取操作日志
     */
    OperationLog getOperationLogById(Long id);

    /**
     * 新增操作日志
     */
    boolean addOperationLog(OperationLog operationLog);

    /**
     * 删除操作日志
     */
    boolean deleteOperationLog(Long id);

    /**
     * 批量删除操作日志
     */
    boolean batchDeleteOperationLog(List<Long> ids);

    /**
     * 清空操作日志
     */
    boolean cleanOperationLog();

    /**
     * 统计操作类型分布
     */
    List<Map<String, Object>> countByBusinessType();

    /**
     * 统计操作人员操作次数
     */
    List<Map<String, Object>> countByOperator(Integer limit);
}
