package com.heikeji.mall.user.component;

import com.heikeji.mall.user.entity.UserLoginHistory;
import com.heikeji.mall.user.service.UserLoginHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * 登录记录组件
 * 用于记录用户登录历史信息
 */
@Component
public class LoginRecordComponent {

    @Autowired
    private UserLoginHistoryService userLoginHistoryService;

    /**
     * 记录用户登录信息
     *
     * @param userId    用户ID
     * @param username  用户名
     * @param status    登录状态 0:失败 1:成功
     * @param request   HTTP请求对象
     * @param message   登录消息
     */
    public void recordLogin(Long userId, String username, Integer status, HttpServletRequest request, String message) {
        UserLoginHistory loginHistory = new UserLoginHistory();
        loginHistory.setUserId(userId);
        loginHistory.setLoginAccount(username);
        loginHistory.setLoginTime(LocalDateTime.now());
        loginHistory.setLoginIp(getClientIp(request));
        loginHistory.setLoginStatus(status);
        loginHistory.setFailReason(message);

        userLoginHistoryService.save(loginHistory);
    }

    /**
     * 获取客户端真实IP地址
     *
     * @param request HTTP请求对象
     * @return 客户端IP地址
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // 如果是多级代理，取第一个IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}