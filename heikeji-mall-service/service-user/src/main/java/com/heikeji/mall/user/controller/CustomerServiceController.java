package com.heikeji.mall.customer.controller;

import com.heikeji.common.core.domain.R;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/customer-service")
@Tag(name = "智能客服", description = "智能客服相关接口")
@Slf4j
public class CustomerServiceController {

    private final Map<String, List<Map<String, String>>> sessionMessages = new ConcurrentHashMap<>();

    @PostMapping("/chat")
    @Operation(summary = "智能问答")
    public R<Map<String, Object>> chat(@RequestBody Map<String, String> request) {
        String sessionId = request.get("sessionId");
        String message = request.get("message");
        
        if (sessionId == null || message == null) {
            return R.error("参数不完整");
        }

        log.info("收到用户消息: sessionId={}, message={}", sessionId, message);

        String response = getAutoReply(message);
        
        List<Map<String, String>> messages = sessionMessages.computeIfAbsent(sessionId, k -> new ArrayList<>());
        messages.add(createMessage("user", message));
        messages.add(createMessage("bot", response));
        
        Map<String, Object> result = new HashMap<>();
        result.put("reply", response);
        result.put("type", "text");
        result.put("suggestions", getSuggestions(message));
        
        return R.success(result);
    }

    @GetMapping("/history/{sessionId}")
    @Operation(summary = "获取聊天历史")
    public R<List<Map<String, String>>> getHistory(@PathVariable String sessionId) {
        List<Map<String, String>> messages = sessionMessages.getOrDefault(sessionId, new ArrayList<>());
        return R.success(messages);
    }

    @DeleteMapping("/history/{sessionId}")
    @Operation(summary = "清除聊天历史")
    public R<Boolean> clearHistory(@PathVariable String sessionId) {
        sessionMessages.remove(sessionId);
        return R.success(true);
    }

    @GetMapping("/quick-replies")
    @Operation(summary = "获取快捷回复")
    public R<List<Map<String, String>>> getQuickReplies() {
        List<Map<String, String>> replies = new ArrayList<>();
        replies.add(createQuickReply("如何注册？", "点击首页右上角注册按钮，输入手机号和验证码即可完成注册"));
        replies.add(createQuickReply("如何下单？", "选择商品后点击立即购买，填写收货地址并完成支付即可下单"));
        replies.add(createQuickReply("如何联系卖家？", "在商品详情页点击联系卖家按钮即可私信联系"));
        replies.add(createQuickReply("订单如何退款？", "在订单详情页面申请退款，商家同意后会自动退回支付账户"));
        replies.add(createQuickReply("配送费用？", "配送费用根据商品重量和距离计算，具体以提交订单时显示为准"));
        replies.add(createQuickReply("如何发布商品？", "点击发布按钮，选择商品分类，填写商品信息后提交审核"));
        return R.success(replies);
    }

    @GetMapping("/evaluaion/{sessionId}")
    @Operation(summary = "获取满意度评价选项")
    public R<List<Map<String, String>>> getEvaluationOptions() {
        List<Map<String, String>> options = new ArrayList<>();
        options.add(createEvaluation("非常满意", 5));
        options.add(createEvaluation("满意", 4));
        options.add(createEvaluation("一般", 3));
        options.add(createEvaluation("不满意", 2));
        options.add(createEvaluation("非常不满意", 1));
        return R.success(options);
    }

    @PostMapping("/feedback")
    @Operation(summary = "提交反馈")
    public R<Boolean> submitFeedback(@RequestBody Map<String, String> feedback) {
        String sessionId = feedback.get("sessionId");
        String rating = feedback.get("rating");
        String content = feedback.get("content");
        
        log.info("收到用户反馈: sessionId={}, rating={}, content={}", sessionId, rating, content);
        
        return R.success(true);
    }

