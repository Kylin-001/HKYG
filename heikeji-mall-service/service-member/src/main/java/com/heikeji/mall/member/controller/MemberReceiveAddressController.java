package com.heikeji.mall.member.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.member.entity.MemberReceiveAddress;
import com.heikeji.mall.member.service.MemberReceiveAddressService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 浼氬憳鏀惰揣鍦板潃鎺у埗鍣? */
@RestController
@RequestMapping("/api/member/address")
@Tag(name = "收货地址管理")
public class MemberReceiveAddressController {

    @Autowired
    private MemberReceiveAddressService memberReceiveAddressService;

    /**
     * 鑾峰彇鐢ㄦ埛鍦板潃鍒楄〃
     */
    @GetMapping("/list")
    @Operation(summary = "获取用户地址列表")
    public R<List<MemberReceiveAddress>> getAddressList() {
        // 杩欓噷绠€鍖栧鐞嗭紝瀹為檯搴旇浠巘oken鎴杝ession涓幏鍙栫敤鎴稩D
        Long userId = 1L;
        List<MemberReceiveAddress> addressList = memberReceiveAddressService.listByUserId(userId);
        return R.success(addressList);
    }

    /**
     * 鑾峰彇鍦板潃璇︽儏
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取地址详情")
    public R<MemberReceiveAddress> getAddressDetail(@PathVariable Long id) {
        MemberReceiveAddress address = memberReceiveAddressService.getById(id);
        if (address == null) {
            return R.error("地址不存在");
        }
        return R.success(address);
    }

    /**
     * 娣诲姞鏀惰揣鍦板潃
     */
    @PostMapping
    @Operation(summary = "添加收货地址")
    public R<Boolean> addAddress(@RequestBody MemberReceiveAddress address) {
        // 杩欓噷绠€鍖栧鐞嗭紝瀹為檯搴旇浠巘oken鎴杝ession涓幏鍙栫敤鎴稩D
        Long userId = 1L;
        address.setUserId(userId);
        boolean result = memberReceiveAddressService.saveAddress(address);
        return result ? R.success(true) : R.error("娣诲姞澶辫触");
    }

    /**
     * 鏇存柊鏀惰揣鍦板潃
     */
    @PutMapping
    @Operation(summary = "更新收货地址")
    public R<Boolean> updateAddress(@RequestBody MemberReceiveAddress address) {
        // 杩欓噷绠€鍖栧鐞嗭紝瀹為檯搴旇浠巘oken鎴杝ession涓幏鍙栫敤鎴稩D
        Long userId = 1L;
        address.setUserId(userId);
        boolean result = memberReceiveAddressService.updateAddress(address);
        return result ? R.success(true) : R.error("鏇存柊澶辫触");
    }

    /**
     * 鍒犻櫎鏀惰揣鍦板潃
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除收货地址")
    public R<Boolean> deleteAddress(@PathVariable Long id) {
        // 杩欓噷绠€鍖栧鐞嗭紝瀹為檯搴旇浠巘oken鎴杝ession涓幏鍙栫敤鎴稩D
        Long userId = 1L;
        boolean result = memberReceiveAddressService.deleteAddress(id, userId);
        return result ? R.success(true) : R.error("鍒犻櫎澶辫触");
    }

    /**
     * 璁剧疆榛樿鍦板潃
     */
    @PutMapping("/default/{id}")
    @Operation(summary = "设置默认地址")
    public R<Boolean> setDefaultAddress(@PathVariable Long id) {
        // 杩欓噷绠€鍖栧鐞嗭紝瀹為檯搴旇浠巘oken鎴杝ession涓幏鍙栫敤鎴稩D
        Long userId = 1L;
        boolean result = memberReceiveAddressService.setDefaultAddress(id, userId);
        return result ? R.success(true) : R.error("璁剧疆澶辫触");
    }

    /**
     * 鑾峰彇鐢ㄦ埛榛樿鍦板潃
     */
    @GetMapping("/default")
    @Operation(summary = "获取用户默认地址")
    public R<MemberReceiveAddress> getDefaultAddress() {
        // 杩欓噷绠€鍖栧鐞嗭紝瀹為檯搴旇浠巘oken鎴杝ession涓幏鍙栫敤鎴稩D
        Long userId = 1L;
        MemberReceiveAddress defaultAddress = memberReceiveAddressService.getDefaultAddressByUserId(userId);
        return defaultAddress != null ? R.success(defaultAddress) : R.error("鏆傛棤榛樿鍦板潃");
    }
}
