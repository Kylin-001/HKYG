package com.heikeji.mall.product.service;

import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch._types.SortOrder;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.mall.product.document.ProductIndex;
import com.heikeji.mall.product.dto.ProductSearchDTO;
import com.heikeji.mall.product.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Elasticsearch商品搜索服务实现
 */
@Service
public class ProductElasticsearchService {

    @Autowired
    private ElasticsearchOperations elasticsearchOperations;

    /**
     * 高级搜索商品（MyBatis Plus分页版本）
     * @param page MyBatis Plus分页对象
     * @param searchDTO 搜索条件
     * @return 分页搜索结果
     */
    public Page<Product> advancedSearch(Page<Product> page, ProductSearchDTO searchDTO) {
        // 构建查询条件
        Criteria criteria = new Criteria();

        // 关键字搜索（名称、副标题、详情）
        if (searchDTO.getKeyword() != null && !searchDTO.getKeyword().isEmpty()) {
            String keyword = searchDTO.getKeyword();
            criteria.or(new Criteria("name").contains(keyword))
                   .or(new Criteria("subtitle").contains(keyword))
                   .or(new Criteria("detail").contains(keyword));
        }

        // 分类筛选
        if (searchDTO.getCategoryId() != null) {
            criteria.and(new Criteria("categoryId").is(searchDTO.getCategoryId()));
        }

        // 价格区间筛选
        if (searchDTO.getMinPrice() != null || searchDTO.getMaxPrice() != null) {
            Criteria priceCriteria = new Criteria("price");
            if (searchDTO.getMinPrice() != null) {
                priceCriteria.greaterThanEqual(searchDTO.getMinPrice());
            }
            if (searchDTO.getMaxPrice() != null) {
                priceCriteria.lessThanEqual(searchDTO.getMaxPrice());
            }
            criteria.and(priceCriteria);
        }

        // 库存筛选
        if (searchDTO.getHasStock() != null && searchDTO.getHasStock()) {
            criteria.and(new Criteria("stock").greaterThan(0));
        }

        // 状态筛选（只显示上架商品）
        criteria.and(new Criteria("status").is(1));
        criteria.and(new Criteria("delFlag").is(0));

        // 分页
        int pageNum = (int) page.getCurrent();
        int pageSize = (int) page.getSize();
        Pageable pageable = PageRequest.of(pageNum - 1, pageSize);

        // 构建查询
        CriteriaQuery criteriaQuery = new CriteriaQuery(criteria, pageable);

        // 执行查询
        SearchHits<ProductIndex> searchHits = elasticsearchOperations.search(criteriaQuery, ProductIndex.class);

        // 转换为Product对象
        List<Product> productList = new ArrayList<>();
        for (SearchHit<ProductIndex> hit : searchHits) {
            ProductIndex index = hit.getContent();
            Product product = new Product();
            product.setId(index.getId());
            product.setMerchantId(index.getMerchantId());
            product.setCategoryId(index.getCategoryId());
            product.setName(index.getName());
            product.setSubtitle(index.getSubtitle());
            product.setPrice(index.getPrice());
            product.setOriginalPrice(index.getOriginalPrice());
            product.setStock(index.getStock());
            product.setSales(index.getSales());
            product.setStatus(index.getStatus());
            product.setSortOrder(index.getSortOrder());
            product.setCreateTime(index.getCreateTime());
            product.setUpdateTime(index.getUpdateTime());
            product.setDelFlag(index.getDelFlag());
            product.setDetail(index.getDetail());
            product.setImages(index.getImages());
            productList.add(product);
        }

        // 构建返回的分页对象
        Page<Product> resultPage = new Page<>(pageNum, pageSize);
        resultPage.setRecords(productList);
        resultPage.setTotal(searchHits.getTotalHits());

        return resultPage;
    }

