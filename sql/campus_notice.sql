-- ----------------------------
-- Table structure for campus_notice
-- ----------------------------
DROP TABLE IF EXISTS `campus_notice`;
CREATE TABLE `campus_notice` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `campus_id` bigint(20) NOT NULL COMMENT '所属校区ID',
  `title` varchar(255) NOT NULL COMMENT '公告标题',
  `content` text NOT NULL COMMENT '公告内容',
  `type` varchar(50) DEFAULT '通知' COMMENT '公告类型：通知、活动、新闻等',
  `publisher` varchar(50) DEFAULT '' COMMENT '发布人',
  `publish_time` datetime DEFAULT NULL COMMENT '发布时间',
  `status` tinyint(4) DEFAULT 0 COMMENT '状态：0-未发布，1-已发布，2-已过期',
  `is_top` tinyint(4) DEFAULT 0 COMMENT '是否置顶：0-否，1-是',
  `expire_time` datetime DEFAULT NULL COMMENT '过期时间',
  `click_count` int(11) DEFAULT 0 COMMENT '点击量',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_campus_id` (`campus_id`),
  KEY `idx_status` (`status`),
  KEY `idx_is_top` (`is_top`),
  KEY `idx_publish_time` (`publish_time`),
  KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='校园公告表';

-- ----------------------------
-- Records for campus_notice
-- ----------------------------
INSERT INTO `campus_notice` VALUES ('1', '1', '欢迎使用黑科易购校园电商平台', '黑科易购校园电商平台正式上线啦！我们提供外卖服务、校园跑腿、二手交易等多种功能，为校园生活提供便利。', '通知', '管理员', CURRENT_TIMESTAMP, '1', '1', NULL, '0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO `campus_notice` VALUES ('2', '1', '双11购物节活动通知', '双11期间，平台所有商家将推出大量优惠活动，欢迎大家踊跃参与！', '活动', '管理员', CURRENT_TIMESTAMP, '1', '0', DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), '0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO `campus_notice` VALUES ('3', '1', '校园招聘信息', '学校将于下周举办秋季校园招聘会，欢迎各年级同学参加。', '通知', '管理员', CURRENT_TIMESTAMP, '1', '0', DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), '0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
