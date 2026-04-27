package com.heikeji.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.admin.entity.OperationLog;
import com.heikeji.admin.mapper.OperationLogMapper;
import com.heikeji.admin.service.OperationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 操作日志Service实现类
 */
@Service
public class OperationLogServiceImpl implements OperationLogService {

    @Autowired
    private OperationLogMapper operationLogMapper;

    @Override
    public Map<String, Object> pageOperationLog(Map<String, Object> params) {
        Integer pageNo = params.get("page") != null ? Integer.parseInt(params.get("page").toString()) : 1;
        Integer pageSize = params.get("limit") != null ? Integer.parseInt(params.get("limit").toString()) : 10;
        String title = (String) params.get("title");
        String operName = (String) params.get("operName");
        Integer businessType = params.get("businessType") != null ? Integer.parseInt(params.get("businessType").toString()) : null;
        Integer status = params.get("status") != null ? Integer.parseInt(params.get("status").toString()) : null;
        String startTime = (String) params.get("startTime");
        String endTime = (String) params.get("endTime");

        IPage<OperationLog> page = new Page<>(pageNo, pageSize);
        LambdaQueryWrapper<OperationLog> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(title)) {
            wrapper.like(OperationLog::getTitle, title);
        }
        if (StringUtils.hasText(operName)) {
            wrapper.like(OperationLog::getOperName, operName);
        }
        if (businessType != null) {
            wrapper.eq(OperationLog::getBusinessType, businessType);
        }
        if (status != null) {
            wrapper.eq(OperationLog::getStatus, status);
        }
        if (StringUtils.hasText(startTime)) {
            wrapper.ge(OperationLog::getOperTime, startTime);
        }
        if (StringUtils.hasText(endTime)) {
            wrapper.le(OperationLog::getOperTime, endTime);
        }

        wrapper.orderByDesc(OperationLog::getOperTime);
        operationLogMapper.selectPage(page, wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", page.getRecords());
        result.put("total", page.getTotal());
        result.put("pages", page.getPages());
        result.put("page", pageNo);
        result.put("limit", pageSize);

        return result;
    }

    @Override
    public OperationLog getOperationLogById(Long id) {
        return operationLogMapper.selectById(id);
    }

    @Override
    public boolean addOperationLog(OperationLog operationLog) {
        return operationLogMapper.insert(operationLog) > 0;
    }

    @Override
    public boolean deleteOperationLog(Long id) {
        return operationLogMapper.deleteById(id) > 0;
    }

    @Override
    public boolean batchDeleteOperationLog(List<Long> ids) {
        return operationLogMapper.deleteBatchIds(ids) > 0;
    }

    @Override
    public boolean cleanOperationLog() {
        operationLogMapper.cleanOperationLog();
        return true;
    }

    @Override
    public List<Map<String, Object>> countByBusinessType() {
        return operationLogMapper.countByBusinessType();
    }

    @Override
    public List<Map<String, Object>> countByOperator(Integer limit) {
        return operationLogMapper.countByOperator(limit);
    }
}
