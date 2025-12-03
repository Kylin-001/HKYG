-- 支付日志表
CREATE TABLE IF NOT EXISTS `payment_log` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `payment_no` VARCHAR(100) NOT NULL COMMENT '支付单号',
  `action` VARCHAR(50) NOT NULL COMMENT '操作类型',
  `content` TEXT DEFAULT NULL COMMENT '日志内容',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_payment_no` (`payment_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付日志表';
