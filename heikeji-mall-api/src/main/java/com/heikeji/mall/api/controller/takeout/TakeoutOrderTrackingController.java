package com.heikeji.mall.api.controller.takeout;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.TakeoutOrder;
import com.heikeji.mall.takeout.service.TakeoutOrderService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * 用户端外卖订单追踪Controller
 */
@RestController
@RequestMapping("/api/takeout/order-tracking")
@Api(tags = "用户端订单追踪接口")
public class TakeoutOrderTrackingController {
    
    @Autowired
    private TakeoutOrderService takeoutOrderService;
    
    /**
     * 订单追踪信息
     */
    public static class OrderTrackingInfo {
        private Long orderId;
        private String orderNo;
        private String status;
        private String statusText;
        private String currentLocation;
        private String deliveryPersonName;
        private String deliveryPersonPhone;
        private String estimatedTime;
        private List<TrackingStep> trackingSteps;
        
        // Getters and Setters
        public Long getOrderId() { return orderId; }
        public void setOrderId(Long orderId) { this.orderId = orderId; }
        
        public String getOrderNo() { return orderNo; }
        public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public String getStatusText() { return statusText; }
        public void setStatusText(String statusText) { this.statusText = statusText; }
        
        public String getCurrentLocation() { return currentLocation; }
        public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }
        
        public String getDeliveryPersonName() { return deliveryPersonName; }
        public void setDeliveryPersonName(String deliveryPersonName) { this.deliveryPersonName = deliveryPersonName; }
        
        public String getDeliveryPersonPhone() { return deliveryPersonPhone; }
        public void setDeliveryPersonPhone(String deliveryPersonPhone) { this.deliveryPersonPhone = deliveryPersonPhone; }
        
        public String getEstimatedTime() { return estimatedTime; }
        public void setEstimatedTime(String estimatedTime) { this.estimatedTime = estimatedTime; }
        
