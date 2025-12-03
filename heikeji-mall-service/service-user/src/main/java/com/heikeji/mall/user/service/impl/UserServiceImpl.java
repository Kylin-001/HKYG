package com.heikeji.mall.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.common.enums.UserStatus;
import com.heikeji.mall.common.Result;
import com.heikeji.mall.user.component.PasswordStrengthChecker;
import com.heikeji.mall.user.dto.LoginDTO;
import com.heikeji.mall.user.dto.RegisterDTO;
import com.heikeji.mall.user.dto.ResetPasswordDTO;
import com.heikeji.mall.user.dto.UserDTO;
import com.heikeji.mall.user.dto.UserUpdateDTO;
import com.heikeji.mall.user.entity.User;
import com.heikeji.mall.user.mapper.UserMapper;
import com.heikeji.mall.user.service.UserSecurityService;
import com.heikeji.mall.user.service.UserService;
import com.heikeji.mall.user.utils.SecurityUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 用户服务实现类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordStrengthChecker passwordStrengthChecker;
    
    @Autowired
    private UserSecurityService userSecurityService;

    @Override
    public User getUserByOpenId(String openId) {
        return userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getOpenId, openId));
    }

    public User getUserByStudentId(String studentId) {
        return userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getStudentId, studentId));
    }
    
    @Override
    public User getUserByStudentNo(String studentNo) {
        return getUserByStudentId(studentNo);
    }
    
    @Override
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }
    
    @Override
    public User getUserByUsername(String username) {
        return userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username));
    }

    @Override
    public User getUserByPhone(String phone) {
        return userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getPhone, phone));
    }

    @Override
    public User getUserByEmail(String email) {
        return userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getEmail, email));
    }

    // 移除不匹配的register方法的@Override注解
    @Transactional(rollbackFor = Exception.class)
    public User register(UserDTO userDTO) {
        // 检查用户名是否已存在
        if (userMapper.exists(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, userDTO.getUsername()))) {
            throw new RuntimeException("用户名已存在");
        }

        // 检查手机号是否已存在
        if (userDTO.getPhone() != null && userMapper.exists(new LambdaQueryWrapper<User>()
                .eq(User::getPhone, userDTO.getPhone()))) {
            throw new RuntimeException("手机号已被注册");
        }

        // 检查邮箱是否已存在
        if (userDTO.getEmail() != null && userMapper.exists(new LambdaQueryWrapper<User>()
                .eq(User::getEmail, userDTO.getEmail()))) {
            throw new RuntimeException("邮箱已被注册");
        }

        User user = new User();
        BeanUtils.copyProperties(userDTO, user);

        // 加密密码
        if (userDTO.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        // 设置默认值
        user.setStatus(UserStatus.ACTIVE.getCode());
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());

        userMapper.insert(user);
        return user;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public User register(RegisterDTO registerDTO) {
        // 检查用户名是否已存在
        if (userMapper.exists(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, registerDTO.getUsername()))) {
            throw new RuntimeException("用户名已存在");
        }

        // 检查手机号是否已存在
        if (registerDTO.getPhone() != null && userMapper.exists(new LambdaQueryWrapper<User>()
                .eq(User::getPhone, registerDTO.getPhone()))) {
            throw new RuntimeException("手机号已被注册");
        }

        User user = new User();
        BeanUtils.copyProperties(registerDTO, user);

        // 加密密码
        if (registerDTO.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        }

        // 设置默认值
        user.setStatus(UserStatus.ACTIVE.getCode());
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());

        userMapper.insert(user);
        return user;
    }

    // 移除不匹配的wechatLogin方法的@Override注解
    @Transactional(rollbackFor = Exception.class)
    public User wechatLogin(String openId, String nickname, String avatar) {
        // 查找用户
        User user = getUserByOpenId(openId);

        if (user == null) {
            // 新用户注册
            user = new User();
            user.setOpenId(openId);
            user.setNickname(nickname);
            user.setAvatar(avatar);
            user.setStatus(UserStatus.ACTIVE.getCode());
            user.setCreateTime(LocalDateTime.now());
            user.setUpdateTime(LocalDateTime.now());
            userMapper.insert(user);
        } else {
            // 更新用户信息
            user.setNickname(nickname);
            user.setAvatar(avatar);
            user.setUpdateTime(LocalDateTime.now());
            userMapper.updateById(user);
        }

        return user;
    }
    
    @Override
    public Map<String, Object> login(LoginDTO loginDTO) {
        // TODO: 实现登录逻辑
        return null;
    }
    
    @Override
    public Map<String, Object> wechatLogin(String code) {
        // TODO: 实现微信登录逻辑
        return null;
    }
    
    @Override
    public void logout(String token) {
        // TODO: 实现登出逻辑
    }
    
    @Override
    public User getCurrentUser() {
        // 获取当前登录用户ID
        Long userId = SecurityUtils.getCurrentUserId();
        // 根据ID查询用户信息
        return getUserById(userId);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public User updateUser(UserUpdateDTO userUpdateDTO) {
        // 获取当前登录用户ID
        Long userId = SecurityUtils.getCurrentUserId();
        // 根据ID查询用户
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 更新用户信息
        if (userUpdateDTO.getNickname() != null) {
            user.setNickname(userUpdateDTO.getNickname());
        }
        if (userUpdateDTO.getEmail() != null) {
            // 检查邮箱是否已被其他用户使用
            if (userMapper.exists(new LambdaQueryWrapper<User>()
                    .eq(User::getEmail, userUpdateDTO.getEmail())
                    .ne(User::getId, userId))) {
                throw new RuntimeException("邮箱已被注册");
            }
            user.setEmail(userUpdateDTO.getEmail());
        }
        if (userUpdateDTO.getGender() != null) {
            user.setGender(userUpdateDTO.getGender());
        }
        if (userUpdateDTO.getBirthday() != null) {
            user.setBirthday(userUpdateDTO.getBirthday());
        }
        if (userUpdateDTO.getPhone() != null) {
            // 检查手机号是否已被其他用户使用
            if (userMapper.exists(new LambdaQueryWrapper<User>()
                    .eq(User::getPhone, userUpdateDTO.getPhone())
                    .ne(User::getId, userId))) {
                throw new RuntimeException("手机号已被注册");
            }
            user.setPhone(userUpdateDTO.getPhone());
        }
        if (userUpdateDTO.getCollege() != null) {
            user.setCollege(userUpdateDTO.getCollege());
        }
        if (userUpdateDTO.getMajor() != null) {
            user.setMajor(userUpdateDTO.getMajor());
        }
        if (userUpdateDTO.getGrade() != null) {
            user.setGrade(userUpdateDTO.getGrade());
        }

        user.setUpdateTime(LocalDateTime.now());
        userMapper.updateById(user);

        return user;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updatePassword(String oldPassword, String newPassword) {
        // 获取当前登录用户ID
        Long userId = SecurityUtils.getCurrentUserId();
        // 根据ID查询用户
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 验证旧密码
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("旧密码错误");
        }

        // 验证新密码强度
        if (!passwordStrengthChecker.validatePassword(newPassword)) {
            throw new RuntimeException("新密码强度不足");
        }

        // 更新密码
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdateTime(LocalDateTime.now());
        userMapper.updateById(user);
    }
    
    @Override
    public void resetPassword(ResetPasswordDTO resetPasswordDTO) {
        // TODO: 实现重置密码的逻辑
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateAvatar(String avatarUrl) {
        // 获取当前登录用户ID
        Long userId = SecurityUtils.getCurrentUserId();
        // 根据ID查询用户
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 更新头像
        user.setAvatar(avatarUrl);
        user.setUpdateTime(LocalDateTime.now());
        userMapper.updateById(user);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public User bindStudentId(String studentId, String realName, String college, String major, String grade) {
        // 1. 获取当前登录用户ID
        Long userId = SecurityUtils.getCurrentUserId();
        
        // 2. 根据ID获取用户信息
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        // 3. 检查学号是否已经被其他用户绑定
        User existingUser = getUserByStudentId(studentId);
        if (existingUser != null && !existingUser.getId().equals(userId)) {
            throw new RuntimeException("该学号已被其他用户绑定");
        }
        
        // 4. 更新用户的学号信息
        user.setStudentId(studentId);
        
        // 5. 如果提供了真实姓名、学院、专业、年级等信息，也一并更新
        if (realName != null) {
            user.setRealName(realName);
        }
        if (college != null) {
            user.setCollege(college);
        }
        if (major != null) {
            user.setMajor(major);
        }
        if (grade != null) {
            user.setGrade(grade);
        }
        
        // 6. 更新用户的更新时间
        user.setUpdateTime(LocalDateTime.now());
        
        // 7. 保存更新后的用户信息
        userMapper.updateById(user);
        
        return user;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public User bindWechat(String openId) {
        // 1. 获取当前登录用户ID
        Long userId = SecurityUtils.getCurrentUserId();
        
        // 2. 根据ID获取用户信息
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        // 3. 检查openId是否已经被其他用户绑定
        User existingUser = getUserByOpenId(openId);
        if (existingUser != null && !existingUser.getId().equals(userId)) {
            throw new RuntimeException("该微信账号已被其他用户绑定");
        }
        
        // 4. 绑定微信账号
        user.setOpenId(openId);
        user.setUpdateTime(LocalDateTime.now());
        
        // 5. 更新用户信息
        userMapper.updateById(user);
        
        return user;
    }
    
    @Override
    public void sendVerificationCode(String phone) {
        // 调用用户安全服务发送验证码
        userSecurityService.sendSmsCode(phone);
    }
    
    @Override
    public boolean verifyCode(String phone, String code) {
        // 调用用户安全服务验证验证码
        return userSecurityService.verifySmsCode(phone, code);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updatePoints(Long userId, Integer points) {
        // 根据ID查询用户
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 更新用户积分
        if (user.getPoints() == null) {
            user.setPoints(points);
        } else {
            user.setPoints(user.getPoints() + points);
        }
        // 确保积分不小于0
        if (user.getPoints() < 0) {
            user.setPoints(0);
        }
        
        user.setUpdateTime(LocalDateTime.now());
        userMapper.updateById(user);
    }
    
    @Override
    public Integer getPoints(Long userId) {
        // 根据ID查询用户
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        // 如果积分未设置，返回0
        return user.getPoints() == null ? 0 : user.getPoints();
    }
    
    @Override
    public void disableUser(Long userId) {
        // TODO: 实现禁用用户的逻辑
    }
    
    @Override
    public void enableUser(Long userId) {
        // TODO: 实现启用用户的逻辑
    }

    // 移除不匹配的bindStudentId方法的@Override注解
    @Transactional(rollbackFor = Exception.class)
    public boolean bindStudentId(Long userId, String studentId) {
        // 检查学号是否已被绑定
        if (userMapper.exists(new LambdaQueryWrapper<User>()
                .eq(User::getStudentId, studentId)
                .ne(User::getId, userId))) {
            return false;
        }

        User user = new User();
        user.setId(userId);
        user.setStudentId(studentId);
        user.setUpdateTime(LocalDateTime.now());

        return userMapper.updateById(user) > 0;
    }

    // 移除不匹配的getUsersByRole方法的@Override注解
    public List<User> getUsersByRole(String role) {
        // 注意：User实体类中没有role字段，而是userType字段，这里暂时使用userType代替
        // 如果需要实现按角色查询，需要完善角色相关的逻辑
        return userMapper.selectList(new LambdaQueryWrapper<User>()
                .eq(User::getUserType, role)
                .eq(User::getStatus, UserStatus.ACTIVE.getCode()));
    }

    // 移除不匹配的updateUserStatus方法的@Override注解
    @Transactional(rollbackFor = Exception.class)
    public boolean updateUserStatus(Long userId, UserStatus status) {
        User user = new User();
        user.setId(userId);
        user.setStatus(status.getCode());
        user.setUpdateTime(LocalDateTime.now());

        return userMapper.updateById(user) > 0;
    }

    // 移除不匹配的updateUserInfo方法的@Override注解
    @Transactional(rollbackFor = Exception.class)
    public User updateUserInfo(Long userId, UserDTO userDTO) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 更新用户信息
        if (userDTO.getNickname() != null) {
            user.setNickname(userDTO.getNickname());
        }
        if (userDTO.getAvatar() != null) {
            user.setAvatar(userDTO.getAvatar());
        }
        if (userDTO.getGender() != null) {
            user.setGender(userDTO.getGender());
        }
        if (userDTO.getBirthday() != null) {
            user.setBirthday(userDTO.getBirthday());
        }
        if (userDTO.getPhone() != null) {
            // 检查手机号是否已被其他用户使用
            if (userMapper.exists(new LambdaQueryWrapper<User>()
                    .eq(User::getPhone, userDTO.getPhone())
                    .ne(User::getId, userId))) {
                throw new RuntimeException("手机号已被注册");
            }
            user.setPhone(userDTO.getPhone());
        }
        if (userDTO.getEmail() != null) {
            // 检查邮箱是否已被其他用户使用
            if (userMapper.exists(new LambdaQueryWrapper<User>()
                    .eq(User::getEmail, userDTO.getEmail())
                    .ne(User::getId, userId))) {
                throw new RuntimeException("邮箱已被注册");
            }
            user.setEmail(userDTO.getEmail());
        }

        user.setUpdateTime(LocalDateTime.now());
        userMapper.updateById(user);

        return user;
    }

    // 移除不匹配的changePassword方法的@Override注解
    @Transactional(rollbackFor = Exception.class)
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 验证旧密码
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return false;
        }

        // 更新密码
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdateTime(LocalDateTime.now());

        return userMapper.updateById(user) > 0;
    }

    // 移除不匹配的resetPassword方法的@Override注解
    @Transactional(rollbackFor = Exception.class)
    public boolean resetPassword(Long userId, String newPassword) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            return false;
        }

        // 更新密码
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdateTime(LocalDateTime.now());

        return userMapper.updateById(user) > 0;
    }
}
