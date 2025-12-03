package com.heikeji.mall.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.user.entity.UserAuth;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户认证Mapper接口
 * 用于处理用户认证相关的数据库操作
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Mapper
public interface UserAuthMapper extends BaseMapper<UserAuth> {

    /**
     * 根据用户ID查询用户认证信息
     *
     * @param userId 用户ID
     * @return 用户认证信息
     */
    UserAuth selectByUserId(@Param("userId") Long userId);

    /**
     * 根据用户名查询用户认证信息
     *
     * @param username 用户名
     * @return 用户认证信息
     */
    UserAuth selectByUsername(@Param("username") String username);

    /**
     * 根据邮箱查询用户认证信息
     *
     * @param email 邮箱
     * @return 用户认证信息
     */
    UserAuth selectByEmail(@Param("email") String email);

    /**
     * 根据手机号查询用户认证信息
     *
     * @param phone 手机号
     * @return 用户认证信息
     */
    UserAuth selectByPhone(@Param("phone") String phone);

    /**
     * 插入用户认证信息
     *
     * @param userAuth 用户认证信息
     * @return 受影响的行数
     */
    int insert(UserAuth userAuth);

    /**
     * 更新用户认证信息
     *
     * @param userAuth 用户认证信息
     * @return 受影响的行数
     */
    int update(UserAuth userAuth);

    /**
     * 更新用户密码
     *
     * @param userId      用户ID
     * @param newPassword 新密码
     * @return 受影响的行数
     */
    int updatePassword(@Param("userId") Long userId, @Param("newPassword") String newPassword);

    /**
     * 更新用户登录信息
     *
     * @param userId   用户ID
     * @param loginIp  登录IP
     * @param loginTime 登录时间
     * @return 受影响的行数
     */
    int updateLoginInfo(@Param("userId") Long userId, @Param("loginIp") String loginIp, @Param("loginTime") String loginTime);

    /**
     * 根据用户ID删除用户认证信息
     *
     * @param userId 用户ID
     * @return 受影响的行数
     */
    int deleteByUserId(@Param("userId") Long userId);

    /**
     * 批量查询用户认证信息
     *
     * @param userIds 用户ID列表
     * @return 用户认证信息列表
     */
    List<UserAuth> selectBatchByUserIds(@Param("userIds") List<Long> userIds);

    /**
     * 查询用户认证信息总数
     *
     * @return 用户认证信息总数
     */
    int count();

    /**
     * 根据状态查询用户认证信息总数
     *
     * @param status 状态
     * @return 用户认证信息总数
     */
    int countByStatus(@Param("status") Integer status);
}
