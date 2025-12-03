-- 数据字典基础数据
USE `heikeji_mall`;

-- 订单状态
INSERT INTO `dict` (`dict_type`, `dict_code`, `dict_name`, `dict_value`, `sort_order`, `status`) VALUES
('order_status', '0', '待支付', '待支付', 1, 0),
('order_status', '1', '已支付', '已支付', 2, 0),
('order_status', '2', '配送中', '配送中', 3, 0),
('order_status', '3', '已完成', '已完成', 4, 0),
('order_status', '4', '已取消', '已取消', 5, 0);

-- 支付状态
INSERT INTO `dict` (`dict_type`, `dict_code`, `dict_name`, `dict_value`, `sort_order`, `status`) VALUES
('pay_status', '0', '未支付', '未支付', 1, 0),
('pay_status', '1', '已支付', '已支付', 2, 0),
('pay_status', '2', '支付失败', '支付失败', 3, 0);

-- 配送方式
INSERT INTO `dict` (`dict_type`, `dict_code`, `dict_name`, `dict_value`, `sort_order`, `status`) VALUES
('delivery_type', '1', '外卖柜自提', '外卖柜自提', 1, 0),
('delivery_type', '2', '送货上门', '送货上门', 2, 0);

-- 用户状态
INSERT INTO `dict` (`dict_type`, `dict_code`, `dict_name`, `dict_value`, `sort_order`, `status`) VALUES
('user_status', '0', '正常', '正常', 1, 0),
('user_status', '1', '禁用', '禁用', 2, 0);
