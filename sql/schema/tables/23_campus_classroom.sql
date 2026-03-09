-- 教学楼表
CREATE TABLE IF NOT EXISTS `campus_building` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '教学楼ID',
  `name` VARCHAR(100) NOT NULL COMMENT '教学楼名称',
  `location` VARCHAR(200) DEFAULT NULL COMMENT '位置描述',
  `floor_count` INT DEFAULT NULL COMMENT '楼层数',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:1-正常,0-停用',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教学楼表';

-- 教室表
CREATE TABLE IF NOT EXISTS `campus_classroom` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '教室ID',
  `building_id` BIGINT NOT NULL COMMENT '教学楼ID',
  `name` VARCHAR(50) NOT NULL COMMENT '教室名称',
  `floor` INT DEFAULT NULL COMMENT '楼层',
  `capacity` INT DEFAULT NULL COMMENT '容纳人数',
  `equipment` TEXT DEFAULT NULL COMMENT '设备信息(JSON)',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:1-可用,0-停用',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_building` (`building_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_classroom_building` FOREIGN KEY (`building_id`) REFERENCES `campus_building` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教室表';

-- 教室使用记录表
CREATE TABLE IF NOT EXISTS `campus_classroom_schedule` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `classroom_id` BIGINT NOT NULL COMMENT '教室ID',
  `date` DATE NOT NULL COMMENT '日期',
  `start_time` TIME NOT NULL COMMENT '开始时间',
  `end_time` TIME NOT NULL COMMENT '结束时间',
  `course_name` VARCHAR(100) DEFAULT NULL COMMENT '课程名称',
  `teacher_name` VARCHAR(50) DEFAULT NULL COMMENT '教师姓名',
  `booked_by` BIGINT DEFAULT NULL COMMENT '预订用户ID',
  `booking_type` TINYINT(1) DEFAULT NULL COMMENT '预订类型:1-课程,2-活动,3-自习',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:1-已确认,2-取消',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_classroom_date` (`classroom_id`, `date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_schedule_classroom` FOREIGN KEY (`classroom_id`) REFERENCES `campus_classroom` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教室使用记录表';
