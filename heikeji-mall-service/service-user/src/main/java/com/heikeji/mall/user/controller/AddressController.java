package com.heikeji.mall.user.controller;

import com.heikeji.common.core.annotation.RequiresLogin;
import com.heikeji.common.core.security.UserContextHolderAdapter;
import com.heikeji.mall.common.response.R;
import com.heikeji.mall.user.entity.Address;
import com.heikeji.mall.user.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * 地址控制器
 */
@RestController
@RequestMapping("/api/address")
@Tag(name = "地址管理")
@Validated
public class AddressController {
    private static final Logger log = LoggerFactory.getLogger(AddressController.class);

    @Autowired
    private AddressService addressService;

    /**
     * 获取用户地址列表
     */
    @GetMapping("/list")
    @RequiresLogin
    @Operation(summary = "获取用户地址列表")
    public R<List<Address>> getAddressList() {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        List<Address> addressList = addressService.getUserAddresses(userId);
        return R.success(addressList);
    }

    /**
     * 获取默认地址
     */
    @GetMapping("/default")
    @RequiresLogin
    @Operation(summary = "获取默认地址")
    public R<Address> getDefaultAddress() {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        List<Address> addresses = addressService.getUserAddresses(userId);
        // getUserAddresses方法返回的地址列表已按isDefault降序排序，第一个就是默认地址
        Address defaultAddress = addresses.stream()
                .filter(addr -> addr.getIsDefault() == 1)
                .findFirst()
                .orElse(null);
        return R.success(defaultAddress);
    }

    /**
     * 添加收货地址
     */
    @PostMapping("/add")
    @RequiresLogin
    @Operation(summary = "添加收货地址")
    public R<Boolean> addAddress(@Valid @RequestBody Address address) {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        address.setUserId(userId);
        boolean success = addressService.addAddress(address);
        return success ? R.success(true) : R.error("添加失败");
    }

    /**
     * 更新收货地址
     */
    @PutMapping("/update/{addressId}")
    @RequiresLogin
    @Operation(summary = "更新收货地址")
    public R<Boolean> updateAddress(@PathVariable Long addressId, @Valid @RequestBody Address address) {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        address.setId(addressId);
        address.setUserId(userId);
        boolean result = addressService.updateAddress(address);
        return result ? R.success(true) : R.error("更新失败");
    }

    /**
     * 删除收货地址
     */
    @DeleteMapping("/delete/{addressId}")
    @RequiresLogin
    @Operation(summary = "删除收货地址")
    public R<Boolean> deleteAddress(@PathVariable Long addressId) {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        boolean result = addressService.deleteAddress(addressId, userId);
        return result ? R.success(true) : R.error("删除失败");
    }

    /**
     * 设置默认地址
     */
    @PutMapping("/setDefault/{addressId}")
    @RequiresLogin
    @Operation(summary = "设置默认地址")
    public R<Boolean> setDefaultAddress(@PathVariable Long addressId) {
        Long userId = UserContextHolderAdapter.getCurrentUserId();
        boolean result = addressService.setDefaultAddress(addressId, userId);
        return result ? R.success(true) : R.error("设置失败");
    }
}