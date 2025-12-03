package com.heikeji.mall.member.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.member.entity.MemberReceiveAddress;
import com.heikeji.mall.member.mapper.MemberReceiveAddressMapper;
import com.heikeji.mall.member.service.MemberReceiveAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 浼氬憳鏀惰揣鍦板潃鏈嶅姟瀹炵幇
 */
@Service
public class MemberReceiveAddressServiceImpl extends ServiceImpl<MemberReceiveAddressMapper, MemberReceiveAddress> implements MemberReceiveAddressService {

    @Autowired
    private MemberReceiveAddressMapper addressMapper;

    @Override
    public List<MemberReceiveAddress> listByUserId(Long userId) {
        return addressMapper.listByUserId(userId);
    }

    @Override
    public MemberReceiveAddress getById(Long id) {
        return super.getById(id);
    }

    @Override
    @Transactional
    public boolean saveAddress(MemberReceiveAddress address) {
        // 濡傛灉鏄粯璁ゅ湴鍧€锛屽厛灏嗙敤鎴峰叾浠栧湴鍧€璁句负闈為粯璁?        if (address.getDefaultStatus() == 1) {
            updateOtherAddressesNotDefault(address.getUserId());
        }
        return save(address);
    }

    @Override
    @Transactional
    public boolean updateAddress(MemberReceiveAddress address) {
        // 濡傛灉鏄粯璁ゅ湴鍧€锛屽厛灏嗙敤鎴峰叾浠栧湴鍧€璁句负闈為粯璁?        if (address.getDefaultStatus() == 1) {
            updateOtherAddressesNotDefault(address.getUserId());
        }
        return updateById(address);
    }

    @Override
    public boolean deleteAddress(Long id, Long userId) {
        // 纭繚鍙兘鍒犻櫎鑷繁鐨勫湴鍧€
        MemberReceiveAddress address = getById(id);
        if (address != null && address.getUserId().equals(userId)) {
            return removeById(id);
        }
        return false;
    }

    @Override
    @Transactional
    public boolean setDefaultAddress(Long id, Long userId) {
        // 纭繚鍙兘璁剧疆鑷繁鐨勫湴鍧€涓洪粯璁?        MemberReceiveAddress address = getById(id);
        if (address != null && address.getUserId().equals(userId)) {
            // 灏嗗叾浠栧湴鍧€璁句负闈為粯璁?            updateOtherAddressesNotDefault(userId);
            // 璁剧疆褰撳墠鍦板潃涓洪粯璁?            address.setDefaultStatus(1);
            return updateById(address);
        }
        return false;
    }

    @Override
    public MemberReceiveAddress getDefaultAddressByUserId(Long userId) {
        return addressMapper.getDefaultAddressByUserId(userId);
    }

    /**
     * 灏嗙敤鎴风殑鍏朵粬鍦板潃璁剧疆涓洪潪榛樿
     */
    private void updateOtherAddressesNotDefault(Long userId) {
        List<MemberReceiveAddress> addresses = listByUserId(userId);
        for (MemberReceiveAddress address : addresses) {
            if (address.getDefaultStatus() == 1) {
                address.setDefaultStatus(0);
                updateById(address);
            }
        }
    }
}
