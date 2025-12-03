package com.heikeji.mall.member.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.member.entity.MemberReceiveAddress;
import java.util.List;

/**
 * 浼氬憳鏀惰揣鍦板潃鏈嶅姟
 */
public interface MemberReceiveAddressService extends IService<MemberReceiveAddress> {

    /**
     * 鏍规嵁鐢ㄦ埛ID鏌ヨ鍦板潃鍒楄〃
     */
    List<MemberReceiveAddress> listByUserId(Long userId);

    /**
     * 鏍规嵁ID鑾峰彇鍦板潃
     */
    MemberReceiveAddress getById(Long id);

    /**
     * 淇濆瓨鍦板潃
     */
    boolean saveAddress(MemberReceiveAddress address);

    /**
     * 鏇存柊鍦板潃
     */
    boolean updateAddress(MemberReceiveAddress address);

    /**
     * 鍒犻櫎鍦板潃
     */
    boolean deleteAddress(Long id, Long userId);

    /**
     * 璁剧疆榛樿鍦板潃
     */
    boolean setDefaultAddress(Long id, Long userId);

    /**
     * 鑾峰彇鐢ㄦ埛榛樿鍦板潃
     */
    MemberReceiveAddress getDefaultAddressByUserId(Long userId);
}
