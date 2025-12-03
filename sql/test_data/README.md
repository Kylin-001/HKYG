# 黑科易购项目黑龙江科技大学测试数据

## 数据说明

本测试数据集专门为黑科易购项目设计，基于**黑龙江科技大学**的真实信息构建，包含完整的校园场景数据。

## 数据概览

### 1. 校园信息
- **松北校区**：黑龙江省哈尔滨市松北区学院路73号（主校区）
- **嵩山校区**：黑龙江省哈尔滨市南岗区嵩山路199号

### 2. 外卖柜位置（10个）
- **A区宿舍外卖柜** - A区学生宿舍1号楼门前
- **A区商业街外卖柜** - A区商业街入口处
- **B区食堂外卖柜** - B区学生食堂门口
- **B区宿舍外卖柜** - B区学生宿舍3号楼门前
- **C区商业街外卖柜** - C区商业街中心位置
- **C区图书馆外卖柜** - C区图书馆南门
- **D区教学楼外卖柜** - D区教学楼大厅
- **D区实验楼外卖柜** - D区实验楼东门
- **嵩山校区外卖柜** - 嵩山校区食堂旁
- **嵩山校区宿舍外卖柜** - 嵩山校区学生宿舍楼下

### 3. 商家信息（10家校园内真实商铺）
- 科大超市松北店
- 学府便利店
- 嵩山便民超市
- C区水果小店
- 科大奶茶店
- 学生超市A店
- 松北文具店
- 科大复印店
- 学生餐厅超市
- 校园生活超市

### 4. 商品分类（26个分类）
- **校园食品**：零食小吃、膨化食品、糖果巧克力等
- **生活用品**：日化用品、牙膏牙刷、洗发护发等
- **学习用品**：文具用品、办公用品、电脑配件
- **水果生鲜**：各类新鲜水果
- **饮品饮料**：牛奶饮品、茶饮咖啡、碳酸饮料等

### 5. 商品数据（60+种真实商品）
包含学生日常所需的各类商品：
- **零食类**：奥利奥、乐事薯片、卫龙辣条、旺仔小馒头等
- **饮料类**：农夫山泉、可口可乐、康师傅冰红茶、红牛等
- **生活用品**：云南白药牙膏、海飞丝洗发水、舒肤佳沐浴露等
- **学习用品**：晨光中性笔、得力便利贴、国誉活页本等
- **水果类**：苹果、香蕉、橙子、葡萄、西瓜等
- **奶茶类**：珍珠奶茶、芝士奶盖绿茶、水果茶等

### 6. 用户数据（40个真实学生用户）
- **学号格式**：USTH20200101 - USTH20210110
- **松北校区用户**：前30个用户（A-D区各宿舍楼）
- **嵩山校区用户**：后10个用户（S区宿舍楼）
- **真实姓名**：符合大学学生命名规律
- **联系方式**：13800138001 - 13800138040
- **校园地址**：准确的宿舍楼和房间号
- **账户余额**：符合学生消费水平的真实余额

### 7. 订单数据（12个完整订单）
- **已完成订单**：8个
- **配送中订单**：2个
- **待支付订单**：1个
- **待接单订单**：1个

### 8. 支付记录
- 微信支付
- 完整的支付流水号
- 真实的支付时间

### 9. 跑腿员数据（10名）
- 校园内的兼职学生
- 真实姓名和联系方式
- 完整的评分和收入数据

## 使用方法

### 1. 导入测试数据

```bash
# 导入完整的测试数据
mysql -u[用户名] -p[密码] heikeji_mall < sql/test_data/heikeji_ust_test_data.sql

# 或在MySQL客户端中执行
source sql/test_data/heikeji_ust_test_data.sql;
```

### 2. 数据验证

