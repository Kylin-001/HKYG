package com.heikeji.mall.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.user.entity.UserLoginHistory;
import com.heikeji.mall.user.mapper.UserLoginHistoryMapper;
import com.heikeji.mall.user.service.UserLoginHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * 用户登录历史服务实现类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Service
public class UserLoginHistoryServiceImpl extends ServiceImpl<UserLoginHistoryMapper, UserLoginHistory> implements UserLoginHistoryService {

    @Autowired
    private UserLoginHistoryMapper loginHistoryMapper;

    @Autowired(required = false)
    private RedisTemplate<String, String> redisTemplate;

    private static final Logger log = LoggerFactory.getLogger(UserLoginHistoryServiceImpl.class);
    private static final String LOGIN_HISTORY_KEY_PREFIX = "user:login:history:";
    private static final String USER_SESSION_KEY_PREFIX = "user:session:";

    @Override
    public void recordLoginHistory(Long userId, String username, String ip, String userAgent, String status, String reason) {
        UserLoginHistory loginHistory = new UserLoginHistory();
        loginHistory.setUserId(userId);
        loginHistory.setLoginAccount(username);
        loginHistory.setLoginIp(ip);
        loginHistory.setLoginStatus("success".equals(status) ? 1 : 0);
        loginHistory.setFailReason(reason);
        loginHistory.setLoginTime(LocalDateTime.now());
        loginHistoryMapper.insert(loginHistory);
    }

    @Override
    public List<UserLoginHistory> getRecentLoginHistory(Long userId, Integer limit) {
        LambdaQueryWrapper<UserLoginHistory> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserLoginHistory::getUserId, userId)
                .orderByDesc(UserLoginHistory::getLoginTime)
                .last("LIMIT " + limit);
        return loginHistoryMapper.selectList(queryWrapper);
    }

    @Override
    public List<UserLoginHistory> getUserLoginHistory(Long userId, Integer page, Integer pageSize) {
        Page<UserLoginHistory> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<UserLoginHistory> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserLoginHistory::getUserId, userId)
                .orderByDesc(UserLoginHistory::getLoginTime);
        IPage<UserLoginHistory> pageResult = loginHistoryMapper.selectPage(pageParam, queryWrapper);
        return pageResult.getRecords();
    }

    @Override
    public Integer getLoginCountByIp(Long userId, String ip, Integer days) {
        LocalDateTime startTime = LocalDateTime.now().minusDays(days);
        LambdaQueryWrapper<UserLoginHistory> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserLoginHistory::getUserId, userId)
                .eq(UserLoginHistory::getLoginIp, ip)
                .ge(UserLoginHistory::getLoginTime, startTime);
        return Math.toIntExact(loginHistoryMapper.selectCount(queryWrapper));
    }

    @Override
    public boolean checkLoginAbnormal(Long userId, String ip, String userAgent) {
        // 简单的异常检测逻辑：检查该IP在最近24小时内的登录失败次数
        Integer failedCount = getLoginFailCountByIp(ip, 1);
        if (failedCount >= 5) {
            return true;
        }

        // 检查用户最近登录的IP是否与当前IP相同
        List<UserLoginHistory> recentHistory = getRecentLoginHistory(userId, 3);
        if (!recentHistory.isEmpty()) {
            boolean ipChanged = true;
            for (UserLoginHistory history : recentHistory) {
                if (history.getLoginIp().equals(ip)) {
                    ipChanged = false;
                    break;
                }
            }
            if (ipChanged) {
                return true;
            }
        }

        return false;
    }

    @Override
    public boolean forceLogout(Long userId, String reason) {
        try {
            // 清除用户所有会话（如果Redis可用）
            if (redisTemplate != null) {
                String sessionPattern = USER_SESSION_KEY_PREFIX + userId + ":*";
                Set<String> keys = redisTemplate.keys(sessionPattern);
                if (keys != null && !keys.isEmpty()) {
                    redisTemplate.delete(keys);
                }
            }

            // 记录强制下线历史
            recordLoginHistory(userId, null, null, null, "fail", reason);
            
            return true;
        } catch (Exception e) {
            log.error("强制用户下线时发生异常", e);
            return false;
        }
    }

    /**
     * 获取IP在指定天数内的登录失败次数
     */
    private Integer getLoginFailCountByIp(String ip, Integer days) {
        LocalDateTime startTime = LocalDateTime.now().minusDays(days);
        LambdaQueryWrapper<UserLoginHistory> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserLoginHistory::getLoginIp, ip)
                .eq(UserLoginHistory::getLoginStatus, 0)
                .ge(UserLoginHistory::getLoginTime, startTime);
        return Math.toIntExact(loginHistoryMapper.selectCount(queryWrapper));
    }
}
