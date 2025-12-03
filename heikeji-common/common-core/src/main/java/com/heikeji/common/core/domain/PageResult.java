package com.heikeji.common.core.domain;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 分页结果类
 * 用于在服务间传递分页数据
 */
@Data
public class PageResult<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 当前页码
     */
    private Integer page;

    /**
     * 每页记录数
     */
    private Integer limit;

    /**
     * 总记录数
     */
    private Long total;

    /**
     * 总页数
     */
    private Integer pages;

    /**
     * 分页数据
     */
    private List<T> list;

    /**
     * 是否有下一页
     */
    private boolean hasNext;

    /**
     * 是否有上一页
     */
    private boolean hasPrev;

    /**
     * 无参构造函数
     */
    public PageResult() {
    }

    /**
     * 全参构造函数
     */
    public PageResult(Integer page, Integer limit, Long total, List<T> list) {
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.list = list;
        this.pages = (int) Math.ceil((double) total / limit);
        this.hasNext = page < this.pages;
        this.hasPrev = page > 1;
    }

    /**
     * 构建分页结果
     */
    public static <T> PageResult<T> build(Integer page, Integer limit, Long total, List<T> list) {
        return new PageResult<>(page, limit, total, list);
    }

    /**
     * 构建空分页结果
     */
    public static <T> PageResult<T> empty(Integer page, Integer limit) {
        return new PageResult<>(page, limit, 0L, null);
    }
}