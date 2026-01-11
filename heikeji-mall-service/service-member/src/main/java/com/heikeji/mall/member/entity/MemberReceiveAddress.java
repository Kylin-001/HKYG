package com.heikeji.mall.member.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 浼氬憳鏀惰揣鍦板潃瀹炰綋绫? */
@Data
@TableName("member_receive_address")
public class MemberReceiveAddress implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 鍦板潃ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 鐢ㄦ埛ID
     */
    private Long userId;

    /**
     * 鏀惰揣浜哄鍚?     */
    private String name;

    /**
     * 鎵嬫満鍙风爜
     */
    private String phone;

    /**
     * 鐪佷唤
     */
    private String province;

    /**
     * 鍩庡競
     */
    private String city;

    /**
     * 鍖哄幙
     */
    private String region;

    /**
     * 璇︾粏鍦板潃
     */
    private String detailAddress;

    /**
     * 鏄惁榛樿鍦板潃
     */
    private Integer defaultStatus;

    /**
     * 鍒涘缓鏃堕棿
     */
    private Date createTime;

    /**
     * 鏇存柊鏃堕棿
     */
    private Date updateTime;

    /**
     * 鍒犻櫎鏍囪
     */
    private Integer delFlag;
}
