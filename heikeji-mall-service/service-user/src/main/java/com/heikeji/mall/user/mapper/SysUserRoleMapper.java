package com.heikeji.mall.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.user.entity.SysUserRole;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户角色关联Mapper接口
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Mapper
public interface SysUserRoleMapper extends BaseMapper<SysUserRole> {
}
