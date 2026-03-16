-- =====================================================
-- 黑科易购数据库缺失表创建脚本
-- 执行时间: 2026-03-13
-- =====================================================

USE heikeji_mall;

-- =====================================================
-- 1. 用户登录历史表
-- =====================================================
CREATE TABLE IF NOT EXISTS `user_login_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) DEFAULT NULL COMMENT '用户ID',
  `login_account` varchar(100) DEFAULT NULL COMMENT '登录账号',
  `login_ip` varchar(50) DEFAULT NULL COMMENT '登录IP',
  `login_location` varchar(255) DEFAULT NULL COMMENT '登录地点',
  `browser` varchar(100) DEFAULT NULL COMMENT '浏览器类型',
  `os` varchar(50) DEFAULT NULL COMMENT '操作系统',
  `login_status` tinyint(4) DEFAULT '1' COMMENT '登录状态 1:成功 0:失败',
  `login_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
  `device` varchar(50) DEFAULT NULL COMMENT '登录设备',
  `fail_reason` varchar(500) DEFAULT NULL COMMENT '失败原因',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_login_time` (`login_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户登录历史表';

-- =====================================================
-- 2. 配送员表
-- =====================================================
CREATE TABLE IF NOT EXISTS `delivery_person` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `name` varchar(50) NOT NULL COMMENT '姓名',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `id_card` varchar(20) DEFAULT NULL COMMENT '身份证号',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:待审核 1:正常 2:禁用',
  `rating` decimal(3,2) DEFAULT '5.00' COMMENT '评分',
  `total_orders` int(11) DEFAULT '0' COMMENT '总配送订单数',
  `total_distance` decimal(10,2) DEFAULT '0.00' COMMENT '总配送距离(公里)',
  `balance` decimal(10,2) DEFAULT '0.00' COMMENT '账户余额',
  `verify_time` datetime DEFAULT NULL COMMENT '审核时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='配送员表';

-- =====================================================
-- 3. 配送请求表
-- =====================================================
CREATE TABLE IF NOT EXISTS `delivery_request` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `request_no` varchar(50) NOT NULL COMMENT '请求编号',
  `user_id` bigint(20) NOT NULL COMMENT '发布用户ID',
  `type` tinyint(4) NOT NULL COMMENT '请求类型 1:代取快递 2:代购 3:代办',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `description` text COMMENT '详细描述',
  `pickup_location` varchar(255) NOT NULL COMMENT '取件地点',
  `delivery_location` varchar(255) NOT NULL COMMENT '配送地点',
  `estimated_price` decimal(10,2) DEFAULT NULL COMMENT '预估价格',
  `actual_price` decimal(10,2) DEFAULT NULL COMMENT '实际价格',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1:待接单 2:已接单 3:配送中 4:已完成 5:已取消',
  `delivery_person_id` bigint(20) DEFAULT NULL COMMENT '接单配送员ID',
  `accept_time` datetime DEFAULT NULL COMMENT '接单时间',
  `complete_time` datetime DEFAULT NULL COMMENT '完成时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_request_no` (`request_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_delivery_person_id` (`delivery_person_id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='配送请求表';

-- =====================================================
-- 4. 商家表
-- =====================================================
CREATE TABLE IF NOT EXISTS `merchant` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '商家名称',
  `description` text COMMENT '商家描述',
  `logo` varchar(255) DEFAULT NULL COMMENT '商家logo',
  `address` varchar(255) NOT NULL COMMENT '商家地址',
  `phone` varchar(20) NOT NULL COMMENT '联系电话',
  `business_hours` varchar(100) DEFAULT NULL COMMENT '营业时间',
  `min_price` decimal(10,2) DEFAULT '0.00' COMMENT '起送价',
  `delivery_fee` decimal(10,2) DEFAULT '0.00' COMMENT '配送费',
  `rating` decimal(3,2) DEFAULT '5.00' COMMENT '平均评分',
  `sales` int(11) DEFAULT '0' COMMENT '销量',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:歇业 1:营业中',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家表';

