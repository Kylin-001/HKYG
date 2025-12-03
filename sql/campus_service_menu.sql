-- 校园服务平台菜单添加脚本
-- 时间：2024-01-01

-- 添加校园服务管理父菜单
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `path`, `component`, `permission`, `icon`, `sort`, `status`, `create_time`, `update_time`) 
VALUES ('校园服务管理', 0, '/campus', 'Layout', NULL, 'el-icon-location', 2, 1, NOW(), NOW());

-- 添加校区管理子菜单
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `path`, `component`, `permission`, `icon`, `sort`, `status`, `create_time`, `update_time`) 
VALUES ('校区管理', (SELECT id FROM `sys_menu` WHERE `menu_name` = '校园服务管理'), 'list', 'views/campus/list', 'campus:list', 'el-icon-office-building', 1, 1, NOW(), NOW());

-- 添加楼栋管理子菜单
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `path`, `component`, `permission`, `icon`, `sort`, `status`, `create_time`, `update_time`) 
VALUES ('楼栋管理', (SELECT id FROM `sys_menu` WHERE `menu_name` = '校园服务管理'), 'building', 'views/campus/building', 'campus:building', 'el-icon-home', 2, 1, NOW(), NOW());

-- 添加外卖柜管理子菜单
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `path`, `component`, `permission`, `icon`, `sort`, `status`, `create_time`, `update_time`) 
VALUES ('外卖柜管理', (SELECT id FROM `sys_menu` WHERE `menu_name` = '校园服务管理'), 'locker', 'views/campus/locker', 'campus:locker', 'el-icon-box', 3, 1, NOW(), NOW());

-- 添加校园站点管理子菜单
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `path`, `component`, `permission`, `icon`, `sort`, `status`, `create_time`, `update_time`) 
VALUES ('校园站点管理', (SELECT id FROM `sys_menu` WHERE `menu_name` = '校园服务管理'), 'station', 'views/campus/station', 'campus:station', 'el-icon-map-marker', 4, 1, NOW(), NOW());

-- 添加外卖服务管理父菜单
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `path`, `component`, `permission`, `icon`, `sort`, `status`, `create_time`, `update_time`) 
VALUES ('外卖服务管理', 0, '/takeaway', 'Layout', NULL, 'el-icon-food', 3, 1, NOW(), NOW());

-- 添加外卖订单管理子菜单
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `path`, `component`, `permission`, `icon`, `sort`, `status`, `create_time`, `update_time`) 
VALUES ('外卖订单管理', (SELECT id FROM `sys_menu` WHERE `menu_name` = '外卖服务管理'), 'order', 'views/takeaway/order', 'takeaway:order', 'el-icon-document', 1, 1, NOW(), NOW());

-- 添加跑腿服务管理父菜单
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `path`, `component`, `permission`, `icon`, `sort`, `status`, `create_time`, `update_time`) 
VALUES ('跑腿服务管理', 0, '/errand', 'Layout', NULL, 'el-icon-truck', 4, 1, NOW(), NOW());

-- 添加跑腿请求管理子菜单
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `path`, `component`, `permission`, `icon`, `sort`, `status`, `create_time`, `update_time`) 
VALUES ('跑腿请求管理', (SELECT id FROM `sys_menu` WHERE `menu_name` = '跑腿服务管理'), 'request', 'views/errand/request', 'errand:request', 'el-icon-chat-dot-square', 1, 1, NOW(), NOW());

-- 为超级管理员角色分配所有校园服务相关菜单权限
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) 
SELECT 1, id FROM `sys_menu` WHERE `menu_name` IN ('校园服务管理', '校区管理', '楼栋管理', '外卖柜管理', '校园站点管理', '外卖服务管理', '外卖订单管理', '跑腿服务管理', '跑腿请求管理');

-- 插入校园服务相关操作权限
INSERT INTO `admin_permission` (`name`, `code`, `description`) VALUES
('校区管理', 'campus:list', '校区信息管理权限'),
('楼栋管理', 'campus:building', '楼栋信息管理权限'),
('外卖柜管理', 'campus:locker', '外卖柜信息管理权限'),
('校园站点管理', 'campus:station', '校园站点管理权限'),
('外卖订单管理', 'takeaway:order', '外卖订单管理权限'),
('跑腿请求管理', 'errand:request', '跑腿请求管理权限');

-- 为超级管理员角色分配所有校园服务相关操作权限
INSERT INTO `admin_role_permission` (`role_id`, `permission_id`)
SELECT 1, id FROM `admin_permission` WHERE `code` LIKE 'campus:%' OR `code` LIKE 'takeaway:%' OR `code` LIKE 'errand:%';

-- 输出添加结果
SELECT '校园服务菜单添加完成' AS result;
SELECT id, menu_name, parent_id, path FROM sys_menu WHERE menu_name LIKE '%校园%' OR menu_name LIKE '%外卖%' OR menu_name LIKE '%跑腿%';