```sql
-- 查看所有数据统计
SELECT '数据统计:' AS 统计项目;
SELECT '校园信息表' AS 表名, COUNT(*) AS 记录数 FROM campus_info;
SELECT '用户表' AS 表名, COUNT(*) AS 记录数 FROM user;
SELECT '商家表' AS 表名, COUNT(*) AS 记录数 FROM merchant;
SELECT '商品表' AS 表名, COUNT(*) AS 记录数 FROM product;
SELECT '订单表' AS 表名, COUNT(*) AS 记录数 FROM `order`;
```

### 3. 功能测试建议

#### 用户功能测试
```sql
-- 登录测试：使用学号USTH20200101登录
SELECT * FROM user WHERE student_no = 'USTH20200101';

-- 地址测试：查看学生地址信息
SELECT u.student_no, u.nickname, a.consignee, a.detail_address 
FROM user u JOIN address a ON u.id = a.user_id 
WHERE u.student_no = 'USTH20200101';
```

#### 购物功能测试
```sql
-- 购物车测试：查看用户购物车
SELECT p.name, c.quantity, p.price, c.selected 
FROM cart c JOIN product p ON c.product_id = p.id 
WHERE c.user_id = 1;

-- 商品浏览测试：按分类查看商品
SELECT c.name AS 分类名称, p.name AS 商品名称, p.price, p.stock, p.sales
FROM product p JOIN category c ON p.category_id = c.id 
WHERE c.name = '零食小吃'
LIMIT 10;
```

#### 订单功能测试
```sql
-- 订单查询测试：查看用户订单历史
SELECT o.order_no, o.total_amount, o.status, o.create_time,
       GROUP_CONCAT(oi.product_name) AS 商品列表
FROM `order` o 
JOIN order_item oi ON o.id = oi.order_id
WHERE o.user_id = 1
GROUP BY o.id;
```

#### 外卖功能测试
```sql
-- 外卖柜查询测试
SELECT locker_code, name, location, available_cells, status
FROM delivery_locker
WHERE campus_id = 1;

-- 商家配送范围测试
SELECT m.name, dl.locker_code, dl.name AS delivery_point
FROM merchant m
JOIN delivery_locker dl ON m.address LIKE CONCAT('%', dl.location, '%')
WHERE m.id = 1;
```

## 特色功能展示

### 1. 校园配送
- 支持校内不同区域配送
- 外卖柜自取功能
- 跑腿员配送服务

### 2. 学生专属优惠
- 学生身份认证
- 校园专属价格
- 学生充值优惠

### 3. 智能分类
- 按学生需求分类
- 学习用品专区
- 生活用品专区

### 4. 真实数据场景
- 符合学生消费习惯
- 真实的商品定价
- 准确的配送地址

## 注意事项

1. **数据完整性**：所有外键关系都已正确建立
2. **数据一致性**：商品价格、库存、销量等数据逻辑一致
3. **真实场景**：基于黑龙江科技大学实际地理信息
4. **测试覆盖**：包含用户、商家、商品、订单、支付等完整业务流程

## 扩展使用

如需添加更多数据，可以基于现有数据模式继续扩展：

```sql
-- 添加更多用户
INSERT INTO user (student_no, nickname, phone, email, campus_id, dorm_building_id, dorm_room_no) 
VALUES ('USTH20210111', '新学生', '13800138041', 'newstudent@ust.edu.cn', 1, 1, 'A106');

-- 添加更多商品
INSERT INTO product (name, category_id, merchant_id, price, stock, description) 
VALUES ('测试商品', 1, 1, 9.90, 100, '测试描述');
```

## 数据优势

✅ **真实校园信息**：基于黑龙江科技大学真实地理信息
✅ **完整业务场景**：覆盖完整的电商业务流程
✅ **学生消费特点**：符合大学生消费习惯和价格敏感度
✅ **校园配送模式**：支持校内配送和外卖柜自取
✅ **数据逻辑一致**：所有数据字段关系合理，符合业务逻辑
✅ **测试友好**：便于功能测试和性能测试

通过这些真实的测试数据，您的黑科易购项目将能够完美展示校园电商的全方位功能！