-- 初始化数据库表结构脚本
-- 执行顺序：先执行数据库创建，再执行所有表结构文件

-- 创建数据库和设置字符集
SOURCE ./00_create_database.sql;

-- 执行所有表结构文件
SOURCE ./tables/01_schema_version.sql;
SOURCE ./tables/02_user.sql;
SOURCE ./tables/03_user_auth.sql;
SOURCE ./tables/04_user_address.sql;
SOURCE ./tables/05_store.sql;
SOURCE ./tables/06_category.sql;
SOURCE ./tables/07_product.sql;
SOURCE ./tables/08_product_image.sql;
SOURCE ./tables/09_cart.sql;
SOURCE ./tables/10_order.sql;
SOURCE ./tables/11_order_item.sql;
SOURCE ./tables/12_delivery_locker.sql;
SOURCE ./tables/13_payment.sql;
SOURCE ./tables/14_payment_log.sql;
SOURCE ./tables/15_system_config.sql;
SOURCE ./tables/16_system_log.sql;
SOURCE ./tables/17_dict.sql;
SOURCE ./tables/18_role.sql;
SOURCE ./tables/19_menu.sql;
SOURCE ./tables/20_role_menu.sql;
SOURCE ./tables/21_user_role.sql;

-- 插入初始版本记录
INSERT INTO `schema_version` (`version`, `description`) VALUES ('v1.0.0', 'Initial schema creation');
