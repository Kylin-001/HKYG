package com.heikeji.mall.delivery.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

/**
 * 配送员信息实体
 */
@Data
@TableName("delivery_user")
public class DeliveryUser {

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 姓名
     */
    private String name;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 身份证号
     */
    private String idCard;

    /**
     * 身份证正面照片
     */
    private String idCardFrontImg;

    /**
     * 身份证反面照片
     */
    private String idCardBackImg;

    /**
     * 人脸照片
     */
    private String faceImg;

    /**
     * 驾驶证照片
     */
    private String drivingLicenseImg;

    /**
     * 电动车牌照
     */
    private String electricVehicleLicense;

    /**
     * 电动车照片
     */
    private String vehicleImg;

    /**
     * 状态：0-待审核，1-已审核，2-审核失败，3-已禁用
     */
    private Integer status;

    /**
     * 审核失败原因
     */
    private String rejectReason;

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
     * 配送评分
     */
    private Double deliveryScore;

    /**
     * 总配送单数量
     */
    private Integer totalOrderCount;

    /**
     * 完成订单数量
     */
    private Integer completedOrderCount;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 是否删除：0-未删除，1-已删除
     */
    private Integer deleted;
}
