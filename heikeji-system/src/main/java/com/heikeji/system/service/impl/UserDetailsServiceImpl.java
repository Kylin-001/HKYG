package com.heikeji.system.service.impl;

import com.heikeji.system.entity.SysUser;
import com.heikeji.system.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * 用户认证服务实现类
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private SysUserService sysUserService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 根据用户名查找用户
        SysUser user = sysUserService.getByUsername(username);
        
        if (user == null) {
            throw new UsernameNotFoundException("用户名不存在");
        }
        
        // 检查用户状态
        if (user.getStatus() == 0) {
            throw new RuntimeException("账号已被禁用");
        }
        
        // 获取用户权限
        Set<String> permissions = sysUserService.getPermissionsByUserId(user.getId());
        
        // 转换为Spring Security的权限格式
        Set<SimpleGrantedAuthority> authorities = permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
        
        // 更新最后登录时间
        sysUserService.updateLastLoginTime(user.getId());
        
        // 返回UserDetails对象
        return new User(user.getUsername(), user.getPassword(), authorities);
    }
}
