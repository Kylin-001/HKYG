package com.heikeji.mall.user.service;

import com.heikeji.mall.user.entity.UserLoginHistory;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * 用户登录历史服务接口
 *
 * @author heikeji
 * @date 2024-12-19
 */
public interface UserLoginHistoryService extends IService<UserLoginHistory> {

    /**
     * 记录用户登录历史
     *
     * @param userId    用户ID
     * @param username  用户名
     * @param ip        IP地址
     * @param userAgent 用户代理
     * @param status    登录状态
     * @param reason    登录原因
     */
    void recordLoginHistory(Long userId, String username, String ip, String userAgent, String status, String reason);

    /**
     * 获取用户最近登录记录
     *
     * @param userId   用户ID
     * @param limit    记录数
     * @return 登录记录列表
     */
    List<UserLoginHistory> getRecentLoginHistory(Long userId, Integer limit);

    /**
     * 获取用户登录记录
     *
     * @param userId   用户ID
     * @param page     页码
     * @param pageSize 每页大小
     * @return 登录记录列表
     */
    List<UserLoginHistory> getUserLoginHistory(Long userId, Integer page, Integer pageSize);

    /**
     * 获取用户IP登录次数
     *
     * @param userId 用户ID
     * @param ip     IP地址
     * @param days   天数
     * @return 登录次数
     */
    Integer getLoginCountByIp(Long userId, String ip, Integer days);

    /**
     * 检查用户登录是否异常
     *
     * @param userId   用户ID
     * @param ip       IP地址
     * @param userAgent 用户代理
     * @return 是否异常
     */
    boolean checkLoginAbnormal(Long userId, String ip, String userAgent);

    /**
     * 强制用户下线
     *
     * @param userId 用户ID
     * @param reason 下线原因
     * @return 是否成功
     */
    boolean forceLogout(Long userId, String reason);
}
