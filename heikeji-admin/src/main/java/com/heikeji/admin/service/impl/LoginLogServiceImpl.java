package com.heikeji.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.admin.entity.LoginLog;
import com.heikeji.admin.mapper.LoginLogMapper;
import com.heikeji.admin.service.LoginLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 登录日志Service实现类
 */
@Service
public class LoginLogServiceImpl implements LoginLogService {

    @Autowired
    private LoginLogMapper loginLogMapper;

    @Override
    public Map<String, Object> pageLoginLog(Map<String, Object> params) {
        Integer pageNo = params.get("page") != null ? Integer.parseInt(params.get("page").toString()) : 1;
        Integer pageSize = params.get("limit") != null ? Integer.parseInt(params.get("limit").toString()) : 10;
        String username = (String) params.get("username");
        String ipAddress = (String) params.get("ipAddress");
        Integer status = params.get("status") != null ? Integer.parseInt(params.get("status").toString()) : null;
        String startTime = (String) params.get("startTime");
        String endTime = (String) params.get("endTime");

        IPage<LoginLog> page = new Page<>(pageNo, pageSize);
        LambdaQueryWrapper<LoginLog> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(username)) {
            wrapper.like(LoginLog::getUsername, username);
        }
        if (StringUtils.hasText(ipAddress)) {
            wrapper.like(LoginLog::getIpAddress, ipAddress);
        }
        if (status != null) {
            wrapper.eq(LoginLog::getStatus, status);
        }
        if (StringUtils.hasText(startTime)) {
            wrapper.ge(LoginLog::getLoginTime, startTime);
        }
        if (StringUtils.hasText(endTime)) {
            wrapper.le(LoginLog::getLoginTime, endTime);
        }

        wrapper.orderByDesc(LoginLog::getLoginTime);
        loginLogMapper.selectPage(page, wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", page.getRecords());
        result.put("total", page.getTotal());
        result.put("pages", page.getPages());
        result.put("page", pageNo);
        result.put("limit", pageSize);

        return result;
    }

    @Override
    public LoginLog getLoginLogById(Long id) {
        return loginLogMapper.selectById(id);
    }

    @Override
    public boolean addLoginLog(LoginLog loginLog) {
        return loginLogMapper.insert(loginLog) > 0;
    }

    @Override
    public boolean deleteLoginLog(Long id) {
        return loginLogMapper.deleteById(id) > 0;
    }

    @Override
    public boolean batchDeleteLoginLog(List<Long> ids) {
        return loginLogMapper.deleteBatchIds(ids) > 0;
    }

    @Override
    public boolean cleanLoginLog() {
        loginLogMapper.cleanLoginLog();
        return true;
    }

    @Override
    public Long countLoginByTimeRange(String startTime, String endTime) {
        return loginLogMapper.countByTimeRange(startTime, endTime);
    }

    @Override
    public List<Map<String, Object>> countLoginByUser(Integer limit) {
        return loginLogMapper.countByUser(limit);
    }
}
