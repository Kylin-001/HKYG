-- 数据库性能优化脚本
-- 目标：提升查询性能30%以上

-- 1. 分析表结构并优化索引
-- 2. 添加复合索引优化常用查询
-- 3. 优化表结构
-- 4. 添加分区表支持大数据量

-- ========================================
-- 用户相关表优化
-- ========================================

-- 用户表优化
-- 添加复合索引优化用户查询
ALTER TABLE `user` ADD INDEX `idx_status_create_time` (`status`, `create_time` DESC) COMMENT '状态-创建时间复合索引';
ALTER TABLE `user` ADD INDEX `idx_phone_status` (`phone`, `status`) COMMENT '手机号-状态复合索引';
ALTER TABLE `user` ADD INDEX `idx_email_status` (`email`, `status`) COMMENT '邮箱-状态复合索引';
ALTER TABLE `user` ADD INDEX `idx_campus_status` (`campus_id`, `status`) COMMENT '校区-状态复合索引';

-- 用户认证表优化
ALTER TABLE `user_auth` ADD INDEX `idx_user_type` (`user_id`, `auth_type`) COMMENT '用户-认证类型复合索引';
ALTER TABLE `user_auth` ADD INDEX `idx_identifier_type` (`identifier`, `auth_type`) COMMENT '标识符-认证类型复合索引';

-- 用户地址表优化
ALTER TABLE `user_address` ADD INDEX `idx_user_default` (`user_id`, `is_default`) COMMENT '用户-默认地址复合索引';
ALTER TABLE `user_address` ADD INDEX `idx_user_campus` (`user_id`, `campus_id`) COMMENT '用户-校区复合索引';

-- ========================================
-- 商品相关表优化
-- ========================================

-- 商品表优化
-- 添加复合索引优化商品查询
ALTER TABLE `product` ADD INDEX `idx_category_status_sales` (`category_id`, `status`, `sales` DESC) COMMENT '分类-状态-销量复合索引';
ALTER TABLE `product` ADD INDEX `idx_merchant_status_sales` (`merchant_id`, `status`, `sales` DESC) COMMENT '商家-状态-销量复合索引';
ALTER TABLE `product` ADD INDEX `idx_status_price_range` (`status`, `price`) COMMENT '状态-价格范围复合索引';
ALTER TABLE `product` ADD INDEX `idx_status_create_time` (`status`, `create_time` DESC) COMMENT '状态-创建时间复合索引';
ALTER TABLE `product` ADD INDEX `idx_hot_new_status` (`is_hot`, `is_new`, `status`) COMMENT '热门-新品-状态复合索引';

-- 商品分类表优化
ALTER TABLE `category` ADD INDEX `idx_parent_status` (`parent_id`, `status`) COMMENT '父分类-状态复合索引';
ALTER TABLE `category` ADD INDEX `idx_level_status` (`level`, `status`) COMMENT '级别-状态复合索引';

-- 商品图片表优化
ALTER TABLE `product_image` ADD INDEX `idx_product_sort` (`product_id`, `sort_order`) COMMENT '商品-排序复合索引';

-- ========================================
-- 订单相关表优化
-- ========================================

-- 订单表优化
-- 添加复合索引优化订单查询
ALTER TABLE `order` ADD INDEX `idx_user_status_time` (`user_id`, `status`, `create_time` DESC) COMMENT '用户-状态-时间复合索引';
ALTER TABLE `order` ADD INDEX `idx_status_pay_time` (`status`, `pay_status`, `create_time` DESC) COMMENT '状态-支付状态-时间复合索引';
ALTER TABLE `order` ADD INDEX `idx_delivery_status_time` (`delivery_type`, `status`, `create_time` DESC) COMMENT '配送类型-状态-时间复合索引';
ALTER TABLE `order` ADD INDEX `idx_merchant_status_time` (`merchant_id`, `status`, `create_time` DESC) COMMENT '商家-状态-时间复合索引';

-- 订单项表优化
ALTER TABLE `order_item` ADD INDEX `idx_order_product` (`order_no`, `product_id`) COMMENT '订单-商品复合索引';
ALTER TABLE `order_item` ADD INDEX `idx_product_time` (`product_id`, `create_time` DESC) COMMENT '商品-时间复合索引';

-- ========================================
-- 购物车相关表优化
-- ========================================

-- 购物车表优化
ALTER TABLE `cart` ADD INDEX `idx_user_product` (`user_id`, `product_id`) COMMENT '用户-商品复合索引';
ALTER TABLE `cart` ADD INDEX `idx_user_update_time` (`user_id`, `update_time` DESC) COMMENT '用户-更新时间复合索引';
ALTER TABLE `cart` ADD INDEX `idx_product_status` (`product_id`, `status`) COMMENT '商品-状态复合索引';

-- ========================================
-- 支付相关表优化
-- ========================================

-- 支付表优化
ALTER TABLE `payment` ADD INDEX `idx_order_status_time` (`order_no`, `status`, `create_time` DESC) COMMENT '订单-状态-时间复合索引';
ALTER TABLE `payment` ADD INDEX `idx_type_status_time` (`payment_type`, `status`, `create_time` DESC) COMMENT '支付类型-状态-时间复合索引';
ALTER TABLE `payment` ADD INDEX `idx_transaction_status` (`transaction_id`, `status`) COMMENT '交易号-状态复合索引';

-- ========================================
-- 配送相关表优化
-- ========================================

-- 配送表优化
ALTER TABLE `delivery` ADD INDEX `idx_order_status_time` (`order_id`, `status`, `create_time` DESC) COMMENT '订单-状态-时间复合索引';
ALTER TABLE `delivery` ADD INDEX `idx_person_status_time` (`delivery_person_id`, `status`, `create_time` DESC) COMMENT '配送员-状态-时间复合索引';

