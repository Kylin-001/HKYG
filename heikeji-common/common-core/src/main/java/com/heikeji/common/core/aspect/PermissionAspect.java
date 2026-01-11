package com.heikeji.common.core.aspect;

import com.heikeji.common.api.ResultCode;
import com.heikeji.common.api.ResponseMessage;
import com.heikeji.common.core.annotation.RequiresPermission;
import com.heikeji.common.core.service.PermissionService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Set;

/**
 * 权限校验切面
 * 用于拦截含有RequiresPermission注解的方法进行权限校验
 */
@Aspect
@Component
public class PermissionAspect {

    private static final Logger log = LoggerFactory.getLogger(PermissionAspect.class);

    @Autowired(required = false)
    private PermissionService permissionService;

    /**
     * 定义切入点：拦截所有带有RequiresPermission注解的方法
     */
    @Pointcut("@annotation(com.heikeji.common.core.annotation.RequiresPermission)")
    public void permissionPointCut() {
    }

    /**
     * 执行环绕通知，进行权限校验
     */
    @Around("permissionPointCut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        // 获取方法签名
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();
        
        // 获取RequiresPermission注解
        RequiresPermission requiresPermission = method.getAnnotation(RequiresPermission.class);
        if (requiresPermission == null) {
            return point.proceed();
        }
        
        // 如果permissionService未注入，直接放行
        if (permissionService == null) {
            log.warn("PermissionService未注入，跳过权限校验：{}.{}", method.getDeclaringClass().getName(), method.getName());
            return point.proceed();
        }
        
        // 获取权限信息
        String[] permissions = requiresPermission.value();
        String type = requiresPermission.type();
        String message = requiresPermission.message();
        
        // 获取当前用户信息
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("用户未认证");
        }
        
        // 获取用户ID（假设Principal中包含用户ID信息）
        Long userId = null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof Long) {
            userId = (Long) principal;
        } else if (principal instanceof String) {
            try {
                userId = Long.parseLong((String) principal);
            } catch (NumberFormatException e) {
                // 如果无法解析，可能需要从其他地方获取用户ID
                // 这里简化处理，实际项目中可能需要根据情况调整
                throw new RuntimeException("无法获取用户ID");
            }
        } else {
            // 尝试从认证信息中获取用户ID
            // 实际项目中可能需要根据具体的认证实现进行调整
            throw new RuntimeException("无法获取用户信息");
        }
        
        // 获取用户的权限编码列表
        Set<String> userPermissionCodes = permissionService.getPermissionCodesByUserId(userId);
        
        // 检查用户是否拥有所需权限
        boolean hasPermission = false;
        
        if ("single".equals(type)) {
            // 只需要满足其中一个权限
            for (String permission : permissions) {
                if (userPermissionCodes.contains(permission)) {
                    hasPermission = true;
                    break;
                }
            }
        } else if ("all".equals(type)) {
            // 需要满足所有权限
            hasPermission = true;
            for (String permission : permissions) {
                if (!userPermissionCodes.contains(permission)) {
                    hasPermission = false;
                    break;
                }
            }
        }
        
        // 如果没有权限，抛出异常
        if (!hasPermission) {
            log.warn("用户[{}]尝试访问未授权资源：{}.{}", userId, method.getDeclaringClass().getName(), method.getName());
            throw new RuntimeException(message);
        }
        
        // 有权限，继续执行目标方法
        return point.proceed();
    }
}
