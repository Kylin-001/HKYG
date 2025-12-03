-- 黑龙江科技大学相关数据

-- 创建校区表
DROP TABLE IF EXISTS `campus`;
CREATE TABLE `campus` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '校区ID',
  `name` VARCHAR(50) NOT NULL COMMENT '校区名称',
  `description` VARCHAR(200) DEFAULT NULL COMMENT '校区描述',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='校区表';

-- 创建教学楼表
DROP TABLE IF EXISTS `teaching_building`;
CREATE TABLE `teaching_building` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '教学楼ID',
  `campus_id` BIGINT(20) NOT NULL COMMENT '所属校区ID',
  `name` VARCHAR(50) NOT NULL COMMENT '教学楼名称',
  `code` VARCHAR(20) DEFAULT NULL COMMENT '教学楼代码',
  `floor_count` INT(11) DEFAULT 0 COMMENT '楼层数',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_campus_id` (`campus_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教学楼表';

-- 创建教室表
DROP TABLE IF EXISTS `classroom`;
CREATE TABLE `classroom` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '教室ID',
  `building_id` BIGINT(20) NOT NULL COMMENT '所属教学楼ID',
  `room_no` VARCHAR(20) NOT NULL COMMENT '教室号',
  `capacity` INT(11) DEFAULT 0 COMMENT '容纳人数',
  `type` VARCHAR(20) DEFAULT NULL COMMENT '教室类型：普通教室、实验室等',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_building_room` (`building_id`, `room_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教室表';

-- 创建寝室楼表
DROP TABLE IF EXISTS `dorm_building`;
CREATE TABLE `dorm_building` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '寝室楼ID',
  `campus_id` BIGINT(20) NOT NULL COMMENT '所属校区ID',
  `name` VARCHAR(50) NOT NULL COMMENT '寝室楼名称',
  `code` VARCHAR(20) DEFAULT NULL COMMENT '寝室楼代码',
  `floor_count` INT(11) DEFAULT 0 COMMENT '楼层数',
  `gender` TINYINT(1) DEFAULT 0 COMMENT '性别：0-混合，1-男生，2-女生',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_campus_id` (`campus_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='寝室楼表';

-- 创建食堂表
DROP TABLE IF EXISTS `dining_hall`;
CREATE TABLE `dining_hall` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '食堂ID',
  `campus_id` BIGINT(20) NOT NULL COMMENT '所属校区ID',
  `name` VARCHAR(50) NOT NULL COMMENT '食堂名称',
  `description` VARCHAR(200) DEFAULT NULL COMMENT '食堂描述',
  `floor_count` INT(11) DEFAULT 0 COMMENT '楼层数',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_campus_id` (`campus_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食堂表';