        public List<TrackingStep> getTrackingSteps() { return trackingSteps; }
        public void setTrackingSteps(List<TrackingStep> trackingSteps) { this.trackingSteps = trackingSteps; }
    }
    
    /**
     * 追踪步骤信息
     */
    public static class TrackingStep {
        private String status;
        private String statusText;
        private String description;
        private String time;
        private Boolean completed;
        private Boolean current;
        
        // Getters and Setters
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public String getStatusText() { return statusText; }
        public void setStatusText(String statusText) { this.statusText = statusText; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }
        
        public Boolean getCompleted() { return completed; }
        public void setCompleted(Boolean completed) { this.completed = completed; }
        
        public Boolean getCurrent() { return current; }
        public void setCurrent(Boolean current) { this.current = current; }
    }
    
    @ApiOperation("获取订单追踪信息")
    @GetMapping("/{orderId}/tracking")
    public R<OrderTrackingInfo> getOrderTracking(@PathVariable Long orderId) {
        TakeoutOrder order = takeoutOrderService.getOrderDetail(orderId);
        if (order == null) {
            return R.error("订单不存在");
        }
        
        OrderTrackingInfo trackingInfo = new OrderTrackingInfo();
        trackingInfo.setOrderId(order.getId());
        trackingInfo.setOrderNo(order.getOrderNo());
        trackingInfo.setStatus(order.getStatus().toString());
        trackingInfo.setStatusText(getStatusText(order.getStatus()));
        trackingInfo.setDeliveryPersonName(order.getDeliveryPersonName());
        trackingInfo.setDeliveryPersonPhone(order.getDeliveryPersonPhone());
        trackingInfo.setEstimatedTime(order.getEstimatedTime() != null ? 
                order.getEstimatedTime().toString() : "");
        
        // 根据订单状态设置当前位置
        trackingInfo.setCurrentLocation(getCurrentLocation(order));
        
        // 生成追踪步骤
        trackingInfo.setTrackingSteps(generateTrackingSteps(order));
        
        return R.success(trackingInfo);
    }
    
    @ApiOperation("获取实时订单状态")
    @GetMapping("/{orderId}/status")
    public R<Map<String, Object>> getRealTimeStatus(@PathVariable Long orderId) {
        TakeoutOrder order = takeoutOrderService.getOrderDetail(orderId);
        if (order == null) {
            return R.error("订单不存在");
        }
        
        Map<String, Object> statusMap = new HashMap<>();
        statusMap.put("orderId", order.getId());
        statusMap.put("orderNo", order.getOrderNo());
        statusMap.put("status", order.getStatus());
        statusMap.put("statusText", getStatusText(order.getStatus()));
        statusMap.put("lastUpdateTime", order.getUpdateTime());
        
        // 如果是配送中状态，模拟实时位置更新
        if (order.getStatus() == 2) { // 配送中
            statusMap.put("deliveryLocation", generateDeliveryLocation());
            statusMap.put("progressPercentage", generateProgressPercentage());
        }
        
        return R.success(statusMap);
    }
    
    @ApiOperation("获取配送员信息")
    @GetMapping("/{orderId}/delivery-person")
    public R<Map<String, Object>> getDeliveryPersonInfo(@PathVariable Long orderId) {
        TakeoutOrder order = takeoutOrderService.getOrderDetail(orderId);
        if (order == null) {
            return R.error("订单不存在");
        }
        
        Map<String, Object> deliveryInfo = new HashMap<>();
        deliveryInfo.put("deliveryPersonName", order.getDeliveryPersonName());
        deliveryInfo.put("deliveryPersonPhone", order.getDeliveryPersonPhone());
        
        // 如果订单正在配送中，模拟配送员位置
        if (order.getStatus() == 2) {
            deliveryInfo.put("currentLocation", generateDeliveryLocation());
            deliveryInfo.put("distance", "约1.2公里");
            deliveryInfo.put("estimatedArrival", "15分钟后");
        } else {
            deliveryInfo.put("currentLocation", "");
            deliveryInfo.put("distance", "");
            deliveryInfo.put("estimatedArrival", "");
        }
        
        return R.success(deliveryInfo);
    }
    
    @ApiOperation("获取订单历史记录")
    @GetMapping("/{orderId}/history")
    public R<List<TrackingStep>> getOrderHistory(@PathVariable Long orderId) {
        TakeoutOrder order = takeoutOrderService.getOrderDetail(orderId);
        if (order == null) {
            return R.error("订单不存在");
        }
        
        List<TrackingStep> history = generateTrackingSteps(order);
        return R.success(history);
    }
    
    /**
     * 获取状态文本
     */
    private String getStatusText(Integer status) {
        switch (status) {
            case 0: return "待接单";
            case 1: return "已接单";
            case 2: return "配送中";
            case 3: return "已送达";
            case 4: return "已取消";
            default: return "未知状态";
        }
    }
    
    /**
     * 获取当前位置
     */
    private String getCurrentLocation(TakeoutOrder order) {
        switch (order.getStatus()) {
            case 0: return "商家等待接单";
            case 1: return "商家正在制作";
            case 2: return "配送员配送中";
            case 3: return "订单已完成";
            case 4: return "订单已取消";
            default: return "位置未知";
        }
    }
    
    /**
     * 生成追踪步骤
     */
    private List<TrackingStep> generateTrackingSteps(TakeoutOrder order) {
        List<TrackingStep> steps = new java.util.ArrayList<>();
        
        // 订单已提交
        steps.add(createStep("0", "待接单", "订单已提交，等待商家接单", order.getCreateTime().toString(), true, false));
        
        // 商家已接单
        if (order.getStatus() > 0) {
            steps.add(createStep("1", "已接单", "商家已接单，正在准备食材", 
                addMinutes(order.getCreateTime(), 5).toString(), true, false));
        }
        
        // 制作中
        if (order.getStatus() > 1) {
            steps.add(createStep("2", "制作中", "商家正在制作食物", 
                addMinutes(order.getCreateTime(), 15).toString(), true, false));
        }
        
        // 配送中
        if (order.getStatus() == 2) {
            steps.add(createStep("3", "配送中", "配送员正在配送途中", 
                addMinutes(order.getCreateTime(), 25).toString(), false, true));
        } else if (order.getStatus() > 2) {
            steps.add(createStep("3", "配送中", "配送员已完成配送", 
                addMinutes(order.getCreateTime(), 25).toString(), true, false));
        }
        
        // 已送达
        if (order.getStatus() == 3) {
            steps.add(createStep("4", "已送达", "订单已送达，请及时取餐", 
                order.getActualTime() != null ? order.getActualTime().toString() : 
                addMinutes(order.getCreateTime(), 35).toString(), false, true));
        } else if (order.getStatus() > 3) {
            steps.add(createStep("4", "已送达", "订单已送达", 
                order.getActualTime() != null ? order.getActualTime().toString() : 
                addMinutes(order.getCreateTime(), 35).toString(), true, false));
        }
        
        return steps;
    }
    
    /**
     * 创建追踪步骤
     */
    private TrackingStep createStep(String status, String statusText, String description, 
                                  String time, Boolean completed, Boolean current) {
        TrackingStep step = new TrackingStep();
        step.setStatus(status);
        step.setStatusText(statusText);
        step.setDescription(description);
        step.setTime(time);
        step.setCompleted(completed);
        step.setCurrent(current);
        return step;
    }
    
    /**
     * 模拟配送位置
     */
    private String generateDeliveryLocation() {
        String[] locations = {
            "学校南门附近",
            "第二食堂楼下",
            "学生宿舍A栋附近",
            "图书馆西门",
            "学校操场附近"
        };
        return locations[(int) (Math.random() * locations.length)];
    }
    
    /**
     * 生成配送进度百分比
     */
    private Integer generateProgressPercentage() {
        return (int) (Math.random() * 40) + 60; // 60-100之间的随机数
    }
    
    @ApiOperation("获取配送进度")
    @GetMapping("/{orderId}/progress")
    public R<Map<String, Object>> getDeliveryProgress(@PathVariable Long orderId) {
        TakeoutOrder order = takeoutOrderService.getOrderDetail(orderId);
        if (order == null) {
            return R.error("订单不存在");
        }
        
        Map<String, Object> progress = new HashMap<>();
        
        if (order.getStatus() < 2) { // 还未开始配送
            progress.put("canTrack", false);
            progress.put("message", "订单尚未开始配送");
        } else if (order.getStatus() == 2) { // 配送中
            progress.put("canTrack", true);
            progress.put("percentage", generateProgressPercentage());
            progress.put("currentLocation", generateDeliveryLocation());
            progress.put("estimatedArrival", "约15分钟后");
            progress.put("deliveryPerson", order.getDeliveryPersonName());
        } else { // 已送达或已完成
            progress.put("canTrack", false);
            progress.put("message", "订单已完成配送");
            if (order.getActualTime() != null) {
                progress.put("completedTime", order.getActualTime().toString());
            }
        }
        
        return R.success(progress);
    }
    
    @ApiOperation("获取订单时间线")
    @GetMapping("/{orderId}/timeline")
    public R<Map<String, Object>> getOrderTimeline(@PathVariable Long orderId) {
        TakeoutOrder order = takeoutOrderService.getOrderDetail(orderId);
        if (order == null) {
            return R.error("订单不存在");
        }
        
        Map<String, Object> timeline = new HashMap<>();
        timeline.put("orderId", order.getId());
        timeline.put("orderNo", order.getOrderNo());
        timeline.put("createTime", order.getCreateTime());
        timeline.put("updateTime", order.getUpdateTime());
        timeline.put("estimatedTime", order.getEstimatedTime());
        timeline.put("actualTime", order.getActualTime());
        
        // 计算各个阶段的时间
        if (order.getStatus() == 3 || order.getStatus() == 4) {
            timeline.put("totalTime", calculateTotalTime(order));
            timeline.put("deliveryTime", calculateDeliveryTime(order));
        }
        
        return R.success(timeline);
    }

    /**
     * 添加分钟
     */
    private java.util.Date addMinutes(java.util.Date date, int minutes) {
        return new java.util.Date(date.getTime() + minutes * 60 * 1000);
    }
    
    /**
     * 计算总用时
     */
    private String calculateTotalTime(TakeoutOrder order) {
        if (order.getCreateTime() != null && order.getActualTime() != null) {
            long diffMinutes = (order.getActualTime().getTime() - order.getCreateTime().getTime()) / (60 * 1000);
            return diffMinutes + "分钟";
        }
        return "";
    }
    
    /**
     * 计算配送用时
     */
    private String calculateDeliveryTime(TakeoutOrder order) {
        // 简化计算，从开始配送到送达约15-25分钟
        return "20分钟";
    }
}