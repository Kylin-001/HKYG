-- 营销系统数据库表结构
-- 包含：优惠券、积分、会员等级、营销活动等表

-- 优惠券表
CREATE TABLE IF NOT EXISTS `coupon` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '优惠券ID',
  `name` VARCHAR(100) NOT NULL COMMENT '优惠券名称',
  `coupon_code` VARCHAR(50) NOT NULL COMMENT '优惠券码',
  `type` TINYINT NOT NULL COMMENT '类型：1-满减券，2-折扣券',
  `value` DECIMAL(10,2) NOT NULL COMMENT '优惠金额/折扣值',
  `discount` DECIMAL(3,2) COMMENT '折扣率（折扣券使用）',
  `min_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '最低使用金额',
  `max_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '最高优惠金额',
  `start_time` DATETIME NOT NULL COMMENT '开始时间',
  `end_time` DATETIME NOT NULL COMMENT '结束时间',
  `total_count` INT NOT NULL COMMENT '发行总量',
  `used_count` INT DEFAULT 0 COMMENT '已使用数量',
  `per_user_limit` INT DEFAULT 1 COMMENT '每人限领数量',
  `status` TINYINT DEFAULT 0 COMMENT '状态：0-正常，1-已失效',
  `description` VARCHAR(500) COMMENT '使用说明',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_coupon_code` (`coupon_code`),
  KEY `idx_status_time` (`status`, `start_time`, `end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券表';

-- 用户优惠券表
CREATE TABLE IF NOT EXISTS `user_coupon` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `coupon_id` BIGINT NOT NULL COMMENT '优惠券ID',
  `status` TINYINT DEFAULT 0 COMMENT '状态：0-未使用，1-已使用，2-已过期',
  `used_at` DATETIME COMMENT '使用时间',
  `order_no` VARCHAR(50) COMMENT '关联订单号',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_coupon_id` (`coupon_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券表';

-- 积分记录表
CREATE TABLE IF NOT EXISTS `point_record` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `points` INT NOT NULL COMMENT '积分变动（正数为增加，负数为减少）',
  `balance` INT NOT NULL COMMENT '变动后余额',
  `type` TINYINT NOT NULL COMMENT '类型：1-订单消费，2-签到，3-活动奖励，4-积分兑换，5-系统调整',
  `source` VARCHAR(50) COMMENT '来源描述',
  `order_no` VARCHAR(50) COMMENT '关联订单号',
  `remark` VARCHAR(200) COMMENT '备注',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分记录表';

-- 积分规则表
CREATE TABLE IF NOT EXISTS `point_rule` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `type` TINYINT NOT NULL COMMENT '类型：1-订单消费，2-签到，3-活动奖励',
  `rule_name` VARCHAR(100) NOT NULL COMMENT '规则名称',
  `points` INT NOT NULL COMMENT '积分值',
  `rule_config` JSON COMMENT '规则配置',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分规则表';

-- 积分商品表
CREATE TABLE IF NOT EXISTS `point_product` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `image` VARCHAR(500) COMMENT '商品图片',
  `points` INT NOT NULL COMMENT '所需积分',
  `stock` INT NOT NULL COMMENT '库存',
  `sold_count` INT DEFAULT 0 COMMENT '已兑换数量',
  `description` TEXT COMMENT '商品描述',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-下架，1-上架',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分商品表';

-- 会员等级表
CREATE TABLE IF NOT EXISTS `member_level` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT '等级名称',
  `min_points` INT NOT NULL COMMENT '最低积分',
  `max_points` INT COMMENT '最高积分',
  `discount` DECIMAL(3,2) NOT NULL COMMENT '折扣系数',
  `description` VARCHAR(200) COMMENT '等级描述',
  `privileges` JSON COMMENT '等级权益',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_points_range` (`min_points`, `max_points`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员等级表';

-- 用户等级记录表
CREATE TABLE IF NOT EXISTS `user_level_record` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `level_id` BIGINT NOT NULL COMMENT '等级ID',
  `points` INT NOT NULL COMMENT '升级时积分',
  `upgrade_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '升级时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户等级记录表';

-- 营销活动表
CREATE TABLE IF NOT EXISTS `marketing_activity` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL COMMENT '活动名称',
  `type` TINYINT NOT NULL COMMENT '活动类型：1-优惠券活动，2-积分活动，3-满减活动',
  `start_time` DATETIME NOT NULL COMMENT '开始时间',
  `end_time` DATETIME NOT NULL COMMENT '结束时间',
  `status` TINYINT DEFAULT 0 COMMENT '状态：0-未开始，1-进行中，2-已结束',
  `config` JSON COMMENT '活动配置',
  `description` TEXT COMMENT '活动描述',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status_time` (`status`, `start_time`, `end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='营销活动表';

-- 用户活动参与记录表
CREATE TABLE IF NOT EXISTS `user_activity_record` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `activity_id` BIGINT NOT NULL COMMENT '活动ID',
  `reward_type` TINYINT COMMENT '奖励类型：1-积分，2-优惠券，3-商品',
  `reward_value` VARCHAR(100) COMMENT '奖励值',
  `status` TINYINT DEFAULT 0 COMMENT '状态：0-未完成，1-已完成',
  `complete_time` DATETIME COMMENT '完成时间',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_activity_id` (`activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户活动参与记录表';
