# 数据库表结构对比分析报告

**生成日期**: 2026-03-13

---

## 一、代码中定义的表（71个）

| 序号 | 表名 | 模块 | 说明 |
|------|------|------|------|
| 1 | user | 用户服务 | 用户表 |
| 2 | user_auth | 用户服务 | 用户认证表 |
| 3 | address | 用户服务 | 地址表 |
| 4 | user_login_history | 用户服务 | 登录历史表 |
| 5 | user_behavior_log | 用户服务 | 行为日志表 |
| 6 | delivery_person | 用户服务 | 配送员表 |
| 7 | delivery_request | 用户服务 | 配送请求表 |
| 8 | sys_user_role | 用户服务 | 用户角色表 |
| 9 | sys_role_permission | 用户服务 | 角色权限表 |
| 10 | sys_role | 用户服务 | 角色表 |
| 11 | sys_permission | 用户服务 | 权限表 |
| 12 | category | 商品服务 | 分类表 |
| 13 | product | 商品服务 | 商品表 |
| 14 | cart | 商品服务 | 购物车表 |
| 15 | product_comment | 商品服务 | 商品评价表 |
| 16 | product_comment_stats | 商品服务 | 评价统计表 |
| 17 | product_hot_word | 商品服务 | 热词表 |
| 18 | product_view_history | 商品服务 | 浏览历史表 |
| 19 | user_behavior_log | 商品服务 | 行为日志表 |
| 20 | order | 订单服务 | 订单主表 |
| 21 | order_item | 订单服务 | 订单明细表 |
| 22 | order_comment | 订单服务 | 订单评价表 |
| 23 | order_review | 订单服务 | 订单评价表(v2) |
| 24 | order_review_like | 订单服务 | 评价点赞表 |
| 25 | refund_log | 订单服务 | 退款日志表 |
| 26 | refund_reason | 订单服务 | 退款原因表 |
| 27 | user_coupon | 订单服务 | 用户优惠券表 |
| 28 | coupon | 订单服务 | 优惠券表 |
| 29 | merchant | 外卖服务 | 商家表 |
| 30 | takeout_category | 外卖服务 | 外卖分类表 |
| 31 | takeout_product | 外卖服务 | 外卖商品表 |
| 32 | takeout_order | 外卖服务 | 外卖订单表 |
| 33 | takeout_order_item | 外卖服务 | 外卖订单明细表 |
| 34 | takeout_locker | 外卖服务 | 外卖柜表 |
| 35 | takeout_review | 外卖服务 | 外卖评价表 |
| 36 | takeout_delivery_track | 外卖服务 | 配送轨迹表 |
| 37 | delivery_locker | 外卖服务 | 配送柜表 |
| 38 | secondhand_category | 二手服务 | 二手分类表 |
| 39 | secondhand_product | 二手服务 | 二手商品表 |
| 40 | payment | 支付服务 | 支付记录表 |
| 41 | payment_reconciliation | 支付服务 | 对账表 |
| 42 | payment_reconciliation_batch | 支付服务 | 对账批次表 |
| 43 | member_level | 会员服务 | 会员等级表 |
| 44 | user_level_record | 会员服务 | 用户等级记录表 |
| 45 | user_activity_record | 会员服务 | 用户活动记录表 |
| 46 | point_rule | 会员服务 | 积分规则表 |
| 47 | point_record | 会员服务 | 积分记录表 |
| 48 | point_product | 会员服务 | 积分商品表 |
| 49 | marketing_activity | 会员服务 | 营销活动表 |
| 50 | member_receive_address | 会员服务 | 会员收货地址表 |
| 51 | delivery_order | 配送服务 | 配送订单表 |
| 52 | delivery_user | 配送服务 | 配送用户表 |
| 53 | delivery_tracking | 配送服务 | 配送跟踪表 |
| 54 | delivery_route | 配送服务 | 配送路线表 |
| 55 | delivery_review | 配送服务 | 配送评价表 |
| 56 | delivery_event | 配送服务 | 配送事件表 |
| 57 | campus | 校园服务 | 校园表 |
| 58 | campus_notice | 校园服务 | 校园公告表 |
| 59 | campus_site | 校园服务 | 校园场地表 |
| 60 | campus_building | 校园服务 | 校园建筑表 |
| 61 | empty_classroom | 校园服务 | 空教室表 |
| 62 | lost_found | 失物招领 | 失物招领表 |
| 63 | sys_user | 系统服务 | 系统用户表 |
| 64 | sys_role | 系统服务 | 系统角色表 |
| 65 | sys_permission | 系统服务 | 系统权限表 |
| 66 | sys_user_role | 系统服务 | 系统用户角色表 |
| 67 | sys_role_permission | 系统服务 | 系统角色权限表 |
| 68 | system_config | 系统服务 | 系统配置表 |
| 69 | sys_admin_user | 管理后台 | 管理员用户表 |
| 70 | user_coupon | 会员服务 | 用户优惠券表 |
| 71 | product_comment_like | 商品服务 | 评价点赞表 |

---

## 二、SQL文件中已定义的表

### schema/tables/ 目录 (25个表)