    /**
     * 高级搜索商品
     * @param searchDTO 搜索条件
     * @return 分页搜索结果
     */
    public Page<ProductIndex> advancedSearch(ProductSearchDTO searchDTO) {
        // 构建查询条件
        Criteria criteria = new Criteria();

        // 关键字搜索（名称、副标题、详情）
        if (searchDTO.getKeyword() != null && !searchDTO.getKeyword().isEmpty()) {
            String keyword = searchDTO.getKeyword();
            criteria.or(new Criteria("name").contains(keyword))
                   .or(new Criteria("subtitle").contains(keyword))
                   .or(new Criteria("detail").contains(keyword));
        }

        // 分类筛选
        if (searchDTO.getCategoryId() != null) {
            criteria.and(new Criteria("categoryId").is(searchDTO.getCategoryId()));
        }

        // 价格区间筛选
        if (searchDTO.getMinPrice() != null || searchDTO.getMaxPrice() != null) {
            Criteria priceCriteria = new Criteria("price");
            if (searchDTO.getMinPrice() != null) {
                priceCriteria.greaterThanEqual(searchDTO.getMinPrice());
            }
            if (searchDTO.getMaxPrice() != null) {
                priceCriteria.lessThanEqual(searchDTO.getMaxPrice());
            }
            criteria.and(priceCriteria);
        }

        // 库存筛选
        if (searchDTO.getHasStock() != null && searchDTO.getHasStock()) {
            criteria.and(new Criteria("stock").greaterThan(0));
        }

        // 状态筛选（只显示上架商品）
        criteria.and(new Criteria("status").is(1));
        criteria.and(new Criteria("delFlag").is(0));

        // 设置分页
        int pageNum = searchDTO.getPageNum() != null ? searchDTO.getPageNum() : 1;
        int pageSize = searchDTO.getPageSize() != null ? searchDTO.getPageSize() : 10;
        Pageable pageable = PageRequest.of(pageNum - 1, pageSize);

        // 构建查询
        CriteriaQuery criteriaQuery = new CriteriaQuery(criteria, pageable);

        // 执行查询
        SearchHits<ProductIndex> searchHits = elasticsearchOperations.search(criteriaQuery, ProductIndex.class);

        // 转换结果
        List<ProductIndex> productIndexList = searchHits.stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());

        // 封装成Page对象
        Page<ProductIndex> productIndexPage = new Page<>(pageNum, pageSize);
        productIndexPage.setRecords(productIndexList);
        productIndexPage.setTotal(searchHits.getTotalHits());

        return productIndexPage;
    }

    /**
     * 批量保存商品索引
     * @param productIndices 商品索引列表
     * @return 保存结果列表
     */
    public List<ProductIndex> bulkSave(List<ProductIndex> productIndices) {
        Iterable<ProductIndex> result = elasticsearchOperations.save(productIndices);
        List<ProductIndex> list = new ArrayList<>();
        result.forEach(list::add);
        return list;
    }

    /**
     * 保存单个商品索引
     * @param productIndex 商品索引
     * @return 保存后的商品索引
     */
    public ProductIndex save(ProductIndex productIndex) {
        return elasticsearchOperations.save(productIndex);
    }

    /**
     * 删除商品索引
     * @param id 商品ID
     */
    public void deleteById(Long id) {
        elasticsearchOperations.delete(String.valueOf(id), ProductIndex.class);
    }

    /**
     * 批量删除商品索引
     * @param ids 商品ID列表
     */
    public void bulkDelete(List<Long> ids) {
        for (Long id : ids) {
            elasticsearchOperations.delete(id.toString(), ProductIndex.class);
        }
    }

    /**
     * 根据ID获取商品索引
     * @param id 商品ID
     * @return 商品索引
     */
    public ProductIndex getById(Long id) {
        return elasticsearchOperations.get(String.valueOf(id), ProductIndex.class);
    }

    /**
     * 搜索推荐商品
     * @param keyword 搜索关键字
     * @param limit 限制数量
     * @return 推荐商品列表
     */
    public List<ProductIndex> searchSuggestions(String keyword, Integer limit) {
        // 构建查询条件
        Criteria criteria = new Criteria();

        // 模糊匹配名称和副标题
        if (keyword != null && !keyword.isEmpty()) {
            criteria.or(new Criteria("name").contains(keyword))
                   .or(new Criteria("subtitle").contains(keyword));
        }

        criteria.and(new Criteria("status").is(1));
        criteria.and(new Criteria("delFlag").is(0));

        // 设置分页
        Pageable pageable = PageRequest.of(0, limit != null ? limit : 10);

        // 构建查询
        CriteriaQuery criteriaQuery = new CriteriaQuery(criteria, pageable);

        // 执行查询
        SearchHits<ProductIndex> searchHits = elasticsearchOperations.search(criteriaQuery, ProductIndex.class);

        return searchHits.stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
    }

    /**
     * 搜索相关商品
     * @param productId 当前商品ID
     * @param categoryId 分类ID
     * @param limit 限制数量
     * @return 相关商品列表
     */
    public List<ProductIndex> searchRelatedProducts(Long productId, Long categoryId, Integer limit) {
        // 构建查询条件
        Criteria criteria = new Criteria();

        // 排除当前商品
        criteria.and(new Criteria("id").not().is(productId));
        // 同一分类
        criteria.and(new Criteria("categoryId").is(categoryId));
        // 上架且未删除
        criteria.and(new Criteria("status").is(1));
        criteria.and(new Criteria("delFlag").is(0));

        // 设置分页
        Pageable pageable = PageRequest.of(0, limit != null ? limit : 10);

        // 构建查询
        CriteriaQuery criteriaQuery = new CriteriaQuery(criteria, pageable);

        // 执行查询
        SearchHits<ProductIndex> searchHits = elasticsearchOperations.search(criteriaQuery, ProductIndex.class);

        return searchHits.stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
    }
}
