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
        // 如果是默认地址，先将用户其他地址设为非默认
        if (address.getDefaultStatus() == 1) {
            updateOtherAddressesNotDefault(address.getUserId());
        }
        return save(address);
    }

    @Override
    @Transactional
    public boolean updateAddress(MemberReceiveAddress address) {
        // 如果是默认地址，先将用户其他地址设为非默认
        if (address.getDefaultStatus() == 1) {
            updateOtherAddressesNotDefault(address.getUserId());
        }
        return updateById(address);
    }

    @Override
    public boolean deleteAddress(Long id, Long userId) {
        // 确保只能删除自己的地址
        MemberReceiveAddress address = getById(id);
        if (address != null && address.getUserId().equals(userId)) {
            return removeById(id);
        }
        return false;
    }

    @Override
    @Transactional
    public boolean setDefaultAddress(Long id, Long userId) {
        // 确保只能设置自己的地址为默认
        MemberReceiveAddress address = getById(id);
        if (address != null && address.getUserId().equals(userId)) {
            // 将其他地址设为非默认
            updateOtherAddressesNotDefault(userId);
            // 设置当前地址为默认
            address.setDefaultStatus(1);
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
