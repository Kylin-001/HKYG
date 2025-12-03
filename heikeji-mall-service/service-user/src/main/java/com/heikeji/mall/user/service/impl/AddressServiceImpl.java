package com.heikeji.mall.user.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.user.entity.Address;
import com.heikeji.mall.user.mapper.AddressMapper;
import com.heikeji.mall.user.service.AddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 地址服务实现类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Service
public class AddressServiceImpl extends ServiceImpl<AddressMapper, Address> implements AddressService {

    @Override
    public boolean addAddress(Address address) {
        // 设置创建时间和更新时间
        address.setCreateTime(LocalDateTime.now());
        address.setUpdateTime(LocalDateTime.now());
        
        // 如果是默认地址，先取消其他默认地址
        if (address.getIsDefault() != null && address.getIsDefault() == 1) {
            setOtherAddressNotDefault(address.getUserId());
        }
        
        return save(address);
    }

    @Override
    public boolean updateAddress(Address address) {
        // 设置更新时间
        address.setUpdateTime(LocalDateTime.now());
        
        // 如果是默认地址，先取消其他默认地址
        if (address.getIsDefault() != null && address.getIsDefault() == 1) {
            setOtherAddressNotDefault(address.getUserId());
        }
        
        return lambdaUpdate()
                .eq(Address::getId, address.getId())
                .eq(Address::getUserId, address.getUserId())
                .update(address);
    }

    @Override
    public boolean deleteAddress(Long addressId, Long userId) {
        return lambdaUpdate()
                .eq(Address::getId, addressId)
                .eq(Address::getUserId, userId)
                .remove();
    }

    @Override
    public List<Address> getUserAddresses(Long userId) {
        return lambdaQuery()
                .eq(Address::getUserId, userId)
                .orderByDesc(Address::getIsDefault)
                .orderByDesc(Address::getUpdateTime)
                .list();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean setDefaultAddress(Long addressId, Long userId) {
        // 先将所有地址设置为非默认
        boolean result1 = setOtherAddressNotDefault(userId);
        if (!result1) {
            return false;
        }
        
        // 再将指定地址设置为默认
        boolean result2 = lambdaUpdate()
                .eq(Address::getId, addressId)
                .eq(Address::getUserId, userId)
                .set(Address::getIsDefault, 1)
                .set(Address::getUpdateTime, LocalDateTime.now())
                .update();
        
        return result2;
    }

    @Override
    public Address getAddressById(Long addressId, Long userId) {
        return lambdaQuery()
                .eq(Address::getId, addressId)
                .eq(Address::getUserId, userId)
                .one();
    }

    @Override
    public Address getDefaultAddress(Long userId) {
        return lambdaQuery()
                .eq(Address::getUserId, userId)
                .eq(Address::getIsDefault, 1)
                .one();
    }
    
    /**
     * 将用户的其他地址设置为非默认
     *
     * @param userId 用户ID
     * @return 是否设置成功
     */
    private boolean setOtherAddressNotDefault(Long userId) {
        return lambdaUpdate()
                .eq(Address::getUserId, userId)
                .set(Address::getIsDefault, 0)
                .update();
    }
}
