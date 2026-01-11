package com.heikeji.mall.member.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.member.entity.MemberReceiveAddress;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 浼氬憳鏀惰揣鍦板潃Mapper
 */
@Mapper
public interface MemberReceiveAddressMapper extends BaseMapper<MemberReceiveAddress> {

    /**
     * 鏍规嵁鐢ㄦ埛ID鏌ヨ鍦板潃鍒楄〃
     */
    List<MemberReceiveAddress> listByUserId(Long userId);

    /**
     * 鏌ヨ鐢ㄦ埛榛樿鍦板潃
     */
    MemberReceiveAddress getDefaultAddressByUserId(Long userId);
}
