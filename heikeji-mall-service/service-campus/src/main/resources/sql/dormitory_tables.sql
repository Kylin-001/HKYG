-- 宿舍管理相关表结构

-- 1. 宿舍信息表
CREATE TABLE IF NOT EXISTS `dormitory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `building` varchar(50) NOT NULL COMMENT '楼栋',
  `room` varchar(20) NOT NULL COMMENT '房间号',
  `address` varchar(200) DEFAULT NULL COMMENT '地址',
  `floor` int(11) DEFAULT NULL COMMENT '楼层',
  `type` varchar(20) DEFAULT '四人间' COMMENT '宿舍类型：四人间/六人间/八人间',
  `capacity` int(11) DEFAULT 4 COMMENT '容量',
  `current_occupancy` int(11) DEFAULT 0 COMMENT '当前入住人数',
  `gender` varchar(10) DEFAULT NULL COMMENT '性别：male-男，female-女',
  `facilities` text COMMENT '设施配置，JSON格式',
  `electric_balance` decimal(10,2) DEFAULT 0.00 COMMENT '电费余额',
  `electric_used` decimal(10,2) DEFAULT 0.00 COMMENT '本月用电量',
  `water_balance` decimal(10,2) DEFAULT 0.00 COMMENT '水费余额',
  `water_used` decimal(10,2) DEFAULT 0.00 COMMENT '本月用水量',
  `status` tinyint(4) DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_building_room` (`building`, `room`),
  KEY `idx_building` (`building`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宿舍信息表';

-- 2. 宿舍学生关联表
CREATE TABLE IF NOT EXISTS `dormitory_student` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `dormitory_id` bigint(20) NOT NULL COMMENT '宿舍ID',
  `student_id` bigint(20) NOT NULL COMMENT '学生ID',
  `student_name` varchar(50) DEFAULT NULL COMMENT '学生姓名',
  `department` varchar(100) DEFAULT NULL COMMENT '学院',
  `major` varchar(100) DEFAULT NULL COMMENT '专业',
  `avatar` varchar(500) DEFAULT NULL COMMENT '头像',
  `move_in_date` date DEFAULT NULL COMMENT '入住日期',
  `move_out_date` date DEFAULT NULL COMMENT '退宿日期',
  `status` tinyint(4) DEFAULT 1 COMMENT '状态：0-已退宿，1-在住',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_dormitory_id` (`dormitory_id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宿舍学生关联表';

-- 3. 宿舍报修表
CREATE TABLE IF NOT EXISTS `dormitory_repair` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `ticket_no` varchar(50) NOT NULL COMMENT '工单号',
  `dormitory_id` bigint(20) DEFAULT NULL COMMENT '宿舍ID',
  `student_id` bigint(20) NOT NULL COMMENT '学生ID',
  `title` varchar(200) NOT NULL COMMENT '报修标题',
  `description` text COMMENT '问题描述',
  `type` varchar(20) DEFAULT 'other' COMMENT '报修类型：utility-水电，furniture-家具，network-网络，door-门窗，other-其他',
  `status` varchar(20) DEFAULT 'pending' COMMENT '状态：pending-待处理，processing-处理中，completed-已完成，rejected-已驳回',
  `images` text COMMENT '图片URL，逗号分隔',
  `preferred_time` varchar(100) DEFAULT NULL COMMENT '方便维修时间',
  `handler` varchar(50) DEFAULT NULL COMMENT '处理人',
  `result` text COMMENT '处理结果',
  `submitted_at` datetime DEFAULT NULL COMMENT '提交时间',
  `completed_at` datetime DEFAULT NULL COMMENT '完成时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ticket_no` (`ticket_no`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_status` (`status`),
  KEY `idx_dormitory_id` (`dormitory_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宿舍报修表';

-- 4. 宿舍门禁记录表
CREATE TABLE IF NOT EXISTS `dormitory_access_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `student_id` bigint(20) NOT NULL COMMENT '学生ID',
  `type` varchar(10) NOT NULL COMMENT '类型：in-进入，out-离开',
  `time` datetime NOT NULL COMMENT '时间',
  `location` varchar(100) DEFAULT NULL COMMENT '位置',
  `method` varchar(20) DEFAULT 'card' COMMENT '方式：card-门禁卡，face-人脸识别，password-密码，temporary-临时密码',
  `status` varchar(20) DEFAULT 'success' COMMENT '状态：success-成功，failed-失败',
  `device_name` varchar(100) DEFAULT NULL COMMENT '设备名称',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宿舍门禁记录表';

-- 5. 宿舍卫生评分记录表
CREATE TABLE IF NOT EXISTS `dormitory_hygiene_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `dormitory_id` bigint(20) NOT NULL COMMENT '宿舍ID',
  `date` date NOT NULL COMMENT '检查日期',
  `week` varchar(50) DEFAULT NULL COMMENT '周次',
  `score` int(11) DEFAULT 0 COMMENT '得分',
  `total_score` int(11) DEFAULT 100 COMMENT '总分',
  `items` text COMMENT '评分项详情，JSON格式',
  `inspector` varchar(50) DEFAULT NULL COMMENT '检查人',
  `rank` int(11) DEFAULT NULL COMMENT '排名',
  `total_rooms` int(11) DEFAULT NULL COMMENT '总房间数',
  `comment` text COMMENT '评语',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_dormitory_id` (`dormitory_id`),
  KEY `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宿舍卫生评分记录表';

-- 6. 宿舍临时密码表
CREATE TABLE IF NOT EXISTS `dormitory_temp_password` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `student_id` bigint(20) NOT NULL COMMENT '学生ID',
  `code` varchar(10) NOT NULL COMMENT '密码',
  `valid_from` datetime NOT NULL COMMENT '有效期开始',
  `valid_to` datetime NOT NULL COMMENT '有效期结束',
  `usage_limit` int(11) DEFAULT 1 COMMENT '使用次数限制',
  `usage_count` int(11) DEFAULT 0 COMMENT '已使用次数',
  `status` varchar(20) DEFAULT 'active' COMMENT '状态：active-有效，expired-已过期，disabled-已禁用',
  `purpose` varchar(200) DEFAULT NULL COMMENT '用途说明',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_status` (`status`),
  KEY `idx_valid_to` (`valid_to`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宿舍临时密码表';

-- 7. 宿舍访客记录表
CREATE TABLE IF NOT EXISTS `dormitory_visitor` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `student_id` bigint(20) NOT NULL COMMENT '学生ID',
  `dormitory_id` bigint(20) DEFAULT NULL COMMENT '宿舍ID',
  `visitor_name` varchar(50) NOT NULL COMMENT '访客姓名',
  `visitor_phone` varchar(20) DEFAULT NULL COMMENT '访客电话',
  `visit_date` date NOT NULL COMMENT '来访日期',
  `visit_time` varchar(20) DEFAULT NULL COMMENT '来访时间',
  `purpose` varchar(500) DEFAULT NULL COMMENT '来访事由',
  `status` varchar(20) DEFAULT 'pending' COMMENT '状态：pending-待审批，approved-已通过，rejected-已拒绝，completed-已完成',
  `approved_by` varchar(50) DEFAULT NULL COMMENT '审批人',
  `approved_at` datetime DEFAULT NULL COMMENT '审批时间',
  `remark` text COMMENT '备注',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_status` (`status`),
  KEY `idx_visit_date` (`visit_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宿舍访客记录表';

-- 8. 宿舍调换申请表
CREATE TABLE IF NOT EXISTS `dormitory_swap_request` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `student_id` bigint(20) NOT NULL COMMENT '学生ID',
  `student_name` varchar(50) DEFAULT NULL COMMENT '学生姓名',
  `current_dormitory_id` bigint(20) DEFAULT NULL COMMENT '当前宿舍ID',
  `current_dorm` varchar(50) DEFAULT NULL COMMENT '当前楼栋',
  `current_room` varchar(20) DEFAULT NULL COMMENT '当前房间',
  `target_dorm` varchar(50) NOT NULL COMMENT '目标楼栋',
  `target_room` varchar(20) NOT NULL COMMENT '目标房间',
  `reason` text NOT NULL COMMENT '调换原因',
  `status` varchar(20) DEFAULT 'pending' COMMENT '状态：pending-待审批，approved-已通过，rejected-已拒绝，completed-已完成',
  `approved_by` varchar(50) DEFAULT NULL COMMENT '审批人',
  `approved_at` datetime DEFAULT NULL COMMENT '审批时间',
  `remark` text COMMENT '备注',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宿舍调换申请表';

-- 9. 宿舍晚归记录表
CREATE TABLE IF NOT EXISTS `dormitory_late_return` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `student_id` bigint(20) NOT NULL COMMENT '学生ID',
  `date` date NOT NULL COMMENT '日期',
  `expected_return_time` varchar(20) DEFAULT '22:30' COMMENT '应归时间',
  `actual_return_time` varchar(20) DEFAULT NULL COMMENT '实际归时间',
  `late_minutes` int(11) DEFAULT 0 COMMENT '晚归分钟数',
  `reason` text COMMENT '晚归原因',
  `status` varchar(20) DEFAULT 'unreported' COMMENT '状态：unreported-未说明，reported-已说明，excused-已豁免，punished-已处理',
  `reporter` varchar(50) DEFAULT NULL COMMENT '记录人',
  `remark` text COMMENT '备注',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_date` (`date`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宿舍晚归记录表';

-- 10. 宿舍费用账单表
CREATE TABLE IF NOT EXISTS `dormitory_bill` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `student_id` bigint(20) NOT NULL COMMENT '学生ID',
  `dormitory_id` bigint(20) DEFAULT NULL COMMENT '宿舍ID',
  `type` varchar(20) NOT NULL COMMENT '类型：electricity-电费，water-水费，accommodation-住宿费，other-其他',
  `title` varchar(200) NOT NULL COMMENT '标题',
  `amount` decimal(10,2) NOT NULL COMMENT '金额',
  `period` varchar(50) DEFAULT NULL COMMENT '账期',
  `due_date` date DEFAULT NULL COMMENT '截止日期',
  `paid_at` datetime DEFAULT NULL COMMENT '支付时间',
  `status` varchar(20) DEFAULT 'pending' COMMENT '状态：pending-待支付，paid-已支付，overdue-已逾期',
  `details` text COMMENT '费用明细，JSON格式',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宿舍费用账单表';

-- 插入测试数据
INSERT INTO `dormitory` (`building`, `room`, `address`, `floor`, `type`, `capacity`, `current_occupancy`, `gender`, `electric_balance`, `water_balance`) VALUES
('12号楼', '305', '学生公寓12号楼3层北侧', 3, '四人间', 4, 4, 'male', 45.68, 23.45),
('12号楼', '306', '学生公寓12号楼3层北侧', 3, '四人间', 4, 3, 'male', 12.50, 8.20),
('12号楼', '307', '学生公寓12号楼3层南侧', 3, '四人间', 4, 4, 'male', 89.30, 45.60),
('13号楼', '201', '学生公寓13号楼2层北侧', 2, '六人间', 6, 5, 'female', 5.20, 3.10),
('13号楼', '202', '学生公寓13号楼2层北侧', 2, '六人间', 6, 6, 'female', 67.80, 34.50);
