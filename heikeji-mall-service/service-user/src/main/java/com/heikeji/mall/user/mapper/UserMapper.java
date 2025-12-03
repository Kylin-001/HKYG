package com.heikeji.mall.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.user.entity.User;
import org.apache.ibatis.annotations.Param;

/**
 * 用户Mapper接口
 *
 * @author heikeji
 * @date 2024-12-19
 */
public interface UserMapper extends BaseMapper<User> {

    /**
     * 根据用户名或手机号或邮箱查询用户
     */
    User selectByUsernameOrPhoneOrEmail(@Param("account") String account);
}
