-- 角色和权限基础数据
USE `heikeji_mall`;

-- 1. 角色数据
INSERT INTO `role` (`role_name`, `role_code`, `description`, `status`) VALUES
('超级管理员', 'admin', '系统最高权限角色', 0),
('普通用户', 'user', '普通用户角色', 0),
('商家', 'merchant', '商家角色', 0);

-- 2. 菜单数据
INSERT INTO `menu` (`parent_id`, `menu_name`, `menu_code`, `menu_url`, `menu_type`, `icon`, `sort_order`, `status`) VALUES
(0, '系统管理', 'system_manage', '/system', 1, 'system', 1, 0),
(1, '用户管理', 'user_manage', '/system/user', 2, 'user', 1, 0),
(1, '角色管理', 'role_manage', '/system/role', 2, 'role', 2, 0),
(1, '菜单管理', 'menu_manage', '/system/menu', 2, 'menu', 3, 0),
(1, '系统配置', 'config_manage', '/system/config', 2, 'config', 4, 0),
(0, '商品管理', 'product_manage', '/product', 1, 'product', 2, 0),
(6, '商品列表', 'product_list', '/product/list', 2, 'list', 1, 0),
(6, '商品分类', 'category_manage', '/product/category', 2, 'category', 2, 0),
(0, '订单管理', 'order_manage', '/order', 1, 'order', 3, 0),
(9, '订单列表', 'order_list', '/order/list', 2, 'list', 1, 0),
(0, '商家管理', 'merchant_manage', '/merchant', 1, 'merchant', 4, 0),
(11, '商家列表', 'merchant_list', '/merchant/list', 2, 'list', 1, 0),
(0, '外卖柜管理', 'locker_manage', '/locker', 1, 'locker', 5, 0),
(13, '外卖柜列表', 'locker_list', '/locker/list', 2, 'list', 1, 0);

-- 3. 角色菜单关联数据（超级管理员拥有所有权限）
INSERT INTO `role_menu` (`role_id`, `menu_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(1, 6), (1, 7), (1, 8), (1, 9), (1, 10),
(1, 11), (1, 12), (1, 13), (1, 14);

-- 4. 初始管理员用户（密码：admin123，已加密）
INSERT INTO `user` (`student_no`, `nickname`, `phone`, `status`, `is_verified`, `balance`, `score`) VALUES
('admin', '超级管理员', '13800138000', 0, 1, 0.00, 0);

-- 5. 用户角色关联
INSERT INTO `user_role` (`user_id`, `role_id`) VALUES
(1, 1);
