-- 修复用户表结构，添加缺失的字段
USE heikeji_mall;

-- 添加用户名字段
ALTER TABLE `user` ADD COLUMN `username` VARCHAR(50) NULL COMMENT '用户名' AFTER `id`;
ALTER TABLE `user` ADD COLUMN `password` VARCHAR(255) NULL COMMENT '密码' AFTER `username`;
ALTER TABLE `user` ADD COLUMN `email` VARCHAR(100) NULL COMMENT '邮箱' AFTER `phone`;
ALTER TABLE `user` ADD COLUMN `gender` TINYINT(1) NULL COMMENT '性别：0-未知，1-男，2-女' AFTER `email`;
ALTER TABLE `user` ADD COLUMN `birthday` DATE NULL COMMENT '生日' AFTER `gender`;
ALTER TABLE `user` ADD COLUMN `real_name` VARCHAR(50) NULL COMMENT '真实姓名' AFTER `nickname`;
ALTER TABLE `user` ADD COLUMN `college` VARCHAR(100) NULL COMMENT '学院' AFTER `real_name`;
ALTER TABLE `user` ADD COLUMN `major` VARCHAR(100) NULL COMMENT '专业' AFTER `college`;
ALTER TABLE `user` ADD COLUMN `grade` VARCHAR(20) NULL COMMENT '年级' AFTER `major`;
ALTER TABLE `user` ADD COLUMN `user_type` TINYINT(1) DEFAULT 0 COMMENT '用户类型：0-普通用户，1-配送员，2-管理员' AFTER `grade`;
ALTER TABLE `user` ADD COLUMN `points` INT DEFAULT 0 COMMENT '积分' AFTER `balance`;
ALTER TABLE `user` ADD COLUMN `open_id` VARCHAR(100) NULL COMMENT '微信openId' AFTER `points`;
ALTER TABLE `user` ADD COLUMN `last_login_time` TIMESTAMP NULL COMMENT '最后登录时间' AFTER `updated_at`;
ALTER TABLE `user` ADD COLUMN `last_login_ip` VARCHAR(50) NULL COMMENT '最后登录IP' AFTER `last_login_time`;
ALTER TABLE `user` ADD COLUMN `login_count` INT DEFAULT 0 COMMENT '登录次数' AFTER `last_login_ip`;
ALTER TABLE `user` ADD COLUMN `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除' AFTER `login_count`;

-- 修改字段名以匹配实体类
ALTER TABLE `user` CHANGE COLUMN `student_no` `student_id` VARCHAR(20) NOT NULL COMMENT '学号';
ALTER TABLE `user` CHANGE COLUMN `created_at` `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
ALTER TABLE `user` CHANGE COLUMN `updated_at` `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';
ALTER TABLE `user` CHANGE COLUMN `sex` `gender` TINYINT(1) DEFAULT NULL COMMENT '性别：0-未知，1-男，2-女';
ALTER TABLE `user` CHANGE COLUMN `score` `points` INT DEFAULT 0 COMMENT '积分';

-- 添加唯一索引
ALTER TABLE `user` ADD UNIQUE INDEX `uk_username` (`username`);
ALTER TABLE `user` ADD UNIQUE INDEX `uk_email` (`email`);
ALTER TABLE `user` ADD INDEX `idx_phone` (`phone`);
ALTER TABLE `user` ADD INDEX `idx_status` (`status`);

-- 插入测试用户数据
INSERT INTO `user` (`username`, `password`, `nickname`, `phone`, `email`, `student_id`, `status`, `gender`, `user_type`, `points`, `balance`) VALUES 
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '管理员', '13800138000', 'admin@heikeji.com', '2022000001', 1, 1, 2, 0, 0.00),
('testuser', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '测试用户', '13800138001', 'test@heikeji.com', '2022000002', 1, 1, 0, 100, 100.00),
('zhangsan', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '张三', '13800138002', 'zhangsan@heikeji.com', '2022000003', 1, 1, 0, 50, 50.00),
('lisi', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '李四', '13800138003', 'lisi@heikeji.com', '2022000004', 1, 2, 0, 30, 30.00)
ON DUPLICATE KEY UPDATE 
`password` = VALUES(`password`),
`status` = VALUES(`status`);

SELECT '用户表修复完成！' AS result;
