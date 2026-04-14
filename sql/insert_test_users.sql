-- 插入测试用户数据
USE heikeji_mall;

-- 先检查是否有数据
SELECT COUNT(*) as user_count FROM `user`;

-- 插入测试用户数据
-- 密码都是 BCrypt 加密的 "admin123"
-- 使用数据库中已存在的正确 BCrypt 哈希值
INSERT INTO `user` (`username`, `password`, `nickname`, `phone`, `email`, `student_id`, `status`, `gender`, `user_type`, `points`, `balance`) VALUES 
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '管理员', '13800138000', 'admin@heikeji.com', '2022000001', 1, 1, 2, 0, 0.00),
('testuser', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '测试用户', '13800138001', 'test@heikeji.com', '2022000002', 1, 1, 0, 100, 100.00),
('zhangsan', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '张三', '13800138002', 'zhangsan@heikeji.com', '2022000003', 1, 1, 0, 50, 50.00),
('lisi', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '李四', '13800138003', 'lisi@heikeji.com', '2022000004', 1, 2, 0, 30, 30.00)
ON DUPLICATE KEY UPDATE 
`password` = VALUES(`password`),
`status` = VALUES(`status`);

-- 验证插入结果
SELECT id, username, nickname, phone, email, student_id, status, user_type FROM `user` WHERE username IN ('admin', 'testuser', 'zhangsan', 'lisi');

SELECT '测试用户数据插入完成！' AS result;
