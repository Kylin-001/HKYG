package com.heikeji.mall.product.repository;

import com.heikeji.mall.product.document.ProductIndex;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

/**
 * Elasticsearch 商品操作接口
 */
@Repository
public interface ProductElasticsearchRepository extends ElasticsearchRepository<ProductIndex, Long> {
}
