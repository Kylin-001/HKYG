package com.heikeji.mall.user.interceptor;

import com.heikeji.mall.common.auth.annotation.RequiresAdmin;
import com.heikeji.mall.common.auth.annotation.RequiresPermission;
import com.heikeji.mall.common.auth.annotation.RequiresRole;
import com.heikeji.mall.common.exception.AuthorizationException;
import com.heikeji.mall.user.entity.User;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;

/**
 * 增强型授权拦截器
 * 用于处理请求的授权验证
 */
@Component
public class EnhancedAuthorizationInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 如果不是方法处理器，直接放行
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        Method method = handlerMethod.getMethod();
        Class<?> clazz = handlerMethod.getBeanType();

        // 检查类级别注解
        checkAdminAnnotation(clazz);
        checkRolesAnnotation(clazz);
        checkPermissionsAnnotation(clazz);

        // 检查方法级别注解
        checkAdminAnnotation(method);
        checkRolesAnnotation(method);
        checkPermissionsAnnotation(method);

        return true;
    }

    /**
     * 检查管理员权限注解
     *
     * @param element 类或方法
     * @throws AuthorizationException 授权异常
     */
    private void checkAdminAnnotation(Object element) throws AuthorizationException {
        RequiresAdmin requiresAdmin;
        if (element instanceof Class<?>) {
            requiresAdmin = ((Class<?>) element).getAnnotation(RequiresAdmin.class);
        } else if (element instanceof Method) {
            requiresAdmin = ((Method) element).getAnnotation(RequiresAdmin.class);
        } else {
            return;
        }

        if (requiresAdmin != null) {
            // TODO: 实现管理员权限检查逻辑
            // 示例：获取当前用户，检查是否为管理员
            User currentUser = getCurrentUser();
            if (currentUser == null || currentUser.getUserType() != 2) {
                throw new AuthorizationException("需要管理员权限");
            }
        }
    }

    /**
     * 检查角色权限注解
     *
     * @param element 类或方法
     * @throws AuthorizationException 授权异常
     */
    private void checkRolesAnnotation(Object element) throws AuthorizationException {
        RequiresRole requiresRole;
        if (element instanceof Class<?>) {
            requiresRole = ((Class<?>) element).getAnnotation(RequiresRole.class);
        } else if (element instanceof Method) {
            requiresRole = ((Method) element).getAnnotation(RequiresRole.class);
        } else {
            return;
        }

        if (requiresRole != null) {
            // 实现角色权限检查逻辑
            String[] requiredRoles = requiresRole.value();
            boolean requireAll = requiresRole.requireAll();
            boolean hasPermission = false;

            if (requireAll) {
                // 需要所有角色
                hasPermission = true;
                for (String role : requiredRoles) {
                    if (!hasRole(role)) {
                        hasPermission = false;
                        break;
                    }
                }
            } else {
                // 需要其中一个角色
                for (String role : requiredRoles) {
                    if (hasRole(role)) {
                        hasPermission = true;
                        break;
                    }
                }
            }

            if (!hasPermission) {
                throw new AuthorizationException("需要指定角色权限");
            }
        }
    }

    /**
     * 检查权限注解
     *
     * @param element 类或方法
     * @throws AuthorizationException 授权异常
     */
    private void checkPermissionsAnnotation(Object element) throws AuthorizationException {
        RequiresPermission requiresPermission;
        if (element instanceof Class<?>) {
            requiresPermission = ((Class<?>) element).getAnnotation(RequiresPermission.class);
        } else if (element instanceof Method) {
            requiresPermission = ((Method) element).getAnnotation(RequiresPermission.class);
        } else {
            return;
        }

        if (requiresPermission != null) {
            // TODO: 实现权限检查逻辑
            // 示例：获取当前用户权限，检查是否包含所需权限
            String[] permissions = requiresPermission.value();
            for (String permission : permissions) {
                boolean hasPermission = checkPermission(permission);
                if (!hasPermission) {
                    throw new AuthorizationException("需要指定权限");
                }
            }
        }
    }

    /**
     * 获取当前用户
     *
     * @return 当前用户
     */
    private User getCurrentUser() {
        // TODO: 实现获取当前用户的逻辑
        // 示例：从请求上下文或会话中获取当前用户
        return null;
    }

    /**
     * 检查是否包含指定角色
     *
     * @param role 角色
     * @return 是否包含角色
     */
    private boolean hasRole(String role) {
        // TODO: 实现角色检查逻辑
        return false;
    }

    /**
     * 检查是否包含指定权限
     *
     * @param permission 权限
     * @return 是否包含权限
     */
    private boolean checkPermission(String permission) {
        // TODO: 实现权限检查逻辑
        return false;
    }
}