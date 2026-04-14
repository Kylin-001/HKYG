package com.heikeji.mall.common.auth;

import com.heikeji.common.core.security.UserContextHolderAdapter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * 用户上下文清理拦截器
 * 在请求处理完成后清理用户上下文，避免内存泄漏
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Component
@Slf4j
public class UserContextCleanupInterceptor implements HandlerInterceptor {

    /**
     * 在请求处理完成后清理用户上下文
     * 这个方法会在视图渲染完成后执行（如果有视图的话）
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        try {
            // 清理用户上下文
            UserContextHolderAdapter.clearCurrentUserId();
            log.debug("用户上下文已清理");
        } catch (Exception e) {
            log.error("清理用户上下文失败: {}", e.getMessage());
        }
    }
}
