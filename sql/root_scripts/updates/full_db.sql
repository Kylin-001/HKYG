-- 黑科易购数据库完整SQL文件
-- 包含所有表结构和数据

-- 创建数据库
CREATE DATABASE IF NOT EXISTS heikeji_mall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE heikeji_mall;

-- 表结构部分
-- 1. schema_version
CREATE TABLE `schema_version` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` varchar(50) NOT NULL COMMENT '版本号',
  `description` varchar(255) DEFAULT NULL COMMENT '版本描述',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据库版本表';

-- 2. user
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `nickname` varchar(100) DEFAULT NULL COMMENT '昵称',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `gender` tinyint(4) DEFAULT '0' COMMENT '性别 0:未知 1:男 2:女',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1:正常 0:禁用',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_phone` (`phone`),
  UNIQUE KEY `uk_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 3. user_auth
CREATE TABLE `user_auth` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `auth_type` varchar(20) NOT NULL COMMENT '认证类型(username/password, phone, wechat, etc.)',
  `identifier` varchar(100) NOT NULL COMMENT '认证唯一标识',
  `credential` varchar(255) NOT NULL COMMENT '认证凭证(密码哈希等)',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_identifier` (`auth_type`,`identifier`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_user_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户认证信息表';

-- 4. user_address
CREATE TABLE `user_address` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `consignee_name` varchar(50) NOT NULL COMMENT '收货人姓名',
  `consignee_phone` varchar(20) NOT NULL COMMENT '收货人手机号',
  `province` varchar(50) NOT NULL COMMENT '省份',
  `city` varchar(50) NOT NULL COMMENT '城市',
  `district` varchar(50) NOT NULL COMMENT '区县',
  `detail_address` varchar(255) NOT NULL COMMENT '详细地址',
  `is_default` tinyint(4) DEFAULT '0' COMMENT '是否默认地址 1:是 0:否',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户地址表';

-- 5. store
CREATE TABLE `store` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '门店名称',
  `address` varchar(255) NOT NULL COMMENT '门店地址',
  `phone` varchar(20) NOT NULL COMMENT '门店电话',
  `business_hours` varchar(100) NOT NULL COMMENT '营业时间',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1:营业 0:关闭',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门店表';

-- 6. category
CREATE TABLE `category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '分类名称',
  `parent_id` bigint(20) DEFAULT '0' COMMENT '父分类ID，0表示顶级分类',
  `level` tinyint(4) DEFAULT '1' COMMENT '分类级别',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1:启用 0:禁用',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

-- 7. product
CREATE TABLE `product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '商品名称',
  `description` text COMMENT '商品描述',
  `category_id` bigint(20) NOT NULL COMMENT '分类ID',
  `store_id` bigint(20) NOT NULL COMMENT '门店ID',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `stock` int(11) NOT NULL DEFAULT '0' COMMENT '库存数量',
  `sales` int(11) NOT NULL DEFAULT '0' COMMENT '已售数量',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1:上架 0:下架',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_store_id` (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 8. product_image
CREATE TABLE `product_image` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL COMMENT '商品ID',
  `image_url` varchar(255) NOT NULL COMMENT '图片URL',
  `is_main` tinyint(4) DEFAULT '0' COMMENT '是否主图 1:是 0:否',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  CONSTRAINT `fk_product_image_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品图片表';

-- 9. cart
CREATE TABLE `cart` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `product_id` bigint(20) NOT NULL COMMENT '商品ID',
  `quantity` int(11) NOT NULL DEFAULT '1' COMMENT '购买数量',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_product` (`user_id`,`product_id`),
  KEY `idx_product_id` (`product_id`),
  CONSTRAINT `fk_cart_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- 10. order
CREATE TABLE `order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_sn` varchar(50) NOT NULL COMMENT '订单编号',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `store_id` bigint(20) NOT NULL COMMENT '门店ID',
  `total_amount` decimal(10,2) NOT NULL COMMENT '订单总金额',
  `status` tinyint(4) DEFAULT '0' COMMENT '订单状态: 0-待支付 1-待取货 2-已完成 3-已取消',
  `payment_status` tinyint(4) DEFAULT '0' COMMENT '支付状态: 0-未支付 1-已支付 2-已退款',
  `delivery_locker_id` bigint(20) DEFAULT NULL COMMENT '自提柜ID',
  `pickup_code` varchar(20) DEFAULT NULL COMMENT '取货码',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `paid_at` datetime DEFAULT NULL COMMENT '支付时间',
  `completed_at` datetime DEFAULT NULL COMMENT '完成时间',
  `cancelled_at` datetime DEFAULT NULL COMMENT '取消时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_sn` (`order_sn`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_store_id` (`store_id`),
  KEY `idx_delivery_locker_id` (`delivery_locker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 11. order_item
CREATE TABLE `order_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL COMMENT '订单ID',
  `product_id` bigint(20) NOT NULL COMMENT '商品ID',
  `product_name` varchar(255) NOT NULL COMMENT '商品名称',
  `price` decimal(10,2) NOT NULL COMMENT '商品单价',
  `quantity` int(11) NOT NULL DEFAULT '1' COMMENT '购买数量',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`),
  CONSTRAINT `fk_order_item_order_id` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单商品表';

-- 12. delivery_locker
CREATE TABLE `delivery_locker` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `store_id` bigint(20) NOT NULL COMMENT '门店ID',
  `name` varchar(50) NOT NULL COMMENT '自提柜名称',
  `location` varchar(255) NOT NULL COMMENT '自提柜位置',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1:正常 0:故障',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_store_id` (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='自提柜表';

-- 13. payment
CREATE TABLE `payment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL COMMENT '订单ID',
  `payment_sn` varchar(50) NOT NULL COMMENT '支付流水号',
  `amount` decimal(10,2) NOT NULL COMMENT '支付金额',
  `payment_method` varchar(20) NOT NULL COMMENT '支付方式: wechat_pay, alipay等',
  `status` tinyint(4) DEFAULT '0' COMMENT '支付状态: 0-待支付 1-已支付 2-已退款 3-已失效',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `paid_at` datetime DEFAULT NULL COMMENT '支付时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_payment_sn` (`payment_sn`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付表';

-- 14. payment_log
CREATE TABLE `payment_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `payment_id` bigint(20) NOT NULL COMMENT '支付ID',
  `action` varchar(50) NOT NULL COMMENT '操作类型',
  `content` text COMMENT '操作内容',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_payment_id` (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付日志表';

-- 15. system_config
CREATE TABLE `system_config` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `config_key` varchar(50) NOT NULL COMMENT '配置键',
  `config_value` varchar(255) NOT NULL COMMENT '配置值',
  `description` varchar(255) DEFAULT NULL COMMENT '配置描述',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 16. system_log
CREATE TABLE `system_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `operator` varchar(50) DEFAULT NULL COMMENT '操作人',
  `action` varchar(50) NOT NULL COMMENT '操作类型',
  `content` text COMMENT '操作内容',
  `ip_address` varchar(20) DEFAULT NULL COMMENT 'IP地址',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统日志表';

-- 17. dict
CREATE TABLE `dict` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `dict_type` varchar(50) NOT NULL COMMENT '字典类型',
  `dict_key` varchar(50) NOT NULL COMMENT '字典键',
  `dict_value` varchar(255) NOT NULL COMMENT '字典值',
  `description` varchar(255) DEFAULT NULL COMMENT '字典描述',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1:启用 0:禁用',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dict_type_key` (`dict_type`,`dict_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='字典表';

-- 18. role
CREATE TABLE `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '角色名称',
  `description` varchar(255) DEFAULT NULL COMMENT '角色描述',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1:启用 0:禁用',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 19. menu
CREATE TABLE `menu` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '菜单名称',
  `parent_id` bigint(20) DEFAULT '0' COMMENT '父菜单ID',
  `path` varchar(100) DEFAULT NULL COMMENT '路由路径',
  `component` varchar(100) DEFAULT NULL COMMENT '组件路径',
  `icon` varchar(50) DEFAULT NULL COMMENT '菜单图标',
  `type` tinyint(4) DEFAULT '1' COMMENT '菜单类型: 1-菜单 2-按钮',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态 1:启用 0:禁用',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单表';

-- 20. role_menu
CREATE TABLE `role_menu` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
  `menu_id` bigint(20) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_menu` (`role_id`,`menu_id`),
  KEY `idx_menu_id` (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';

-- 21. user_role
CREATE TABLE `user_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`,`role_id`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 初始数据部分
-- 1. schema_version
INSERT INTO `schema_version` (`version`, `description`) VALUES ('1.0.0', '初始版本');

-- 2. category
INSERT INTO `category` (`id`, `name`, `parent_id`, `level`, `sort_order`, `status`) VALUES
(1, '数码产品', 0, 1, 1, 1),
(2, '手机', 1, 2, 1, 1),
(3, '笔记本电脑', 1, 2, 2, 1),
(4, '家用电器', 0, 1, 2, 1),
(5, '电视', 4, 2, 1, 1),
(6, '冰箱', 4, 2, 2, 1),
(7, '服装', 0, 1, 3, 1),
(8, '男装', 7, 2, 1, 1),
(9, '女装', 7, 2, 2, 1);

-- 3. store
INSERT INTO `store` (`id`, `name`, `address`, `phone`, `business_hours`, `status`) VALUES
(1, '黑科易购旗舰店', '北京市朝阳区科技园区1号', '010-12345678', '9:00-22:00', 1),
(2, '黑科易购中关村店', '北京市海淀区中关村大街2号', '010-87654321', '9:00-21:00', 1),
(3, '黑科易购望京店', '北京市朝阳区望京街道3号', '010-11223344', '9:00-22:00', 1);

-- 4. product
INSERT INTO `product` (`id`, `name`, `description`, `category_id`, `store_id`, `price`, `stock`, `sales`, `status`) VALUES
(1, 'iPhone 15 Pro', '苹果最新旗舰手机', 2, 1, 8999.00, 50, 120, 1),
(2, 'Samsung Galaxy S23 Ultra', '三星旗舰手机', 2, 1, 7999.00, 40, 80, 1),
(3, 'MacBook Pro 16英寸', '苹果专业笔记本电脑', 3, 1, 19999.00, 20, 50, 1),
(4, '小米电视 65英寸', '4K超高清智能电视', 5, 2, 3999.00, 30, 150, 1),
(5, '海尔冰箱 双开门', '大容量智能冰箱', 6, 2, 5999.00, 15, 70, 1),
(6, 'Nike 运动鞋', '男士跑步鞋', 8, 3, 899.00, 100, 300, 1),
(7, 'Adidas 休闲裤', '男士时尚休闲裤', 8, 3, 499.00, 80, 200, 1),
(8, '华为 Mate 60 Pro', '华为最新旗舰手机', 2, 1, 6999.00, 60, 180, 1),
(9, '联想 ThinkPad X1', '商务笔记本电脑', 3, 2, 12999.00, 25, 60, 1),
(10, '格力空调 1.5匹', '变频冷暖空调', 4, 3, 3299.00, 40, 120, 1);

-- 5. product_image
INSERT INTO `product_image` (`product_id`, `image_url`, `is_main`, `sort_order`) VALUES
(1, 'https://example.com/iphone15pro_1.jpg', 1, 1),
(1, 'https://example.com/iphone15pro_2.jpg', 0, 2),
(2, 'https://example.com/samsung_s23_1.jpg', 1, 1),
(3, 'https://example.com/macbook_pro_1.jpg', 1, 1),
(4, 'https://example.com/xiaomi_tv_1.jpg', 1, 1),
(5, 'https://example.com/haier_fridge_1.jpg', 1, 1),
(6, 'https://example.com/nike_shoes_1.jpg', 1, 1),
(7, 'https://example.com/adidas_pants_1.jpg', 1, 1),
(8, 'https://example.com/huawei_mate60_1.jpg', 1, 1),
(9, 'https://example.com/thinkpad_x1_1.jpg', 1, 1),
(10, 'https://example.com/gree_air_1.jpg', 1, 1);

-- 6. delivery_locker
INSERT INTO `delivery_locker` (`store_id`, `name`, `location`, `status`) VALUES
(1, '自提柜A区', '门店门口左侧', 1),
(1, '自提柜B区', '门店门口右侧', 1),
(2, '自提柜1号', '门店大厅', 1),
(3, '自提柜', '门店门口', 1);

-- 7. dict
INSERT INTO `dict` (`dict_type`, `dict_key`, `dict_value`, `description`, `sort_order`, `status`) VALUES
('order_status', '0', '待支付', '订单状态：待支付', 1, 1),
('order_status', '1', '待取货', '订单状态：待取货', 2, 1),
('order_status', '2', '已完成', '订单状态：已完成', 3, 1),
('order_status', '3', '已取消', '订单状态：已取消', 4, 1),
('payment_status', '0', '未支付', '支付状态：未支付', 1, 1),
('payment_status', '1', '已支付', '支付状态：已支付', 2, 1),
('payment_status', '2', '已退款', '支付状态：已退款', 3, 1),
('user_gender', '0', '未知', '用户性别：未知', 1, 1),
('user_gender', '1', '男', '用户性别：男', 2, 1),
('user_gender', '2', '女', '用户性别：女', 3, 1);

-- 8. system_config
INSERT INTO `system_config` (`config_key`, `config_value`, `description`) VALUES
('site_name', '黑科易购', '网站名称'),
('site_title', '黑科易购 - 您的智能购物伙伴', '网站标题'),
('max_cart_items', '50', '购物车最大商品数量'),
('order_timeout', '30', '订单超时时间（分钟）'),
('pickup_code_valid_hours', '48', '取货码有效期（小时）');

-- 9. role
INSERT INTO `role` (`id`, `name`, `description`, `status`) VALUES
(1, '管理员', '系统管理员，拥有所有权限', 1),
(2, '普通用户', '普通购物用户', 1),
(3, '商家', '门店商家', 1);

-- 10. menu
INSERT INTO `menu` (`id`, `name`, `parent_id`, `path`, `component`, `icon`, `type`, `sort_order`, `status`) VALUES
(1, '系统管理', 0, '/system', 'Layout', 'setting', 1, 1, 1),
(2, '用户管理', 1, '/system/user', 'system/user/index', 'user', 1, 1, 1),
(3, '角色管理', 1, '/system/role', 'system/role/index', 'role', 1, 2, 1),
(4, '菜单管理', 1, '/system/menu', 'system/menu/index', 'menu', 1, 3, 1),
(5, '商品管理', 0, '/product', 'Layout', 'goods', 1, 2, 1),
(6, '商品列表', 5, '/product/list', 'product/list/index', 'list', 1, 1, 1),
(7, '分类管理', 5, '/product/category', 'product/category/index', 'category', 1, 2, 1),
(8, '订单管理', 0, '/order', 'Layout', 'order', 1, 3, 1),
(9, '订单列表', 8, '/order/list', 'order/list/index', 'list', 1, 1, 1),
(10, '门店管理', 0, '/store', 'Layout', 'shop', 1, 4, 1),
(11, '门店列表', 10, '/store/list', 'store/list/index', 'list', 1, 1, 1);

-- 11. role_menu
INSERT INTO `role_menu` (`role_id`, `menu_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11);

-- 测试数据部分
-- 1. user
INSERT INTO `user` (`id`, `username`, `nickname`, `phone`, `email`, `gender`, `avatar`, `status`) VALUES
(1, 'admin', '系统管理员', '13800138000', 'admin@heikeji.com', 1, 'https://example.com/avatar/admin.jpg', 1),
(2, 'user001', '张三', '13800138001', 'user001@example.com', 1, 'https://example.com/avatar/user001.jpg', 1),
(3, 'user002', '李四', '13800138002', 'user002@example.com', 1, 'https://example.com/avatar/user002.jpg', 1),
(4, 'user003', '王五', '13800138003', 'user003@example.com', 2, 'https://example.com/avatar/user003.jpg', 1),
(5, 'user004', '赵六', '13800138004', 'user004@example.com', 1, 'https://example.com/avatar/user004.jpg', 1);

-- 2. user_auth
INSERT INTO `user_auth` (`user_id`, `auth_type`, `identifier`, `credential`) VALUES
(1, 'password', 'admin', '$2a$10$e8f4a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0'),
(2, 'password', 'user001', '$2a$10$e8f4a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0'),
(3, 'password', 'user002', '$2a$10$e8f4a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0'),
(4, 'password', 'user003', '$2a$10$e8f4a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0'),
(5, 'password', 'user004', '$2a$10$e8f4a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0');

-- 3. user_address
INSERT INTO `user_address` (`user_id`, `consignee_name`, `consignee_phone`, `province`, `city`, `district`, `detail_address`, `is_default`) VALUES
(2, '张三', '13800138001', '北京市', '北京市', '朝阳区', '科技园区1号院1号楼1单元101室', 1),
(3, '李四', '13800138002', '上海市', '上海市', '浦东新区', '张江高科技园区2号', 1),
(4, '王五', '13800138003', '广东省', '广州市', '天河区', '天河路3号', 1),
(5, '赵六', '13800138004', '江苏省', '南京市', '玄武区', '中山路4号', 1);

-- 4. cart
INSERT INTO `cart` (`user_id`, `product_id`, `quantity`) VALUES
(2, 1, 1),
(2, 3, 1),
(3, 2, 2),
(3, 4, 1),
(4, 5, 1),
(4, 6, 3),
(5, 7, 1),
(5, 8, 1);

-- 5. order
INSERT INTO `order` (`order_sn`, `user_id`, `store_id`, `total_amount`, `status`, `payment_status`, `delivery_locker_id`, `pickup_code`, `created_at`, `paid_at`) VALUES
('HEIKEJI202312010001', 2, 1, 8999.00, 1, 1, 1, '123456', '2023-12-01 10:00:00', '2023-12-01 10:05:00'),
('HEIKEJI202312010002', 3, 2, 3999.00, 2, 1, 3, '654321', '2023-12-01 11:00:00', '2023-12-01 11:05:00'),
('HEIKEJI202312020003', 4, 3, 499.00, 1, 1, 4, '789012', '2023-12-02 14:00:00', '2023-12-02 14:10:00'),
('HEIKEJI202312020004', 5, 1, 6999.00, 3, 2, NULL, NULL, '2023-12-02 15:00:00', '2023-12-02 15:05:00');

-- 6. order_item
INSERT INTO `order_item` (`order_id`, `product_id`, `product_name`, `price`, `quantity`) VALUES
(1, 1, 'iPhone 15 Pro', 8999.00, 1),
(2, 4, '小米电视 65英寸', 3999.00, 1),
(3, 7, 'Adidas 休闲裤', 499.00, 1),
(4, 8, '华为 Mate 60 Pro', 6999.00, 1);

-- 7. payment
INSERT INTO `payment` (`order_id`, `payment_sn`, `amount`, `payment_method`, `status`, `created_at`, `paid_at`) VALUES
(1, 'PAY202312010001', 8999.00, 'wechat_pay', 1, '2023-12-01 10:00:00', '2023-12-01 10:05:00'),
(2, 'PAY202312010002', 3999.00, 'alipay', 1, '2023-12-01 11:00:00', '2023-12-01 11:05:00'),
(3, 'PAY202312020003', 499.00, 'wechat_pay', 1, '2023-12-02 14:00:00', '2023-12-02 14:10:00'),
(4, 'PAY202312020004', 6999.00, 'alipay', 2, '2023-12-02 15:00:00', '2023-12-02 15:05:00');

-- 8. payment_log
INSERT INTO `payment_log` (`payment_id`, `action`, `content`) VALUES
(1, 'create', '创建支付记录'),
(1, 'pay', '支付成功'),
(2, 'create', '创建支付记录'),
(2, 'pay', '支付成功'),
(3, 'create', '创建支付记录'),
(3, 'pay', '支付成功'),
(4, 'create', '创建支付记录'),
(4, 'pay', '支付成功'),
(4, 'refund', '退款成功');

-- 9. user_role
INSERT INTO `user_role` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 2),
(3, 2),
(4, 2),
(5, 2);
