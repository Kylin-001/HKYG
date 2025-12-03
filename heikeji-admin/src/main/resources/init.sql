-- 创建管理员用户表
CREATE TABLE IF NOT EXISTS `sys_admin_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号码',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：0=禁用，1=启用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '删除标志：0=未删除，1=已删除',
  `dept_id` bigint(20) DEFAULT NULL COMMENT '部门ID',
  `role_ids` varchar(255) DEFAULT NULL COMMENT '角色ID列表',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员用户表';

-- 创建部门表
CREATE TABLE IF NOT EXISTS `sys_dept` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  `dept_name` varchar(50) NOT NULL COMMENT '部门名称',
  `parent_id` bigint(20) DEFAULT '0' COMMENT '父部门ID',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  `leader` varchar(50) DEFAULT NULL COMMENT '负责人',
  `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：0=禁用，1=启用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 创建角色表
CREATE TABLE IF NOT EXISTS `sys_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(50) NOT NULL COMMENT '角色名称',
  `role_code` varchar(50) NOT NULL COMMENT '角色编码',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：0=禁用，1=启用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 创建菜单表
CREATE TABLE IF NOT EXISTS `sys_menu` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `menu_name` varchar(50) NOT NULL COMMENT '菜单名称',
  `parent_id` bigint(20) DEFAULT '0' COMMENT '父菜单ID',
  `menu_type` tinyint(1) NOT NULL COMMENT '菜单类型：0=目录，1=菜单，2=按钮',
  `path` varchar(255) DEFAULT NULL COMMENT '路由路径',
  `component` varchar(255) DEFAULT NULL COMMENT '组件路径',
  `permission` varchar(100) DEFAULT NULL COMMENT '权限标识',
  `icon` varchar(50) DEFAULT NULL COMMENT '图标',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：0=禁用，1=启用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单表';

-- 创建角色菜单关联表
CREATE TABLE IF NOT EXISTS `sys_role_menu` (
  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
  `menu_id` bigint(20) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`role_id`,`menu_id`),
  KEY `idx_menu_id` (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';

-- 创建初始管理员用户（密码：123456，已加密）
INSERT INTO `sys_admin_user` (`id`, `username`, `password`, `real_name`, `phone`, `email`, `avatar`, `status`, `create_time`, `update_time`, `last_login_time`, `deleted`, `dept_id`, `role_ids`) VALUES
(1, 'admin', '$2a$10$7RJbPz9Ie6D1tqZ2xW67R.uQaRcKEOGv5t0jP8dF1X5p3Z6x1M7Zq', '系统管理员', '13800138000', 'admin@heikeji.com', NULL, 1, NOW(), NOW(), NULL, 0, NULL, '1');

-- 创建初始角色
INSERT INTO `sys_role` (`id`, `role_name`, `role_code`, `description`, `sort`, `status`, `create_time`, `update_time`) VALUES
(1, '超级管理员', 'SUPER_ADMIN', '系统最高权限', 1, 1, NOW(), NOW());

-- 创建初始菜单
INSERT INTO `sys_menu` (`id`, `menu_name`, `parent_id`, `menu_type`, `path`, `component`, `permission`, `icon`, `sort`, `status`, `create_time`, `update_time`) VALUES
(1, '系统管理', 0, 0, '/system', NULL, NULL, 'system', 1, 1, NOW(), NOW()),
(2, '用户管理', 1, 1, '/system/user', 'system/user/index', 'system:user:list', 'user', 1, 1, NOW(), NOW()),
(3, '角色管理', 1, 1, '/system/role', 'system/role/index', 'system:role:list', 'role', 2, 1, NOW(), NOW()),
(4, '菜单管理', 1, 1, '/system/menu', 'system/menu/index', 'system:menu:list', 'menu', 3, 1, NOW(), NOW()),
(5, '部门管理', 1, 1, '/system/dept', 'system/dept/index', 'system:dept:list', 'dept', 4, 1, NOW(), NOW()),
(6, '添加用户', 2, 2, NULL, NULL, 'system:user:add', NULL, 1, 1, NOW(), NOW()),
(7, '编辑用户', 2, 2, NULL, NULL, 'system:user:edit', NULL, 2, 1, NOW(), NOW()),
(8, '删除用户', 2, 2, NULL, NULL, 'system:user:delete', NULL, 3, 1, NOW(), NOW());

-- 关联角色菜单
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8);