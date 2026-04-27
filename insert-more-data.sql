-- ============================================
-- 黑科易购 - 添加更多商品和外卖商家数据
-- ============================================

USE heikeji_mall;

-- 添加更多商品分类（如果不存在）
INSERT INTO category (name, parent_id, level, sort_order, icon, status, create_time, update_time) VALUES
('手机数码', 0, 1, 1, '📱', 1, NOW(), NOW()),
('电脑办公', 0, 1, 2, '💻', 1, NOW(), NOW()),
('美妆护肤', 0, 1, 3, '💄', 1, NOW(), NOW()),
('食品饮料', 0, 1, 4, '🍔', 1, NOW(), NOW()),
('日用百货', 0, 1, 5, '🛒', 1, NOW(), NOW()),
('运动户外', 0, 1, 6, '⚽', 1, NOW(), NOW()),
('图书文具', 0, 1, 7, '📚', 1, NOW(), NOW()),
('服装鞋包', 0, 1, 8, '👕', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE update_time = NOW();

-- 添加更多商家（如果不存在）
INSERT INTO merchant (name, description, logo, contact_phone, address, status, rating, total_sales, create_time, update_time) VALUES
('数码科技店', '正品数码产品，假一赔十', 'https://via.placeholder.com/100x100/4A90E2/ffffff?text=数码', '13800138001', '校园商业街A区101', 1, 4.8, 5000, NOW(), NOW()),
('美妆小屋', '正品美妆，学生优惠', 'https://via.placeholder.com/100x100/FF6B6B/ffffff?text=美妆', '13800138002', '校园商业街B区205', 1, 4.7, 3200, NOW(), NOW()),
('运动装备店', '专业运动装备，品质保证', 'https://via.placeholder.com/100x100/51CF66/ffffff?text=运动', '13800138003', '体育馆旁商铺3号', 1, 4.9, 2800, NOW(), NOW()),
('文具书店', '学习用品一站式购齐', 'https://via.placeholder.com/100x100/FFD93D/ffffff?text=文具', '13800138004', '图书馆负一层', 1, 4.6, 8900, NOW(), NOW())
ON DUPLICATE KEY UPDATE update_time = NOW();

-- 添加更多商品
INSERT INTO product (
    name, category_id, merchant_id, price, original_price, stock, sales, 
    main_image, images, description, specifications, 
    status, is_recommend, is_new, sort_order, create_time, update_time
) VALUES 
-- 手机数码类
('iPhone 15 Pro 128GB 原色钛金属', 31, 7, 7999.00, 8999.00, 20, 156, 
 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400', 
 '["https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400"]',
 '苹果最新旗舰手机，A17 Pro芯片，钛金属机身，4800万像素主摄', 
 '{"brand":"Apple","model":"iPhone 15 Pro","storage":"128GB","color":"原色钛金属"}',
 1, 1, 1, 1, NOW(), NOW()),

('AirPods Pro 2代 降噪耳机', 31, 7, 1899.00, 2299.00, 50, 423, 
 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', 
 '["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400"]',
 '主动降噪，通透模式，空间音频，单次续航6小时', 
 '{"brand":"Apple","model":"AirPods Pro 2","type":"入耳式"}',
 1, 1, 0, 2, NOW(), NOW()),

('小米14 16+512GB 白色', 31, 7, 4299.00, 4599.00, 30, 289, 
 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 
 '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"]',
 '骁龙8 Gen3，徕卡影像，90W快充，IP68防水', 
 '{"brand":"小米","model":"小米14","ram":"16GB","storage":"512GB"}',
 1, 0, 1, 3, NOW(), NOW()),

-- 电脑办公类
('MacBook Air M3 13寸 8+256GB', 32, 7, 8999.00, 10499.00, 15, 98, 
 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 
 '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"]',
 'M3芯片，轻薄便携，18小时续航，Retina显示屏', 
 '{"brand":"Apple","model":"MacBook Air M3","screen":"13寸","ram":"8GB","storage":"256GB"}',
 1, 1, 1, 1, NOW(), NOW()),

('罗技MX Master 3S 无线鼠标', 32, 7, 699.00, 899.00, 80, 567, 
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 
 '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400"]',
 '人体工学设计，8000DPI，静音点击，多设备切换', 
 '{"brand":"罗技","model":"MX Master 3S","connection":"无线"}',
 1, 0, 0, 2, NOW(), NOW()),

-- 美妆护肤类
('SK-II 神仙水 230ml', 33, 8, 1540.00, 1899.00, 25, 234, 
 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400', 
 '["https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400"]',
 'PITERA精华，改善肤质，提亮肤色', 
 '{"brand":"SK-II","product":"神仙水","volume":"230ml"}',
 1, 1, 0, 1, NOW(), NOW()),

('雅诗兰黛小棕瓶精华 50ml', 33, 8, 850.00, 1080.00, 40, 389, 
 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', 
 '["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"]',
 '修护精华，淡化细纹，提升肌肤弹性', 
 '{"brand":"雅诗兰黛","product":"小棕瓶","volume":"50ml"}',
 1, 1, 0, 2, NOW(), NOW()),

('兰蔻粉水 400ml', 33, 8, 420.00, 580.00, 60, 678, 
 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400', 
 '["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400"]',
 '补水保湿，舒缓肌肤，适合干性和中性肌肤', 
 '{"brand":"兰蔻","product":"粉水","volume":"400ml"}',
 1, 0, 0, 3, NOW(), NOW()),

-- 食品饮料类
('三只松鼠坚果大礼包 1.5kg', 34, 8, 128.00, 168.00, 100, 1234, 
 'https://images.unsplash.com/photo-1536591375315-196000ea3678?w=400', 
 '["https://images.unsplash.com/photo-1536591375315-196000ea3678?w=400"]',
 '9种坚果组合，每日坚果，健康零食', 
 '{"brand":"三只松鼠","weight":"1.5kg","type":"混合坚果"}',
 1, 1, 0, 1, NOW(), NOW()),

('伊利纯牛奶 250ml*24盒', 34, 8, 69.90, 89.90, 200, 2345, 
 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', 
 '["https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400"]',
 '优质奶源，3.2g蛋白质，营养早餐', 
 '{"brand":"伊利","type":"纯牛奶","volume":"250ml*24"}',
 1, 0, 0, 2, NOW(), NOW()),

('乐事薯片大礼包 400g', 34, 8, 35.90, 49.90, 150, 1890, 
 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', 
 '["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400"]',
 '多种口味组合，追剧必备', 
 '{"brand":"乐事","weight":"400g","type":"混合口味"}',
 1, 0, 0, 3, NOW(), NOW()),

-- 日用百货类
('维达抽纸 3层120抽*24包', 35, 7, 45.90, 59.90, 300, 3456, 
 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400', 
 '["https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400"]',
 '超韧不易破，柔软亲肤，家庭必备', 
 '{"brand":"维达","layer":"3层","count":"120抽*24包"}',
 1, 0, 0, 1, NOW(), NOW()),

('蓝月亮洗衣液 3kg*2瓶', 35, 7, 79.90, 99.90, 120, 1567, 
 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400', 
 '["https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400"]',
 '深层洁净，护色增艳，薰衣草香', 
 '{"brand":"蓝月亮","weight":"3kg*2","scent":"薰衣草"}',
 1, 0, 0, 2, NOW(), NOW()),

-- 运动户外类
('耐克 Air Force 1 经典款', 36, 9, 749.00, 899.00, 40, 567, 
 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', 
 '["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"]',
 '经典板鞋，舒适百搭，街头潮流', 
 '{"brand":"Nike","model":"Air Force 1","type":"板鞋"}',
 1, 1, 0, 1, NOW(), NOW()),

('阿迪达斯 Ultra Boost 跑鞋', 36, 9, 1099.00, 1399.00, 30, 234, 
 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400', 
 '["https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400"]',
 'Boost中底，轻盈回弹，专业跑步', 
 '{"brand":"Adidas","model":"Ultra Boost","type":"跑鞋"}',
 1, 1, 0, 2, NOW(), NOW()),

('李宁篮球 7号标准球', 36, 9, 129.00, 169.00, 80, 890, 
 'https://images.unsplash.com/photo-1519861531473-920026393112?w=400', 
 '["https://images.unsplash.com/photo-1519861531473-920026393112?w=400"]',
 'PU材质，耐磨防滑，室内外通用', 
 '{"brand":"李宁","size":"7号","type":"篮球"}',
 1, 0, 0, 3, NOW(), NOW()),

-- 图书文具类
('2024考研英语词汇红宝书', 37, 10, 45.00, 58.00, 200, 1234, 
 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 
 '["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"]',
 '考研必备词汇书，乱序版，附带APP', 
 '{"subject":"考研英语","type":"词汇书","year":"2024"}',
 1, 1, 1, 1, NOW(), NOW()),

('百乐P500中性笔 0.5mm 12支装', 37, 10, 89.90, 119.00, 150, 2345, 
 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400', 
 '["https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400"]',
 '日本进口，书写顺滑，考试专用', 
 '{"brand":"百乐","model":"P500","count":"12支装"}',
 1, 0, 0, 2, NOW(), NOW()),

('国誉活页本 B5 100页', 37, 10, 28.90, 38.00, 300, 3456, 
 'https://images.unsplash.com/photo-1531346878377-a513bc951c7f?w=400', 
 '["https://images.unsplash.com/photo-1531346878377-a513bc951c7f?w=400"]',
 '日本品质，可拆卸设计，纸张顺滑', 
 '{"brand":"国誉","size":"B5","pages":"100页"}',
 1, 0, 0, 3, NOW(), NOW()),

-- 服装鞋包类
('优衣库 UT 印花T恤', 38, 7, 99.00, 129.00, 100, 2345, 
 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 
 '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"]',
 '纯棉面料，舒适透气，多色可选', 
 '{"brand":"优衣库","type":"T恤","material":"纯棉"}',
 1, 0, 0, 1, NOW(), NOW()),

('森马牛仔裤 修身款', 38, 7, 159.00, 229.00, 80, 1234, 
 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400', 
 '["https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400"]',
 '弹力面料，修身版型，百搭经典', 
 '{"brand":"森马","type":"牛仔裤","fit":"修身"}',
 1, 0, 0, 2, NOW(), NOW()),

('小米双肩包 大容量', 38, 7, 79.00, 99.00, 120, 1890, 
 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 
 '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"]',
 '防水面料，多层收纳，电脑隔层', 
 '{"brand":"小米","type":"双肩包","capacity":"大容量"}',
 1, 0, 0, 3, NOW(), NOW());

-- 添加外卖商家
INSERT INTO takeout_merchant (
    name, category, logo, description, address, phone, 
    rating, sales, delivery_time, delivery_fee, min_price,
    business_hours, status, create_time, update_time
) VALUES
('麦当劳', 'fastfood', 'https://via.placeholder.com/100x100/FFC72C/000000?text=M', 
 '全球知名快餐品牌，汉堡薯条专家', '校园商业街A区1号', '400-920-0201',
 4.8, 9999, 30, 0, 15, '08:00-22:00', 1, NOW(), NOW()),

('肯德基', 'fastfood', 'https://via.placeholder.com/100x100/E4002B/ffffff?text=K', 
 '美式炸鸡，原味鸡经典', '校园商业街A区2号', '400-882-3823',
 4.7, 8567, 35, 2, 20, '09:00-23:00', 1, NOW(), NOW()),

('必胜客', 'pizza', 'https://via.placeholder.com/100x100/00A651/ffffff?text=P', 
 '披萨专家，意式美食', '校园商业街B区101', '400-812-3123',
 4.6, 4321, 40, 5, 50, '10:00-22:00', 1, NOW(), NOW()),

('星巴克', 'drink', 'https://via.placeholder.com/100x100/00704A/ffffff?text=S', 
 '精品咖啡，第三空间', '图书馆一楼', '400-820-6998',
 4.9, 6789, 25, 3, 30, '07:00-22:00', 1, NOW(), NOW()),

('喜茶', 'drink', 'https://via.placeholder.com/100x100/000000/ffffff?text=H', 
 '灵感之茶，芝士茶开创者', '校园商业街C区205', '400-888-3333',
 4.8, 7890, 20, 2, 25, '10:00-22:00', 1, NOW(), NOW()),

('蜜雪冰城', 'drink', 'https://via.placeholder.com/100x100/FF0000/ffffff?text=MX', 
 '高质平价，冰淇淋与茶', '食堂一楼', '400-060-8888',
 4.5, 12345, 15, 0, 8, '09:00-22:00', 1, NOW(), NOW()),

('张亮麻辣烫', 'noodles', 'https://via.placeholder.com/100x100/FF6B00/ffffff?text=ZL', 
 '骨汤麻辣烫，营养健康', '校园商业街B区303', '13800138005',
 4.6, 5678, 25, 1, 15, '10:00-21:00', 1, NOW(), NOW()),

('兰州拉面', 'noodles', 'https://via.placeholder.com/100x100/8B4513/ffffff?text=LZ', 
 '正宗兰州拉面，手工制作', '校园商业街A区55号', '13800138006',
 4.4, 3456, 20, 0, 12, '07:00-21:00', 1, NOW(), NOW()),

('黄焖鸡米饭', 'rice', 'https://via.placeholder.com/100x100/FFD700/000000?text=HM', 
 '招牌黄焖鸡，米饭不限量', '校园商业街B区108', '13800138007',
 4.5, 6789, 30, 1, 18, '10:00-21:00', 1, NOW(), NOW()),

('沙县小吃', 'fastfood', 'https://via.placeholder.com/100x100/228B22/ffffff?text=SX', 
 '福建特色小吃，蒸饺拌面', '校园商业街A区88号', '13800138008',
 4.3, 4567, 15, 0, 10, '06:00-22:00', 1, NOW(), NOW());

-- 添加外卖商品
INSERT INTO takeout_product (
    merchant_id, name, category, price, original_price, 
    image, description, is_recommend, sales, status, create_time, update_time
) VALUES
-- 麦当劳商品
(1, '巨无霸套餐', 'combo', 35.00, 42.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200', '巨无霸汉堡+中薯条+中可乐', 1, 2345, 1, NOW(), NOW()),
(1, '麦辣鸡腿堡', 'burger', 19.00, 22.00, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200', '经典麦辣鸡腿堡，香辣酥脆', 1, 3456, 1, NOW(), NOW()),
(1, '麦乐鸡10块', 'snack', 22.00, 25.00, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200', '金黄酥脆，搭配甜酸酱', 0, 1890, 1, NOW(), NOW()),

-- 肯德基商品
(2, '吮指原味鸡3块', 'chicken', 29.00, 35.00, 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200', '经典原味鸡，外酥里嫩', 1, 4567, 1, NOW(), NOW()),
(2, '香辣鸡腿堡', 'burger', 20.00, 23.00, 'https://images.unsplash.com/photo-1561758033-d8f2342a017d?w=200', '香辣酥脆，口感丰富', 1, 5678, 1, NOW(), NOW()),
(2, '蛋挞6只装', 'dessert', 28.00, 32.00, 'https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=200', '葡式蛋挞，酥脆香甜', 1, 2345, 1, NOW(), NOW()),

-- 必胜客商品
(3, '超级至尊披萨', 'pizza', 89.00, 109.00, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=200', '丰富配料，芝士浓郁', 1, 1234, 1, NOW(), NOW()),
(3, '意式肉酱面', 'pasta', 39.00, 45.00, 'https://images.unsplash.com/photo-1626844131082-256783844137?w=200', '经典意式肉酱，面条劲道', 0, 890, 1, NOW(), NOW()),

-- 星巴克商品
(4, '拿铁咖啡大杯', 'coffee', 32.00, 35.00, 'https://images.unsplash.com/photo-1570968992193-fd6dc0e63b33?w=200', '浓缩咖啡配蒸奶，丝滑口感', 1, 4567, 1, NOW(), NOW()),
(4, '美式咖啡大杯', 'coffee', 28.00, 30.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200', '经典美式，香醇浓郁', 0, 2345, 1, NOW(), NOW()),
(4, '星冰乐摩卡', 'drink', 36.00, 39.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200', '冰沙口感，巧克力风味', 1, 3456, 1, NOW(), NOW()),

-- 喜茶商品
(5, '多肉葡萄', 'tea', 28.00, 32.00, 'https://images.unsplash.com/photo-1546173159-315724a31696?w=200', '新鲜葡萄，芝士奶盖', 1, 6789, 1, NOW(), NOW()),
(5, '芋泥波波牛乳', 'milk', 22.00, 25.00, 'https://images.unsplash.com/photo-1558855410-3112e253d704?w=200', '芋泥香浓，波波Q弹', 1, 4567, 1, NOW(), NOW()),

-- 蜜雪冰城商品
(6, '摩天脆脆冰淇淋', 'icecream', 3.00, 4.00, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200', '经典脆筒，奶香浓郁', 1, 12345, 1, NOW(), NOW()),
(6, '珍珠奶茶大杯', 'milktea', 8.00, 10.00, 'https://images.unsplash.com/photo-1558855410-3112e253d704?w=200', '香浓奶茶，Q弹珍珠', 1, 9876, 1, NOW(), NOW()),

-- 张亮麻辣烫商品
(7, '经典麻辣烫', 'noodles', 25.00, 30.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200', '自选配料，骨汤熬制', 1, 3456, 1, NOW(), NOW()),
(7, '麻辣拌', 'noodles', 22.00, 26.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=200', '干拌风味，酱香浓郁', 0, 1234, 1, NOW(), NOW()),

-- 兰州拉面商品
(8, '牛肉拉面', 'noodles', 15.00, 18.00, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200', '手工拉面，清汤牛肉', 1, 4567, 1, NOW(), NOW()),
(8, '刀削面', 'noodles', 16.00, 19.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=200', '刀削面片，劲道爽滑', 0, 2345, 1, NOW(), NOW()),

-- 黄焖鸡米饭商品
(9, '黄焖鸡大份', 'rice', 28.00, 32.00, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200', '招牌黄焖鸡，米饭不限量', 1, 5678, 1, NOW(), NOW()),
(9, '黄焖排骨', 'rice', 32.00, 36.00, 'https://images.unsplash.com/photo-1544025162-d76690b60944?w=200', '排骨软烂，酱香浓郁', 0, 2345, 1, NOW(), NOW()),

-- 沙县小吃商品
(10, '蒸饺', 'dimsum', 8.00, 10.00, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=200', '柳叶蒸饺，皮薄馅大', 1, 6789, 1, NOW(), NOW()),
(10, '拌面', 'noodles', 7.00, 9.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=200', '花生酱拌面，香浓可口', 1, 4567, 1, NOW(), NOW()),
(10, '炖汤', 'soup', 12.00, 15.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200', '营养炖汤，滋补养生', 0, 2345, 1, NOW(), NOW());

SELECT '数据插入完成' AS result;
