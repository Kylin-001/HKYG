package com.heikeji.mall.payment.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.payment.entity.Payment;
import com.heikeji.mall.payment.service.PaymentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

/**
 * 支付控制器
 */
@RestController
@RequestMapping("/api/payment")
@Api(tags = "支付管理")
@Slf4j
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * 生成微信支付参数
     */
    @GetMapping("/wechat/{paymentId}")
    @ApiOperation("生成微信支付参数")
    public R<Map<String, Object>> generateWechatPayParams(@PathVariable Long paymentId) {
        log.info("生成微信支付参数，paymentId: {}", paymentId);
        Map<String, Object> payParams = paymentService.generateWechatPayParams(paymentId);
        log.info("生成微信支付参数成功，paymentId: {}", paymentId);
        return R.success(payParams);
    }

    /**
     * 查询支付状态
     */
    @GetMapping("/status/{orderNo}")
    @ApiOperation("查询支付状态")
    public R<Integer> queryPaymentStatus(@PathVariable String orderNo) {
        log.info("查询支付状态，订单号: {}", orderNo);
        Integer status = paymentService.queryPaymentStatus(orderNo);
        log.info("查询支付状态成功，订单号: {}, 状态: {}", orderNo, status);
        return R.success(status);
    }

    /**
     * 退款
     */
    @PostMapping("/refund")
    @ApiOperation("退款")
    public R<Boolean> refund(@RequestParam String orderNo, @RequestParam BigDecimal refundAmount) {
        log.info("申请退款，订单号: {}, 退款金额: {}", orderNo, refundAmount);
        boolean result = paymentService.refund(orderNo, refundAmount);
        log.info("退款申请处理成功，订单号: {}, 结果: {}", orderNo, result);
        return R.success(result);
    }

    /**
     * 处理微信支付回调
     * 注意：实际项目中需要使用@RequestBody接收XML格式的回调数据
     */
    @PostMapping("/notify/wechat")
    @ApiOperation("微信支付回调")
    public String processWechatPayNotify(@RequestBody Map<String, String> notifyData) {
        log.info("收到微信支付回调，数据: {}", notifyData);
        boolean result = paymentService.processWechatPayNotify(notifyData);
        log.info("微信支付回调处理完成，结果: {}", result);
        return result ? "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>" : 
               "<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[处理失败]]></return_msg></xml>";
    }
    
    /**
     * 处理支付宝支付回调
     */
    @PostMapping("/notify/alipay")
    @ApiOperation("支付宝支付回调")
    public String processAlipayNotify(@RequestParam Map<String, String> notifyData) {
        log.info("收到支付宝支付回调，数据: {}", notifyData);
        boolean result = paymentService.processAlipayNotify(notifyData);
        log.info("支付宝支付回调处理完成，结果: {}", result);
        return result ? "success" : "fail";
    }
    
    /**
     * 余额支付
     */
    @PostMapping("/balance/pay")
    @ApiOperation("余额支付")
    public R<Boolean> balancePay(@RequestParam Long paymentId) {
        log.info("余额支付请求，paymentId: {}", paymentId);
        boolean result = paymentService.balancePay(paymentId);
        log.info("余额支付处理完成，paymentId: {}, 结果: {}", paymentId, result);
        return R.success(result);
    }
    
    /**
     * 创建充值订单
     */
    @PostMapping("/recharge")
    @ApiOperation("创建充值订单")
    public R<Payment> recharge(@RequestParam BigDecimal amount, @RequestParam Integer paymentType) {
        log.info("创建充值订单请求，金额: {}, 支付类型: {}", amount, paymentType);
        Payment payment = paymentService.recharge(amount, paymentType);
        log.info("充值订单创建成功，订单号: {}", payment.getOrderNo());
        return R.success(payment);
    }
    
    /**
     * 获取支付记录列表
     */
    @GetMapping("/list")
    @ApiOperation("获取支付记录列表")
    public R<Map<String, Object>> getPaymentList(@RequestParam(defaultValue = "1") Integer page, 
                                               @RequestParam(defaultValue = "10") Integer size) {
        log.info("获取支付记录列表，页码: {}, 每页大小: {}", page, size);
        Map<String, Object> paymentList = paymentService.getPaymentList(page, size);
        log.info("获取支付记录列表成功，页码: {}, 每页大小: {}", page, size);
        return R.success(paymentList);
    }
}