| 序号 | 文件 | 表名 | 状态 |
|------|------|------|------|
| 1 | 01_schema_version | schema_version | ✅ |
| 2 | 02_user | user | ✅ |
| 3 | 03_user_auth | user_auth | ✅ |
| 4 | 04_user_address | user_address | ✅ |
| 5 | 05_store | store | ✅ |
| 6 | 06_category | category | ✅ |
| 7 | 07_product | product | ✅ |
| 8 | 08_product_image | product_image | ✅ |
| 9 | 09_cart | cart | ✅ |
| 10 | 10_order | order | ✅ |
| 11 | 11_order_item | order_item | ✅ |
| 12 | 12_delivery_locker | delivery_locker | ✅ |
| 13 | 13_payment | payment | ✅ |
| 14 | 14_payment_log | payment_log | ✅ |
| 15 | 15_system_config | system_config | ✅ |
| 16 | 16_system_log | system_log | ✅ |
| 17 | 17_dict | dict | ✅ |
| 18 | 18_role | role | ✅ |
| 19 | 19_menu | menu | ✅ |
| 20 | 20_role_menu | role_menu | ✅ |
| 21 | 21_user_role | user_role | ✅ |
| 22 | 22_campus_announcement | campus_announcement | ✅ |
| 23 | 23_campus_classroom | campus_classroom | ✅ |
| 24 | 24_points_system | points_system | ✅ |
| 25 | 25_coupon_system | coupon_system | ✅ |

---

## 三、差异分析

### 3.1 代码中有但SQL文件中缺少的表

| 表名 | 模块 | 优先级 | 建议 |
|------|------|--------|------|
| user_login_history | 用户服务 | 高 | 需要创建 |
| user_behavior_log | 用户服务 | 高 | 需要创建 |
| delivery_person | 用户服务 | 高 | 需要创建 |
| delivery_request | 用户服务 | 高 | 需要创建 |
| product_comment | 商品服务 | 高 | 需要创建 |
| product_comment_stats | 商品服务 | 中 | 需要创建 |
| product_hot_word | 商品服务 | 中 | 需要创建 |
| product_view_history | 商品服务 | 中 | 需要创建 |
| product_comment_like | 商品服务 | 高 | 需要创建 |
| order_comment | 订单服务 | 高 | 需要创建 |
| order_review | 订单服务 | 高 | 需要创建 |
| order_review_like | 订单服务 | 高 | 需要创建 |
| refund_log | 订单服务 | 中 | 需要创建 |
| refund_reason | 订单服务 | 中 | 需要创建 |
| user_coupon | 订单服务 | 高 | 需要创建 |
| merchant | 外卖服务 | 高 | 需要创建 |
| takeout_category | 外卖服务 | 中 | 需要创建 |
| takeout_product | 外卖服务 | 高 | 需要创建 |
| takeout_order | 外卖服务 | 高 | 需要创建 |
| takeout_order_item | 外卖服务 | 高 | 需要创建 |
| takeout_locker | 外卖服务 | 中 | 需要创建 |
| takeout_review | 外卖服务 | 中 | 需要创建 |
| takeout_delivery_track | 外卖服务 | 中 | 需要创建 |
| secondhand_category | 二手服务 | 中 | 需要创建 |
| secondhand_product | 二手服务 | 高 | 需要创建 |
| payment_reconciliation | 支付服务 | 中 | 需要创建 |
| payment_reconciliation_batch | 支付服务 | 中 | 需要创建 |
| user_level_record | 会员服务 | 中 | 需要创建 |
| user_activity_record | 会员服务 | 中 | 需要创建 |
| point_rule | 会员服务 | 中 | 需要创建 |
| point_record | 会员服务 | 中 | 需要创建 |
| point_product | 会员服务 | 中 | 需要创建 |
| marketing_activity | 会员服务 | 中 | 需要创建 |
| member_level | 会员服务 | 中 | 需要创建 |
| member_receive_address | 会员服务 | 中 | 需要创建 |
| delivery_order | 配送服务 | 高 | 需要创建 |
| delivery_user | 配送服务 | 高 | 需要创建 |
| delivery_tracking | 配送服务 | 中 | 需要创建 |
| delivery_route | 配送服务 | 中 | 需要创建 |
| delivery_review | 配送服务 | 中 | 需要创建 |
| delivery_event | 配送服务 | 中 | 需要创建 |
| campus | 校园服务 | 高 | 需要创建 |
| campus_notice | 校园服务 | 中 | 需要创建 |
| campus_site | 校园服务 | 中 | 需要创建 |
| campus_building | 校园服务 | 中 | 需要创建 |
| empty_classroom | 校园服务 | 中 | 需要创建 |
| lost_found | 失物招领 | 高 | 需要创建 |
| sys_user | 系统服务 | 高 | 需要创建 |
| sys_admin_user | 管理后台 | 高 | 需要创建 |

### 3.2 SQL文件中有但代码中可能未使用的表

| 表名 | 说明 |
|------|------|
| product_image | 商品图片表 |
| payment_log | 支付日志表 |
| system_log | 系统日志表 |
| dict | 字典表 |
| role | 角色表 |
| menu | 菜单表 |
| role_menu | 角色菜单表 |
| user_role | 用户角色表 |
| campus_announcement | 校园公告表 |
| campus_classroom | 教室表 |
| points_system | 积分系统表 |
| coupon_system | 优惠券系统表 |

---

## 四、结论

### 4.1 数据库匹配度

| 指标 | 数量 | 比例 |
|------|------|------|
| 代码中定义的表 | 71 | 100% |
| SQL文件中已定义的表 | ~25 | 35% |
| 缺少的表 | ~46 | 65% |

### 4.2 建议

1. **高优先级** - 核心业务表（user, order, product, payment等）已存在，需要补充
2. **中优先级** - 扩展功能表（评价、积分、营销等）需要创建
3. **低优先级** - 辅助功能表（日志、统计等）可以后续补充

### 4.3 需要的操作

1. 执行 sql/full_db.sql 初始化基础表
2. 执行 sql/migrations/all_migrations.sql 添加评价相关表
3. 根据缺失表清单创建剩余表结构

---

*本报告由项目分析工具自动生成*
