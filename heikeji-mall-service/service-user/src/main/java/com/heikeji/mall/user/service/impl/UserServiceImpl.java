package com.heikeji.mall.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.common.enums.UserStatus;
import com.heikeji.mall.common.Result;
import com.heikeji.mall.user.component.PasswordStrengthChecker;
import com.heikeji.mall.user.dto.LoginDTO;
import com.heikeji.mall.user.dto.RegisterDTO;
import com.heikeji.mall.user.dto.ResetPasswordDTO;
import com.heikeji.mall.user.dto.UserUpdateDTO;
import com.heikeji.mall.user.entity.User;
import com.heikeji.mall.user.mapper.UserMapper;
import com.heikeji.common.core.security.JwtUtils;
import com.heikeji.mall.user.service.UserService;
import com.heikeji.mall.user.service.UserSecurityService;
import com.heikeji.mall.user.utils.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 用户服务实现类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordStrengthChecker passwordStrengthChecker;
    
    @Autowired
    private UserSecurityService userSecurityService;
    
    @Autowired
    private JwtUtils jwtUtils;

    @Override
    @Cacheable(value = "userCache", key = "'openid_' + #openId", unless = "#result == null")
    public User getUserByOpenId(String openId) {
        return userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getOpenId, openId));
    }

    @Cacheable(value = "userCache", key = "'studentid_' + #studentId", unless = "#result == null")
    public User getUserByStudentId(String studentId) {
        return userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getStudentId, studentId));
    }
    
    @Override
    @Cacheable(value = "userCache", key = "'studentno_' + #studentNo", unless = "#result == null")
    public User getUserByStudentNo(String studentNo) {
        return getUserByStudentId(studentNo);
    }
    
    @Override
    @Cacheable(value = "userCache", key = "'userid_' + #id", unless = "#result == null")
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }
    
    @Override
    @Cacheable(value = "userCache", key = "'username_' + #username", unless = "#result == null")
    public User getUserByUsername(String username) {
        return userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username));
    }

    @Override
    @Cacheable(value = "userCache", key = "'phone_' + #phone", unless = "#result == null")
    public User getUserByPhone(String phone) {
        return userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getPhone, phone));
    }

    @Override
    @Cacheable(value = "userCache", key = "'email_' + #email", unless = "#result == null")
    public User getUserByEmail(String email) {
        return userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getEmail, email));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
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
        
        // 检查邮箱是否已存在
        if (registerDTO.getEmail() != null && userMapper.exists(new LambdaQueryWrapper<User>()
                .eq(User::getEmail, registerDTO.getEmail()))) {
            throw new RuntimeException("邮箱已被注册");
        }
        
        // 验证密码和确认密码是否一致
        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            throw new RuntimeException("密码和确认密码不一致");
        }
        
        // 验证验证码
        if (!verifyCode(registerDTO.getPhone(), registerDTO.getCode())) {
            throw new RuntimeException("验证码错误或已过期");
        }
        
        // 验证密码强度
        if (!passwordStrengthChecker.validatePassword(registerDTO.getPassword())) {
            throw new RuntimeException("密码强度不足");
        }

        User user = new User();
        BeanUtils.copyProperties(registerDTO, user);

        // 加密密码
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        // 设置默认值
        user.setStatus(UserStatus.ACTIVE.getCode());
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        
        // 如果没有昵称，使用用户名作为昵称
        if (user.getNickname() == null || user.getNickname().trim().isEmpty()) {
            user.setNickname(user.getUsername());
        }

        userMapper.insert(user);
        return user;
    }

    @Override
    public Map<String, Object> login(LoginDTO loginDTO) {
        if (loginDTO.getLoginType() == 0) {
            // 账号密码登录
            return login(loginDTO.getAccount(), loginDTO.getPassword());
        } else if (loginDTO.getLoginType() == 1) {
            // 手机号验证码登录
            return phoneLogin(loginDTO.getAccount(), loginDTO.getCode());
        }
        return null;
    }
    
    @Override
    public Map<String, Object> login(String username, String password) {
        // 查询用户
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username)
                .or()
                .eq(User::getPhone, username)
                .or()
                .eq(User::getEmail, username));
        
        if (user == null) {
            return null;
        }
        
        // 验证密码
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null;
        }
        
        // 检查用户状态
        if (user.getStatus() != 1) {
            return null;
        }
        
        // 更新最后登录时间
        user.setLastLoginTime(LocalDateTime.now());
        userMapper.updateById(user);
        
        // 生成token
        String token = jwtUtils.generateToken(user.getId().toString(), user.getUsername());
        String refreshToken = jwtUtils.generateRefreshToken(user.getId().toString(), user.getUsername());
        
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("refreshToken", refreshToken);
        result.put("userId", user.getId());
        result.put("username", user.getUsername());
        result.put("nickname", user.getNickname());
        result.put("avatar", user.getAvatar());
        
        return result;
    }
    
    @Override
    public Map<String, Object> phoneLogin(String phone, String code) {
        // 验证验证码
        if (!verifyCode(phone, code)) {
            return null;
        }
        
        // 查询用户
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getPhone, phone));
        
        if (user == null) {
            // 自动注册新用户
            user = new User();
            user.setPhone(phone);
            user.setUsername("user_" + phone.substring(phone.length() - 8));
            user.setNickname("用户" + phone.substring(phone.length() - 4));
            user.setStatus(1);
            user.setPassword(passwordEncoder.encode(phone.substring(phone.length() - 6)));
            user.setCreateTime(LocalDateTime.now());
            user.setUpdateTime(LocalDateTime.now());
            userMapper.insert(user);
        } else {
            // 检查用户状态
            if (user.getStatus() != 1) {
                return null;
            }
            
            // 更新最后登录时间
            user.setLastLoginTime(LocalDateTime.now());
            userMapper.updateById(user);
        }
        
        // 生成token
        String token = jwtUtils.generateToken(user.getId().toString(), user.getUsername());
        String refreshToken = jwtUtils.generateRefreshToken(user.getId().toString(), user.getUsername());
        
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("refreshToken", refreshToken);
        result.put("userId", user.getId());
        result.put("username", user.getUsername());
        result.put("nickname", user.getNickname());
        result.put("avatar", user.getAvatar());
        
        return result;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
    public Map<String, Object> wechatLogin(String code) {
        try {
            // 1. 调用微信API获取openId和sessionKey
            // 这里需要根据实际情况调用微信登录API，例如使用wx-java-miniapp库
            // 暂时模拟实现，实际项目中需要替换为真实的微信API调用
            String openId = "mock_openid_" + System.currentTimeMillis();
            String sessionKey = "mock_sessionkey_" + System.currentTimeMillis();
            
            // 2. 根据openId查询用户
            User user = getUserByOpenId(openId);
            
            // 3. 如果用户不存在，创建新用户
            if (user == null) {
                user = new User();
                user.setOpenId(openId);
                user.setUsername("wx_user_" + openId.substring(0, 8));
                user.setNickname("微信用户" + openId.substring(0, 4));
                user.setStatus(UserStatus.ACTIVE.getCode());
                user.setPassword(passwordEncoder.encode(openId.substring(0, 6)));
                user.setCreateTime(LocalDateTime.now());
                user.setUpdateTime(LocalDateTime.now());
                userMapper.insert(user);
            }
            
            // 4. 更新最后登录时间
            user.setLastLoginTime(LocalDateTime.now());
            userMapper.updateById(user);
            
            // 5. 生成token
            String token = jwtUtils.generateToken(user.getId().toString(), user.getUsername());
            String refreshToken = jwtUtils.generateRefreshToken(user.getId().toString(), user.getUsername());
            
            // 6. 构建返回结果
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("refreshToken", refreshToken);
            result.put("userId", user.getId());
            result.put("username", user.getUsername());
            result.put("nickname", user.getNickname());
            result.put("avatar", user.getAvatar());
            
            log.info("微信登录成功: userId={}, openId={}", user.getId(), openId);
            return result;
        } catch (Exception e) {
            log.error("微信登录失败: {}", e.getMessage());
            throw new RuntimeException("微信登录失败");
        }
    }
    
    @Override
    public void logout(String token) {
        try {
            // 从Token中提取用户ID和用户名
            String userId = jwtUtils.getUserIdFromToken(token);
            String username = jwtUtils.getUsernameFromToken(token);
            
            // 将Token加入黑名单
            jwtUtils.addTokenToBlacklist(token);
            
            log.info("用户登出成功，已将Token加入黑名单: userId={}, username={}", userId, username);
        } catch (Exception e) {
            log.error("用户登出失败: {}", e.getMessage());
            throw new RuntimeException("登出失败");
        }
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
    @CacheEvict(value = "userCache", allEntries = true)
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
    @CacheEvict(value = "userCache", allEntries = true)
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
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
    public void resetPassword(ResetPasswordDTO resetPasswordDTO) {
        // 验证手机号和验证码
        if (!verifyCode(resetPasswordDTO.getPhone(), resetPasswordDTO.getCode())) {
            throw new RuntimeException("验证码错误或已过期");
        }
        
        // 验证密码和确认密码是否一致
        if (!resetPasswordDTO.getNewPassword().equals(resetPasswordDTO.getConfirmPassword())) {
            throw new RuntimeException("密码和确认密码不一致");
        }
        
        // 验证密码强度
        if (!passwordStrengthChecker.validatePassword(resetPasswordDTO.getNewPassword())) {
            throw new RuntimeException("密码强度不足");
        }
        
        // 查询用户
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getPhone, resetPasswordDTO.getPhone()));
        
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        // 更新密码
        user.setPassword(passwordEncoder.encode(resetPasswordDTO.getNewPassword()));
        user.setUpdateTime(LocalDateTime.now());
        userMapper.updateById(user);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
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
    @CacheEvict(value = "userCache", allEntries = true)
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
    @CacheEvict(value = "userCache", allEntries = true)
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
    public boolean sendVerificationCode(String phone) {
        // 调用用户安全服务发送验证码
        try {
            userSecurityService.sendSmsCode(phone);
            return true;
        } catch (Exception e) {
            log.error("发送验证码失败: {}", e.getMessage());
            return false;
        }
    }
    
    @Override
    public boolean verifyCode(String phone, String code) {
        // 调用用户安全服务验证验证码
        return userSecurityService.verifySmsCode(phone, code);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
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
    public BigDecimal getBalance(Long userId) {
        // 根据ID查询用户
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        // 如果余额未设置，返回0
        return user.getBalance() == null ? BigDecimal.ZERO : user.getBalance();
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
    public void updateBalance(Long userId, BigDecimal amount) {
        // 根据ID查询用户
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        // 更新用户余额
        user.setBalance(amount);
        user.setUpdateTime(LocalDateTime.now());
        userMapper.updateById(user);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
    public boolean deductBalance(Long userId, BigDecimal amount) {
        // 根据ID查询用户
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 获取当前余额，如果未设置则为0
        BigDecimal currentBalance = user.getBalance() != null ? user.getBalance() : BigDecimal.ZERO;
        // 检查余额是否足够
        if (currentBalance.compareTo(amount) < 0) {
            return false;
        }

        // 扣除余额
        BigDecimal newBalance = currentBalance.subtract(amount);
        user.setBalance(newBalance);
        user.setUpdateTime(LocalDateTime.now());
        userMapper.updateById(user);

        return true;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
    public void rechargeBalance(Long userId, BigDecimal amount) {
        // 根据ID查询用户
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 检查充值金额是否大于0
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("充值金额必须大于0");
        }

        // 获取当前余额，如果未设置则为0
        BigDecimal currentBalance = user.getBalance() != null ? user.getBalance() : BigDecimal.ZERO;
        // 增加余额
        BigDecimal newBalance = currentBalance.add(amount);
        user.setBalance(newBalance);
        user.setUpdateTime(LocalDateTime.now());
        userMapper.updateById(user);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
    public void disableUser(Long userId) {
        // 根据ID查询用户
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        // 更新用户状态为禁用
        user.setStatus(UserStatus.DISABLED.getCode());
        user.setUpdateTime(LocalDateTime.now());
        userMapper.updateById(user);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "userCache", allEntries = true)
    public void enableUser(Long userId) {
        // 根据ID查询用户
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        // 更新用户状态为启用
        user.setStatus(UserStatus.ACTIVE.getCode());
        user.setUpdateTime(LocalDateTime.now());
        userMapper.updateById(user);
    }
}