-- 创建校内站点表
DROP TABLE IF EXISTS `campus_site`;
CREATE TABLE `campus_site` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '站点ID',
  `campus_id` BIGINT(20) NOT NULL COMMENT '所属校区ID',
  `name` VARCHAR(50) NOT NULL COMMENT '站点名称',
  `type` VARCHAR(20) DEFAULT NULL COMMENT '站点类型：超市、快递点、打印店等',
  `description` VARCHAR(200) DEFAULT NULL COMMENT '站点描述',
  `location` VARCHAR(200) DEFAULT NULL COMMENT '具体位置',
  `contact_phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_campus_id` (`campus_id`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='校内站点表';

-- 插入黑龙江科技大学校区数据
INSERT INTO `campus` (`id`, `name`, `description`) VALUES
(1, '主校区', '黑龙江科技大学主校区'),
(2, '嵩山校区', '黑龙江科技大学嵩山校区');

-- 插入教学楼数据
INSERT INTO `teaching_building` (`id`, `campus_id`, `name`, `code`, `floor_count`) VALUES
(1, 1, '第一教学楼', 'J1', 6),
(2, 1, '第二教学楼', 'J2', 6),
(3, 1, '第三教学楼', 'J3', 6),
(4, 1, '第四教学楼', 'J4', 6),
(5, 1, '实验楼A区', 'SYLA', 5),
(6, 1, '实验楼B区', 'SYLB', 5),
(7, 1, '实验楼C区', 'SYLC', 5),
(8, 1, '图书馆', 'TSG', 7);

-- 插入部分教室数据
INSERT INTO `classroom` (`id`, `building_id`, `room_no`, `capacity`, `type`) VALUES
-- 第一教学楼部分教室
(1, 1, '101', 120, '普通教室'),
(2, 1, '102', 120, '普通教室'),
(3, 1, '201', 120, '普通教室'),
(4, 1, '202', 120, '普通教室'),
(5, 1, '301', 120, '普通教室'),
(6, 1, '302', 120, '普通教室'),
-- 第二教学楼部分教室
(7, 2, '101', 120, '普通教室'),
(8, 2, '102', 120, '普通教室'),
(9, 2, '201', 120, '普通教室'),
(10, 2, '202', 120, '普通教室'),
-- 实验楼部分实验室
(11, 5, '101', 40, '计算机实验室'),
(12, 5, '102', 40, '计算机实验室'),
(13, 6, '101', 40, '电子实验室'),
(14, 6, '102', 40, '电子实验室');

-- 插入寝室楼数据
INSERT INTO `dorm_building` (`id`, `campus_id`, `name`, `code`, `floor_count`, `gender`) VALUES
(1, 1, '1号公寓', 'D1', 6, 1),
(2, 1, '2号公寓', 'D2', 6, 1),
(3, 1, '3号公寓', 'D3', 6, 1),
(4, 1, '4号公寓', 'D4', 6, 1),
(5, 1, '5号公寓', 'D5', 6, 2),
(6, 1, '6号公寓', 'D6', 6, 2),
(7, 1, '7号公寓', 'D7', 6, 2),
(8, 1, '8号公寓', 'D8', 6, 2),
(9, 1, '9号公寓', 'D9', 6, 1),
(10, 1, '10号公寓', 'D10', 6, 1);

-- 插入食堂数据
INSERT INTO `dining_hall` (`id`, `campus_id`, `name`, `description`, `floor_count`) VALUES
(1, 1, '第一食堂', '学生第一食堂', 2),
(2, 1, '第二食堂', '学生第二食堂', 2),
(3, 1, '第三食堂', '学生第三食堂', 2),
(4, 1, '教工食堂', '教职工食堂', 1);

-- 插入校内站点数据
INSERT INTO `campus_site` (`id`, `campus_id`, `name`, `type`, `description`, `location`, `contact_phone`) VALUES
(1, 1, '大学生超市', '超市', '校内大型超市', '主校区中心位置', '0451-88036123'),
(2, 1, '菜鸟驿站', '快递点', '校内快递收发中心', '主校区西门附近', '0451-88036124'),
(3, 1, '打印店', '打印店', '校内打印服务', '第一教学楼一楼', '13800138001'),
(4, 1, '医务室', '医疗服务', '校医院', '主校区西北角', '0451-88036120'),
(5, 1, '移动营业厅', '通讯服务', '中国移动校内营业厅', '主校区中心位置', '10086'),
(6, 1, '联通营业厅', '通讯服务', '中国联通校内营业厅', '主校区中心位置', '10010'),
(7, 1, '中国电信', '通讯服务', '中国电信校内营业厅', '主校区中心位置', '10000'),
(8, 1, '水果店', '商店', '校内水果店', '第二食堂附近', '13900139001'),
(9, 1, '书店', '书店', '校内书店', '图书馆一楼', '0451-88036125');

-- 插入校内公告示例数据
INSERT INTO `campus_info` (`id`, `info_type`, `title`, `content`, `publish_time`, `status`) VALUES
(1, 2, '关于2023-2024学年第二学期选课的通知', '各位同学：\n2023-2024学年第二学期选课工作即将开始，请同学们按照教务处通知的时间安排进行选课。具体选课时间为：2024年5月10日至5月17日。\n选课系统将于5月10日上午8:00开放，请同学们提前做好选课计划。\n教务处\n2024年5月5日', '2024-05-05 08:00:00', 0),
(2, 2, '校园安全管理规定', '为了保障校园安全，维护正常的教学和生活秩序，特制定本规定。请全体师生员工遵守校园安全管理规定，共同营造安全和谐的校园环境。\n安全保卫处\n2024年4月1日', '2024-04-01 10:00:00', 0),
(3, 1, '本周空教室信息（5月6日-5月10日）', '第一教学楼：\n周一：101（9:50-11:30）、202（13:30-15:10）\n周二：301（8:00-9:40）、402（15:30-17:10）\n周三：102（9:50-11:30）、201（13:30-15:10）\n周四：302（8:00-9:40）、401（15:30-17:10）\n周五：101（9:50-11:30）、202（13:30-15:10）\n教学管理科\n2024年5月5日', '2024-05-05 14:00:00', 0);

-- 更新外卖柜表，添加黑龙江科技大学特定数据
INSERT INTO `delivery_locker` (`locker_code`, `name`, `location`, `campus_area`, `total_cells`, `available_cells`, `status`) VALUES
('LK001', '第一教学楼外卖柜', '第一教学楼一楼大厅', '主校区', 50, 50, 0),
('LK002', '第二教学楼外卖柜', '第二教学楼一楼大厅', '主校区', 50, 50, 0),
('LK003', '第一食堂外卖柜', '第一食堂门口', '主校区', 50, 50, 0),
('LK004', '第二食堂外卖柜', '第二食堂门口', '主校区', 50, 50, 0),
('LK005', '1号公寓外卖柜', '1号公寓楼下', '主校区', 50, 50, 0),
('LK006', '5号公寓外卖柜', '5号公寓楼下', '主校区', 50, 50, 0),
('LK007', '图书馆外卖柜', '图书馆一楼大厅', '主校区', 50, 50, 0),
('LK008', '大学生超市外卖柜', '大学生超市门口', '主校区', 50, 50, 0);