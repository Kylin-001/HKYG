package com.heikeji.mall.takeout.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.TakeoutDeliveryTrack;
import com.heikeji.mall.takeout.service.TakeoutDeliveryTrackService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 外卖配送轨迹控制器
 */
@RestController
@RequestMapping("/api/takeout/delivery-track")
@Api(tags = "外卖配送跟踪")
public class TakeoutDeliveryTrackController {

    @Autowired
    private TakeoutDeliveryTrackService deliveryTrackService;

    /**
     * 根据外卖订单ID获取配送轨迹
     */
    @GetMapping("/order/{takeoutOrderId}")
    @ApiOperation("根据订单ID获取配送轨迹")
    public R<List<TakeoutDeliveryTrack>> getTracksByOrderId(@PathVariable Long takeoutOrderId) {
        List<TakeoutDeliveryTrack> tracks = deliveryTrackService.getTracksByTakeoutOrderId(takeoutOrderId);
        return R.success(tracks);
    }

    /**
     * 根据订单号获取配送轨迹
     */
    @GetMapping("/order-no/{orderNo}")
    @ApiOperation("根据订单号获取配送轨迹")
    public R<List<TakeoutDeliveryTrack>> getTracksByOrderNo(@PathVariable String orderNo) {
        List<TakeoutDeliveryTrack> tracks = deliveryTrackService.getTracksByOrderNo(orderNo);
        return R.success(tracks);
    }

    /**
     * 获取最新的配送轨迹
     */
    @GetMapping("/latest/{takeoutOrderId}")
    @ApiOperation("获取最新配送轨迹")
    public R<TakeoutDeliveryTrack> getLatestTrack(@PathVariable Long takeoutOrderId) {
        TakeoutDeliveryTrack track = deliveryTrackService.getLatestTrackByTakeoutOrderId(takeoutOrderId);
        return R.success(track);
    }

    /**
     * 创建配送轨迹
     */
    @PostMapping
    @ApiOperation("创建配送轨迹")
    public R<Boolean> createTrack(@RequestBody TakeoutDeliveryTrack track) {
        boolean success = deliveryTrackService.createTrack(track);
        return R.success(success);
    }

    /**
     * 更新配送状态
     */
    @PutMapping("/status")
    @ApiOperation("更新配送状态")
    public R<Boolean> updateTrackStatus(@RequestParam Long takeoutOrderId, @RequestParam Integer status, @RequestParam String statusDesc) {
        boolean success = deliveryTrackService.updateTrackStatus(takeoutOrderId, status, statusDesc);
        return R.success(success);
    }

    /**
     * 更新配送位置
     */
    @PutMapping("/location")
    @ApiOperation("更新配送位置")
    public R<Boolean> updateTrackLocation(@RequestParam Long takeoutOrderId, 
                                         @RequestParam Double latitude, 
                                         @RequestParam Double longitude, 
                                         @RequestParam String locationDesc) {
        boolean success = deliveryTrackService.updateTrackLocation(takeoutOrderId, latitude, longitude, locationDesc);
        return R.success(success);
    }

}