-- 外卖柜表优化
ALTER TABLE `locker` ADD INDEX `idx_campus_status_available` (`campus_id`, `status`, `available_cells`) COMMENT '校区-状态-可用格口复合索引';

-- ========================================
-- 营销相关表优化
-- ========================================

-- 优惠券表优化
ALTER TABLE `coupon` ADD INDEX `idx_type_status_time` (`type`, `status`, `create_time` DESC) COMMENT '类型-状态-时间复合索引';
ALTER TABLE `coupon` ADD INDEX `idx_user_status_time` (`user_id`, `status`, `create_time` DESC) COMMENT '用户-状态-时间复合索引';

-- 会员等级表优化
ALTER TABLE `member_level` ADD INDEX `idx_status_sort` (`status`, `sort_order`) COMMENT '状态-排序复合索引';

-- ========================================
-- 系统相关表优化
-- ========================================

-- 系统日志表优化
ALTER TABLE `system_log` ADD INDEX `idx_user_type_time` (`user_id`, `log_type`, `create_time` DESC) COMMENT '用户-类型-时间复合索引';
ALTER TABLE `system_log` ADD INDEX `idx_type_time` (`log_type`, `create_time` DESC) COMMENT '类型-时间复合索引';

-- 系统配置表优化
ALTER TABLE `system_config` ADD INDEX `idx_key_status` (`config_key`, `status`) COMMENT '键-状态复合索引';

-- ========================================
-- 分区表优化（适用于大数据量场景）
-- ========================================

-- 订单表按月分区（如果数据量大）
-- ALTER TABLE `order` PARTITION BY RANGE (YEAR(create_time) * 100 + MONTH(create_time)) (
--   PARTITION p202301 VALUES LESS THAN (202302),
--   PARTITION p202302 VALUES LESS THAN (202303),
--   PARTITION p202303 VALUES LESS THAN (202304),
--   -- 继续添加更多分区...
--   PARTITION pmax VALUES LESS THAN MAXVALUE
-- );

-- 系统日志表按月分区
-- ALTER TABLE `system_log` PARTITION BY RANGE (YEAR(create_time) * 100 + MONTH(create_time)) (
--   PARTITION p202301 VALUES LESS THAN (202302),
--   PARTITION p202302 VALUES LESS THAN (202303),
--   PARTITION p202303 VALUES LESS THAN (202304),
--   -- 继续添加更多分区...
--   PARTITION pmax VALUES LESS THAN MAXVALUE
-- );

-- ========================================
-- 表结构优化
-- ========================================

-- 优化商品表字段类型
ALTER TABLE `product` MODIFY COLUMN `description` TEXT COMMENT '商品描述';
ALTER TABLE `product` MODIFY COLUMN `details` LONGTEXT COMMENT '商品详情';

-- 优化用户表字段类型
ALTER TABLE `user` MODIFY COLUMN `avatar` VARCHAR(500) COMMENT '头像URL';

-- 优化订单表字段类型
ALTER TABLE `order` MODIFY COLUMN `remark` VARCHAR(500) COMMENT '订单备注';

-- ========================================
-- 查询优化提示
-- ========================================

-- 1. 避免SELECT *，只查询需要的字段
-- 2. 使用LIMIT限制返回结果数量
-- 3. 避免在WHERE子句中对字段进行函数操作
-- 4. 使用EXISTS替代IN子查询
-- 5. 避免使用OR，使用UNION替代
-- 6. 使用JOIN替代子查询
-- 7. 避免在索引列上使用NOT、<>、!=等操作
-- 8. 使用批量插入替代单条插入
-- 9. 合理使用事务，避免长事务
-- 10. 定期分析表和优化表

-- ========================================
-- 性能监控
-- ========================================

-- 创建慢查询日志表
CREATE TABLE IF NOT EXISTS `slow_query_log` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `query_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '查询时间',
  `duration` FLOAT NOT NULL COMMENT '执行时间(秒)',
  `sql_text` TEXT NOT NULL COMMENT 'SQL语句',
  `db_name` VARCHAR(64) DEFAULT NULL COMMENT '数据库名',
  `table_name` VARCHAR(64) DEFAULT NULL COMMENT '表名',
  INDEX `idx_query_time` (`query_time`),
  INDEX `idx_duration` (`duration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='慢查询日志表';

-- 创建表统计信息表
CREATE TABLE IF NOT EXISTS `table_stats` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `table_name` VARCHAR(64) NOT NULL COMMENT '表名',
  `table_rows` BIGINT DEFAULT NULL COMMENT '表行数',
  `data_length` BIGINT DEFAULT NULL COMMENT '数据长度',
  `index_length` BIGINT DEFAULT NULL COMMENT '索引长度',
  `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `uk_table_name` (`table_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='表统计信息表';

-- ========================================
-- 定期维护任务
-- ========================================

-- 1. 定期分析表
-- ANALYZE TABLE `user`, `product`, `order`, `cart`, `payment`;

-- 2. 定期优化表
-- OPTIMIZE TABLE `user`, `product`, `order`, `cart`, `payment`;

-- 3. 定期检查表
-- CHECK TABLE `user`, `product`, `order`, `cart`, `payment`;

-- 4. 定期清理过期数据
-- DELETE FROM `slow_query_log` WHERE `query_time` < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- ========================================
-- 性能优化完成提示
-- ========================================

-- 执行完此脚本后，请执行以下步骤：
-- 1. 重启数据库服务使索引生效
-- 2. 执行ANALYZE TABLE更新统计信息
-- 3. 监控慢查询日志，进一步优化
-- 4. 根据实际查询模式调整索引
-- 5. 配置Redis缓存策略

SELECT '数据库索引优化完成！' AS message;