-- =====================================================
-- 5. 外卖分类表
-- =====================================================
CREATE TABLE IF NOT EXISTS `takeout_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `merchant_id` bigint(20) NOT NULL COMMENT '商家ID',
  `name` varchar(50) NOT NULL COMMENT '分类名称',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:禁用 1:启用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_merchant_id` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='外卖分类表';

-- =====================================================
-- 6. 外卖商品表
-- =====================================================
CREATE TABLE IF NOT EXISTS `takeout_product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `merchant_id` bigint(20) NOT NULL COMMENT '商家ID',
  `category_id` bigint(20) DEFAULT NULL COMMENT '分类ID',
  `name` varchar(100) NOT NULL COMMENT '商品名称',
  `description` text COMMENT '商品描述',
  `image` varchar(255) DEFAULT NULL COMMENT '商品图片',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `stock` int(11) DEFAULT '0' COMMENT '库存',
  `sales` int(11) DEFAULT '0' COMMENT '销量',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:下架 1:上架',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='外卖商品表';

-- =====================================================
-- 7. 外卖订单表
-- =====================================================
CREATE TABLE IF NOT EXISTS `takeout_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_no` varchar(50) NOT NULL COMMENT '订单编号',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `merchant_id` bigint(20) NOT NULL COMMENT '商家ID',
  `total_amount` decimal(10,2) NOT NULL COMMENT '订单总金额',
  `delivery_fee` decimal(10,2) DEFAULT '0.00' COMMENT '配送费',
  `discount_amount` decimal(10,2) DEFAULT '0.00' COMMENT '优惠金额',
  `actual_amount` decimal(10,2) NOT NULL COMMENT '实付金额',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1:待支付 2:待接单 3:配送中 4:已完成 5:已取消 6:退款中 7:已退款',
  `delivery_address` varchar(255) NOT NULL COMMENT '配送地址',
  `delivery_phone` varchar(20) NOT NULL COMMENT '配送电话',
  `delivery_name` varchar(50) NOT NULL COMMENT '收货人姓名',
  `remark` varchar(255) DEFAULT NULL COMMENT '订单备注',
  `delivery_person_id` bigint(20) DEFAULT NULL COMMENT '配送员ID',
  `pickup_code` varchar(10) DEFAULT NULL COMMENT '取餐码',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_delivery_person_id` (`delivery_person_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='外卖订单表';

-- =====================================================
-- 8. 外卖订单明细表
-- =====================================================
CREATE TABLE IF NOT EXISTS `takeout_order_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_id` bigint(20) NOT NULL COMMENT '订单ID',
  `product_id` bigint(20) NOT NULL COMMENT '商品ID',
  `product_name` varchar(100) NOT NULL COMMENT '商品名称',
  `product_image` varchar(255) DEFAULT NULL COMMENT '商品图片',
  `price` decimal(10,2) NOT NULL COMMENT '单价',
  `quantity` int(11) NOT NULL COMMENT '数量',
  `subtotal` decimal(10,2) NOT NULL COMMENT '小计',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='外卖订单明细表';

-- =====================================================
-- 9. 外卖柜表
-- =====================================================
CREATE TABLE IF NOT EXISTS `takeout_locker` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `locker_no` varchar(20) NOT NULL COMMENT '柜子编号',
  `location` varchar(255) NOT NULL COMMENT '位置',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:故障 1:空闲 2:使用中',
  `current_order_id` bigint(20) DEFAULT NULL COMMENT '当前订单ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_locker_no` (`locker_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='外卖柜表';

-- =====================================================
-- 10. 二手商品表
-- =====================================================
CREATE TABLE IF NOT EXISTS `secondhand_product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '发布用户ID',
  `category_id` bigint(20) DEFAULT NULL COMMENT '分类ID',
  `title` varchar(100) NOT NULL COMMENT '商品标题',
  `description` text COMMENT '商品描述',
  `original_price` decimal(10,2) DEFAULT NULL COMMENT '原价',
  `sell_price` decimal(10,2) NOT NULL COMMENT '售价',
  `images` text COMMENT '商品图片（JSON数组）',
  `condition` tinyint(4) DEFAULT NULL COMMENT '新旧程度 1:全新 2:九成新 3:八成新 4:七成新 5:六成新及以下',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1:待售 2:已售出 3:已下架',
  `view_count` int(11) DEFAULT '0' COMMENT '浏览量',
  `favorite_count` int(11) DEFAULT '0' COMMENT '收藏数',
  `contact_phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='二手商品表';

-- =====================================================
-- 11. 二手分类表
-- =====================================================
CREATE TABLE IF NOT EXISTS `secondhand_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) NOT NULL COMMENT '分类名称',
  `parent_id` bigint(20) DEFAULT '0' COMMENT '父分类ID',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:禁用 1:启用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='二手分类表';

-- =====================================================
-- 12. 订单评价表
-- =====================================================
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
  `like_count` int(11) DEFAULT '0' COMMENT '点赞数量',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评价时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单评价表';

-- =====================================================
-- 13. 评价点赞表
-- =====================================================
CREATE TABLE IF NOT EXISTS `order_review_like` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `review_id` bigint(20) NOT NULL COMMENT '评价ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_review_user` (`review_id`, `user_id`),
  KEY `idx_review_id` (`review_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价点赞表';

-- =====================================================
-- 14. 商品评价表
-- =====================================================
CREATE TABLE IF NOT EXISTS `product_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `product_id` bigint(20) NOT NULL COMMENT '商品ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `order_id` bigint(20) DEFAULT NULL COMMENT '订单ID',
  `rating` tinyint(4) NOT NULL COMMENT '评分（1-5星）',
  `content` text COMMENT '评价内容',
  `images` text COMMENT '评价图片（JSON数组）',
  `like_count` int(11) DEFAULT '0' COMMENT '点赞数',
  `reply_content` text COMMENT '商家回复',
  `reply_time` datetime DEFAULT NULL COMMENT '回复时间',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:隐藏 1:显示',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '评价时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品评价表';

-- =====================================================
-- 15. 商品评价点赞表
-- =====================================================
CREATE TABLE IF NOT EXISTS `product_comment_like` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `comment_id` bigint(20) NOT NULL COMMENT '评价ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_comment_user` (`comment_id`, `user_id`),
  KEY `idx_comment_id` (`comment_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品评价点赞表';

-- =====================================================
-- 16. 用户优惠券表
-- =====================================================
CREATE TABLE IF NOT EXISTS `user_coupon` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `coupon_id` bigint(20) NOT NULL COMMENT '优惠券ID',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1:未使用 2:已使用 3:已过期',
  `order_id` bigint(20) DEFAULT NULL COMMENT '使用的订单ID',
  `use_time` datetime DEFAULT NULL COMMENT '使用时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '领取时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_coupon_id` (`coupon_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券表';

-- =====================================================
-- 17. 失物招领表
-- =====================================================
CREATE TABLE IF NOT EXISTS `lost_found` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `content` text COMMENT '内容描述',
  `type` tinyint(4) NOT NULL COMMENT '类型 0:失物 1:招领',
  `category_id` bigint(20) DEFAULT NULL COMMENT '物品分类ID',
  `images` varchar(1000) DEFAULT NULL COMMENT '物品图片（逗号分隔）',
  `tags` varchar(255) DEFAULT NULL COMMENT '物品标签（逗号分隔）',
  `location` varchar(255) DEFAULT NULL COMMENT '地点',
  `time` datetime DEFAULT NULL COMMENT '时间',
  `contact_name` varchar(50) DEFAULT NULL COMMENT '联系人姓名',
  `contact_phone` varchar(20) DEFAULT NULL COMMENT '联系人电话',
  `status` tinyint(4) DEFAULT '0' COMMENT '状态 0:待审核 1:已发布 2:已解决 3:已删除 4:审核失败',
  `view_count` int(11) DEFAULT '0' COMMENT '浏览量',
  `comment_count` int(11) DEFAULT '0' COMMENT '留言数',
  `audit_remark` varchar(255) DEFAULT NULL COMMENT '审核意见',
  `del_flag` tinyint(4) DEFAULT '0' COMMENT '删除标记 0:正常 1:删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='失物招领表';

-- =====================================================
-- 18. 配送订单表
-- =====================================================
CREATE TABLE IF NOT EXISTS `delivery_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_no` varchar(50) NOT NULL COMMENT '订单编号',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `delivery_person_id` bigint(20) DEFAULT NULL COMMENT '配送员ID',
  `type` tinyint(4) NOT NULL COMMENT '配送类型 1:外卖 2:快递 3:跑腿',
  `pickup_location` varchar(255) NOT NULL COMMENT '取件地点',
  `delivery_location` varchar(255) NOT NULL COMMENT '配送地点',
  `pickup_phone` varchar(20) NOT NULL COMMENT '取件电话',
  `delivery_phone` varchar(20) NOT NULL COMMENT '配送电话',
  `estimated_weight` decimal(10,2) DEFAULT NULL COMMENT '预估重量',
  `actual_weight` decimal(10,2) DEFAULT NULL COMMENT '实际重量',
  `delivery_fee` decimal(10,2) NOT NULL COMMENT '配送费',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1:待取件 2:配送中 3:已送达 4:已确认 5:已取消',
  `pickup_time` datetime DEFAULT NULL COMMENT '取件时间',
  `delivery_time` datetime DEFAULT NULL COMMENT '送达时间',
  `complete_time` datetime DEFAULT NULL COMMENT '完成时间',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_delivery_person_id` (`delivery_person_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='配送订单表';

-- =====================================================
-- 19. 配送用户表
-- =====================================================
CREATE TABLE IF NOT EXISTS `delivery_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:待审核 1:正常 2:禁用',
  `rating` decimal(3,2) DEFAULT '5.00' COMMENT '评分',
  `total_delivery` int(11) DEFAULT '0' COMMENT '总配送数',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='配送用户表';

-- =====================================================
-- 20. 校园表
-- =====================================================
CREATE TABLE IF NOT EXISTS `campus` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '校园名称',
  `code` varchar(20) NOT NULL COMMENT '校园代码',
  `province` varchar(50) DEFAULT NULL COMMENT '省份',
  `city` varchar(50) DEFAULT NULL COMMENT '城市',
  `district` varchar(50) DEFAULT NULL COMMENT '区县',
  `address` varchar(255) DEFAULT NULL COMMENT '详细地址',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:禁用 1:启用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='校园表';

-- =====================================================
-- 21. 校园公告表
-- =====================================================
CREATE TABLE IF NOT EXISTS `campus_notice` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(100) NOT NULL COMMENT '公告标题',
  `content` text NOT NULL COMMENT '公告内容',
  `type` tinyint(4) DEFAULT '1' COMMENT '类型 1:系统公告 2:活动通知 3:安全提示',
  `publisher` varchar(50) DEFAULT NULL COMMENT '发布人',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:草稿 1:已发布 2:已下线',
  `view_count` int(11) DEFAULT '0' COMMENT '浏览量',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='校园公告表';

-- =====================================================
-- 22. 会员等级表
-- =====================================================
CREATE TABLE IF NOT EXISTS `member_level` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) NOT NULL COMMENT '等级名称',
  `level` int(11) NOT NULL COMMENT '等级',
  `min_points` int(11) DEFAULT '0' COMMENT '最低积分',
  `discount` decimal(3,2) DEFAULT '1.00' COMMENT '折扣',
  `icon` varchar(255) DEFAULT NULL COMMENT '等级图标',
  `description` varchar(255) DEFAULT NULL COMMENT '等级描述',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:禁用 1:启用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员等级表';

-- =====================================================
-- 23. 积分记录表
-- =====================================================
CREATE TABLE IF NOT EXISTS `point_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `type` tinyint(4) NOT NULL COMMENT '类型 1:签到 2:消费 3:充值 4:兑换 5:退款',
  `points` int(11) NOT NULL COMMENT '积分数量（正数增加，负数扣减）',
  `balance` int(11) DEFAULT NULL COMMENT '变动后余额',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `related_id` bigint(20) DEFAULT NULL COMMENT '关联ID（订单ID等）',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分记录表';

-- =====================================================
-- 24. 积分规则表
-- =====================================================
CREATE TABLE IF NOT EXISTS `point_rule` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `rule_key` varchar(50) NOT NULL COMMENT '规则key',
  `rule_name` varchar(100) NOT NULL COMMENT '规则名称',
  `points` int(11) NOT NULL COMMENT '积分数量',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:禁用 1:启用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_rule_key` (`rule_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分规则表';

-- =====================================================
-- 25. 积分商品表
-- =====================================================
CREATE TABLE IF NOT EXISTS `point_product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '商品名称',
  `description` text COMMENT '商品描述',
  `image` varchar(255) DEFAULT NULL COMMENT '商品图片',
  `points` int(11) NOT NULL COMMENT '所需积分',
  `stock` int(11) DEFAULT '0' COMMENT '库存',
  `exchange_count` int(11) DEFAULT '0' COMMENT '已兑换数量',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:下架 1:上架',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分商品表';

-- =====================================================
-- 26. 优惠券表
-- =====================================================
CREATE TABLE IF NOT EXISTS `coupon` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '优惠券名称',
  `type` tinyint(4) NOT NULL COMMENT '类型 1:满减券 2:折扣券 3:无门槛券',
  `value` decimal(10,2) NOT NULL COMMENT '面值/折扣',
  `min_amount` decimal(10,2) DEFAULT '0.00' COMMENT '最低消费金额',
  `total_count` int(11) DEFAULT '0' COMMENT '发放总量',
  `received_count` int(11) DEFAULT '0' COMMENT '已领取数量',
  `used_count` int(11) DEFAULT '0' COMMENT '已使用数量',
  `valid_from` datetime NOT NULL COMMENT '有效期开始',
  `valid_to` datetime NOT NULL COMMENT '有效期结束',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 0:未发布 1:进行中 2:已过期 3:已下架',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_valid_from` (`valid_from`),
  KEY `idx_valid_to` (`valid_to`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券表';

-- =====================================================
-- 27. 会员收货地址表
-- =====================================================
CREATE TABLE IF NOT EXISTS `member_receive_address` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `consignee` varchar(50) NOT NULL COMMENT '收货人',
  `phone` varchar(20) NOT NULL COMMENT '联系电话',
  `province` varchar(50) DEFAULT NULL COMMENT '省份',
  `city` varchar(50) DEFAULT NULL COMMENT '城市',
  `district` varchar(50) DEFAULT NULL COMMENT '区县',
  `detail_address` varchar(255) NOT NULL COMMENT '详细地址',
  `is_default` tinyint(4) DEFAULT '0' COMMENT '是否默认 0:否 1:是',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员收货地址表';

-- =====================================================
-- 记录版本
-- =====================================================
INSERT INTO schema_version (version, description)
VALUES ('2026.03.13.missing_tables', 'Create 27 missing tables for project')
ON DUPLICATE KEY UPDATE description = VALUES(description);

SELECT '========================================' AS '';
SELECT '成功创建27个缺失的数据库表！' AS message;
SELECT '========================================' AS '';
