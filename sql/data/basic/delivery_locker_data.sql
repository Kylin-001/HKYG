-- 外卖柜基础数据
USE `heikeji_mall`;

INSERT INTO `delivery_locker` (`locker_code`, `name`, `location`, `campus_area`, `total_cells`, `available_cells`, `status`) VALUES
('LOCKER001', 'B区食堂外卖柜', 'B区食堂门口', 'B区', 30, 25, 0),
('LOCKER002', 'A区宿舍外卖柜', 'A区宿舍楼下', 'A区', 20, 18, 0),
('LOCKER003', 'C区教学楼外卖柜', 'C区教学楼大厅', 'C区', 25, 22, 0),
('LOCKER004', '图书馆外卖柜', '图书馆正门左侧', 'C区', 15, 12, 0);
