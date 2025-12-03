-- 数据库索引优化脚本

-- 1. 用户相关表索引优化
-- 为用户表添加索引
ALTER TABLE `user` ADD INDEX `idx_status` (`status`) COMMENT '用户状态索引';
ALTER TABLE `user` ADD INDEX `idx_create_time` (`create_time`) COMMENT '创建时间索引，用于新用户分析';
ALTER TABLE `user` ADD INDEX `idx_is_verified` (`is_verified`) COMMENT '实名认证查询优化';

-- 为管理员用户表添加索引
ALTER TABLE `admin_user` ADD INDEX `idx_last_login` (`last_login_time`) COMMENT '登录分析优化';
ALTER TABLE `admin_user` ADD INDEX `idx_phone` (`phone`) COMMENT '手机号登录支持';

-- 2. 商品相关表索引优化
-- 为商品表添加索引
ALTER TABLE `product` ADD INDEX `idx_status` (`status`) COMMENT '商品状态索引';
ALTER TABLE `product` ADD INDEX `idx_sales` (`sales`) COMMENT '销量索引，用于热门商品排序';
ALTER TABLE `product` ADD INDEX `idx_create_time` (`create_time`) COMMENT '创建时间索引，用于新品查询';
ALTER TABLE `product` ADD INDEX `idx_price` (`price`) COMMENT '价格索引，用于价格排序';
ALTER TABLE `product` ADD INDEX `idx_merchant_category` (`merchant_id`, `category_id`) COMMENT '商家分类复合索引';
ALTER TABLE `product` ADD INDEX `idx_category_status` (`category_id`, `status`) COMMENT '按分类查询上架商品';
ALTER TABLE `product` ADD INDEX `idx_merchant_status` (`merchant_id`, `status`) COMMENT '商家商品管理优化';

-- 为商品分类表添加索引
ALTER TABLE `category` ADD INDEX `idx_parent_id` (`parent_id`) COMMENT '父分类ID索引';
ALTER TABLE `category` ADD INDEX `idx_parent_sort` (`parent_id`, `sort_order`) COMMENT '父分类排序索引';
ALTER TABLE `category` ADD INDEX `idx_del_flag` (`del_flag`) COMMENT '软删除查询优化';

-- 3. 订单相关表索引优化
-- 为订单表添加索引
ALTER TABLE `order` ADD INDEX `idx_user_id` (`user_id`) COMMENT '用户ID索引';
ALTER TABLE `order` ADD INDEX `idx_order_no` (`order_no`) COMMENT '订单号索引';
ALTER TABLE `order` ADD INDEX `idx_status` (`status`) COMMENT '订单状态索引';
ALTER TABLE `order` ADD INDEX `idx_create_time` (`create_time`) COMMENT '创建时间索引';
ALTER TABLE `order` ADD INDEX `idx_user_status` (`user_id`, `status`) COMMENT '用户-状态复合索引';
ALTER TABLE `order` ADD INDEX `idx_order_type` (`order_type`) COMMENT '订单类型索引';
ALTER TABLE `order` ADD INDEX `idx_pay_status` (`pay_status`) COMMENT '支付状态索引';
ALTER TABLE `order` ADD INDEX `idx_merchant_status` (`merchant_id`, `status`) COMMENT '商家订单状态索引';
ALTER TABLE `order` ADD INDEX `idx_delivery_time` (`delivery_time`) COMMENT '发货时间查询优化';
ALTER TABLE `order` ADD INDEX `idx_user_create_time` (`user_id`, `create_time` DESC) COMMENT '用户订单历史优化';

-- 为订单详情表添加索引
ALTER TABLE `order_item` ADD INDEX `idx_product_id` (`product_id`) COMMENT '商品ID索引';
ALTER TABLE `order_item` ADD INDEX `idx_order_no` (`order_no`) COMMENT '订单号索引';
ALTER TABLE `order_item` ADD INDEX `idx_create_time` (`create_time`) COMMENT '时间维度分析优化';

-- 4. 支付相关索引优化
-- 为支付表添加索引
ALTER TABLE `payment` ADD INDEX `idx_status` (`status`) COMMENT '支付状态索引';
ALTER TABLE `payment` ADD INDEX `idx_order_no` (`order_no`) COMMENT '订单号索引';
ALTER TABLE `payment` ADD INDEX `idx_payment_type` (`payment_type`) COMMENT '支付方式索引';
ALTER TABLE `payment` ADD INDEX `idx_create_time` (`create_time`) COMMENT '创建时间索引';
ALTER TABLE `payment` ADD INDEX `idx_transaction_id` (`transaction_id`) COMMENT '交易号查询优化';

-- 5. 购物车相关索引优化
-- 为购物车表添加索引
ALTER TABLE `cart` ADD INDEX `idx_product_id` (`product_id`) COMMENT '商品ID索引';
ALTER TABLE `cart` ADD INDEX `idx_create_time` (`create_time`) COMMENT '创建时间索引';
ALTER TABLE `cart` ADD INDEX `idx_update_time` (`update_time`) COMMENT '购物车更新时间优化';

-- 6. 配送相关索引优化
-- 为配送表添加索引
ALTER TABLE `delivery` ADD INDEX `idx_order_id` (`order_id`) COMMENT '订单ID索引';
ALTER TABLE `delivery` ADD INDEX `idx_status` (`status`) COMMENT '配送状态索引';
ALTER TABLE `delivery` ADD INDEX `idx_delivery_person_id` (`delivery_person_id`) COMMENT '配送员ID索引';
ALTER TABLE `delivery` ADD INDEX `idx_create_time` (`create_time`) COMMENT '创建时间索引';

-- 为外卖柜表添加索引
ALTER TABLE `locker` ADD INDEX `idx_status` (`status`) COMMENT '柜子状态索引';
ALTER TABLE `locker` ADD INDEX `idx_campus_area` (`campus_area`) COMMENT '校区索引';
ALTER TABLE `locker` ADD INDEX `idx_available_cells` (`available_cells`) COMMENT '可用格口查询';

-- 7. 收货地址相关索引优化
-- 为地址表添加索引
ALTER TABLE `address` ADD INDEX `idx_is_default` (`is_default`) COMMENT '默认地址查询';
ALTER TABLE `address` ADD INDEX `idx_campus_area` (`campus_area`) COMMENT '校区地址查询';

-- 8. 商家相关索引优化
-- 为商家表添加索引
ALTER TABLE `merchant` ADD INDEX `idx_status` (`status`) COMMENT '商家状态索引';
ALTER TABLE `merchant` ADD INDEX `idx_create_time` (`create_time`) COMMENT '创建时间索引';