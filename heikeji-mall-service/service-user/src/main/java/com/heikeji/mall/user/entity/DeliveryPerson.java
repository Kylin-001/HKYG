package com.heikeji.mall.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

/**
 * 配送员实体类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@TableName("delivery_person")
public class DeliveryPerson {

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
     * 身份证正面照片
     */
    private String idCardFrontImg;

    /**
     * 身份证反面照片
     */
    private String idCardBackImg;

    /**
     * 驾驶证照片
     */
    private String drivingLicenseImg;

    /**
     * 配送状态：0-待审核，1-已审核，2-审核失败，3-已禁用
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

    /**
     * 是否删除：0-未删除，1-已删除
     */
    private Integer deleted;
}
