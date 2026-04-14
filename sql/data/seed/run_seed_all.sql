-- ============================================================
-- 黑科易购(heikeji_mall) 种子数据 - 主执行脚本
-- 自动按顺序执行 Part1 → Part2 → Part3
-- 数据库: heikeji_mall | 主机: 192.168.186.128:3306 | 用户: hkyg
-- 执行方式: mysql -u hkyg -p'Mysql@8Root!2025' heikeji_mall < this_file.sql
-- 或在MySQL客户端: SOURCE /path/to/run_seed_all.sql
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

SELECT '============================================' AS '';
SELECT '  开始导入种子数据...' AS message;
SELECT '============================================' AS '';

-- ====== Part 1: 用户系统 + RBAC + 商品 + 购物车 + 订单 + 评价 ======
SELECT '' AS '';
SELECT '>>> [1/3] 导入 Part1: 用户/权限/商品/订单数据...' AS step;
SOURCE e:/Program File/HKYG/heikeji-mall/sql/data/seed/heikeji_mall_seed_data_part1.sql;
SELECT '>>> [1/3] Part1 导入完成!' AS result;

-- ====== Part 2: 外卖 + 二手 + 失物招领 + 配送 ======
SELECT '' AS '';
SELECT '>>> [2/3] 导入 Part2: 外卖/二手/失物招领/配送数据...' AS step;
SOURCE e:/Program File/HKYG/heikeji-mall/sql/data/seed/heikeji_mall_seed_data_part2.sql;
SELECT '>>> [2/3] Part2 导入完成!' AS result;

-- ====== Part 3: 校园服务 + 社区论坛 + 营销系统 ======
SELECT '' AS '';
SELECT '>>> [3/3] 导入 Part3: 校园/社区/营销数据...' AS step;
SOURCE e:/Program File/HKYG/heikeji-mall/sql/data/seed/heikeji_mall_seed_data_part3.sql;
SELECT '>>> [3/3] Part3 导入完成!' AS result;

SET FOREIGN_KEY_CHECKS = 1;

SELECT '' AS '';
SELECT '============================================' AS '';
SELECT '  全部种子数据导入完成！' AS message;
SELECT '============================================' AS '';

-- 最终统计
SELECT '--- 数据量统计 ---' AS section;
SELECT CONCAT('用户: ', COUNT(*), ' 人') AS info FROM `user`;
SELECT CONCAT('商品: ', COUNT(*), ' 个') AS info FROM product;
SELECT CONCAT('商家: ', COUNT(*), ' 家') AS info FROM store;
SELECT CONCAT('购物车: ', COUNT(*), ' 条') AS info FROM cart;
SELECT CONCAT('订单: ', COUNT(*), ' 笔') AS info FROM `order`;
SELECT CONCAT('外卖商家: ', COUNT(*), ' 家') AS info FROM merchant;
SELECT CONCAT('二手商品: ', COUNT(*), ' 个') AS info FROM secondhand_product;
SELECT CONCAT('失物招领: ', COUNT(*), ' 条') AS info FROM lost_found;
SELECT CONCAT('校园建筑: ', COUNT(*), ' 栋') AS info FROM campus_building;
SELECT CONCAT('教室: ', COUNT(*), ' 间') AS info FROM campus_classroom;
SELECT CONCAT('优惠券模板: ', COUNT(*), ' 张') AS info FROM coupon_template;
SELECT CONCAT('会员等级: ', COUNT(*), ' 级') AS info FROM member_level;
