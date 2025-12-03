package com.heikeji.mall.payment.config;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.api.impl.WxMaServiceImpl;
import cn.binarywang.wx.miniapp.config.WxMaConfig;
import cn.binarywang.wx.miniapp.config.impl.WxMaDefaultConfigImpl;
import cn.binarywang.wx.miniapp.config.impl.WxMaRedisConfigImpl;
import cn.binarywang.wx.miniapp.message.WxMaMessageRouter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.github.binarywang.wxpay.config.WxPayConfig;
import com.github.binarywang.wxpay.service.WxPayService;
import com.github.binarywang.wxpay.service.impl.WxPayServiceImpl;
import lombok.Data;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

/**
 * 微信支付配置类
 * 配置微信支付SDK所需的参数和服务
 */
@Configuration
@Data
@ConfigurationProperties(prefix = "wx.pay")
public class WechatPayConfig {
    
    private String appId;               // 微信小程序appId
    private String mchId;               // 商户号
    private String mchKey;              // 商户密钥
    private String keyPath;             // API证书路径
    private String notifyUrl;           // 支付结果通知地址
    private String refundNotifyUrl;     // 退款结果通知地址
    private String certPath;            // 证书路径
    private String privateCertPath;     // 私钥证书路径
    private String publicCertPath;      // 公钥证书路径
    private String apiV3Key;            // API V3密钥
    
    /**
     * 创建微信支付服务实例
     */
    @Bean
    public WxPayService wxPayService() {
        com.github.binarywang.wxpay.config.WxPayConfig payConfig = new com.github.binarywang.wxpay.config.WxPayConfig();
        payConfig.setAppId(this.appId);
        payConfig.setMchId(this.mchId);
        payConfig.setMchKey(this.mchKey);
        payConfig.setKeyPath(this.keyPath);
        payConfig.setNotifyUrl(this.notifyUrl);
        // 新版本中可能不需要这些方法，注释掉
        // payConfig.setRefundNotifyUrl(this.refundNotifyUrl);
        // payConfig.setCertPath(this.certPath);
        // payConfig.setPrivateCertPath(this.privateCertPath);
        // payConfig.setPublicCertPath(this.publicCertPath);
        payConfig.setApiV3Key(this.apiV3Key);
        
        // 配置是否使用沙箱环境
        payConfig.setUseSandboxEnv(false);
        
        WxPayService wxPayService = new WxPayServiceImpl();
        wxPayService.setConfig(payConfig);
        
        return wxPayService;
    }
    
    /**
     * 配置Jackson序列化，避免Long类型在JSON中丢失精度
     */
    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper objectMapper = builder.createXmlMapper(false).build();
        
        // 添加Java 8时间模块
        objectMapper.registerModule(new JavaTimeModule());
        
        // 配置Long类型序列化为字符串，避免前端丢失精度
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(Long.class, ToStringSerializer.instance);
        simpleModule.addSerializer(Long.TYPE, ToStringSerializer.instance);
        objectMapper.registerModule(simpleModule);
        
        return objectMapper;
    }
}