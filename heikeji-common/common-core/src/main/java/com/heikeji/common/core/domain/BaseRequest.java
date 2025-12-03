package com.heikeji.common.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.util.StringUtils;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

/**
 * 基础请求参数类
 * 提供分页、排序等通用参数
 *
 * @author: zky
 * @date: 2024-01-01
 */
@Data
public class BaseRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 默认页码
     */
    public static final int DEFAULT_PAGE_NUM = 1;

    /**
     * 默认每页大小
     */
    public static final int DEFAULT_PAGE_SIZE = 10;

    /**
     * 最大每页大小
     */
    public static final int MAX_PAGE_SIZE = 1000;

    /**
     * 页码，默认1
     */
    private Integer pageNum = DEFAULT_PAGE_NUM;

    /**
     * 每页大小，默认10，最大1000
     */
    private Integer pageSize = DEFAULT_PAGE_SIZE;

    /**
     * 排序字段
     */
    private String sortField;

    /**
     * 排序方向，asc-升序，desc-降序
     */
    private String sortOrder;

    /**
     * 导出标志
     */
    private Boolean export;

    /**
     * 构建排序SQL
     * @return 排序SQL字符串
     */
    @JsonIgnore
    public String getOrderBySql() {
        if (!StringUtils.hasText(sortField)) {
            return "";
        }

        StringBuilder orderBySql = new StringBuilder();
        // 处理排序字段，防止SQL注入
        String safeSortField = formatSortField(sortField);
        if (!StringUtils.hasText(safeSortField)) {
            return "";
        }

        orderBySql.append("ORDER BY ").append(safeSortField);
        
        // 添加排序方向
        if (StringUtils.hasText(sortOrder)) {
            String order = sortOrder.trim().toLowerCase();
            if ("asc".equals(order) || "desc".equals(order)) {
                orderBySql.append(" ").append(order);
            } else {
                orderBySql.append(" DESC");
            }
        } else {
            orderBySql.append(" DESC");
        }

        return orderBySql.toString();
    }

    /**
     * 格式化排序字段，防止SQL注入
     * @param field 原始字段名
     * @return 安全的字段名
     */
    private String formatSortField(String field) {
        // 移除可能的SQL注入字符
        String safeField = field.trim()
                .replaceAll("[^a-zA-Z0-9_\\.]", "");
        
        // 检查是否为空或仅包含点号
        if (!StringUtils.hasText(safeField) || safeField.equals(".")) {
            return "";
        }
        
        // 允许的排序字段列表，可以根据业务需求扩展
        List<String> allowedFields = getAllowedSortFields();
        if (allowedFields != null && !allowedFields.isEmpty()) {
            // 如果指定了允许的字段列表，则进行验证
            if (!allowedFields.contains(safeField)) {
                return "";
            }
        }
        
        return safeField;
    }

    /**
     * 获取允许的排序字段列表
     * 子类可以重写此方法指定允许的排序字段
     * @return 允许的排序字段列表
     */
    protected List<String> getAllowedSortFields() {
        // 默认允许空列表，由子类决定
        return null;
    }

    /**
     * 获取SQL分页偏移量
     * @return 偏移量
     */
    @JsonIgnore
    public int getOffset() {
        return (pageNum - 1) * pageSize;
    }

    /**
     * 规范化分页参数
     */
    public void normalizePageParams() {
        // 确保页码不小于1
        if (pageNum == null || pageNum < 1) {
            pageNum = DEFAULT_PAGE_NUM;
        }
        
        // 确保每页大小不小于1，不大于最大值
        if (pageSize == null || pageSize < 1) {
            pageSize = DEFAULT_PAGE_SIZE;
        } else if (pageSize > MAX_PAGE_SIZE) {
            pageSize = MAX_PAGE_SIZE;
        }
    }
}