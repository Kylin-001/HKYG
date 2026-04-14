package com.heikeji.mall.product.service;

import com.heikeji.mall.common.Result;
import com.heikeji.mall.product.dto.ProductBatchInsertDTO;
import com.heikeji.mall.product.entity.Product;

import java.util.List;

/**
 * 商品批量插入服务接口
 * 定义单条和批量商品数据插入的标准契约
 */
public interface ProductBatchInsertService {

    /**
     * 插入单条商品数据
     *
     * @param dto 商品数据传输对象（已通过参数验证）
     * @return 操作结果，成功时返回商品实体（含生成的主键ID）
     */
    Result<Product> insertSingle(ProductBatchInsertDTO dto);

    /**
     * 批量插入商品数据
     *
     * @param dtoList 商品数据列表（每个元素已通过参数验证）
     * @return 批量操作结果，包含：
     *         - 成功插入的商品列表
     *         - 成功/失败数量统计
     *         - 失败记录的错误详情
     */
    Result<List<Product>> insertBatch(List<ProductBatchInsertDTO> dtoList);
}
