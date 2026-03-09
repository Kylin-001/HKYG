-- 积分规则表
CREATE TABLE IF NOT EXISTS `points_rule` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '规则ID',
  `name` VARCHAR(100) NOT NULL COMMENT '规则名称',
  `type` VARCHAR(50) NOT NULL COMMENT '规则类型:sign-签到,consume-消费,review-评价,invite-邀请,activity-活动',
  `points` INT NOT NULL COMMENT '积分数量',
  `max_points` INT DEFAULT NULL COMMENT '最大积分限制',
  `condition` TEXT DEFAULT NULL COMMENT '条件(JSON)',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:1-启用,0-禁用',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分规则表';

-- 用户积分表
CREATE TABLE IF NOT EXISTS `user_points` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `total_points` INT DEFAULT 0 COMMENT '总积分',
  `available_points` INT DEFAULT 0 COMMENT '可用积分',
  `frozen_points` INT DEFAULT 0 COMMENT '冻结积分',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户积分表';

-- 积分记录表
CREATE TABLE IF NOT EXISTS `points_record` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `type` VARCHAR(50) NOT NULL COMMENT '类型:earn-获取,consume-消费,expire-过期',
  `points` INT NOT NULL COMMENT '积分数量(正为获取,负为消费)',
  `balance` INT NOT NULL COMMENT '变动后余额',
  `rule_id` BIGINT DEFAULT NULL COMMENT '规则ID',
  `order_id` BIGINT DEFAULT NULL COMMENT '关联订单ID',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_time` (`user_id`, `created_at`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分记录表';
