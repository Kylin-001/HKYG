package com.heikeji.admin.service;

import com.heikeji.admin.entity.LoginLog;

import java.util.List;
import java.util.Map;

/**
 * 登录日志Service接口
 */
public interface LoginLogService {

    /**
     * 分页查询登录日志列表
     */
    Map<String, Object> pageLoginLog(Map<String, Object> params);

    /**
     * 根据ID获取登录日志
     */
    LoginLog getLoginLogById(Long id);

    /**
     * 新增登录日志
     */
    boolean addLoginLog(LoginLog loginLog);

    /**
     * 删除登录日志
     */
    boolean deleteLoginLog(Long id);

    /**
     * 批量删除登录日志
     */
    boolean batchDeleteLoginLog(List<Long> ids);

    /**
     * 清空登录日志
     */
    boolean cleanLoginLog();

    /**
     * 统计登录次数
     */
    Long countLoginByTimeRange(String startTime, String endTime);

    /**
     * 统计用户登录次数排行
     */
    List<Map<String, Object>> countLoginByUser(Integer limit);
}
