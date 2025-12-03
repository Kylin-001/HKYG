-- 测试数据 - 适配当前数据库结构
USE `heikeji_mall`;

-- 1. 添加购物车数据
INSERT INTO `cart` (`user_id`, `product_id`, `quantity`) VALUES
(1, 1, 2),
(1, 2, 1),
(2, 3, 1),
(3, 4, 3),
(4, 5, 1);

-- 2. 添加配送员数据
INSERT INTO `delivery_person` (`user_id`, `real_name`, `phone`, `status`, `rating`, `total_orders`) VALUES
(1, '张三', '13900139001', 0, 4.8, 100),
(2, '李四', '13900139002', 1, 4.9, 150),
(3, '王五', '13900139003', 0, 4.7, 80);
