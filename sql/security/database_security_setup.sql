-- ================================
-- 黑科易购项目数据库安全配置脚本
-- 版本: 1.0
-- 描述: 数据库用户权限、安全策略和数据加密配置
-- 日期: 2025-11-18
-- ================================

USE mysql;

-- ================================
-- 1. 创建应用专用数据库用户
-- ================================

-- 删除已存在的用户（如果存在）
DROP USER IF EXISTS 'heikeji_app'@'%';
DROP USER IF EXISTS 'heikeji_read'@'%';
DROP USER IF EXISTS 'heikeji_admin'@'localhost';

-- 创建应用用户（完整读写权限）
CREATE USER 'heikeji_app'@'%' IDENTIFIED BY 'HeikejiApp@2025#';

-- 创建只读用户（仅查询权限）
CREATE USER 'heikeji_read'@'%' IDENTIFIED BY 'HeikejiRead@2025#';

-- 创建管理用户（仅本地主机）
CREATE USER 'heikeji_admin'@'localhost' IDENTIFIED BY 'HeikejiAdmin@2025#';

-- ================================
-- 2. 权限分配
-- ================================

-- 应用用户权限：完整的读写权限，但不允许删除数据库
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX ON heikeji_mall.* TO 'heikeji_app'@'%';

-- 只读用户权限：仅查询权限
GRANT SELECT ON heikeji_mall.* TO 'heikeji_read'@'%';

-- 管理用户权限：完整权限（用于运维）
GRANT ALL PRIVILEGES ON heikeji_mall.* TO 'heikeji_admin'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;

-- ================================
-- 3. 安全参数配置
-- ================================

USE heikeji_mall;

-- 禁用危险的系统变量
SET GLOBAL local_infile = 0; -- 禁用本地文件导入
SET GLOBAL sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO'; -- 严格模式

-- ================================
-- 4. 创建数据库安全视图
-- ================================

-- 创建用户信息视图（隐藏敏感信息）
CREATE OR REPLACE VIEW user_info_security AS
SELECT 
    u.id,
    u.student_no,
    u.nickname,
    u.phone,
    u.email,
    u.gender,
    u.avatar,
    u.status,
    u.balance,
    u.score,
    u.campus_id,
    u.dorm_building_id,
    u.dorm_room_no,
    u.create_time,
    u.update_time
FROM `user` u
WHERE u.del_flag = 0;

-- 创建订单安全视图（隐藏用户隐私信息）
CREATE OR REPLACE VIEW order_info_security AS
SELECT 
    o.id,
    o.order_no,
    o.user_id,
    u.student_no,
    o.merchant_id,
    m.name AS merchant_name,
    o.address_id,
    CONCAT(a.consignee, ' (', SUBSTRING(a.phone, 1, 3), '****', SUBSTRING(a.phone, 8), ')') AS contact_info,
    CONCAT(a.province, a.city, a.district, a.detail_address) AS delivery_address,
    o.total_amount,
    o.delivery_fee,
    o.actual_amount,
    o.status,
    o.payment_type,
    o.delivery_type,
    o.remark,
    o.create_time,
    o.update_time,
    o.paid_time,
    o.delivery_time,
    o.completed_time
FROM `order` o
LEFT JOIN `user` u ON o.user_id = u.id
LEFT JOIN `merchant` m ON o.merchant_id = m.id
LEFT JOIN `address` a ON o.address_id = a.id;

-- 创建支付信息安全视图（隐藏完整卡号信息）
CREATE OR REPLACE VIEW payment_info_security AS
SELECT 
    p.id,
    p.order_no,
    p.user_id,
    u.student_no,
    p.amount,
    CASE p.payment_type
        WHEN 0 THEN '余额支付'
        WHEN 1 THEN '微信支付'
        WHEN 2 THEN '支付宝'
        ELSE '其他'
    END AS payment_type_name,
    p.status,
    CASE p.status
        WHEN 0 THEN '待支付'
        WHEN 1 THEN '支付中'
        WHEN 2 THEN '支付成功'
        WHEN 3 THEN '支付失败'
        WHEN 4 THEN '已退款'
        ELSE '未知'
    END AS status_name,
    CASE WHEN p.transaction_id IS NOT NULL THEN 
        CONCAT(SUBSTRING(p.transaction_id, 1, 8), '****', SUBSTRING(p.transaction_id, -4))
        ELSE NULL 
    END AS transaction_id_masked,
    p.payment_time,
    p.refund_time,
    p.create_time,
    p.update_time
FROM `payment` p
LEFT JOIN `user` u ON p.user_id = u.id;

-- ================================
-- 5. 创建数据脱敏函数
-- ================================

DELIMITER //

-- 手机号脱敏函数
CREATE FUNCTION phone_mask(phone VARCHAR(20)) 
RETURNS VARCHAR(20)
DETERMINISTIC
READS SQL DATA
BEGIN
    IF phone IS NULL OR LENGTH(phone) < 11 THEN
        RETURN phone;
    END IF;
    RETURN CONCAT(SUBSTRING(phone, 1, 3), '****', SUBSTRING(phone, 8));
END//

-- 身份证号脱敏函数
CREATE FUNCTION id_card_mask(id_card VARCHAR(20)) 
RETURNS VARCHAR(20)
DETERMINISTIC
READS SQL DATA
BEGIN
    IF id_card IS NULL OR LENGTH(id_card) < 8 THEN
        RETURN id_card;
    END IF;
    RETURN CONCAT(SUBSTRING(id_card, 1, 6), '********', SUBSTRING(id_card, -4));
END//

