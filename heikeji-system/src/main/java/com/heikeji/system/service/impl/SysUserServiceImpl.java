package com.heikeji.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.system.entity.SysUser;
import com.heikeji.system.mapper.SysUserMapper;
import com.heikeji.system.mapper.SysUserRoleMapper;
import com.heikeji.system.service.SysPermissionService;
import com.heikeji.system.service.SysRoleService;
import com.heikeji.system.service.SysUserService;
import com.heikeji.system.vo.UserQueryVO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 系统用户服务实现类
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserService {

    @Autowired
    private SysUserMapper sysUserMapper;

    @Autowired
    private SysUserRoleMapper sysUserRoleMapper;

    @Autowired
    private SysRoleService sysRoleService;

    @Autowired
    private SysPermissionService sysPermissionService;

    @Autowired
    @Qualifier("systemPasswordEncoder")
    private PasswordEncoder passwordEncoder;

    @Override
    public SysUser getByUsername(String username) {
        return sysUserMapper.selectByUsername(username);
    }

    @Override
    public SysUser getByPhone(String phone) {
        return sysUserMapper.selectByPhone(phone);
    }

    @Override
    public SysUser getByEmail(String email) {
        return sysUserMapper.selectByEmail(email);
    }

    @Override
    public IPage<SysUser> page(UserQueryVO queryVO) {
        Page<SysUser> page = new Page<>(queryVO.getPageNum(), queryVO.getPageSize());
        SysUser user = new SysUser();
        if (StringUtils.isNotBlank(queryVO.getUsername())) {
            user.setUsername(queryVO.getUsername());
        }
        if (StringUtils.isNotBlank(queryVO.getNickname())) {
            user.setNickname(queryVO.getNickname());
        }
        if (StringUtils.isNotBlank(queryVO.getPhone())) {
            user.setPhone(queryVO.getPhone());
        }
        if (queryVO.getStatus() != null) {
            user.setStatus(queryVO.getStatus());
        }
        if (queryVO.getDeptId() != null) {
            user.setDeptId(queryVO.getDeptId());
        }
        return sysUserMapper.selectPage(page, user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean create(SysUser user) {
        // 密码加密
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return this.save(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean update(SysUser user) {
        return this.updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean delete(Long id) {
        // 删除用户角色关联
        sysUserRoleMapper.deleteByUserId(id);
        return this.removeById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteBatch(List<Long> ids) {
        // 批量删除用户角色关联
        for (Long id : ids) {
            sysUserRoleMapper.deleteByUserId(id);
        }
        return this.removeByIds(ids);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateStatus(Long id, Integer status) {
        SysUser user = new SysUser();
        user.setId(id);
        user.setStatus(status);
        return this.updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean resetPassword(Long id, String password) {
        SysUser user = new SysUser();
        user.setId(id);
        user.setPassword(passwordEncoder.encode(password));
        return this.updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateLastLoginTime(Long id) {
        return sysUserMapper.updateLastLoginTime(id) > 0;
    }

    @Override
    public List<SysUser> listByRoleId(Long roleId) {
        return sysUserMapper.selectByRoleId(roleId);
    }

    @Override
    public List<SysUser> listByDeptId(Long deptId) {
        return sysUserMapper.selectByDeptId(deptId);
    }

    @Override
    public Set<String> getPermissionsByUserId(Long userId) {
        return sysPermissionService.getPermissionCodesByUserId(userId);
    }

    @Override
    public Set<String> getRolesByUserId(Long userId) {
        List<Long> roleIds = sysUserRoleMapper.selectRoleIdsByUserId(userId);
        Set<String> roleCodes = new HashSet<>();
        for (Long roleId : roleIds) {
            SysUser user = this.getById(userId);
            if (user != null && user.getStatus() == 1) {
                // 可以在这里获取角色编码等信息
            }
        }
        return roleCodes;
    }

    @Override
    public boolean checkUsernameUnique(String username, Long id) {
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        if (id != null) {
            queryWrapper.ne("id", id);
        }
        return this.count(queryWrapper) == 0;
    }

    @Override
    public boolean checkPhoneUnique(String phone, Long id) {
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("phone", phone);
        if (id != null) {
            queryWrapper.ne("id", id);
        }
        return this.count(queryWrapper) == 0;
    }

    @Override
    public boolean checkEmailUnique(String email, Long id) {
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        if (id != null) {
            queryWrapper.ne("id", id);
        }
        return this.count(queryWrapper) == 0;
    }
}
