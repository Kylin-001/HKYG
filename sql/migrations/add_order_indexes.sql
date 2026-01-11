-- 优化订单表索引
-- 添加缺失的索引，提高高频查询的性能

-- 1. 针对用户ID查询的索引
CREATE INDEX IF NOT EXISTS idx_order_user_id ON `order`(user_id);

-- 2. 针对商家ID查询的索引
CREATE INDEX IF NOT EXISTS idx_order_merchant_id ON `order`(merchant_id);

-- 3. 针对订单类型查询的索引
CREATE INDEX IF NOT EXISTS idx_order_order_type ON `order`(order_type);

-- 4. 针对订单状态查询的索引
CREATE INDEX IF NOT EXISTS idx_order_status ON `order`(status);

-- 5. 针对支付状态查询的索引
CREATE INDEX IF NOT EXISTS idx_order_pay_status ON `order`(pay_status);

-- 6. 针对退款状态查询的索引
CREATE INDEX IF NOT EXISTS idx_order_refund_status ON `order`(refund_status);

-- 7. 针对创建时间排序的索引
CREATE INDEX IF NOT EXISTS idx_order_create_time ON `order`(create_time);

-- 8. 针对更新时间排序的索引
CREATE INDEX IF NOT EXISTS idx_order_update_time ON `order`(update_time);

-- 9. 针对完成时间排序的索引
CREATE INDEX IF NOT EXISTS idx_order_complete_time ON `order`(complete_time);

-- 10. 针对用户和状态的复合索引
CREATE INDEX IF NOT EXISTS idx_order_user_id_status ON `order`(user_id, status);

-- 11. 针对商家和状态的复合索引
CREATE INDEX IF NOT EXISTS idx_order_merchant_id_status ON `order`(merchant_id, status);

-- 12. 针对状态和支付状态的复合索引
CREATE INDEX IF NOT EXISTS idx_order_status_pay_status ON `order`(status, pay_status);

-- 13. 针对状态和创建时间的复合索引
CREATE INDEX IF NOT EXISTS idx_order_status_create_time ON `order`(status, create_time);

-- 14. 针对支付状态和创建时间的复合索引
CREATE INDEX IF NOT EXISTS idx_order_pay_status_create_time ON `order`(pay_status, create_time);

-- 15. 针对多种状态的复合索引（用于销售分析）
CREATE INDEX IF NOT EXISTS idx_order_sales_analysis ON `order`(
    status,
    pay_status,
    create_time
);

-- 16. 针对订单类型和状态的复合索引
CREATE INDEX IF NOT EXISTS idx_order_order_type_status ON `order`(order_type, status);

-- 17. 针对支付类型和支付状态的复合索引
CREATE INDEX IF NOT EXISTS idx_order_pay_type_pay_status ON `order`(pay_type, pay_status);

-- 18. 针对退款状态和退款申请时间的复合索引
CREATE INDEX IF NOT EXISTS idx_order_refund_status_apply_time ON `order`(refund_status, refund_apply_time);