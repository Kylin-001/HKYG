package com.heikeji.mall.common.auth;

import com.heikeji.mall.common.exception.BusinessException;
import com.heikeji.mall.user.entity.User;
import com.heikeji.mall.user.service.UserService;
import com.heikeji.mall.user.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 认证服务类
 * 用于处理用户认证相关逻辑
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Service
public class AuthenticationService {

    @Autowired
    private UserService userService;

    /**
     * 用户登录认证
     */
    public UserLoginInfo authenticate(String loginAccount, String password, String loginIp, String loginDevice) {
        if (loginAccount == null || password == null) {
            throw new BusinessException("账号或密码不能为空");
        }

        // 根据登录账号查找用户（尝试通过用户名、手机号、邮箱查找）
        User user = userService.getUserByUsername(loginAccount);
        if (user == null) {
            user = userService.getUserByPhone(loginAccount);
        }
        if (user == null) {
            user = userService.getUserByEmail(loginAccount);
        }
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        // 检查用户状态
        checkUserStatus(user);

        // 验证密码
        if (!SecurityUtils.matchesPassword(password, user.getPassword())) {
            throw new BusinessException("密码错误");
        }

        // 构建用户登录信息
        UserLoginInfo userLoginInfo = new UserLoginInfo();
        userLoginInfo.setUserId(user.getId());
        userLoginInfo.setUsername(user.getUsername());
        userLoginInfo.setUserType(user.getUserType());

        return userLoginInfo;
    }

    /**
     * 检查用户状态
     */
    private void checkUserStatus(User user) {
        if (user.getStatus() == null) {
            throw new BusinessException("用户状态异常");
        }

        switch (user.getStatus()) {
            case 0:
                throw new BusinessException("用户账号已禁用");
            case 2:
                throw new BusinessException("用户账号已锁定");
            case 3:
                throw new BusinessException("用户账号已过期");
            default:
                break;
        }
    }

    /**
     * 退出登录
     */
    public void logout(Long userId, String loginIp) {
        // 清理用户上下文
        UserContextHolder.clear();
    }
    

}
