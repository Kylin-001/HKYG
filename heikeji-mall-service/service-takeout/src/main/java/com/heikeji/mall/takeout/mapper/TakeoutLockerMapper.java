package com.heikeji.mall.takeout.mapper;

import com.heikeji.mall.takeout.entity.TakeoutLocker;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 外卖柜Mapper接口
 */
@Mapper
public interface TakeoutLockerMapper extends BaseMapper<TakeoutLocker> {

    /**
     * 根据区域获取外卖柜列表
     * @param area 区域
     * @return 外卖柜列表
     */
    List<TakeoutLocker> selectByArea(@Param("area") String area);

    /**
     * 获取可用的外卖柜
     * @param area 区域
     * @return 可用外卖柜列表
     */
    List<TakeoutLocker> selectAvailableLockers(@Param("area") String area);

    /**
     * 统计区域的占用情况
     * @param area 区域
     * @return 统计信息
     */
    Object countByArea(@Param("area") String area);

    /**
     * 根据编码获取外卖柜
     * @param lockerCode 编码
     * @return 外卖柜信息
     */
    TakeoutLocker selectByLockerCode(@Param("lockerCode") String lockerCode);
}