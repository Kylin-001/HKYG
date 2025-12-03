-- 用户登录历史表
CREATE TABLE `user_login_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `login_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
  `logout_time` datetime DEFAULT NULL COMMENT '登出时间',
  `ip_address` varchar(64) DEFAULT NULL COMMENT 'IP地址',
  `location` varchar(255) DEFAULT NULL COMMENT '登录地点',
  `device_info` varchar(500) DEFAULT NULL COMMENT '设备信息',
  `device_type` varchar(20) DEFAULT NULL COMMENT '设备类型（PC/Mobile/Tablet）',
  `os_info` varchar(100) DEFAULT NULL COMMENT '操作系统',
  `browser_info` varchar(100) DEFAULT NULL COMMENT '浏览器信息',
  `login_status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '登录状态（0失败 1成功）',
  `failure_reason` varchar(255) DEFAULT NULL COMMENT '失败原因',
  `session_id` varchar(128) DEFAULT NULL COMMENT '会话ID',
  `user_agent` text COMMENT 'User-Agent',
  `is_online` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否在线（0否 1是）',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_login_time` (`login_time`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_login_status` (`login_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户登录历史表';

-- 用户安全配置表
CREATE TABLE `user_security_config` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `password_expire_days` int(11) NOT NULL DEFAULT 90 COMMENT '密码过期天数',
  `max_failed_attempts` int(11) NOT NULL DEFAULT 5 COMMENT '最大失败尝试次数',
  `lock_time_minutes` int(11) NOT NULL DEFAULT 30 COMMENT '锁定时间（分钟）',
  `is_two_factor_enabled` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否启用双因子认证（0否 1是）',
  `two_factor_secret` varchar(255) DEFAULT NULL COMMENT '双因子认证密钥',
  `backup_codes` text COMMENT '备用验证码',
  `security_questions` text COMMENT '安全问题和答案',
  `last_password_change` datetime DEFAULT NULL COMMENT '最后密码修改时间',
  `failed_login_attempts` int(11) NOT NULL DEFAULT 0 COMMENT '失败登录尝试次数',
  `locked_until` datetime DEFAULT NULL COMMENT '锁定截止时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户安全配置表';

-- 用户会话管理表
CREATE TABLE `user_session` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `session_id` varchar(128) NOT NULL COMMENT '会话ID',
  `ip_address` varchar(64) NOT NULL COMMENT 'IP地址',
  `user_agent` text COMMENT 'User-Agent',
  `device_info` varchar(500) DEFAULT NULL COMMENT '设备信息',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否活跃（0否 1是）',
  `last_activity_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后活跃时间',
  `expires_at` datetime NOT NULL COMMENT '过期时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_session_id` (`session_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户会话管理表';

-- 插入测试数据
INSERT INTO `user_security_config` (`user_id`, `password_expire_days`, `max_failed_attempts`, `lock_time_minutes`) VALUES
(1, 90, 5, 30),
(2, 60, 3, 60),
(3, 90, 5, 30);