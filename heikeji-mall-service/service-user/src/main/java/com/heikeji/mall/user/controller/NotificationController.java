package com.heikeji.mall.notification.controller;

import com.heikeji.common.core.domain.R;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/notification")
@Tag(name = "消息通知", description = "消息推送相关接口")
@Slf4j
public class NotificationController {

    private final Map<String, List<Map<String, Object>>> userNotifications = new ConcurrentHashMap<>();

    @GetMapping("/list")
    @Operation(summary = "获取通知列表")
    public R<Map<String, Object>> getNotifications(
            @RequestParam String userId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        List<Map<String, Object>> notifications = userNotifications.getOrDefault(userId, new ArrayList<>());
        
        List<Map<String, Object>> paged = new ArrayList<>();
        int start = (page - 1) * size;
        int end = Math.min(start + size, notifications.size());
        
        if (start < notifications.size()) {
            paged = notifications.subList(start, end);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("list", paged);
        result.put("total", notifications.size());
        result.put("page", page);
        result.put("size", size);
        
        return R.success(result);
    }

    @GetMapping("/unread-count")
    @Operation(summary = "获取未读数量")
    public R<Map<String, Object>> getUnreadCount(@RequestParam String userId) {
        List<Map<String, Object>> notifications = userNotifications.getOrDefault(userId, new ArrayList<>());
        long count = notifications.stream()
                .filter(n -> !Boolean.TRUE.equals(n.get("read")))
                .count();
        
        Map<String, Object> result = new HashMap<>();
        result.put("count", count);
        return R.success(result);
    }

    @PutMapping("/read/{id}")
    @Operation(summary = "标记已读")
    public R<Boolean> markAsRead(@RequestParam String userId, @PathVariable String id) {
        List<Map<String, Object>> notifications = userNotifications.get(userId);
        if (notifications != null) {
            for (Map<String, Object> notification : notifications) {
                if (id.equals(notification.get("id"))) {
                    notification.put("read", true);
                    break;
                }
            }
        }
        return R.success(true);
    }

    @PutMapping("/read-all")
    @Operation(summary = "全部已读")
    public R<Boolean> markAllAsRead(@RequestParam String userId) {
        List<Map<String, Object>> notifications = userNotifications.get(userId);
        if (notifications != null) {
            for (Map<String, Object> notification : notifications) {
                notification.put("read", true);
            }
        }
        return R.success(true);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除通知")
    public R<Boolean> deleteNotification(@RequestParam String userId, @PathVariable String id) {
        List<Map<String, Object>> notifications = userNotifications.get(userId);
        if (notifications != null) {
            notifications.removeIf(n -> id.equals(n.get("id")));
        }
        return R.success(true);
    }

    @PostMapping("/send")
    @Operation(summary = "发送通知")
    public R<Boolean> sendNotification(@RequestBody Map<String, Object> notification) {
        String userId = (String) notification.get("userId");
        if (userId == null) {
            return R.error("用户ID不能为空");
        }
        
        notification.put("id", UUID.randomUUID().toString());
        notification.put("createTime", new Date());
        notification.put("read", false);
        
        List<Map<String, Object>> notifications = userNotifications.computeIfAbsent(userId, k -> new ArrayList<>());
        notifications.add(0, notification);
        
        log.info("发送通知成功: userId={}, title={}", userId, notification.get("title"));
        
        return R.success(true);
    }

    @PostMapping("/broadcast")
    @Operation(summary = "广播通知")
    public R<Boolean> broadcastNotification(@RequestBody Map<String, Object> notification) {
        String title = (String) notification.get("title");
        String content = (String) notification.get("content");
        String type = (String) notification.get("type");
        
        log.info("广播通知: title={}, type={}", title, type);
        
        return R.success(true);
    }

    @GetMapping("/types")
    @Operation(summary = "获取通知类型")
    public R<List<Map<String, String>>> getNotificationTypes() {
        List<Map<String, String>> types = new ArrayList<>();
        types.add(createType("order", "订单通知", "#409EFF"));
        types.add(createType("system", "系统通知", "#909399"));
        types.add(createType("promotion", "促销通知", "#E6A23C"));
        types.add(createType("security", "安全通知", "#F56C6C"));
        types.add(createType("message", "消息通知", "#67C23A"));
        return R.success(types);
    }

    private Map<String, String> createType(String code, String name, String color) {
        Map<String, String> type = new HashMap<>();
        type.put("code", code);
        type.put("name", name);
        type.put("color", color);
        return type;
    }
}