    private String getAutoReply(String message) {
        message = message.toLowerCase();
        
        if (containsAny(message, "注册", "sign up", "register")) {
            return "如何注册：\n1. 点击首页右上角的「注册」按钮\n2. 输入您的手机号码\n3. 获取并输入验证码\n4. 设置登录密码\n5. 完成注册即可";
        }
        
        if (containsAny(message, "登录", "login", "登陆")) {
            return "如何登录：\n1. 点击首页右上角的「登录」按钮\n2. 输入手机号和密码\n3. 点击登录即可\n\n忘记密码可点击「忘记密码」找回";
        }
        
        if (containsAny(message, "下单", "购买", "buy", "order")) {
            return "如何下单：\n1. 在商品列表选择心仪商品\n2. 点击进入商品详情页\n3. 点击「立即购买」\n4. 填写收货地址\n5. 选择支付方式完成支付";
        }
        
        if (containsAny(message, "支付", "pay", "付款", "钱")) {
            return "支付方式：\n我们支持微信支付、支付宝、银行卡等多种支付方式。\n提交订单后请在30分钟内完成支付，超时订单将自动取消。";
        }
        
        if (containsAny(message, "配送", "快递", "delivery", "发货")) {
            return "配送说明：\n1. 普通快递：2-5天送达\n2. 立即配送：1-2小时送达（仅限校园内）\n3. 自提点：下单后24小时内可自提\n\n配送费用根据距离和重量计算";
        }
        
        if (containsAny(message, "退款", "退货", "refund", "return")) {
            return "退款退货：\n1. 进入「我的订单」\n2. 选择需要退款的订单\n3. 点击「申请退款」\n4. 填写退款原因\n5. 提交后等待商家审核";
        }
        
        if (containsAny(message, "发布", "卖", "sell", "publish")) {
            return "如何发布商品：\n1. 登录后点击「发布」按钮\n2. 选择商品分类\n3. 填写商品名称、价格、描述\n4. 上传商品图片（最多5张）\n5. 设置交易方式和地点\n6. 提交审核";
        }
        
        if (containsAny(message, "二手", "secondhand", "used")) {
            return "二手商品：\n我们提供安全的二手交易服务。\n商品发布后需要审核，审核通过后即可展示。\n交易建议选择校园内面交更安全。";
        }
        
        if (containsAny(message, "失物", "招领", "lost", "found")) {
            return "失物招领：\n您可以发布寻物或招领信息。\n1. 点击「失物招领」\n2. 选择「寻物」或「招领」\n3. 填写详细信息\n4. 可设置悬赏金额";
        }
        
        if (containsAny(message, "积分", "points", "credit")) {
            return "积分说明：\n1. 购物可获得积分\n2. 积分可兑换商品\n3. 积分也可抵扣现金\n4. 签到可获得额外积分";
        }
        
        if (containsAny(message, "会员", "vip", "等级")) {
            return "会员等级：\n1. 普通会员：注册即可\n2. 铜牌会员：累计消费100元\n3. 银牌会员：累计消费500元\n4. 金牌会员：累计消费2000元\n\n不同等级享受不同优惠";
        }
        
        if (containsAny(message, "联系", "客服", "contact", "service", "电话")) {
            return "联系我们：\n1. 在线客服：点击右上角客服图标\n2. 电话：400-888-8888\n3. 邮箱：service@heikeji.com\n4. 工作时间：9:00-21:00";
        }
        
        if (containsAny(message, "你好", "hello", "hi", "在")) {
            return "您好！我是黑科易购智能客服小E，很高兴为您服务！\n\n我可以帮您解答关于注册、下单、支付、配送等问题。\n请直接输入您的问题~";
        }
        
        if (containsAny(message, "谢谢", "thank", "感谢")) {
            return "不客气！😊 如果您还有其他问题，随时可以问我~";
        }
        
        if (containsAny(message, "再见", "bye", "拜拜")) {
            return "再见！祝您生活愉快！有任何问题随时找我~ 👋";
        }
        
        return "抱歉，我没有理解您的问题。😕\n\n您可以尝试以下问题：\n- 如何注册？\n- 如何下单？\n- 如何支付？\n- 如何退款？\n- 如何联系卖家？\n\n或者点击下方快捷回复获取更多帮助~";
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private List<String> getSuggestions(String message) {
        List<String> suggestions = new ArrayList<>();
        message = message.toLowerCase();
        
        if (containsAny(message, "注册", "登录")) {
            suggestions.add("如何下单？");
            suggestions.add("如何支付？");
        } else if (containsAny(message, "下单", "购买")) {
            suggestions.add("如何支付？");
            suggestions.add("配送费用？");
        } else if (containsAny(message, "支付", "钱")) {
            suggestions.add("如何退款？");
            suggestions.add("配送时间？");
        } else if (containsAny(message, "退款", "退货")) {
            suggestions.add("退款多久到账？");
            suggestions.add("如何联系客服？");
        } else {
            suggestions.add("如何注册？");
            suggestions.add("如何下单？");
            suggestions.add("如何联系卖家？");
        }
        
        return suggestions;
    }

    private Map<String, String> createMessage(String type, String content) {
        Map<String, String> message = new HashMap<>();
        message.put("type", type);
        message.put("content", content);
        message.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return message;
    }

    private Map<String, String> createQuickReply(String question, String answer) {
        Map<String, String> reply = new HashMap<>();
        reply.put("question", question);
        reply.put("answer", answer);
        return reply;
    }

    private Map<String, String> createEvaluation(String label, int value) {
        Map<String, String> evaluation = new HashMap<>();
        evaluation.put("label", label);
        evaluation.put("value", String.valueOf(value));
        return evaluation;
    }
}
