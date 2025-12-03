package com.heikeji.mall.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.user.entity.UserBehaviorLog;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户行为日志Mapper接口
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Mapper
public interface UserBehaviorLogMapper extends BaseMapper<UserBehaviorLog> {
}
