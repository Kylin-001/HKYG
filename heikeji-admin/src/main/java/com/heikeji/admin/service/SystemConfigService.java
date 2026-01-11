package com.heikeji.admin.service;

import com.heikeji.admin.entity.SystemConfig;

import java.util.List;
import java.util.Map;

/**
 * 系统配置Service接口
 */
public interface SystemConfigService {

    /**
     * 分页查询系统配置
     *
     * @param params 查询参数
     * @return 配置列表和总数
     */
    Map<String, Object> pageSystemConfig(Map<String, Object> params);

    /**
     * 根据ID获取系统配置
     *
     * @param id 配置ID
     * @return 系统配置
     */
    SystemConfig getSystemConfigById(Long id);

    /**
     * 根据配置键获取系统配置
     *
     * @param configKey 配置键
     * @return 系统配置
     */
    SystemConfig getSystemConfigByKey(String configKey);

    /**
     * 添加系统配置
     *
     * @param systemConfig 系统配置
     * @return 是否添加成功
     */
    boolean addSystemConfig(SystemConfig systemConfig);

    /**
     * 更新系统配置
     *
     * @param systemConfig 系统配置
     * @return 是否更新成功
     */
    boolean updateSystemConfig(SystemConfig systemConfig);

    /**
     * 删除系统配置
     *
     * @param id 配置ID
     * @return 是否删除成功
     */
    boolean deleteSystemConfig(Long id);

    /**
     * 批量删除系统配置
     *
     * @param ids 配置ID列表
     * @return 是否删除成功
     */
    boolean batchDeleteSystemConfig(List<Long> ids);

    /**
     * 根据配置类型获取系统配置列表
     *
     * @param configType 配置类型
     * @return 系统配置列表
     */
    List<SystemConfig> getSystemConfigByType(String configType);

    /**
     * 获取所有启用的系统配置
     *
     * @return 系统配置列表
     */
    List<SystemConfig> getAllEnabledSystemConfig();

    /**
     * 更新系统配置状态
     *
     * @param id     配置ID
     * @param status 状态：0禁用 1启用
     * @return 是否更新成功
     */
    boolean updateSystemConfigStatus(Long id, Integer status);

    /**
     * 批量更新系统配置状态
     *
     * @param ids    配置ID列表
     * @param status 状态：0禁用 1启用
     * @return 是否更新成功
     */
    boolean batchUpdateSystemConfigStatus(List<Long> ids, Integer status);
}
