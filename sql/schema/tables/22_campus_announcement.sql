-- 校园公告分类表
CREATE TABLE IF NOT EXISTS `campus_announcement_category` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `icon` VARCHAR(200) DEFAULT NULL COMMENT '分类图标',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:1-启用,0-禁用',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='校园公告分类表';

-- 校园公告表
CREATE TABLE IF NOT EXISTS `campus_announcement` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` VARCHAR(200) NOT NULL COMMENT '公告标题',
  `content` TEXT NOT NULL COMMENT '公告内容',
  `category_id` BIGINT DEFAULT NULL COMMENT '分类ID',
  `priority` TINYINT(1) DEFAULT 1 COMMENT '优先级:1-普通,2-重要,3-紧急',
  `is_top` TINYINT(1) DEFAULT 0 COMMENT '是否置顶:0-否,1-是',
  `publish_time` TIMESTAMP NULL DEFAULT NULL COMMENT '发布时间',
  `expire_time` TIMESTAMP NULL DEFAULT NULL COMMENT '过期时间',
  `publisher_id` BIGINT DEFAULT NULL COMMENT '发布人ID',
  `view_count` INT DEFAULT 0 COMMENT '阅读次数',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态:0-草稿,1-已发布,2-已下架',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_publish_time` (`publish_time`),
  CONSTRAINT `fk_announcement_category` FOREIGN KEY (`category_id`) REFERENCES `campus_announcement_category` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='校园公告表';
