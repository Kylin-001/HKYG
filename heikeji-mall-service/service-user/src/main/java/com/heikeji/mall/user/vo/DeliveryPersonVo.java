package com.heikeji.mall.user.vo;

import lombok.Data;

import java.util.Date;

/**
 * 配送员VO类
 * 用于封装配送员信息的视图对象
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
public class DeliveryPersonVo {
    
    /**
     * 主键ID
     */
    private Long id;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 配送员姓名
     */
    private String name;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 身份证号
     */
    private String idCard;

    /**
     * 配送状态：0-待审核，1-已审核，2-审核失败，3-已禁用
     */
    private Integer status;

    /**
     * 经度
     */
    private Double longitude;

    /**
     * 纬度
     */
    private Double latitude;

    /**
     * 最后定位时间
     */
    private Date lastLocationTime;

    /**
     * 总配送单数
     */
    private Integer totalOrders;

    /**
     * 完成配送单数
     */
    private Integer completedOrders;

    /**
     * 配送评分
     */
    private Double rating;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
    
    // 统计信息字段
    private Integer pendingOrders;
    private Integer cancelledOrders;
    private Double avgDeliveryTime;
    private Integer completedTasksToday;
    private Integer totalDistanceToday;
}
