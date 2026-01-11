-- 优化商品表索引
-- 添加缺失的索引，提高高频查询的性能

-- 1. 针对商家ID查询的索引
CREATE INDEX IF NOT EXISTS idx_product_merchant_id ON product(merchant_id);

-- 2. 针对新品查询的索引
CREATE INDEX IF NOT EXISTS idx_product_is_new ON product(is_new);

-- 3. 针对推荐商品查询的索引
CREATE INDEX IF NOT EXISTS idx_product_is_recommend ON product(is_recommend);

-- 4. 针对销量查询的索引
CREATE INDEX IF NOT EXISTS idx_product_sales ON product(sales);

-- 5. 针对状态和删除标记的复合索引
CREATE INDEX IF NOT EXISTS idx_product_status_del_flag ON product(status, del_flag);

-- 6. 针对分类和状态的复合索引
CREATE INDEX IF NOT EXISTS idx_product_category_id_status ON product(category_id, status, del_flag);

-- 7. 针对商家和状态的复合索引
CREATE INDEX IF NOT EXISTS idx_product_merchant_id_status ON product(merchant_id, status, del_flag);

-- 8. 针对新品和状态的复合索引
CREATE INDEX IF NOT EXISTS idx_product_is_new_status ON product(is_new, status, del_flag, create_time);

-- 9. 针对推荐和状态的复合索引
CREATE INDEX IF NOT EXISTS idx_product_is_recommend_status ON product(is_recommend, status, del_flag, sales);

-- 10. 针对价格范围查询的索引
CREATE INDEX IF NOT EXISTS idx_product_price ON product(price);

-- 11. 针对库存预警的索引
CREATE INDEX IF NOT EXISTS idx_product_alert_stock ON product(alert_stock, stock, status, del_flag);

-- 12. 针对更新时间排序的索引
CREATE INDEX IF NOT EXISTS idx_product_update_time ON product(update_time);

-- 13. 针对创建时间排序的索引
CREATE INDEX IF NOT EXISTS idx_product_create_time ON product(create_time);

-- 14. 针对多条件查询的复合索引（用于高级搜索）
CREATE INDEX IF NOT EXISTS idx_product_advanced_search ON product(
    del_flag,
    status,
    category_id,
    merchant_id,
    price
);

-- 15. 针对个性化推荐的复合索引
CREATE INDEX IF NOT EXISTS idx_product_personalized ON product(
    del_flag,
    status,
    category_id,
    sales,
    is_recommend
);