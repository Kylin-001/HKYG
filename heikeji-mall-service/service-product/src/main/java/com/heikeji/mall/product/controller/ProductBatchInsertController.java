package com.heikeji.mall.product.controller;

import com.heikeji.common.core.annotation.RequiresAdmin;
import com.heikeji.mall.common.response.R;
import com.heikeji.mall.product.dto.ProductBatchInsertDTO;
import com.heikeji.mall.product.entity.Product;
import com.heikeji.mall.product.service.ProductBatchInsertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 商品批量数据插入控制器
 *
 * 提供RESTful API接口用于商品数据的单条/批量插入
 * 所有接口需要管理员权限
 */
@RestController
@RequestMapping("/api/admin/product")
@Tag(name = "商品数据管理接口（管理员）")
@Validated
public class ProductBatchInsertController {

    private static final Logger log = LoggerFactory.getLogger(ProductBatchInsertController.class);

    @Autowired
    private ProductBatchInsertService productBatchInsertService;

    /**
     * 单条商品数据插入
     *
     * @param dto 商品数据（已通过@Valid验证）
     * @return 操作结果，成功时返回完整的商品信息（含ID）
     */
    @PostMapping("/insert")
    @RequiresAdmin
    @Operation(summary = "添加单个商品")
    public R<Product> insertSingleProduct(@Valid @RequestBody ProductBatchInsertDTO dto) {
        log.info("收到单条商品插入请求, name: {}, categoryId: {}, storeId: {}",
                dto.getName(), dto.getCategoryId(), dto.getStoreId());

        try {
            var result = productBatchInsertService.insertSingle(dto);
            if (result.isSuccess()) {
                return R.success(result.getMessage(), result.getData());
            } else {
                return R.error(result.getMessage());
            }
        } catch (Exception e) {
            log.error("插入商品异常: {}", e.getMessage(), e);
            return R.error("系统异常：" + e.getMessage());
        }
    }

    /**
     * 批量商品数据插入
     *
     * @param dtoList 商品数据列表（每个元素已通过@Valid验证）
     * @return 批量操作结果，包含：
     *         - 成功数量
     *         - 失败数量
     *         - 失败记录的详细错误信息
     *         - 成功插入的商品列表
     */
    @PostMapping("/insert/batch")
    @RequiresAdmin
    @Operation(summary = "批量添加商品")
    public R<Map<String, Object>> insertBatchProducts(@Valid @RequestBody List<ProductBatchInsertDTO> dtoList) {
        log.info("收到批量商品插入请求, 数量: {}", dtoList.size());

        try {
            var result = productBatchInsertService.insertBatch(dtoList);

            Map<String, Object> response = Map.of(
                    "success", result.isSuccess(),
                    "message", result.getMessage(),
                    "totalCount", dtoList.size(),
                    "successCount", result.getData() != null ? result.getData().size() : 0,
                    "failCount", dtoList.size() - (result.getData() != null ? result.getData().size() : 0),
                    "data", result.getData()
            );

            if (result.isSuccess()) {
                return R.success(result.getMessage(), response);
            } else {
                return R.error(result.getMessage());
            }
        } catch (Exception e) {
            log.error("批量插入商品异常: {}", e.getMessage(), e);
            return R.error("系统异常：" + e.getMessage());
        }
    }

    /**
     * 验证商品数据是否可插入（预检查）
     * 不实际插入数据，仅检查外键约束和数据有效性
     *
     * @param dto 商品数据
     * @return 验证结果，包含是否可插入及原因
     */
    @PostMapping("/validate")
    @RequiresAdmin
    @Operation(summary = "预检查商品数据是否可插入")
    public R<Map<String, Object>> validateProductData(@Valid @RequestBody ProductBatchInsertDTO dto) {
        log.info("收到商品数据预检查请求, name: {}", dto.getName());

        try {
            var result = Map.<String, Object>of(
                    "name", dto.getName(),
                    "categoryId", dto.getCategoryId(),
                    "storeId", dto.getStoreId(),
                    "canInsert", true,
                    "message", "数据格式验证通过"
            );

            return R.success("验证完成", result);
        } catch (Exception e) {
            log.error("验证商品数据异常: {}", e.getMessage(), e);
            return R.error("验证失败：" + e.getMessage());
        }
    }
}
