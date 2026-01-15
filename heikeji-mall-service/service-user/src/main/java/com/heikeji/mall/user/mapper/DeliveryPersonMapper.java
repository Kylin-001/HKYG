package com.heikeji.mall.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.user.entity.DeliveryPerson;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * 配送员Mapper接口
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Mapper
public interface DeliveryPersonMapper extends BaseMapper<DeliveryPerson> {

    /**
     * 根据用户ID查询配送员信息
     *
     * @param userId 用户ID
     * @return 配送员信息
     */
    DeliveryPerson selectByUserId(Long userId);
}
