-- 外卖柜表
CREATE TABLE IF NOT EXISTS `delivery_locker` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '外卖柜ID',
  `locker_code` VARCHAR(20) NOT NULL UNIQUE COMMENT '外卖柜编号',
  `name` VARCHAR(100) NOT NULL COMMENT '外卖柜名称',
  `location` VARCHAR(200) NOT NULL COMMENT '外卖柜位置',
  `campus_area` VARCHAR(50) NOT NULL COMMENT '校园区域',
  `total_cells` INT NOT NULL COMMENT '总格子数',
  `available_cells` INT NOT NULL COMMENT '可用格子数',
  `status` TINYINT(1) DEFAULT 0 COMMENT '外卖柜状态',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_locker_code` (`locker_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='外卖柜表';
