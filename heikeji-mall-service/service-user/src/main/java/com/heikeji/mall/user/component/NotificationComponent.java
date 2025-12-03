package com.heikeji.mall.user.component;

import com.heikeji.mall.user.entity.User;
import com.heikeji.mall.user.service.UserService;
import com.heikeji.system.utils.MessageUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 通知组件
 * 用于处理用户通知相关的业务逻辑
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Slf4j
@Component
public class NotificationComponent {

    @Autowired
    private UserService userService;
    
    @Autowired
    private MessageUtils messageUtils;

    /**
     * 发送订单状态变化通知
     *
     * @param userId      用户ID
     * @param orderId     订单ID
     * @param status      订单状态
     * @param statusDesc  状态描述
     */
    public void sendOrderStatusNotification(Long userId, String orderId, Integer status, String statusDesc) {
        try {
            // 获取用户信息
            User user = userService.getById(userId);
            if (user == null) {
                log.warn("用户不存在，无法发送通知，用户ID：{}", userId);
                return;
            }

            // 发送WebSocket订单通知
            boolean wsResult = messageUtils.sendOrderNotice(userId.toString(), orderId, status.toString(), "订单状态已更新为：" + statusDesc);
            if (wsResult) {
                log.info("向用户{}({})发送订单状态变化WebSocket通知成功：订单{}已更新为{}({})", 
                        user.getNickname(), user.getPhone(), orderId, status, statusDesc);
            } else {
                log.warn("向用户{}({})发送订单状态变化WebSocket通知失败：订单{}已更新为{}({})", 
                        user.getNickname(), user.getPhone(), orderId, status, statusDesc);
            }

        } catch (Exception e) {
            log.error("发送订单状态通知失败，用户ID：{}，订单ID：{}", userId, orderId, e);
        }
    }

    /**
     * 发送支付结果通知
     *
     * @param userId      用户ID
     * @param orderId     订单ID
     * @param payStatus   支付状态 1:成功 0:失败
     * @param amount      支付金额
     */
    public void sendPaymentNotification(Long userId, String orderId, Integer payStatus, String amount) {
        try {
            // 获取用户信息
            User user = userService.getById(userId);
            if (user == null) {
                log.warn("用户不存在，无法发送通知，用户ID：{}", userId);
                return;
            }

            // 发送WebSocket支付通知
            String payStatusDesc = payStatus == 1 ? "支付成功" : "支付失败";
            boolean wsResult = messageUtils.sendPaymentNotice(userId.toString(), orderId, payStatusDesc, Double.parseDouble(amount));
            if (wsResult) {
                log.info("向用户{}({})发送支付结果WebSocket通知成功：订单{}已{}，金额：{}", 
                        user.getNickname(), user.getPhone(), orderId, payStatusDesc, amount);
            } else {
                log.warn("向用户{}({})发送支付结果WebSocket通知失败：订单{}已{}，金额：{}", 
                        user.getNickname(), user.getPhone(), orderId, payStatusDesc, amount);
            }

        } catch (Exception e) {
            log.error("发送支付结果通知失败，用户ID：{}，订单ID：{}", userId, orderId, e);
        }
    }

    /**
     * 发送商品发货通知
     *
     * @param userId      用户ID
     * @param orderId     订单ID
     * @param productName 商品名称
     * @param expressName 快递公司名称
     * @param expressNo   快递单号
     */
    public void sendDeliveryNotification(Long userId, String orderId, String productName, 
                                         String expressName, String expressNo) {
        try {
            // 获取用户信息
            User user = userService.getById(userId);
            if (user == null) {
                log.warn("用户不存在，无法发送通知，用户ID：{}", userId);
                return;
            }

            // 发送WebSocket业务通知
            String message = String.format("您购买的商品%s已发货，快递公司：%s，快递单号：%s", productName, expressName, expressNo);
            boolean wsResult = messageUtils.sendBusinessNotice(userId.toString(), "DELIVERY", orderId, "商品发货通知", message);
            if (wsResult) {
                log.info("向用户{}({})发送商品发货WebSocket通知成功：您购买的商品{}已发货，订单ID：{}，快递公司：{}，快递单号：{}", 
                        user.getNickname(), user.getPhone(), productName, orderId, expressName, expressNo);
            } else {
                log.warn("向用户{}({})发送商品发货WebSocket通知失败：您购买的商品{}已发货，订单ID：{}，快递公司：{}，快递单号：{}", 
                        user.getNickname(), user.getPhone(), productName, orderId, expressName, expressNo);
            }

        } catch (Exception e) {
            log.error("发送商品发货通知失败，用户ID：{}，订单ID：{}", userId, orderId, e);
        }
    }

    /**
     * 发送提现结果通知
     *
     * @param userId      用户ID
     * @param withdrawId  提现记录ID
     * @param status      提现状态 1:成功 2:失败
     * @param amount      提现金额
     */
    public void sendWithdrawNotification(Long userId, String withdrawId, Integer status, String amount) {
        try {
            // 获取用户信息
            User user = userService.getById(userId);
            if (user == null) {
                log.warn("用户不存在，无法发送通知，用户ID：{}", userId);
                return;
            }

            // 发送WebSocket业务通知
            String statusDesc = status == 1 ? "提现成功" : "提现失败";
            String message = String.format("您的提现请求%s已%s，金额：%s元", withdrawId, statusDesc, amount);
            boolean wsResult = messageUtils.sendBusinessNotice(userId.toString(), "WITHDRAW", withdrawId, "提现结果通知", message);
            if (wsResult) {
                log.info("向用户{}({})发送提现结果WebSocket通知成功：提现记录{}已{}，金额：{}", 
                        user.getNickname(), user.getPhone(), withdrawId, statusDesc, amount);
            } else {
                log.warn("向用户{}({})发送提现结果WebSocket通知失败：提现记录{}已{}，金额：{}", 
                        user.getNickname(), user.getPhone(), withdrawId, statusDesc, amount);
            }

        } catch (Exception e) {
            log.error("发送提现结果通知失败，用户ID：{}，提现记录ID：{}", userId, withdrawId, e);
        }
    }

    /**
     * 发送系统通知
     *
     * @param userId    用户ID
     * @param title     通知标题
     * @param content   通知内容
     */
    public void sendSystemNotification(Long userId, String title, String content) {
        try {
            // 获取用户信息
            User user = userService.getById(userId);
            if (user == null) {
                log.warn("用户不存在，无法发送通知，用户ID：{}", userId);
                return;
            }

            // 发送WebSocket系统通知
            boolean wsResult = messageUtils.sendSystemNotice(userId.toString(), title, content);
            if (wsResult) {
                log.info("向用户{}({})发送系统WebSocket通知成功：【{}】{}", 
                        user.getNickname(), user.getPhone(), title, content);
            } else {
                log.warn("向用户{}({})发送系统WebSocket通知失败：【{}】{}", 
                        user.getNickname(), user.getPhone(), title, content);
            }

        } catch (Exception e) {
            log.error("发送系统通知失败，用户ID：{}", userId, e);
        }
    }
}
