package com.heikeji.mall.user.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 分页数据封装类
 *
 * @param <T> 数据类型
 * @author heikeji
 * @date 2024-12-19
 */
@Data
public class PageData<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 数据列表
     */
    private List<T> list;

    /**
     * 总记录数
     */
    private long total;

    /**
     * 每页记录数
     */
    private long size;

    /**
     * 当前页码
     */
    private long current;

    /**
     * 总页数
     */
    private long pages;

    /**
     * 构造函数
     *
     * @param list    数据列表
     * @param total   总记录数
     * @param size    每页记录数
     * @param current 当前页码
     * @param pages   总页数
     */
    public PageData(List<T> list, long total, long size, long current, long pages) {
        this.list = list;
        this.total = total;
        this.size = size;
        this.current = current;
        this.pages = pages;
    }
}