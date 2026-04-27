package com.heikeji.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.admin.entity.LoginLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
 * 登录日志Mapper接口
 */
@Mapper
public interface LoginLogMapper extends BaseMapper<LoginLog> {

    /**
     * 清空登录日志
     */
    @Select("TRUNCATE TABLE sys_login_log")
    void cleanLoginLog();

    /**
     * 统计登录次数
     */
    @Select("SELECT COUNT(*) FROM sys_login_log WHERE login_time >= #{startTime} AND login_time <= #{endTime}")
    Long countByTimeRange(@Param("startTime") String startTime, @Param("endTime") String endTime);

    /**
     * 统计用户登录次数
     */
    @Select("SELECT username, COUNT(*) as count FROM sys_login_log GROUP BY username ORDER BY count DESC LIMIT #{limit}")
    List<Map<String, Object>> countByUser(@Param("limit") Integer limit);
}
