-- 优惠券模板表
CREATE TABLE IF NOT EXISTS `coupon_template` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '模板ID',
  `name` VARCHAR(100) NOT NULL COMMENT '优惠券名称',
  `type` VARCHAR(50) NOT NULL COMMENT '类型:fixed-满减,percentage-折扣,shipping-免邮',
  `discount_value` DECIMAL(10,2) NOT NULL COMMENT '优惠值',
  `min_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '最低使用金额',
  `max_discount` DECIMAL(10,2) DEFAULT NULL COMMENT '最大优惠金额',
  `total_count` INT NOT NULL COMMENT '发放总量',
  `used_count` INT DEFAULT 0 COMMENT '已使用数量',
  `per_limit` INT DEFAULT 1 COMMENT '每人限领数量',
  `valid_type` VARCHAR(50) NOT NULL COMMENT '有效期类型:fixed-固定日期,relative-相对天数',
  `valid_days` INT DEFAULT NULL COMMENT '有效天数',
  `start_time` TIMESTAMP NULL DEFAULT NULL COMMENT '开始时间',
  `end_time` TIMESTAMP NULL DEFAULT NULL COMMENT '结束时间',
  `category_ids` TEXT DEFAULT NULL COMMENT '适用分类ID列表',
  `product_ids` TEXT DEFAULT NULL COMMENT '适用商品ID列表',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:0-未开始,1-进行中,2-已结束',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券模板表';

-- 用户优惠券表
CREATE TABLE IF NOT EXISTS `user_coupon` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `template_id` BIGINT NOT NULL COMMENT '模板ID',
  `coupon_code` VARCHAR(50) NOT NULL COMMENT '优惠券码',
  `status` VARCHAR(50) DEFAULT 'unused' COMMENT '状态:unused-未使用,used-已使用,expired-已过期',
  `receive_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '领取时间',
  `use_time` TIMESTAMP NULL DEFAULT NULL COMMENT '使用时间',
  `order_id` BIGINT DEFAULT NULL COMMENT '使用订单ID',
  `start_time` TIMESTAMP NOT NULL COMMENT '开始时间',
  `end_time` TIMESTAMP NOT NULL COMMENT '结束时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`coupon_code`),
  KEY `idx_user_status` (`user_id`, `status`),
  KEY `idx_template` (`template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券表';
