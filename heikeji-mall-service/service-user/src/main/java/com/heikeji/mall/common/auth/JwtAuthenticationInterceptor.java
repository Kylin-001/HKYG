package com.heikeji.mall.common.auth;

import com.heikeji.mall.common.auth.annotation.PublicApi;
import com.heikeji.mall.common.exception.BusinessException;
import com.heikeji.common.security.utils.JwtUtils;
import com.heikeji.mall.user.dto.UserLoginDTO;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;
import java.util.Date;

/**
 * JWT认证拦截器
 * 用于验证JWT令牌并解析用户信息
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Slf4j
@Component
public class JwtAuthenticationInterceptor implements HandlerInterceptor {

    // 使用common-security模块中的JwtUtils类，无需注入

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 检查是否为方法处理
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        Method method = handlerMethod.getMethod();

        // 检查是否为公共API
        if (method.isAnnotationPresent(PublicApi.class) || handlerMethod.getBeanType().isAnnotationPresent(PublicApi.class)) {
            return true;
        }

        // 获取请求头中的令牌
        String token = request.getHeader("Authorization");
        if (token == null || token.isEmpty()) {
            throw new BusinessException("未提供认证令牌");
        }

        // 移除Bearer前缀（如果有）
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            // 使用common-security模块中的JwtUtils类解析令牌
            Claims claims = JwtUtils.getClaimsFromToken(token);
            
            // 验证令牌是否过期
            if (JwtUtils.validateToken(token)) {
                // 构建用户登录信息
                UserLoginDTO userLoginInfo = new UserLoginDTO();
                userLoginInfo.setId(JwtUtils.getUserIdFromToken(token));
                userLoginInfo.setUsername((String) claims.get("username"));
                
                // 将用户登录信息放入上下文
                UserContextHolder.setUserLoginInfo(userLoginInfo);
                
                log.debug("JWT认证通过，用户ID: {}", userLoginInfo.getId());
                return true;
            } else {
                throw new BusinessException("认证令牌已过期");
            }
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("JWT认证失败: {}", e.getMessage(), e);
            throw new BusinessException("无效的认证令牌");
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {
        // 空实现
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // 清理用户上下文
        UserContextHolder.clear();
    }
}
