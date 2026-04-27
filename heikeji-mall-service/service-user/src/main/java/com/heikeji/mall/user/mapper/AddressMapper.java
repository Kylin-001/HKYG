package com.heikeji.mall.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.user.entity.Address;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 地址Mapper接口
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Mapper
public interface AddressMapper extends BaseMapper<Address> {

    /**
     * 根据用户ID查询地址列表
     */
    List<Address> selectByUserId(@Param("userId") Long userId);

    /**
     * 查询用户默认地址
     */
    Address selectDefaultByUserId(@Param("userId") Long userId);

    /**
     * 取消用户所有默认地址
     */
    int cancelDefaultByUserId(@Param("userId") Long userId);
}
