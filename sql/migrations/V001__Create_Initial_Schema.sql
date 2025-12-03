-- ================================
-- 黑科易购项目数据库迁移脚本
-- 版本: V001
-- 描述: 创建初始数据库架构
-- 日期: 2025-11-18
-- ================================

-- 禁用外键检查
SET FOREIGN_KEY_CHECKS = 0;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `heikeji_mall` DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

USE `heikeji_mall`;

-- 创建版本记录表
CREATE TABLE IF NOT EXISTS `schema_version` (
  `version` VARCHAR(50) NOT NULL,
  `description` VARCHAR(200) NOT NULL,
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`version`)
);

-- 记录当前版本
INSERT INTO `schema_version` (`version`, `description`) VALUES ('V001', '创建初始数据库架构');

-- 用户表
CREATE TABLE `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `student_no` VARCHAR(20) NOT NULL UNIQUE COMMENT '学号',
  `nickname` VARCHAR(50) NOT NULL COMMENT '昵称',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `gender` TINYINT DEFAULT 0 COMMENT '性别 0-未知 1-男 2-女',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `status` TINYINT DEFAULT 0 COMMENT '状态 0-正常 1-禁用',
  `balance` DECIMAL(10,2) DEFAULT 0.00 COMMENT '账户余额',
  `score` INT DEFAULT 0 COMMENT '积分',
  `campus_id` BIGINT DEFAULT NULL COMMENT '校区ID',
  `dorm_building_id` BIGINT DEFAULT NULL COMMENT '宿舍楼ID',
  `dorm_room_no` VARCHAR(20) DEFAULT NULL COMMENT '宿舍号',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `del_flag` TINYINT DEFAULT 0 COMMENT '删除标志 0-未删除 1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_student_no` (`student_no`),
  KEY `idx_phone` (`phone`),
  KEY `idx_status` (`status`),
  KEY `idx_campus_id` (`campus_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 用户认证表
CREATE TABLE `user_auth` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '认证ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `open_id` VARCHAR(100) NOT NULL COMMENT '微信OpenID',
  `union_id` VARCHAR(100) DEFAULT NULL COMMENT '微信UnionID',
  `session_key` VARCHAR(100) DEFAULT NULL COMMENT '会话密钥',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_open_id` (`open_id`),
  KEY `idx_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户认证表';

-- 用户地址表
CREATE TABLE `address` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `consignee` VARCHAR(50) NOT NULL COMMENT '收货人',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `province` VARCHAR(50) NOT NULL COMMENT '省份',
  `city` VARCHAR(50) NOT NULL COMMENT '城市',
  `district` VARCHAR(50) NOT NULL COMMENT '区县',
  `detail_address` VARCHAR(200) NOT NULL COMMENT '详细地址',
  `is_default` TINYINT DEFAULT 0 COMMENT '是否默认 0-否 1-是',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `campus_id` BIGINT DEFAULT NULL COMMENT '校区ID',
  `delivery_point_id` BIGINT DEFAULT NULL COMMENT '配送点ID',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_campus_id` (`campus_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户地址表';

-- 商家表
CREATE TABLE `merchant` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '商家ID',
  `name` VARCHAR(100) NOT NULL COMMENT '商家名称',
  `type` TINYINT DEFAULT 0 COMMENT '商家类型 0-普通商家 1-校园商家',
  `description` TEXT COMMENT '商家描述',
  `logo` VARCHAR(255) DEFAULT NULL COMMENT '商家logo',
  `phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `address` VARCHAR(200) NOT NULL COMMENT '商家地址',
  `business_hours` VARCHAR(200) DEFAULT NULL COMMENT '营业时间',
  `status` TINYINT DEFAULT 0 COMMENT '状态 0-营业中 1-暂停营业',
  `rating` DECIMAL(3,2) DEFAULT 0.00 COMMENT '评分',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `del_flag` TINYINT DEFAULT 0 COMMENT '删除标志',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商家表';

-- 商品分类表
CREATE TABLE `category` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `parent_id` BIGINT DEFAULT 0 COMMENT '父分类ID',
  `icon` VARCHAR(255) DEFAULT NULL COMMENT '分类图标',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `del_flag` TINYINT DEFAULT 0 COMMENT '删除标志',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类表';

-- 商品表
CREATE TABLE `product` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `category_id` BIGINT NOT NULL COMMENT '分类ID',
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID',
  `price` DECIMAL(10,2) NOT NULL COMMENT '销售价格',
  `original_price` DECIMAL(10,2) DEFAULT NULL COMMENT '原价',
  `stock` INT DEFAULT 0 COMMENT '库存',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图片',
  `images` TEXT COMMENT '商品图片',
  `description` TEXT COMMENT '商品描述',
  `specifications` TEXT COMMENT '商品规格',
  `status` TINYINT DEFAULT 1 COMMENT '状态 0-下架 1-上架',
  `is_hot` TINYINT DEFAULT 0 COMMENT '是否热销 0-否 1-是',
  `is_new` TINYINT DEFAULT 0 COMMENT '是否新品 0-否 1-是',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `del_flag` TINYINT DEFAULT 0 COMMENT '删除标志',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_status` (`status`),
  KEY `idx_sales` (`sales`),
  KEY `idx_create_time` (`create_time`),
  FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`merchant_id`) REFERENCES `merchant` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- 购物车表
CREATE TABLE `cart` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '购物车ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `quantity` INT NOT NULL COMMENT '数量',
  `selected` TINYINT DEFAULT 1 COMMENT '是否选中 0-否 1-是',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_product` (`user_id`, `product_id`),
  KEY `idx_product_id` (`product_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

-- 订单表
CREATE TABLE `order` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL UNIQUE COMMENT '订单号',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID',
  `address_id` BIGINT NOT NULL COMMENT '地址ID',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  `delivery_fee` DECIMAL(10,2) DEFAULT 0.00 COMMENT '配送费',
  `actual_amount` DECIMAL(10,2) NOT NULL COMMENT '实际支付金额',
  `status` TINYINT DEFAULT 0 COMMENT '订单状态 0-待支付 1-已支付 2-已发货 3-已完成 4-已取消',
  `payment_type` TINYINT DEFAULT 0 COMMENT '支付方式 0-余额支付 1-微信支付 2-支付宝',
  `delivery_type` TINYINT DEFAULT 1 COMMENT '配送方式 1-自提 2-配送到家',
  `delivery_fee` DECIMAL(10,2) DEFAULT 0.00 COMMENT '配送费',
  `remark` TEXT COMMENT '备注',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `paid_time` DATETIME DEFAULT NULL COMMENT '支付时间',
  `delivery_time` DATETIME DEFAULT NULL COMMENT '发货时间',
  `completed_time` DATETIME DEFAULT NULL COMMENT '完成时间',
  `campus_id` BIGINT DEFAULT NULL COMMENT '校区ID',
  `delivery_point_id` BIGINT DEFAULT NULL COMMENT '配送点ID',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_order_no` (`order_no`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_user_status` (`user_id`, `status`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`merchant_id`) REFERENCES `merchant` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`address_id`) REFERENCES `address` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 订单商品表
CREATE TABLE `order_item` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '订单商品ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `product_name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '商品图片',
  `price` DECIMAL(10,2) NOT NULL COMMENT '商品价格',
  `quantity` INT NOT NULL COMMENT '数量',
  `total_price` DECIMAL(10,2) NOT NULL COMMENT '小计',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`),
  FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单商品表';

-- 跑腿需求表
CREATE TABLE `delivery_request` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '跑腿需求ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID',
  `pickup_address` VARCHAR(200) NOT NULL COMMENT '取货地址',
  `delivery_address` VARCHAR(200) NOT NULL COMMENT '送货地址',
  `delivery_fee` DECIMAL(10,2) NOT NULL COMMENT '配送费',
  `status` TINYINT DEFAULT 0 COMMENT '状态 0-待接单 1-已接单 2-配送中 3-已完成 4-已取消',
  `delivery_person_id` BIGINT DEFAULT NULL COMMENT '配送员ID',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `completed_time` DATETIME DEFAULT NULL COMMENT '完成时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_status` (`status`),
  KEY `idx_delivery_person_id` (`delivery_person_id`),
  FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`merchant_id`) REFERENCES `merchant` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='跑腿需求表';

-- 外卖订单表
CREATE TABLE `takeout_order` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '外卖订单ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL COMMENT '外卖订单号',
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `status` TINYINT DEFAULT 0 COMMENT '状态 0-待接单 1-已接单 2-配送中 3-已完成 4-已取消',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_status` (`status`),
  FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`merchant_id`) REFERENCES `merchant` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='外卖订单表';

-- 外卖柜表
CREATE TABLE `delivery_locker` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '外卖柜ID',
  `locker_code` VARCHAR(50) NOT NULL UNIQUE COMMENT '外卖柜编号',
  `name` VARCHAR(100) NOT NULL COMMENT '外卖柜名称',
  `location` VARCHAR(200) NOT NULL COMMENT '位置',
  `campus_area` VARCHAR(50) NOT NULL COMMENT '校区区域',
  `total_cells` INT NOT NULL COMMENT '总格数',
  `available_cells` INT NOT NULL COMMENT '可用格数',
  `status` TINYINT DEFAULT 0 COMMENT '状态 0-正常 1-故障',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_locker_code` (`locker_code`),
  KEY `idx_status` (`status`),
  KEY `idx_campus_area` (`campus_area`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='外卖柜表';

-- 支付记录表
CREATE TABLE `payment` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '支付记录ID',
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '支付金额',
  `payment_type` TINYINT NOT NULL COMMENT '支付方式 0-余额 1-微信 2-支付宝',
  `status` TINYINT DEFAULT 0 COMMENT '支付状态 0-待支付 1-支付中 2-支付成功 3-支付失败 4-已退款',
  `transaction_id` VARCHAR(100) DEFAULT NULL COMMENT '第三方交易号',
  `payment_time` DATETIME DEFAULT NULL COMMENT '支付时间',
  `refund_time` DATETIME DEFAULT NULL COMMENT '退款时间',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_payment_time` (`payment_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付记录表';

-- 跑腿员表
CREATE TABLE `delivery_person` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '跑腿员ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `id_card` VARCHAR(20) DEFAULT NULL COMMENT '身份证号',
  `status` TINYINT DEFAULT 0 COMMENT '状态 0-空闲 1-配送中 2-忙碌 3-离线',
  `rating` DECIMAL(3,2) DEFAULT 0.00 COMMENT '评分',
  `total_orders` INT DEFAULT 0 COMMENT '总订单数',
  `total_income` DECIMAL(10,2) DEFAULT 0.00 COMMENT '总收入',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='跑腿员表';

-- 校园信息表
CREATE TABLE `campus_info` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '校园ID',
  `name` VARCHAR(100) NOT NULL COMMENT '校园名称',
  `code` VARCHAR(20) NOT NULL UNIQUE COMMENT '校园代码',
  `address` VARCHAR(200) NOT NULL COMMENT '校园地址',
  `description` TEXT COMMENT '校园描述',
  `status` TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='校园信息表';

-- 恢复外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 插入初始数据
-- 插入校园信息
INSERT INTO `campus_info` (`id`, `name`, `code`, `address`, `description`) VALUES
(1, '黑龙江科技大学松北校区', 'USTH_SONG', '黑龙江省哈尔滨市松北区学院路73号', '黑龙江科技大学主校区'),
(2, '黑龙江科技大学嵩山校区', 'USTH_SONG', '黑龙江省哈尔滨市南岗区嵩山路199号', '黑龙江科技大学嵩山校区');

-- 插入商品分类
INSERT INTO `category` (`name`, `parent_id`, `sort_order`, `status`) VALUES
('校园零食', 0, 1, 1),
('日常用品', 0, 2, 1),
('学习文具', 0, 3, 1),
('水果生鲜', 0, 4, 1),
('校园服务', 0, 5, 1),
('饮料酒水', 1, 1, 1),
('膨化食品', 1, 2, 1),
('洗漱用品', 2, 1, 1),
('宿舍必备', 2, 2, 1),
('办公用品', 3, 1, 1);

-- 插入商家信息
INSERT INTO `merchant` (`name`, `type`, `description`, `phone`, `address`, `status`) VALUES
('科大便利店', 1, '校内便利超市，提供各类零食饮料和生活用品', '13900139001', '黑龙江科技大学B区食堂一楼', 0),
('学府超市', 1, '校园综合超市，商品种类齐全', '13900139002', '黑龙江科技大学A区宿舍旁', 0),
('嵩山小店', 1, '嵩山校区便利店', '13900139003', '黑龙江科技大学嵩山校区内', 0),
('水果之家', 1, '新鲜水果和水果捞', '13900139004', '黑龙江科技大学C区商业街', 0),
('文具小铺', 1, '各类文具和办公用品', '13900139005', '黑龙江科技大学D区教学楼旁', 0);

-- 插入外卖柜信息
INSERT INTO `delivery_locker` (`locker_code`, `name`, `location`, `campus_area`, `total_cells`, `available_cells`, `status`) VALUES
('LOCKER001', 'B区食堂外卖柜', 'B区食堂门口', '松北校区', 20, 18, 0),
('LOCKER002', 'A区宿舍外卖柜', 'A区宿舍楼下', '松北校区', 15, 12, 0),
('LOCKER003', 'C区商业街外卖柜', 'C区商业街入口', '松北校区', 25, 20, 0),
('LOCKER004', '嵩山校区外卖柜', '嵩山校区食堂旁', '嵩山校区', 10, 8, 0);

-- 插入基础用户数据
INSERT INTO `user` (`student_no`, `nickname`, `phone`, `status`, `balance`, `campus_id`) VALUES
('2022020001', '张三', '13800138001', 0, 100.00, 1),
('2022020002', '李四', '13800138002', 0, 50.00, 1),
('2022020003', '王五', '13800138003', 0, 0.00, 2);

-- 记录迁移完成
UPDATE `schema_version` SET `description` = '创建初始数据库架构及基础数据' WHERE `version` = 'V001';

SELECT 'Database migration V001 completed successfully!' AS result;