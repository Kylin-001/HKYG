package com.heikeji.mall.product.dto;

import lombok.Data;

/**
 * 分类DTO类
 */
@Data
public class CategoryDTO {
    private Long id;
    private String name;
    private String icon;
    private Integer sortOrder;
    private Integer status;
    private String statusStr;
    
    // 辅助方法
    public String getStatusStr() {
        if (status == null) return "";
        switch (status) {
            case 0: return "禁用";
            case 1: return "启用";
            default: return "未知";
        }
    }
}