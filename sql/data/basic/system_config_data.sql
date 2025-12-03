-- 系统配置基础数据
USE `heikeji_mall`;

INSERT INTO `system_config` (`config_key`, `config_value`, `config_desc`, `is_system`) VALUES
('site_name', '黑科易购', '网站名称', 1),
('site_logo', 'http://example.com/logo.png', '网站Logo', 1),
('site_description', '校园综合购物平台', '网站描述', 1),
('delivery_fee', '3.00', '基础配送费', 1),
('free_delivery_threshold', '30.00', '免配送费门槛', 1),
('customer_service_phone', '13800138000', '客服电话', 1),
('order_timeout_hours', '2', '订单超时时间(小时)', 1),
('refund_period_days', '7', '退款期限(天)', 1);
