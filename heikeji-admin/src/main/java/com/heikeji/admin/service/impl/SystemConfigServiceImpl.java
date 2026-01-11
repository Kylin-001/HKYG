package com.heikeji.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.admin.entity.SystemConfig;
import com.heikeji.admin.mapper.SystemConfigMapper;
import com.heikeji.admin.service.SystemConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 系统配置Service实现类
 */
@Service
public class SystemConfigServiceImpl implements SystemConfigService {

    @Autowired
    private SystemConfigMapper systemConfigMapper;

    @Override
    public Map<String, Object> pageSystemConfig(Map<String, Object> params) {
        // 获取分页参数
        int page = params.get("page") == null ? 1 : Integer.parseInt(params.get("page").toString());
        int limit = params.get("limit") == null ? 10 : Integer.parseInt(params.get("limit").toString());

        // 创建分页对象
        Page<SystemConfig> pageConfig = new Page<>(page, limit);

        // 构建查询条件
        QueryWrapper<SystemConfig> wrapper = new QueryWrapper<>();

        // 配置键模糊查询
        if (params.containsKey("configKey") && params.get("configKey") != null && !params.get("configKey").toString().isEmpty()) {
            wrapper.like("config_key", params.get("configKey").toString());
        }

        // 配置类型精确查询
        if (params.containsKey("configType") && params.get("configType") != null && !params.get("configType").toString().isEmpty()) {
            wrapper.eq("config_type", params.get("configType").toString());
        }

        // 配置描述模糊查询
        if (params.containsKey("description") && params.get("description") != null && !params.get("description").toString().isEmpty()) {
            wrapper.like("description", params.get("description").toString());
        }

        // 状态精确查询
        if (params.containsKey("status") && params.get("status") != null) {
            wrapper.eq("status", params.get("status"));
        }

        // 按排序值和更新时间排序
        wrapper.orderByAsc("sort");
        wrapper.orderByDesc("update_time");

        // 执行分页查询
        IPage<SystemConfig> systemConfigIPage = systemConfigMapper.selectPage(pageConfig, wrapper);

        // 构建结果
        Map<String, Object> result = new HashMap<>();
        result.put("total", systemConfigIPage.getTotal());
        result.put("list", systemConfigIPage.getRecords());

        return result;
    }

    @Override
    public SystemConfig getSystemConfigById(Long id) {
        return systemConfigMapper.selectById(id);
    }

    @Override
    public SystemConfig getSystemConfigByKey(String configKey) {
        QueryWrapper<SystemConfig> wrapper = new QueryWrapper<>();
        wrapper.eq("config_key", configKey);
        wrapper.eq("status", 1);
        return systemConfigMapper.selectOne(wrapper);
    }

    @Override
    public boolean addSystemConfig(SystemConfig systemConfig) {
        // 设置创建和更新时间
        Date now = new Date();
        systemConfig.setCreateTime(now);
        systemConfig.setUpdateTime(now);
        // 设置默认状态为启用
        if (systemConfig.getStatus() == null) {
            systemConfig.setStatus(1);
        }
        // 设置默认排序值
        if (systemConfig.getSort() == null) {
            systemConfig.setSort(0);
        }
        return systemConfigMapper.insert(systemConfig) > 0;
    }

    @Override
    public boolean updateSystemConfig(SystemConfig systemConfig) {
        // 设置更新时间
        systemConfig.setUpdateTime(new Date());
        return systemConfigMapper.updateById(systemConfig) > 0;
    }

    @Override
    public boolean deleteSystemConfig(Long id) {
        return systemConfigMapper.deleteById(id) > 0;
    }

    @Override
    public boolean batchDeleteSystemConfig(List<Long> ids) {
        QueryWrapper<SystemConfig> wrapper = new QueryWrapper<>();
        wrapper.in("id", ids);
        return systemConfigMapper.delete(wrapper) > 0;
    }

    @Override
    public List<SystemConfig> getSystemConfigByType(String configType) {
        QueryWrapper<SystemConfig> wrapper = new QueryWrapper<>();
        wrapper.eq("config_type", configType);
        wrapper.eq("status", 1);
        wrapper.orderByAsc("sort");
        return systemConfigMapper.selectList(wrapper);
    }

    @Override
    public List<SystemConfig> getAllEnabledSystemConfig() {
        QueryWrapper<SystemConfig> wrapper = new QueryWrapper<>();
        wrapper.eq("status", 1);
        wrapper.orderByAsc("sort");
        wrapper.orderByAsc("config_type");
        return systemConfigMapper.selectList(wrapper);
    }

    @Override
    public boolean updateSystemConfigStatus(Long id, Integer status) {
        SystemConfig systemConfig = new SystemConfig();
        systemConfig.setId(id);
        systemConfig.setStatus(status);
        systemConfig.setUpdateTime(new Date());
        return systemConfigMapper.updateById(systemConfig) > 0;
    }

    @Override
    public boolean batchUpdateSystemConfigStatus(List<Long> ids, Integer status) {
        SystemConfig systemConfig = new SystemConfig();
        systemConfig.setStatus(status);
        systemConfig.setUpdateTime(new Date());
        QueryWrapper<SystemConfig> wrapper = new QueryWrapper<>();
        wrapper.in("id", ids);
        return systemConfigMapper.update(systemConfig, wrapper) > 0;
    }
}
