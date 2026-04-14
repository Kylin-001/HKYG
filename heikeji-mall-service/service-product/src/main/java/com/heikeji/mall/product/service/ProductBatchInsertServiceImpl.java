package com.heikeji.mall.product.service;

import com.heikeji.mall.common.Result;
import com.heikeji.mall.product.dto.ProductBatchInsertDTO;
import com.heikeji.mall.product.entity.Category;
import com.heikeji.mall.product.entity.Product;
import com.heikeji.mall.product.entity.Store;
import com.heikeji.mall.product.mapper.CategoryMapper;
import com.heikeji.mall.product.mapper.ProductMapper;
import com.heikeji.mall.product.mapper.StoreMapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 商品批量插入服务实现类
 *
 * 功能特性：
 * 1. 支持单条和批量商品数据插入
 * 2. 外键约束验证（分类ID、商家ID）
 * 3. 完整的事务处理机制
 * 4. 数据唯一性和完整性校验
 * 5. 异常处理和详细错误日志
 */
@Service
public class ProductBatchInsertServiceImpl extends ServiceImpl<ProductMapper, Product> implements ProductBatchInsertService {

    private static final Logger log = LoggerFactory.getLogger(ProductBatchInsertServiceImpl.class);

    private final ProductMapper productMapper;
    private final CategoryMapper categoryMapper;
    private final StoreMapper storeMapper;

    public ProductBatchInsertServiceImpl(ProductMapper productMapper,
                                        CategoryMapper categoryMapper,
                                        StoreMapper storeMapper) {
        this.productMapper = productMapper;
        this.categoryMapper = categoryMapper;
        this.storeMapper = storeMapper;
    }

    /**
     * 单条商品数据插入
     *
     * @param dto 商品数据传输对象
     * @return 插入结果，包含成功/失败信息和商品ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Product> insertSingle(ProductBatchInsertDTO dto) {
        log.info("开始插入单条商品数据, name: {}, categoryId: {}, storeId: {}",
                dto.getName(), dto.getCategoryId(), dto.getStoreId());

        try {
            validateForeignKeys(dto);

            Product product = convertToEntity(dto);
            boolean success = save(product);

            if (success) {
                log.info("商品插入成功, productId: {}, name: {}", product.getId(), product.getName());
                return Result.success("商品添加成功", product);
            } else {
                log.error("商品插入失败, name: {}", dto.getName());
                return Result.error("商品添加失败，请重试");
            }
        } catch (DuplicateKeyException e) {
            log.error("商品数据重复: {}", e.getMessage());
            throw new RuntimeException("商品数据冲突：" + e.getMessage(), e);
        } catch (Exception e) {
            log.error("插入商品数据时发生异常, name: {}, error: {}", dto.getName(), e.getMessage(), e);
            throw new RuntimeException("插入商品数据失败：" + e.getMessage(), e);
        }
    }

    /**
     * 批量商品数据插入
     *
     * @param dtoList 商品数据列表
     * @return 批量插入结果，包含成功/失败统计和详细信息
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<List<Product>> insertBatch(List<ProductBatchInsertDTO> dtoList) {
        log.info("开始批量插入商品数据, 总数: {}", dtoList.size());

        if (dtoList == null || dtoList.isEmpty()) {
            return Result.error("待插入的数据列表不能为空");
        }

        if (dtoList.size() > 200) {
            return Result.error("单次批量插入数量不能超过200条");
        }

        List<Product> successList = new ArrayList<>();
        List<String> errorList = new ArrayList<>();
        int successCount = 0;
        int failCount = 0;

        for (int i = 0; i < dtoList.size(); i++) {
            ProductBatchInsertDTO dto = dtoList.get(i);
            try {
                validateForeignKeys(dto);

                Product product = convertToEntity(dto);
                boolean saved = save(product);

                if (saved) {
                    successList.add(product);
                    successCount++;
                    log.info("第{}条商品插入成功, productId: {}, name: {}", i + 1, product.getId(), product.getName());
                } else {
                    failCount++;
                    errorList.add(String.format("第%d条(name=%s): 插入失败", i + 1, dto.getName()));
                    log.warn("第{}条商品插入失败, name: {}", i + 1, dto.getName());
                }
            } catch (DuplicateKeyException e) {
                failCount++;
                String errorMsg = String.format("第%d条(name=%s): 数据冲突 - %s",
                        i + 1, dto.getName(), e.getMessage());
                errorList.add(errorMsg);
                log.warn("第{}条商品数据冲突, name: {}, error: {}", i + 1, dto.getName(), e.getMessage());
            } catch (IllegalArgumentException e) {
                failCount++;
                String errorMsg = String.format("第%d条(name=%s): %s",
                        i + 1, dto.getName(), e.getMessage());
                errorList.add(errorMsg);
                log.warn("第{}条商品外键验证失败, name: {}, error: {}", i + 1, dto.getName(), e.getMessage());
            } catch (Exception e) {
                failCount++;
                String errorMsg = String.format("第%d条(name=%s): %s",
                        i + 1, dto.getName(), e.getMessage());
                errorList.add(errorMsg);
                log.error("第{}条商品插入异常, name: {}, error: {}", i + 1, dto.getName(), e.getMessage(), e);
            }
        }

        log.info("批量插入完成, 总数: {}, 成功: {}, 失败: {}", dtoList.size(), successCount, failCount);

        if (failCount == 0) {
            return Result.success(String.format("成功插入%d条商品数据", successCount), successList);
        } else if (successCount == 0) {
            return Result.error(String.format("全部插入失败(%d条)，错误详情：%s",
                    failCount, String.join("; ", errorList)));
        } else {
            return Result.success(String.format("部分成功：成功%d条，失败%d条。失败详情：%s",
                    successCount, failCount, String.join("; ", errorList)), successList);
        }
    }

    /**
     * 验证外键约束
     * 检查分类ID和商家ID是否存在
     */
    private void validateForeignKeys(ProductBatchInsertDTO dto) {
        Category category = categoryMapper.selectById(dto.getCategoryId());
        if (category == null) {
            throw new IllegalArgumentException("分类ID " + dto.getCategoryId() + " 不存在");
        }

        Store store = storeMapper.selectById(dto.getStoreId());
        if (store == null) {
            throw new IllegalArgumentException("商家ID " + dto.getStoreId() + " 不存在");
        }
    }

    /**
     * DTO转实体对象
     * 设置默认值
     */
    private Product convertToEntity(ProductBatchInsertDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setCategoryId(dto.getCategoryId());
        product.setMerchantId(dto.getStoreId());
        product.setPrice(dto.getPrice());
        product.setOriginalPrice(dto.getOriginalPrice());
        product.setStock(dto.getStock());
        product.setImages(dto.getImages());
        product.setDescription(dto.getDescription());
        product.setSpecifications(dto.getSpecifications());
        product.setStatus(dto.getStatus());
        product.setIsRecommend(dto.getIsFeatured());

        if (product.getStock() == null) {
            product.setStock(0);
        }

        if (product.getStatus() == null) {
            product.setStatus(1);
        }

        return product;
    }
}
