-- 黑科易购项目角色权限管理数据库表结构
-- 创建时间: 2024-12-19
-- 描述: 角色权限管理系统相关表

-- 1. 角色表
CREATE TABLE `sys_role` (
    `role_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
    `role_name` varchar(50) NOT NULL COMMENT '角色名称',
    `role_code` varchar(50) NOT NULL COMMENT '角色编码',
    `description` varchar(200) DEFAULT NULL COMMENT '角色描述',
    `role_sort` int(11) DEFAULT '0' COMMENT '角色排序',
    `status` tinyint(1) DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
    `create_by` varchar(64) DEFAULT '' COMMENT '创建人',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_by` varchar(64) DEFAULT '' COMMENT '更新人',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `remark` varchar(500) DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (`role_id`),
    UNIQUE KEY `uk_role_code` (`role_code`) COMMENT '角色编码唯一'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 2. 权限表
CREATE TABLE `sys_permission` (
    `permission_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '权限ID',
    `permission_name` varchar(50) NOT NULL COMMENT '权限名称',
    `permission_code` varchar(50) NOT NULL COMMENT '权限编码',
    `resource_type` varchar(20) NOT NULL DEFAULT 'button' COMMENT '资源类型：menu-菜单，button-按钮，api-接口',
    `parent_id` bigint(20) DEFAULT '0' COMMENT '父权限ID',
    `permission_path` varchar(200) DEFAULT NULL COMMENT '权限路径',
    `component` varchar(255) DEFAULT NULL COMMENT '组件路径',
    `permission_sort` int(11) DEFAULT '0' COMMENT '权限排序',
    `status` tinyint(1) DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
    `is_external` tinyint(1) DEFAULT '0' COMMENT '是否外链：0-否，1-是',
    `icon` varchar(100) DEFAULT NULL COMMENT '图标',
    `create_by` varchar(64) DEFAULT '' COMMENT '创建人',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_by` varchar(64) DEFAULT '' COMMENT '更新人',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `remark` varchar(500) DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (`permission_id`),
    UNIQUE KEY `uk_permission_code` (`permission_code`) COMMENT '权限编码唯一'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';

-- 3. 用户角色关联表
CREATE TABLE `sys_user_role` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` bigint(20) NOT NULL COMMENT '用户ID',
    `role_id` bigint(20) NOT NULL COMMENT '角色ID',
    `assign_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '分配时间',
    `assign_by` varchar(64) DEFAULT '' COMMENT '分配人',
    `is_valid` tinyint(1) DEFAULT '1' COMMENT '是否有效：0-无效，1-有效',
    `expire_time` datetime DEFAULT NULL COMMENT '失效时间',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_role` (`user_id`, `role_id`) COMMENT '用户角色唯一索引',
    KEY `idx_user_id` (`user_id`) COMMENT '用户ID索引',
    KEY `idx_role_id` (`role_id`) COMMENT '角色ID索引',
    KEY `idx_assign_time` (`assign_time`) COMMENT '分配时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- 4. 角色权限关联表
CREATE TABLE `sys_role_permission` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `role_id` bigint(20) NOT NULL COMMENT '角色ID',
    `permission_id` bigint(20) NOT NULL COMMENT '权限ID',
    `assign_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '分配时间',
    `assign_by` varchar(64) DEFAULT '' COMMENT '分配人',
    `is_valid` tinyint(1) DEFAULT '1' COMMENT '是否有效：0-无效，1-有效',
    `expire_time` datetime DEFAULT NULL COMMENT '失效时间',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`) COMMENT '角色权限唯一索引',
    KEY `idx_role_id` (`role_id`) COMMENT '角色ID索引',
    KEY `idx_permission_id` (`permission_id`) COMMENT '权限ID索引',
    KEY `idx_assign_time` (`assign_time`) COMMENT '分配时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

-- 插入初始角色数据
INSERT INTO `sys_role` (`role_id`, `role_name`, `role_code`, `description`, `role_sort`, `status`, `create_by`, `remark`) VALUES
(1, '超级管理员', 'SUPER_ADMIN', '超级管理员，拥有所有权限', 1, 1, 'system', '系统内置角色'),
(2, '系统管理员', 'ADMIN', '系统管理员，拥有大部分权限', 2, 1, 'system', '系统内置角色'),
(3, '普通用户', 'USER', '普通用户，只能访问基础功能', 3, 1, 'system', '系统内置角色'),
(4, '商家', 'MERCHANT', '商家用户，管理自己的商品和订单', 4, 1, 'system', '系统内置角色'),
(5, '配送员', 'DELIVERY', '配送员，负责配送订单', 5, 1, 'system', '系统内置角色');

-- 插入初始权限数据
INSERT INTO `sys_permission` (`permission_id`, `permission_name`, `permission_code`, `resource_type`, `parent_id`, `permission_path`, `permission_sort`, `status`, `create_by`, `remark`) VALUES
(1, '系统管理', 'SYSTEM_MANAGE', 'menu', 0, '/system', 1, 1, 'system', '系统管理菜单'),
(2, '用户管理', 'USER_MANAGE', 'menu', 1, '/system/user', 1, 1, 'system', '用户管理菜单'),
(3, '角色管理', 'ROLE_MANAGE', 'menu', 1, '/system/role', 2, 1, 'system', '角色管理菜单'),
(4, '权限管理', 'PERMISSION_MANAGE', 'menu', 1, '/system/permission', 3, 1, 'system', '权限管理菜单'),
(5, '用户查询', 'USER_LIST', 'button', 2, '', 1, 1, 'system', '用户查询权限'),
(6, '用户新增', 'USER_ADD', 'button', 2, '', 2, 1, 'system', '用户新增权限'),
(7, '用户编辑', 'USER_EDIT', 'button', 2, '', 3, 1, 'system', '用户编辑权限'),
(8, '用户删除', 'USER_DELETE', 'button', 2, '', 4, 1, 'system', '用户删除权限'),
(9, '角色查询', 'ROLE_LIST', 'button', 3, '', 1, 1, 'system', '角色查询权限'),
(10, '角色新增', 'ROLE_ADD', 'button', 3, '', 2, 1, 'system', '角色新增权限'),
(11, '角色编辑', 'ROLE_EDIT', 'button', 3, '', 3, 1, 'system', '角色编辑权限'),
(12, '角色删除', 'ROLE_DELETE', 'button', 3, '', 4, 1, 'system', '角色删除权限'),
(13, '权限查询', 'PERMISSION_LIST', 'button', 4, '', 1, 1, 'system', '权限查询权限'),
(14, '权限新增', 'PERMISSION_ADD', 'button', 4, '', 2, 1, 'system', '权限新增权限'),
(15, '权限编辑', 'PERMISSION_EDIT', 'button', 4, '', 3, 1, 'system', '权限编辑权限'),
(16, '权限删除', 'PERMISSION_DELETE', 'button', 4, '', 4, 1, 'system', '权限删除权限');

-- 为超级管理员分配所有权限
INSERT INTO `sys_role_permission` (`role_id`, `permission_id`, `assign_by`, `is_valid`) VALUES
(1, 1, 'system', 1), (1, 2, 'system', 1), (1, 3, 'system', 1), (1, 4, 'system', 1),
(1, 5, 'system', 1), (1, 6, 'system', 1), (1, 7, 'system', 1), (1, 8, 'system', 1),
(1, 9, 'system', 1), (1, 10, 'system', 1), (1, 11, 'system', 1), (1, 12, 'system', 1),
(1, 13, 'system', 1), (1, 14, 'system', 1), (1, 15, 'system', 1), (1, 16, 'system', 1);

-- 为系统管理员分配基础权限
INSERT INTO `sys_role_permission` (`role_id`, `permission_id`, `assign_by`, `is_valid`) VALUES
(2, 1, 'system', 1), (2, 2, 'system', 1), (2, 3, 'system', 1),
(2, 5, 'system', 1), (2, 6, 'system', 1), (2, 7, 'system', 1),
(2, 9, 'system', 1), (2, 10, 'system', 1), (2, 11, 'system', 1),
(2, 13, 'system', 1), (2, 14, 'system', 1), (2, 15, 'system', 1);

-- 创建索引以提高查询性能
CREATE INDEX idx_user_role_user_id ON sys_user_role(user_id);
CREATE INDEX idx_user_role_role_id ON sys_user_role(role_id);
CREATE INDEX idx_role_permission_role_id ON sys_role_permission(role_id);
CREATE INDEX idx_role_permission_permission_id ON sys_role_permission(permission_id);
CREATE INDEX idx_permission_parent_id ON sys_permission(parent_id);
CREATE INDEX idx_permission_status ON sys_permission(status);
CREATE INDEX idx_role_status ON sys_role(status);