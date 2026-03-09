-- 修复用户表字段名称，使其与代码实体类匹配
USE heikeji_mall;

-- 更新字段名称
ALTER TABLE `user`
    -- 将created_at改为create_time
    CHANGE COLUMN `created_at` `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    -- 将updated_at改为update_time
    CHANGE COLUMN `updated_at` `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    -- 修改student_id字段，保持与代码一致
    CHANGE COLUMN `student_id` `studentId` VARCHAR(20) NOT NULL COMMENT '学号',
    -- 修改is_verified字段，代码中没有这个字段
    DROP COLUMN `is_verified`,
    -- 修改status字段，代码中使用的是tinyint而不是tinyint(1)
    MODIFY COLUMN `status` TINYINT DEFAULT 0 COMMENT '状态: 0-正常, 1-禁用',
    -- 修改gender字段，代码中使用的是Integer而不是tinyint(1)
    MODIFY COLUMN `gender` INTEGER DEFAULT 0 COMMENT '性别 0-未知 1-男 2-女';

SELECT '用户表字段名称修复完成！' AS result;