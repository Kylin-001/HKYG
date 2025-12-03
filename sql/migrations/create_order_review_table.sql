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

-- 添加表注释
ALTER TABLE `order_review` COMMENT='订单评价表';

-- 添加索引以优化查询性能
CREATE INDEX IF NOT EXISTS `idx_order_user` ON `order_review` (`order_no`, `user_id`);
CREATE INDEX IF NOT EXISTS `idx_product_rating` ON `order_review` (`product_id`, `rating`);