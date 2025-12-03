package com.heikeji.mall.user.dto;

import lombok.Data;

import java.util.Date;

/**
 * 配送员DTO类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
public class DeliveryPersonDTO {
    
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
     * 经度
     */
    private Double longitude;

    /**
     * 纬度
     */
    private Double latitude;
}
