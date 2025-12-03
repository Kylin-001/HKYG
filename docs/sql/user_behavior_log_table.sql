-- 用户行为日志表
CREATE TABLE `user_behavior_log` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` bigint NOT NULL COMMENT '用户ID',
    `action` varchar(50) NOT NULL COMMENT '行为动作',
    `module` varchar(50) NOT NULL COMMENT '功能模块',
    `metadata` text COMMENT '行为元数据(JSON格式)',
    `client_info` varchar(500) DEFAULT NULL COMMENT '客户端信息',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `idx_user_id` (`user_id`) USING BTREE,
    KEY `idx_action` (`action`) USING BTREE,
    KEY `idx_module` (`module`) USING BTREE,
    KEY `idx_create_time` (`create_time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户行为日志表';

-- 行为日志索引优化
CREATE INDEX `idx_user_module_action` ON `user_behavior_log` (`user_id`, `module`, `action`);
CREATE INDEX `idx_user_time` ON `user_behavior_log` (`user_id`, `create_time`);
CREATE INDEX `idx_module_time` ON `user_behavior_log` (`module`, `create_time`);