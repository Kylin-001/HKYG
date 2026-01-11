-- 添加常用表索引优化脚本

-- 用户表索引优化
ALTER TABLE `user`
ADD INDEX `idx_phone` (`phone`),
ADD INDEX `idx_status` (`status`),
ADD INDEX `idx_created_at` (`created_at`);

-- 订单表索引优化
ALTER TABLE `order`
ADD INDEX `idx_pay_status` (`pay_status`),
ADD INDEX `idx_created_at` (`created_at`),
ADD INDEX `idx_user_id_status` (`user_id`, `status`),
ADD INDEX `idx_paid_at` (`paid_at`),
ADD INDEX `idx_completed_at` (`completed_at`);

-- 订单商品表索引优化（可选，当前索引已基本覆盖）
-- ALTER TABLE `order_item`
-- ADD INDEX `idx_order_id_product_id` (`order_id`, `product_id`);

-- 商品表索引优化（补充）
ALTER TABLE `product`
ADD INDEX `idx_category_id_status` (`category_id`, `status`),
ADD INDEX `idx_sales` (`sales`),
ADD INDEX `idx_created_at` (`created_at`);

-- 购物车表索引优化
ALTER TABLE `cart`
ADD INDEX `idx_user_id_product_id` (`user_id`, `product_id`),
ADD INDEX `idx_user_id` (`user_id`);

-- 支付表索引优化
ALTER TABLE `payment`
ADD INDEX `idx_order_no` (`order_no`),
ADD INDEX `idx_user_id` (`user_id`),
ADD INDEX `idx_status` (`status`),
ADD INDEX `idx_created_at` (`created_at`);

-- 支付日志表索引优化
ALTER TABLE `payment_log`
ADD INDEX `idx_payment_id` (`payment_id`),
ADD INDEX `idx_created_at` (`created_at`);

-- 系统日志表索引优化
ALTER TABLE `system_log`
ADD INDEX `idx_user_id` (`user_id`),
ADD INDEX `idx_created_at` (`created_at`),
ADD INDEX `idx_log_type` (`log_type`);