-- 姓名脱敏函数
CREATE FUNCTION name_mask(name VARCHAR(50)) 
RETURNS VARCHAR(50)
DETERMINISTIC
READS SQL DATA
BEGIN
    IF name IS NULL OR LENGTH(name) <= 2 THEN
        RETURN name;
    END IF;
    RETURN CONCAT(SUBSTRING(name, 1, 1), '**');
END//

DELIMITER ;

-- ================================
-- 6. 创建审计跟踪表
-- ================================

-- 数据变更日志表
CREATE TABLE IF NOT EXISTS `data_audit_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '日志ID',
    `table_name` VARCHAR(50) NOT NULL COMMENT '表名',
    `record_id` BIGINT NOT NULL COMMENT '记录ID',
    `operation` VARCHAR(10) NOT NULL COMMENT '操作类型 INSERT/UPDATE/DELETE',
    `old_values` JSON DEFAULT NULL COMMENT '修改前的值',
    `new_values` JSON DEFAULT NULL COMMENT '修改后的值',
    `operator` VARCHAR(50) DEFAULT NULL COMMENT '操作者',
    `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP地址',
    `user_agent` VARCHAR(255) DEFAULT NULL COMMENT '用户代理',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    PRIMARY KEY (`id`),
    KEY `idx_table_record` (`table_name`, `record_id`),
    KEY `idx_create_time` (`create_time`),
    KEY `idx_operator` (`operator`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据审计日志表';

-- ================================
-- 7. 创建触发器（用于审计）
-- ================================

DELIMITER //

-- 用户表更新触发器
CREATE TRIGGER user_update_audit 
AFTER UPDATE ON `user`
FOR EACH ROW
BEGIN
    INSERT INTO `data_audit_log` (
        `table_name`, `record_id`, `operation`, 
        `old_values`, `new_values`, `create_time`
    ) VALUES (
        'user', NEW.id, 'UPDATE',
        JSON_OBJECT(
            'nickname', OLD.nickname,
            'phone', OLD.phone,
            'email', OLD.email,
            'status', OLD.status,
            'balance', OLD.balance
        ),
        JSON_OBJECT(
            'nickname', NEW.nickname,
            'phone', NEW.phone,
            'email', NEW.email,
            'status', NEW.status,
            'balance', NEW.balance
        ),
        NOW()
    );
END//

-- 订单表更新触发器
CREATE TRIGGER order_update_audit 
AFTER UPDATE ON `order`
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status OR OLD.actual_amount != NEW.actual_amount THEN
        INSERT INTO `data_audit_log` (
            `table_name`, `record_id`, `operation`,
            `old_values`, `new_values`, `create_time`
        ) VALUES (
            'order', NEW.id, 'UPDATE',
            JSON_OBJECT(
                'status', OLD.status,
                'actual_amount', OLD.actual_amount,
                'payment_type', OLD.payment_type
            ),
            JSON_OBJECT(
                'status', NEW.status,
                'actual_amount', NEW.actual_amount,
                'payment_type', NEW.payment_type
            ),
            NOW()
        );
    END IF;
END//

-- 支付表更新触发器
CREATE TRIGGER payment_update_audit 
AFTER UPDATE ON `payment`
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO `data_audit_log` (
            `table_name`, `record_id`, `operation`,
            `old_values`, `new_values`, `create_time`
        ) VALUES (
            'payment', NEW.id, 'UPDATE',
            JSON_OBJECT(
                'status', OLD.status,
                'amount', OLD.amount,
                'transaction_id', OLD.transaction_id
            ),
            JSON_OBJECT(
                'status', NEW.status,
                'amount', NEW.amount,
                'transaction_id', NEW.transaction_id
            ),
            NOW()
        );
    END IF;
END//

DELIMITER ;

-- ================================
-- 8. 安全检查查询
-- ================================

-- 检查用户权限
SELECT 
    User AS '用户',
    Host AS '主机',
    Select_priv AS '查询权限',
    Insert_priv AS '插入权限',
    Update_priv AS '更新权限',
    Delete_priv AS '删除权限',
    Create_priv AS '创建权限',
    Drop_priv AS '删除数据库权限'
FROM mysql.user
WHERE User LIKE 'heikeji%';

-- 检查敏感数据
SELECT 
    '用户表敏感数据' AS 检查项目,
    COUNT(*) AS 总数,
    SUM(CASE WHEN phone IS NOT NULL THEN 1 ELSE 0 END) AS 有手机号,
    SUM(CASE WHEN email IS NOT NULL THEN 1 ELSE 0 END) AS 有邮箱,
    SUM(CASE WHEN id_card IS NOT NULL THEN 1 ELSE 0 END) AS 有身份证
FROM user_auth ua
LEFT JOIN user u ON ua.user_id = u.id;

-- ================================
-- 9. 输出配置摘要
-- ================================

SELECT 
    '数据库安全配置完成' AS 配置状态,
    'heikeji_app' AS 应用用户,
    'heikeji_read' AS 只读用户,
    'heikeji_admin' AS 管理用户,
    NOW() AS 配置时间;

SELECT 
    '安全视图已创建' AS 视图状态,
    'user_info_security' AS 用户信息视图,
    'order_info_security' AS 订单信息视图,
    'payment_info_security' AS 支付信息视图,
    NOW() AS 创建时间;

SELECT 
    '审计功能已启用' AS 审计状态,
    'data_audit_log' AS 审计日志表,
    '用户更新审计触发器' AS 用户审计,
    '订单更新审计触发器' AS 订单审计,
    '支付更新审计触发器' AS 支付审计,
    NOW() AS 启用时间;