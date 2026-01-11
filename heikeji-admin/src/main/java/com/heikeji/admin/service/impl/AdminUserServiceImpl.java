package com.heikeji.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.admin.entity.AdminUser;
import com.heikeji.admin.mapper.AdminUserMapper;
import com.heikeji.admin.security.TokenService;
import com.heikeji.admin.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * 绠＄悊鍛樼敤鎴锋湇鍔″疄鐜扮被
 */
@Service
public class AdminUserServiceImpl extends ServiceImpl<AdminUserMapper, AdminUser> implements AdminUserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public Map<String, Object> login(String username, String password, String captcha, String uuid) {
        // 楠岃瘉鐮侀獙璇侀€昏緫
        if (!validateCaptcha(captcha, uuid)) {
            throw new RuntimeException("验证码错误或已过期");
        }
        
        // 查询用户
        AdminUser user = getByUsername(username);
        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }

        // 检查用户状态
        if (user.getStatus() == 0) {
            throw new RuntimeException("用户已被禁用");
        }

        // 验证密码
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }

        // 更新最后登录时间
        user.setLastLoginTime(new Date());
        this.updateById(user);

        // 生成token
        UserDetails userDetails = createUserDetails(user);
        String token = tokenService.createToken(userDetails);

        // 返回登录结果
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", user);
        result.put("permissions", tokenService.getCurrentUserPermissions());
        return result;
    }

    /**
     * 验证验证码     */
    private boolean validateCaptcha(String captcha, String uuid) {
        if (!StringUtils.hasText(captcha) || !StringUtils.hasText(uuid)) {
            return false;
        }

        String captchaKey = "captcha:" + uuid;
        String redisCaptcha = (String) redisTemplate.opsForValue().get(captchaKey);
        
        if (redisCaptcha == null) {
            return false;
        }

        // 使用完后删除验证码
        redisTemplate.delete(captchaKey);

        // 忽略大小写比较
        return captcha.equalsIgnoreCase(redisCaptcha);
    }

    @Override
    public boolean logout(String token) {
        tokenService.invalidateToken(token);
        return true;
    }

    @Override
    public AdminUser getUserInfo(Long userId) {
        return this.getById(userId);
    }

    @Override
    public AdminUser getByUsername(String username) {
        return this.getOne(new QueryWrapper<AdminUser>().eq("username", username));
    }

    @Override
    public Map<String, Object> pageUser(Map<String, Object> params) {
        Page<AdminUser> page = new Page<>(
                Long.parseLong(params.getOrDefault("page", 1).toString()),
                Long.parseLong(params.getOrDefault("limit", 10).toString())
        );

        QueryWrapper<AdminUser> wrapper = new QueryWrapper<>();
        // 添加查询条件
        if (params.containsKey("username")) {
            wrapper.like("username", params.get("username"));
        }
        if (params.containsKey("status")) {
            wrapper.eq("status", params.get("status"));
        }
        if (params.containsKey("deptId")) {
            wrapper.eq("dept_id", params.get("deptId"));
        }

        IPage<AdminUser> userPage = this.page(page, wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("total", userPage.getTotal());
        result.put("list", userPage.getRecords());
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean addUser(AdminUser user) {
        // 检查用户名是否已存在
        if (getByUsername(user.getUsername()) != null) {
            throw new RuntimeException("用户名已存在");
        }

        // 密码加密
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreateTime(new Date());
        user.setUpdateTime(new Date());
        user.setStatus(1);
        user.setDeleted(0);

        return this.save(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateUser(AdminUser user) {
        // 不允许修改密码
        user.setPassword(null);
        user.setUpdateTime(new Date());
        return this.updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteUser(Long userId) {
        return this.removeById(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean batchDeleteUser(List<Long> userIds) {
        return this.removeByIds(userIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        AdminUser user = this.getById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 验证旧密码
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("旧密码错误");
        }

        // 加密新密码
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdateTime(new Date());
        return this.updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean resetPassword(Long userId) {
        AdminUser user = this.getById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 重置密码为123456
        user.setPassword(passwordEncoder.encode("123456"));
        user.setUpdateTime(new Date());
        return this.updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateUserStatus(Long userId, Integer status) {
        AdminUser user = new AdminUser();
        user.setId(userId);
        user.setStatus(status);
        user.setUpdateTime(new Date());
        return this.updateById(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminUser user = getByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("用户名不存在");
        }
        return createUserDetails(user);
    }

    /**
     * 创建UserDetails对象
     */
    private UserDetails createUserDetails(AdminUser user) {
        // 从roleIds字段获取角色ID列表
        Set<String> authorities = new HashSet<>();
        
        // 添加默认管理员角色和权限
        authorities.add("ROLE_ADMIN");
        authorities.add("*:*:*");
        
        // 解析roleIds获取具体角色权限（这里可以根据实际需求从数据库查询）
        if (StringUtils.hasText(user.getRoleIds())) {
            String[] roleIdArray = user.getRoleIds().split(",");
            // 这里可以根据角色ID从数据库查询对应的权限
            // 暂时添加角色标识作为权限
            for (String roleId : roleIdArray) {
                authorities.add("ROLE_" + roleId);
            }
        }
        
        return User.withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities.toArray(new String[0]))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(user.getStatus() == 0)
                .build();
    }
}
