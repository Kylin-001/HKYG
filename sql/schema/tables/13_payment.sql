-- 支付表
CREATE TABLE IF NOT EXISTS `payment` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '支付ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `payment_no` VARCHAR(100) NOT NULL COMMENT '支付单号',
  `pay_amount` DECIMAL(10,2) NOT NULL COMMENT '支付金额',
  `pay_type` TINYINT(1) NOT NULL COMMENT '支付方式',
  `status` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '支付状态',
  `transaction_id` VARCHAR(100) DEFAULT NULL COMMENT '交易单号',
  `pay_time` TIMESTAMP NULL DEFAULT NULL COMMENT '支付时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_payment_no` (`payment_no`),
  KEY `idx_order_id` (`order_id`),
  CONSTRAINT `fk_payment_order_id` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付表';
