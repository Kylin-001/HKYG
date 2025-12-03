package com.heikeji.mall.common.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.io.Serializable;
import java.util.Collections;
import java.util.List;

/**
 * 分页数据封装类
 * 用于统一返回分页查询结果
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(description = "分页数据响应")
public class PageData<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "分页数据列表")
    private List<T> records;

    @Schema(description = "总记录数")
    private long total;

    @Schema(description = "每页大小")
    private long size;

    @Schema(description = "当前页码")
    private long current;

    @Schema(description = "总页数")
    private long pages;

    /**
     * 构造方法
     */
    public PageData() {
        this.records = Collections.emptyList();
        this.total = 0;
        this.size = 10;
        this.current = 1;
        this.pages = 0;
    }

    /**
     * 构造方法
     *
     * @param records 数据列表
     * @param total   总记录数
     * @param size    每页大小
     * @param current 当前页码
     */
    public PageData(List<T> records, long total, long size, long current) {
        this.records = records;
        this.total = total;
        this.size = size;
        this.current = current;
        this.pages = calculatePages(total, size);
    }

    /**
     * 计算总页数
     *
     * @param total 总记录数
     * @param size  每页大小
     * @return 总页数
     */
    private long calculatePages(long total, long size) {
        if (size == 0) {
            return 0;
        }
        return (total + size - 1) / size;
    }

    /**
     * 创建空的分页数据
     *
     * @param <T> 数据类型
     * @return 空的分页数据
     */
    public static <T> PageData<T> empty() {
        return new PageData<>();
    }

    /**
     * 创建分页数据
     *
     * @param records 数据列表
     * @param total   总记录数
     * @param size    每页大小
     * @param current 当前页码
     * @param <T>     数据类型
     * @return 分页数据
     */
    public static <T> PageData<T> of(List<T> records, long total, long size, long current) {
        return new PageData<>(records, total, size, current);
    }
}