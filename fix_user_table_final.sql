-- 最终修复用户表字段名称，使其与代码查询匹配
USE heikeji_mall;

-- 更新字段名称，将驼峰命名改回下划线命名
ALTER TABLE `user`
    -- 将studentId改回student_id
    CHANGE COLUMN `studentId` `student_id` VARCHAR(20) NOT NULL COMMENT '学号',
    -- 确保所有字段与代码查询一致
    MODIFY COLUMN `password` VARCHAR(100) DEFAULT NULL COMMENT '密码',
    MODIFY COLUMN `nickname` VARCHAR(50) NOT NULL COMMENT '昵称',
    MODIFY COLUMN `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    MODIFY COLUMN `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    MODIFY COLUMN `gender` INTEGER DEFAULT 0 COMMENT '性别 0-未知 1-男 2-女',
    MODIFY COLUMN `birthday` TIMESTAMP NULL DEFAULT NULL COMMENT '生日',
    MODIFY COLUMN `real_name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名',
    MODIFY COLUMN `college` VARCHAR(100) DEFAULT NULL COMMENT '学院',
    MODIFY COLUMN `major` VARCHAR(100) DEFAULT NULL COMMENT '专业',
    MODIFY COLUMN `grade` VARCHAR(20) DEFAULT NULL COMMENT '年级',
    MODIFY COLUMN `user_type` TINYINT DEFAULT 0 COMMENT '用户类型：0-普通用户，1-配送员，2-管理员',
    MODIFY COLUMN `status` TINYINT DEFAULT 0 COMMENT '状态：0-禁用，1-正常',
    MODIFY COLUMN `open_id` VARCHAR(100) DEFAULT NULL COMMENT '微信openId',
    MODIFY COLUMN `balance` DECIMAL(10,2) DEFAULT 0.00 COMMENT '余额',
    MODIFY COLUMN `points` INT DEFAULT 0 COMMENT '积分',
    MODIFY COLUMN `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    MODIFY COLUMN `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    MODIFY COLUMN `last_login_time` TIMESTAMP NULL DEFAULT NULL COMMENT '最后登录时间',
    MODIFY COLUMN `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
    MODIFY COLUMN `login_count` INT DEFAULT 0 COMMENT '登录次数',
    MODIFY COLUMN `deleted` TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除，1-已删除';

-- 插入一个测试用户，用于登录测试
INSERT INTO `user` (`student_id`, `username`, `password`, `nickname`, `phone`, `status`, `user_type`) 
VALUES ('20220000', 'admin', '$2a$10$e7V6nW5yZ7xX8cV9bN0mK1lJ2kH3jG4iF5hE6gD7fC8dB9aA0zY', '管理员', '13800138000', 0, 2)
ON DUPLICATE KEY UPDATE 
    username = VALUES(username),
    password = VALUES(password),
    nickname = VALUES(nickname),
    phone = VALUES(phone),
    status = VALUES(status),
    user_type = VALUES(user_type);

SELECT '用户表字段名称最终修复完成！' AS result;