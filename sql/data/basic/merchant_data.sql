-- 商家基础数据（适配当前数据库结构）
USE `heikeji_mall`;

INSERT INTO `merchant` (`name`, `logo`, `contact_phone`, `address`, `description`, `status`) VALUES
('校园便利店', 'http://example.com/logo1.jpg', '13800138001', 'B区食堂一楼', '校园内最大的便利店，提供各类零食、日用品', 0),
('学霸文具店', 'http://example.com/logo2.jpg', '13800138002', 'C区教学楼旁', '专业的文具用品店，满足学生学习需求', 0),
('校园水果店', 'http://example.com/logo3.jpg', '13800138003', 'A区宿舍楼下', '新鲜水果，每日配送', 0);
