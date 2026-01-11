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

-- 在商品评价表中添加点赞数量字段
ALTER TABLE `product_comment` ADD COLUMN `like_count` int(11) NOT NULL DEFAULT 0 COMMENT '点赞数量' AFTER `reply_time`;

-- 在商品评价统计中添加总点赞数量字段
ALTER TABLE `product_comment_stats` ADD COLUMN `total_like_count` int(11) NOT NULL DEFAULT 0 COMMENT '总点赞数量' AFTER `has_image_count`;
