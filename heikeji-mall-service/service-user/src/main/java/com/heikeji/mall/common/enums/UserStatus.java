package com.heikeji.mall.common.enums;

/**
 * 用户状态枚举
 *
 * @author heikeji
 * @date 2024-12-19
 */
public enum UserStatus {
    
    ACTIVE(1, "正常"),
    DISABLED(0, "禁用"),
    LOCKED(-1, "锁定"),
    UNVERIFIED(2, "未验证");
    
    private final Integer code;
    private final String desc;
    
    UserStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
    
    public Integer getCode() {
        return code;
    }
    
    public String getDesc() {
        return desc;
    }
    
    /**
     * 根据编码获取状态
     */
    public static UserStatus getByCode(Integer code) {
        for (UserStatus status : values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        return null;
    }
}
