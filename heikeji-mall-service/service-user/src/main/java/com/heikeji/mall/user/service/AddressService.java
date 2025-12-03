package com.heikeji.mall.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.user.entity.Address;

import java.util.List;

/**
 * 地址服务接口
 *
 * @author heikeji
 * @date 2024-12-19
 */
public interface AddressService extends IService<Address> {
    
    /**
     * 新增地址
     *
     * @param address 地址信息
     * @return 是否新增成功
     */
    boolean addAddress(Address address);
    
    /**
     * 更新地址
     *
     * @param address 地址信息
     * @return 是否更新成功
     */
    boolean updateAddress(Address address);
    
    /**
     * 删除地址
     *
     * @param addressId 地址ID
     * @param userId 用户ID
     * @return 是否删除成功
     */
    boolean deleteAddress(Long addressId, Long userId);
    
    /**
     * 查询用户的所有地址
     *
     * @param userId 用户ID
     * @return 地址列表
     */
    List<Address> getUserAddresses(Long userId);
    
    /**
     * 设置默认地址
     *
     * @param addressId 地址ID
     * @param userId 用户ID
     * @return 是否设置成功
     */
    boolean setDefaultAddress(Long addressId, Long userId);
    
    /**
     * 根据地址ID和用户ID获取地址
     *
     * @param addressId 地址ID
     * @param userId    用户ID
     * @return 地址信息
     */
    Address getAddressById(Long addressId, Long userId);

    /**
     * 获取用户默认地址
     *
     * @param userId 用户ID
     * @return 默认地址信息
     */
    Address getDefaultAddress(Long userId);
}
