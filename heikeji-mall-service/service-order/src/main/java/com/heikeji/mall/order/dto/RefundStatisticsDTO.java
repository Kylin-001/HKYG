package com.heikeji.mall.order.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * 退款统计DTO
 * 用于封装退款统计分析结果
 */
@Data
public class RefundStatisticsDTO {
    // 退款订单总数
    private Integer totalRefundOrders;
    
    // 退款总金额
    private BigDecimal totalRefundAmount;
    
    // 平均退款金额
    private BigDecimal avgRefundAmount;
    
    // 退款成功率
    private Double refundSuccessRate;
    
    // 退款失败率
    private Double refundFailRate;
    
    // 退款原因分布
    private List<RefundReasonDistributionDTO> refundReasonDistribution;
    
    // 退款状态分布
    private List<RefundStatusDistributionDTO> refundStatusDistribution;
    
    // 退款金额区间分布
    private List<RefundAmountRangeDTO> refundAmountRangeDistribution;
    
    /**
     * 退款原因分布DTO
     */
    @Data
    public static class RefundReasonDistributionDTO {
        private String reasonName;
        private Integer count;
        private Double percentage;
    }
    
    /**
     * 退款状态分布DTO
     */
    @Data
    public static class RefundStatusDistributionDTO {
        private Integer status;
        private String statusDesc;
        private Integer count;
        private Double percentage;
    }
    
    /**
     * 退款金额区间分布DTO
     */
    @Data
    public static class RefundAmountRangeDTO {
        private String range;
        private Integer count;
        private Double percentage;
    }
}