-- 版本控制表
CREATE TABLE IF NOT EXISTS `schema_version` (
  `version` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据库版本控制表';
