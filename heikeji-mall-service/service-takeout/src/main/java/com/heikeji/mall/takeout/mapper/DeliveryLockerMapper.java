package com.heikeji.mall.takeout.mapper;

import com.heikeji.mall.takeout.entity.DeliveryLocker;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 配送柜Mapper接口
 */
@Mapper
public interface DeliveryLockerMapper extends BaseMapper<DeliveryLocker> {

    /**
     * 根据编码获取配送柜
     * @param lockerCode 柜子编码
     * @return 配送柜
     */
    DeliveryLocker selectByLockerCode(@Param("lockerCode") String lockerCode);

    /**
     * 根据区域获取配送柜列表
     * @param area 区域
     * @return 配送柜列表
     */
    List<DeliveryLocker> selectByArea(@Param("area") String area);

    /**
     * 获取可用的配送柜
     * @param area 区域
     * @return 可用配送柜列表
     */
    List<DeliveryLocker> selectAvailableLockers(@Param("area") String area);

    /**
     * 更新可用格口数
     * @param lockerId 柜子ID
     * @param availableCells 可用格口数
     * @return 影响行数
     */
    int updateAvailableCells(@Param("lockerId") Long lockerId, @Param("availableCells") Integer availableCells);
}