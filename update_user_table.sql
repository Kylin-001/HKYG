-- 更新用户表结构，使其与代码实体类匹配
USE heikeji_mall;

-- 添加缺失的字段
ALTER TABLE `user`
    -- 添加用户名和密码字段
    ADD COLUMN `username` VARCHAR(50) DEFAULT NULL COMMENT '用户名' AFTER `id`,
    ADD COLUMN `password` VARCHAR(100) DEFAULT NULL COMMENT '密码' AFTER `username`,
    -- 修改现有字段
    CHANGE COLUMN `student_no` `student_id` VARCHAR(20) NOT NULL COMMENT '学号',
    CHANGE COLUMN `sex` `gender` TINYINT DEFAULT 0 COMMENT '性别 0-未知 1-男 2-女',
    -- 添加邮箱字段
    ADD COLUMN `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱' AFTER `phone`,
    -- 添加生日字段
    ADD COLUMN `birthday` TIMESTAMP NULL DEFAULT NULL COMMENT '生日' AFTER `gender`,
    -- 添加真实姓名字段
    ADD COLUMN `real_name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名' AFTER `student_id`,
    -- 添加学院和专业字段
    ADD COLUMN `college` VARCHAR(100) DEFAULT NULL COMMENT '学院' AFTER `real_name`,
    ADD COLUMN `major` VARCHAR(100) DEFAULT NULL COMMENT '专业' AFTER `college`,
    -- 添加年级字段
    ADD COLUMN `grade` VARCHAR(20) DEFAULT NULL COMMENT '年级' AFTER `major`,
    -- 添加用户类型字段
    ADD COLUMN `user_type` TINYINT DEFAULT 0 COMMENT '用户类型：0-普通用户，1-配送员，2-管理员' AFTER `grade`,
    -- 添加微信openId字段
    ADD COLUMN `open_id` VARCHAR(100) DEFAULT NULL COMMENT '微信openId' AFTER `status`,
    -- 修改积分字段名称
    CHANGE COLUMN `score` `points` INT DEFAULT 0 COMMENT '积分',
    -- 添加最后登录时间和IP字段
    ADD COLUMN `last_login_time` TIMESTAMP NULL DEFAULT NULL COMMENT '最后登录时间' AFTER `updated_at`,
    ADD COLUMN `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP' AFTER `last_login_time`,
    -- 添加登录次数字段
    ADD COLUMN `login_count` INT DEFAULT 0 COMMENT '登录次数' AFTER `last_login_ip`,
    -- 添加删除标记字段
    ADD COLUMN `deleted` TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除' AFTER `login_count`,
    -- 添加唯一索引
    ADD UNIQUE INDEX `uk_username` (`username`),
    ADD UNIQUE INDEX `uk_phone` (`phone`),
    ADD UNIQUE INDEX `uk_email` (`email`);

-- 添加索引以提高查询性能
CREATE INDEX `idx_status` ON `user` (`status`);
CREATE INDEX `idx_user_type` ON `user` (`user_type`);
CREATE INDEX `idx_deleted` ON `user` (`deleted`);

-- 更新表注释
ALTER TABLE `user` COMMENT '用户表';

SELECT '用户表结构更新完成！' AS result;