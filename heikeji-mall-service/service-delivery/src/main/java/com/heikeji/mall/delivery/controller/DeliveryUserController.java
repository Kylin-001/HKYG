package com.heikeji.mall.delivery.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.delivery.entity.DeliveryUser;
import com.heikeji.mall.delivery.service.DeliveryUserService;
import com.heikeji.mall.delivery.vo.DeliveryUserInfoVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 配送员控制器
 */
@RestController
@RequestMapping("/api/delivery/user")
@Tag(name = "配送员管理")
public class DeliveryUserController {

    @Autowired
    private DeliveryUserService deliveryUserService;

    /**
     * 注册配送员
     */
    @PostMapping("/register")
    @Operation(summary = "注册配送员")
    public R<Boolean> register(@RequestBody DeliveryUser deliveryUser) {
        // 设置默认用户ID（简化处理）
        if (deliveryUser.getUserId() == null) {
            deliveryUser.setUserId(1L);
        }
        boolean result = deliveryUserService.register(deliveryUser);
        return R.success(result);
    }

    /**
     * 验证配送员身份信息
     */
    @PostMapping("/verify")
    @Operation(summary = "验证配送员身份信息")
    public R<Boolean> verifyIdentity(@RequestParam Long deliveryUserId,
                                     @RequestParam String realName,
                                     @RequestParam String idCard) {
        boolean result = deliveryUserService.verifyIdentity(deliveryUserId, realName, idCard);
        return R.success(result);
    }

    /**
     * 更新配送员信息
     */
    @PutMapping
    @Operation(summary = "更新配送员信息")
    public R<Boolean> updateInfo(@RequestBody DeliveryUser deliveryUser) {
        boolean result = deliveryUserService.updateInfo(deliveryUser);
        return R.success(result);
    }

    /**
     * 获取配送员详情
     */
    @GetMapping("/info/{deliveryUserId}")
    @Operation(summary = "获取配送员详情")
    public R<DeliveryUserInfoVO> getDeliveryUserInfo(@PathVariable Long deliveryUserId) {
        DeliveryUserInfoVO userInfo = deliveryUserService.getDeliveryUserInfo(deliveryUserId);
        return R.success(userInfo);
    }

    /**
     * 更新配送状态
     */
    @PostMapping("/status")
    @Operation(summary = "更新配送状态")
    public R<Boolean> updateDeliveryStatus(@RequestParam Long deliveryUserId,
                                          @RequestParam Integer status) {
        boolean result = deliveryUserService.updateDeliveryStatus(deliveryUserId, status);
        return R.success(result);
    }

    /**
     * 检查配送员是否已实名认证
     */
    @GetMapping("/verified/{deliveryUserId}")
    @Operation(summary = "检查配送员是否已实名认证")
    public R<Boolean> checkVerified(@PathVariable Long deliveryUserId) {
        boolean verified = deliveryUserService.checkVerified(deliveryUserId);
        return R.success(verified);
    }

    /**
     * 更新配送员位置
     */
    @PostMapping("/location")
    @Operation(summary = "更新配送员位置")
    public R<Boolean> updateLocation(@RequestParam Long deliveryUserId,
                                    @RequestParam Double latitude,
                                    @RequestParam Double longitude) {
        boolean result = deliveryUserService.updateLocation(deliveryUserId, latitude, longitude);
        return R.success(result);
    }
}
