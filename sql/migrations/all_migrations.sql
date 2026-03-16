-- =====================================================
-- 黑科易购数据库迁移脚本
-- 执行顺序：按文件编号顺序执行
-- =====================================================

-- 数据库名
USE heikeji_mall;

-- =====================================================
-- 迁移 001: 创建评价点赞表
-- 文件: sql/migrations/create_product_comment_like_table.sql
-- =====================================================

-- 创建商品评价点赞表
CREATE TABLE IF NOT EXISTS `product_comment_like` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `comment_id` bigint(20) NOT NULL COMMENT '评价ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_comment_user` (`comment_id`, `user_id`) COMMENT '每个用户对每条评价只能点赞一次',
  KEY `idx_comment_id` (`comment_id`) COMMENT '根据评价ID查询点赞记录',
  KEY `idx_user_id` (`user_id`) COMMENT '根据用户ID查询点赞记录',
  KEY `idx_create_time` (`create_time`) COMMENT '根据创建时间查询点赞记录'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品评价点赞表';

-- 检查并添加字段（如果表存在且字段不存在）
-- ALTER TABLE `product_comment` ADD COLUMN `like_count` int(11) NOT NULL DEFAULT 0 COMMENT '点赞数量' AFTER `reply_time`;
-- ALTER TABLE `product_comment_stats` ADD COLUMN `total_like_count` int(11) NOT NULL DEFAULT 0 COMMENT '总点赞数量' AFTER `has_image_count`;

SELECT 'Migration 001: product_comment_like table created successfully' AS result;

-- =====================================================
-- 迁移 002: 创建订单评价表
-- 文件: sql/migrations/create_order_review_table.sql
-- =====================================================

-- 创建订单评价表
CREATE TABLE IF NOT EXISTS `order_review` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_no` varchar(50) NOT NULL COMMENT '订单编号',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `product_id` bigint(20) NOT NULL COMMENT '商品ID',
  `rating` tinyint(4) NOT NULL COMMENT '评分（1-5星）',
  `content` text COMMENT '评价内容',
  `images` text COMMENT '评价图片（JSON格式存储图片URL列表）',
  `product_name` varchar(200) DEFAULT NULL COMMENT '商品名称（冗余字段）',
  `product_image` varchar(500) DEFAULT NULL COMMENT '商品图片（冗余字段）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评价时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单评价表';

SELECT 'Migration 002: order_review table created successfully' AS result;

-- =====================================================
-- 迁移 003: 添加商品表索引
-- 文件: sql/migrations/add_product_indexes.sql
-- =====================================================

-- 为商品表添加常用索引
-- ALTER TABLE `product` ADD INDEX `idx_category_status` (`category_id`, `status`);
-- ALTER TABLE `product` ADD INDEX `idx_store_id` (`store_id`);
-- ALTER TABLE `product` ADD INDEX `idx_create_time` (`create_time`);

-- 为商品评价表添加索引
-- ALTER TABLE `product_comment` ADD INDEX `idx_product_id` (`product_id`);
-- ALTER TABLE `product_comment` ADD INDEX `idx_user_id` (`user_id`);
-- ALTER TABLE `product_comment` ADD INDEX `idx_create_time` (`create_time`);

SELECT 'Migration 003: product indexes ready (execute manually if needed)' AS result;

-- =====================================================
-- 迁移 004: 添加订单表索引
-- 文件: sql/migrations/add_order_indexes.sql
-- =====================================================

-- 为订单表添加常用索引
-- ALTER TABLE `order` ADD INDEX `idx_user_id` (`user_id`);
-- ALTER TABLE `order` ADD INDEX `idx_order_no` (`order_no`);
-- ALTER TABLE `order` ADD INDEX `idx_status` (`status`);
-- ALTER TABLE `order` ADD INDEX `idx_create_time` (`create_time`);

-- 为订单明细表添加索引
-- ALTER TABLE `order_item` ADD INDEX `idx_order_id` (`order_id`);
-- ALTER TABLE `order_item` ADD INDEX `idx_product_id` (`product_id`);

SELECT 'Migration 004: order indexes ready (execute manually if needed)' AS result;

-- =====================================================
-- 迁移 005: 添加通用索引
-- 文件: sql/migrations/add_common_indexes.sql
-- =====================================================

-- 为用户地址表添加索引
-- ALTER TABLE `user_address` ADD INDEX `idx_user_id` (`user_id`);

-- 为购物车表添加索引
-- ALTER TABLE `cart` ADD INDEX `idx_user_id` (`user_id`);
-- ALTER TABLE `cart` ADD INDEX `idx_product_id` (`product_id`);

-- 为门店表添加索引
-- ALTER TABLE `store` ADD INDEX `idx_status` (`status`);

SELECT 'Migration 005: common indexes ready (execute manually if needed)' AS result;

-- =====================================================
-- 迁移完成记录
-- =====================================================

-- 记录迁移版本
INSERT INTO schema_version (version, description)
VALUES ('2026.03.13.001', 'Database migration: add review and like tables')
ON DUPLICATE KEY UPDATE description = VALUES(description);

SELECT * FROM schema_version ORDER BY applied_at DESC LIMIT 5;

-- =====================================================
-- 执行完成
-- =====================================================

SELECT '========================================' AS '';
SELECT '所有迁移脚本执行完成！' AS message;
SELECT '========================================' AS '';
