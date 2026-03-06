package com.heikeji.mall.docs.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * API文档聚合控制器
 * 提供API文档聚合服务的元数据信息
 *
 * @author: heikeji
 * @date: 2026-03-06
 */
@RestController
@RequestMapping("/api/docs")
@Tag(name = "API文档管理", description = "API文档聚合服务管理接口")
public class ApiDocsController {

    @Value("${app.name}")
    private String appName;

    @Value("${app.version}")
    private String appVersion;

    @Value("${app.description}")
    private String appDescription;

    @Value("${app.contact.name}")
    private String contactName;

    @Value("${app.contact.email}")
    private String contactEmail;

    @Value("${app.contact.url}")
    private String contactUrl;

    /**
     * 获取API文档中心信息
     */
    @GetMapping("/info")
    @Operation(summary = "获取API文档中心信息", description = "获取API文档聚合服务的基本信息")
    public Map<String, Object> getApiDocsInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", appName);
        info.put("version", appVersion);
        info.put("description", appDescription);
        info.put("swaggerUiUrl", "/swagger-ui.html");
        info.put("apiDocsUrl", "/v3/api-docs");
        return info;
    }

    /**
     * 获取联系信息
     */
    @GetMapping("/contact")
    @Operation(summary = "获取联系信息", description = "获取开发团队的联系方式")
    public Map<String, String> getContactInfo() {
        Map<String, String> contact = new HashMap<>();
        contact.put("name", contactName);
        contact.put("email", contactEmail);
        contact.put("url", contactUrl);
        return contact;
    }

    /**
     * 获取服务列表
     */
    @GetMapping("/services")
    @Operation(summary = "获取服务列表", description = "获取所有已聚合的微服务列表")
    public Map<String, Object> getServices() {
        Map<String, Object> services = new HashMap<>();
        
        Map<String, Object> userService = new HashMap<>();
        userService.put("name", "用户服务");
        userService.put("serviceName", "service-user");
        userService.put("port", 8081);
        userService.put("description", "用户注册、登录、信息管理、地址管理等");
        services.put("service-user", userService);
        
        Map<String, Object> productService = new HashMap<>();
        productService.put("name", "商品服务");
        productService.put("serviceName", "service-product");
        productService.put("port", 8082);
        productService.put("description", "商品查询、分类管理、购物车、商品推荐等");
        services.put("service-product", productService);
        
        Map<String, Object> orderService = new HashMap<>();
        orderService.put("name", "订单服务");
        orderService.put("serviceName", "service-order");
        orderService.put("port", 8083);
        orderService.put("description", "订单创建、查询、取消、支付、销售分析等");
        services.put("service-order", orderService);
        
        Map<String, Object> deliveryService = new HashMap<>();
        deliveryService.put("name", "配送服务");
        deliveryService.put("serviceName", "service-delivery");
        deliveryService.put("port", 8001);
        deliveryService.put("description", "配送请求、接单、配送跟踪等");
        services.put("service-delivery", deliveryService);
        
        Map<String, Object> takeoutService = new HashMap<>();
        takeoutService.put("name", "外卖服务");
        takeoutService.put("serviceName", "service-takeout");
        takeoutService.put("port", 8005);
        takeoutService.put("description", "商家管理、商品管理、订单管理、评价管理等");
        services.put("service-takeout", takeoutService);
        
        Map<String, Object> paymentService = new HashMap<>();
        paymentService.put("name", "支付服务");
        paymentService.put("serviceName", "service-payment");
        paymentService.put("port", 8004);
        paymentService.put("description", "微信支付、支付宝支付、退款、对账等");
        services.put("service-payment", paymentService);
        
        Map<String, Object> campusService = new HashMap<>();
        campusService.put("name", "校园服务");
        campusService.put("serviceName", "service-campus");
        campusService.put("port", 8003);
        campusService.put("description", "校园活动、通知公告等");
        services.put("service-campus", campusService);
        
        Map<String, Object> secondhandService = new HashMap<>();
        secondhandService.put("name", "二手服务");
        secondhandService.put("serviceName", "service-secondhand");
        secondhandService.put("port", 8006);
        secondhandService.put("description", "二手商品发布、查询、收藏等");
        services.put("service-secondhand", secondhandService);
        
        Map<String, Object> lostfoundService = new HashMap<>();
        lostfoundService.put("name", "失物招领服务");
        lostfoundService.put("serviceName", "service-lostfound");
        lostfoundService.put("port", 8007);
        lostfoundService.put("description", "失物招领发布、查询、认领等");
        services.put("service-lostfound", lostfoundService);
        
        Map<String, Object> memberService = new HashMap<>();
        memberService.put("name", "会员服务");
        memberService.put("serviceName", "service-member");
        memberService.put("port", 8088);
        memberService.put("description", "会员等级、积分、优惠券、营销活动等");
        services.put("service-member", memberService);
        
        Map<String, Object> systemService = new HashMap<>();
        systemService.put("name", "系统管理服务");
        systemService.put("serviceName", "heikeji-system");
        systemService.put("port", 8090);
        systemService.put("description", "用户管理、角色权限、仪表盘统计等");
        services.put("heikeji-system", systemService);
        
        return services;
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    @Operation(summary = "健康检查", description = "检查API文档聚合服务是否正常运行")
    public Map<String, Object> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", System.currentTimeMillis());
        return health;
    }
}
