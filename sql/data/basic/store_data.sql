-- 商家基础数据
USE `heikeji_mall`;

INSERT INTO `store` (`name`, `logo`, `phone`, `address`, `business_hours`, `description`, `status`, `rating`) VALUES
('校园便利店', 'http://example.com/logo1.jpg', '13800138001', 'B区食堂一楼', '08:00-22:00', '校园内最大的便利店，提供各类零食、日用品', 0, 4.5),
('学霸文具店', 'http://example.com/logo2.jpg', '13800138002', 'C区教学楼旁', '09:00-21:00', '专业的文具用品店，满足学生学习需求', 0, 4.2),
('校园水果店', 'http://example.com/logo3.jpg', '13800138003', 'A区宿舍楼下', '07:30-22:30', '新鲜水果，每日配送', 0, 4.7);
