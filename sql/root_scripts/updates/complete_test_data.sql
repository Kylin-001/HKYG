-- 黑科易购完整测试数据导入文件
-- 适用于heikeji_mall数据库
USE heikeji_mall;

-- 1. 商品分类数据
INSERT INTO category (name, parent_id, sort_order) VALUES 
('电子产品', 0, 1),
('手机', 1, 1),
('电脑', 1, 2),
('平板', 1, 3),
('耳机', 1, 4),
('生活用品', 0, 2),
('洗漱用品', 6, 1),
('床上用品', 6, 2),
('清洁用品', 6, 3),
('食品饮料', 0, 3),
('零食', 10, 1),
('饮料', 10, 2),
('水果', 10, 3),
('学习用品', 0, 4),
('书籍', 14, 1),
('文具', 14, 2),
('体育用品', 0, 5),
('运动器材', 17, 1),
('运动服装', 17, 2),
('校园周边', 0, 6),
('校庆纪念品', 20, 1),
('文化衫', 20, 2);

-- 2. 商家数据
INSERT INTO store (name, logo, phone, address, business_hours, description, status, rating) VALUES 
('黑科电子商城', 'https://example.com/logo1.png', '13800138001', '黑龙江科技大学科技园1号', '09:00-21:00', '专营各类电子产品，正品保障', 1, 4.8),
('校园超市', 'https://example.com/logo2.png', '13800138002', '黑龙江科技大学一食堂旁', '08:00-22:00', '校园综合超市，应有尽有', 1, 4.5),
('学霸书店', 'https://example.com/logo3.png', '13800138003', '黑龙江科技大学二食堂旁', '09:00-20:00', '各类学习用品，助力学业', 1, 4.7),
('运动器材店', 'https://example.com/logo4.png', '13800138004', '黑龙江科技大学体育馆旁', '10:00-20:00', '专业运动器材，强健体魄', 1, 4.6),
('校园水果店', 'https://example.com/logo5.png', '13800138005', '黑龙江科技大学三食堂旁', '08:30-21:30', '新鲜水果，健康生活', 1, 4.9),
('黑科文创', 'https://example.com/logo6.png', '13800138006', '黑龙江科技大学校门口', '09:00-19:00', '校园周边，文化创意', 1, 4.7),
('生活用品店', 'https://example.com/logo7.png', '13800138007', '黑龙江科技大学四公寓旁', '08:00-21:00', '生活用品，方便快捷', 1, 4.4),
('零食小屋', 'https://example.com/logo8.png', '13800138008', '黑龙江科技大学五公寓旁', '09:30-22:30', '美味零食，快乐时光', 1, 4.6),
('数码配件店', 'https://example.com/logo9.png', '13800138009', '黑龙江科技大学六公寓旁', '10:00-20:00', '数码配件，一应俱全', 1, 4.5),
('文具精品店', 'https://example.com/logo10.png', '13800138010', '黑龙江科技大学图书馆旁', '08:30-21:00', '精美文具，书写精彩', 1, 4.8),
('黑科超市分店', 'https://example.com/logo11.png', '13800138011', '黑龙江科技大学七公寓旁', '08:00-22:00', '校园超市分店，服务周到', 1, 4.5),
('运动服饰店', 'https://example.com/logo12.png', '13800138012', '黑龙江科技大学体育馆内', '09:00-20:00', '运动服饰，舒适时尚', 1, 4.6),
('眼镜店', 'https://example.com/logo13.png', '13800138013', '黑龙江科技大学校医院旁', '09:00-18:00', '专业配镜，清晰世界', 1, 4.7),
('打印店', 'https://example.com/logo14.png', '13800138014', '黑龙江科技大学教学楼A区', '08:00-22:00', '打印复印，快捷服务', 1, 4.5),
('鲜花店', 'https://example.com/logo15.png', '13800138015', '黑龙江科技大学校门口西侧', '09:00-19:00', '鲜花礼品，传递真情', 1, 4.8),
('奶茶店', 'https://example.com/logo16.png', '13800138016', '黑龙江科技大学一食堂二楼', '10:00-22:00', '美味奶茶，甜蜜时光', 1, 4.9),
('面包店', 'https://example.com/logo17.png', '13800138017', '黑龙江科技大学二食堂一楼', '07:00-21:00', '新鲜面包，营养早餐', 1, 4.7),
('便利店', 'https://example.com/logo18.png', '13800138018', '黑龙江科技大学八公寓旁', '24小时营业', '24小时便利店，随时为您服务', 1, 4.6),
('书店分店', 'https://example.com/logo19.png', '13800138019', '黑龙江科技大学图书馆内', '08:00-22:00', '书籍借阅，知识殿堂', 1, 4.8),
('数码维修店', 'https://example.com/logo20.png', '13800138020', '黑龙江科技大学科技园2号', '09:00-18:00', '数码维修，专业可靠', 1, 4.5);

-- 3. 用户数据
INSERT INTO user (student_no, nickname, phone, sex, avatar, status, is_verified, balance, score) VALUES 
('20210001', '黑科小明', '13845678901', 1, 'https://example.com/avatar1.png', 0, 1, 100.00, 500),
('20210002', '黑科小红', '13845678902', 0, 'https://example.com/avatar2.png', 0, 1, 200.50, 1000),
('20210003', '黑科小刚', '13845678903', 1, 'https://example.com/avatar3.png', 0, 1, 50.00, 300),
('20210004', '黑科小美', '13845678904', 0, 'https://example.com/avatar4.png', 0, 1, 300.00, 1500),
('20210005', '黑科小强', '13845678905', 1, 'https://example.com/avatar5.png', 0, 1, 150.75, 800),
('20210006', '黑科小花', '13845678906', 0, 'https://example.com/avatar6.png', 0, 1, 250.00, 1200),
('20210007', '黑科小李', '13845678907', 1, 'https://example.com/avatar7.png', 0, 1, 80.00, 400),
('20210008', '黑科小张', '13845678908', 0, 'https://example.com/avatar8.png', 0, 1, 120.50, 600),
('20210009', '黑科小王', '13845678909', 1, 'https://example.com/avatar9.png', 0, 1, 90.00, 450),
('20210010', '黑科小刘', '13845678910', 0, 'https://example.com/avatar10.png', 0, 1, 180.00, 900),
('20210011', '黑科小陈', '13845678911', 1, 'https://example.com/avatar11.png', 0, 1, 70.25, 350),
('20210012', '黑科小杨', '13845678912', 0, 'https://example.com/avatar12.png', 0, 1, 220.00, 1100),
('20210013', '黑科小赵', '13845678913', 1, 'https://example.com/avatar13.png', 0, 1, 60.00, 300),
('20210014', '黑科小孙', '13845678914', 0, 'https://example.com/avatar14.png', 0, 1, 140.50, 700),
('20210015', '黑科小周', '13845678915', 1, 'https://example.com/avatar15.png', 0, 1, 110.00, 550),
('20210016', '黑科小吴', '13845678916', 0, 'https://example.com/avatar16.png', 0, 1, 190.00, 950),
('20210017', '黑科小郑', '13845678917', 1, 'https://example.com/avatar17.png', 0, 1, 85.75, 425),
('20210018', '黑科小冯', '13845678918', 0, 'https://example.com/avatar18.png', 0, 1, 210.00, 1050),
('20210019', '黑科小陈', '13845678919', 1, 'https://example.com/avatar19.png', 0, 1, 95.00, 475),
('20210020', '黑科小蒋', '13845678920', 0, 'https://example.com/avatar20.png', 0, 1, 160.50, 800);

-- 4. 用户认证数据 (微信认证，此处暂时不插入数据)

-- 5. 商品数据
-- 电子产品 - 手机
INSERT INTO product (category_id, store_id, name, price, original_price, stock, sales_count, images, description, specifications, status, is_featured) VALUES 
(2, 1, 'iPhone 15 Pro', 8999.00, 9999.00, 20, 5, '["https://example.com/iphone15pro1.jpg", "https://example.com/iphone15pro2.jpg"]', '全新iPhone 15 Pro，钛金属设计，A17 Pro芯片', '{"内存": "256GB", "颜色": "深空黑色", "屏幕": "6.1英寸"}', 1, 1),
(2, 1, '华为Mate 60 Pro', 6999.00, 7999.00, 30, 8, '["https://example.com/mate60pro1.jpg", "https://example.com/mate60pro2.jpg"]', '华为Mate 60 Pro，麒麟9000S芯片，卫星通信', '{"内存": "512GB", "颜色": "曜金黑", "屏幕": "6.74英寸"}', 1, 1),
(2, 1, '小米14 Pro', 4999.00, 5499.00, 40, 12, '["https://example.com/xiaomi14pro1.jpg", "https://example.com/xiaomi14pro2.jpg"]', '小米14 Pro，骁龙8 Gen 3芯片，徕卡影像', '{"内存": "256GB", "颜色": "钛合金银", "屏幕": "6.73英寸"}', 1, 1),
(2, 1, 'vivo X100 Pro', 4499.00, 4999.00, 25, 6, '["https://example.com/vivox100pro1.jpg", "https://example.com/vivox100pro2.jpg"]', 'vivo X100 Pro，天玑9300芯片，蔡司影像', '{"内存": "256GB", "颜色": "星迹蓝", "屏幕": "6.78英寸"}', 1, 0),
(2, 1, 'OPPO Find X7 Ultra', 5999.00, 6499.00, 15, 3, '["https://example.com/oppofindx7ultra1.jpg", "https://example.com/oppofindx7ultra2.jpg"]', 'OPPO Find X7 Ultra，骁龙8 Gen 3芯片，哈苏影像', '{"内存": "256GB", "颜色": "大漠银月", "屏幕": "6.82英寸"}', 1, 0);

-- 电子产品 - 电脑
INSERT INTO product (category_id, store_id, name, price, original_price, stock, sales_count, images, description, specifications, status, is_featured) VALUES 
(3, 1, 'MacBook Pro 14', 15999.00, 16999.00, 10, 2, '["https://example.com/macbookpro14_1.jpg", "https://example.com/macbookpro14_2.jpg"]', 'MacBook Pro 14，M3 Pro芯片，视网膜显示屏', '{"内存": "16GB", "存储": "512GB SSD", "颜色": "深空灰色"}', 1, 1),
(3, 1, '联想小新Pro 16', 6499.00, 6999.00, 15, 5, '["https://example.com/lenovoxiaoxinpro16_1.jpg", "https://example.com/lenovoxiaoxinpro16_2.jpg"]', '联想小新Pro 16，英特尔酷睿i7，RTX 3050', '{"内存": "16GB", "存储": "512GB SSD", "屏幕": "16英寸2.5K"}', 1, 1),
(3, 1, '华为MateBook X Pro', 8999.00, 9999.00, 8, 3, '["https://example.com/huaweimatebookxpro_1.jpg", "https://example.com/huaweimatebookxpro_2.jpg"]', '华为MateBook X Pro，英特尔酷睿i7，触控屏', '{"内存": "16GB", "存储": "512GB SSD", "屏幕": "13.9英寸3K"}', 1, 0),
(3, 1, '戴尔XPS 13 Plus', 9999.00, 10999.00, 6, 2, '["https://example.com/dellxps13plus_1.jpg", "https://example.com/dellxps13plus_2.jpg"]', '戴尔XPS 13 Plus，英特尔酷睿i7，全面屏', '{"内存": "16GB", "存储": "512GB SSD", "屏幕": "13.4英寸4K"}', 1, 0),
(3, 1, '小米笔记本Pro X', 7999.00, 8499.00, 12, 4, '["https://example.com/xiaomibookprox_1.jpg", "https://example.com/xiaomibookprox_2.jpg"]', '小米笔记本Pro X，英特尔酷睿i7，RTX 3050 Ti', '{"内存": "16GB", "存储": "512GB SSD", "屏幕": "15.6英寸3.5K"}', 1, 0);

-- 生活用品 - 洗漱用品
INSERT INTO product (category_id, store_id, name, price, original_price, stock, sales_count, images, description, specifications, status, is_featured) VALUES 
(7, 7, '电动牙刷套装', 199.00, 299.00, 50, 20, '["https://example.com/electrictoothbrush_1.jpg", "https://example.com/electrictoothbrush_2.jpg"]', '声波电动牙刷，智能计时，IPX7防水', '{"品牌": "小米", "颜色": "白色", "续航": "30天"}', 1, 1),
(7, 7, '氨基酸洁面乳', 89.00, 129.00, 100, 35, '["https://example.com/facialcleanser_1.jpg", "https://example.com/facialcleanser_2.jpg"]', '温和氨基酸配方，深层清洁，不紧绷', '{"容量": "150ml", "适用肤质": "所有肤质"}', 1, 1),
(7, 7, '洗发水套装', 129.00, 189.00, 80, 25, '["https://example.com/shampooset_1.jpg", "https://example.com/shampooset_2.jpg"]', '去屑止痒洗发水，柔顺护发素，持久留香', '{"容量": "500ml*2", "香型": "樱花香"}', 1, 0),
(7, 7, '沐浴露', 69.00, 99.00, 120, 40, '["https://example.com/bodywash_1.jpg", "https://example.com/bodywash_2.jpg"]', '保湿滋润沐浴露，持久留香，深层清洁', '{"容量": "720ml", "香型": "薰衣草香"}', 1, 0),
(7, 7, '毛巾礼盒', 59.00, 89.00, 60, 15, '["https://example.com/towelset_1.jpg", "https://example.com/towelset_2.jpg"]', '纯棉毛巾礼盒，柔软吸水，不掉毛', '{"规格": "毛巾*2+方巾*2", "颜色": "灰色"}', 1, 0);

-- 食品饮料 - 零食
INSERT INTO product (category_id, store_id, name, price, original_price, stock, sales_count, images, description, specifications, status, is_featured) VALUES 
(11, 8, '乐事薯片大礼包', 39.90, 49.90, 100, 50, '["https://example.com/layschip_1.jpg", "https://example.com/layschip_2.jpg"]', '乐事薯片大礼包，多种口味组合', '{"规格": "12包/箱", "口味": "混合口味"}', 1, 1),
(11, 8, '三只松鼠坚果礼盒', 89.00, 129.00, 60, 25, '["https://example.com/squirrelnut_1.jpg", "https://example.com/squirrelnut_2.jpg"]', '三只松鼠坚果礼盒，精选多种坚果', '{"规格": "1.5kg/盒", "内容": "核桃、杏仁、腰果等"}', 1, 1),
(11, 8, '奥利奥饼干', 19.90, 29.90, 150, 60, '["https://example.com/oreo_1.jpg", "https://example.com/oreo_2.jpg"]', '奥利奥夹心饼干，经典口味', '{"规格": "600g/盒", "口味": "原味"}', 1, 0),
(11, 8, '星球杯巧克力', 24.90, 34.90, 120, 45, '["https://example.com/starcup_1.jpg", "https://example.com/starcup_2.jpg"]', '星球杯巧克力，童年回忆', '{"规格": "1000g/桶", "口味": "巧克力味"}', 1, 0),
(11, 8, '旺旺大礼包', 49.90, 69.90, 80, 30, '["https://example.com/wangwang_1.jpg", "https://example.com/wangwang_2.jpg"]', '旺旺大礼包，多种零食组合', '{"规格": "1.2kg/包", "内容": "仙贝、雪饼、QQ糖等"}', 1, 0);

-- 学习用品 - 书籍
INSERT INTO product (category_id, store_id, name, price, original_price, stock, sales_count, images, description, specifications, status, is_featured) VALUES 
(15, 3, 'Java核心技术卷I', 109.00, 149.00, 30, 15, '["https://example.com/java_core_1.jpg", "https://example.com/java_core_2.jpg"]', 'Java核心技术卷I，基础知识，权威指南', '{"作者": "Cay S. Horstmann", "出版社": "机械工业出版社"}', 1, 1),
(15, 3, 'Python编程：从入门到实践', 89.00, 129.00, 40, 20, '["https://example.com/python_practice_1.jpg", "https://example.com/python_practice_2.jpg"]', 'Python编程入门经典，适合零基础学习', '{"作者": "Eric Matthes", "出版社": "人民邮电出版社"}', 1, 1),
(15, 3, '算法导论', 129.00, 169.00, 25, 10, '["https://example.com/algorithm_1.jpg", "https://example.com/algorithm_2.jpg"]', '算法经典著作，计算机科学必读', '{"作者": "Thomas H. Cormen", "出版社": "机械工业出版社"}', 1, 0),
(15, 3, '深入理解计算机系统', 119.00, 159.00, 20, 8, '["https://example.com/csapp_1.jpg", "https://example.com/csapp_2.jpg"]', '计算机系统基础，深入理解底层原理', '{"作者": "Randal E. Bryant", "出版社": "机械工业出版社"}', 1, 0),
(15, 3, '数据库系统概念', 109.00, 149.00, 35, 12, '["https://example.com/db_concepts_1.jpg", "https://example.com/db_concepts_2.jpg"]', '数据库经典教材，全面系统', '{"作者": "Abraham Silberschatz", "出版社": "机械工业出版社"}', 1, 0);

-- 6. 商品图片数据
INSERT INTO product_image (product_id, image_url, is_primary) VALUES 
(1, 'https://example.com/iphone15pro1.jpg', 1),
(1, 'https://example.com/iphone15pro2.jpg', 0),
(1, 'https://example.com/iphone15pro3.jpg', 0),
(2, 'https://example.com/mate60pro1.jpg', 1),
(2, 'https://example.com/mate60pro2.jpg', 0),
(2, 'https://example.com/mate60pro3.jpg', 0),
(3, 'https://example.com/xiaomi14pro1.jpg', 1),
(3, 'https://example.com/xiaomi14pro2.jpg', 0),
(3, 'https://example.com/xiaomi14pro3.jpg', 0),
(4, 'https://example.com/vivox100pro1.jpg', 1),
(4, 'https://example.com/vivox100pro2.jpg', 0),
(5, 'https://example.com/oppofindx7ultra1.jpg', 1),
(5, 'https://example.com/oppofindx7ultra2.jpg', 0),
(6, 'https://example.com/macbookpro14_1.jpg', 1),
(6, 'https://example.com/macbookpro14_2.jpg', 0),
(7, 'https://example.com/lenovoxiaoxinpro16_1.jpg', 1),
(7, 'https://example.com/lenovoxiaoxinpro16_2.jpg', 0),
(8, 'https://example.com/huaweimatebookxpro_1.jpg', 1),
(8, 'https://example.com/huaweimatebookxpro_2.jpg', 0),
(9, 'https://example.com/dellxps13plus_1.jpg', 1),
(9, 'https://example.com/dellxps13plus_2.jpg', 0),
(10, 'https://example.com/xiaomibookprox_1.jpg', 1),
(10, 'https://example.com/xiaomibookprox_2.jpg', 0);

-- 7. 配送柜数据
INSERT INTO delivery_locker (locker_code, name, location, campus_area, total_cells, available_cells, status) VALUES 
('LCK001', '一食堂配送柜', '黑龙江科技大学一食堂门口', '食堂区', 50, 50, 1),
('LCK002', '二食堂配送柜', '黑龙江科技大学二食堂门口', '食堂区', 50, 50, 1),
('LCK003', '三食堂配送柜', '黑龙江科技大学三食堂门口', '食堂区', 50, 50, 1),
('LCK004', '图书馆配送柜', '黑龙江科技大学图书馆门口', '教学区', 40, 40, 1),
('LCK005', '教学楼A区配送柜', '黑龙江科技大学教学楼A区门口', '教学区', 30, 30, 1),
('LCK006', '教学楼B区配送柜', '黑龙江科技大学教学楼B区门口', '教学区', 30, 30, 1),
('LCK007', '1号公寓配送柜', '黑龙江科技大学1号公寓旁', '生活区', 40, 40, 1),
('LCK008', '2号公寓配送柜', '黑龙江科技大学2号公寓旁', '生活区', 40, 40, 1),
('LCK009', '3号公寓配送柜', '黑龙江科技大学3号公寓旁', '生活区', 40, 40, 1),
('LCK010', '4号公寓配送柜', '黑龙江科技大学4号公寓旁', '生活区', 40, 40, 1),
('LCK011', '5号公寓配送柜', '黑龙江科技大学5号公寓旁', '生活区', 40, 40, 1),
('LCK012', '6号公寓配送柜', '黑龙江科技大学6号公寓旁', '生活区', 40, 40, 1),
('LCK013', '7号公寓配送柜', '黑龙江科技大学7号公寓旁', '生活区', 40, 40, 1),
('LCK014', '8号公寓配送柜', '黑龙江科技大学8号公寓旁', '生活区', 40, 40, 1),
('LCK015', '体育馆配送柜', '黑龙江科技大学体育馆旁', '运动区', 30, 30, 1);

-- 8. 用户地址数据
INSERT INTO user_address (user_id, contact_name, contact_phone, province, city, district, detail, full_address, is_default) VALUES 
(1, '小明', '13845678901', '黑龙江省', '哈尔滨市', '松北区', '1号公寓101室', '黑龙江省哈尔滨市松北区黑龙江科技大学1号公寓101室', 1),
(2, '小红', '13845678902', '黑龙江省', '哈尔滨市', '松北区', '2号公寓202室', '黑龙江省哈尔滨市松北区黑龙江科技大学2号公寓202室', 1),
(3, '小刚', '13845678903', '黑龙江省', '哈尔滨市', '松北区', '3号公寓303室', '黑龙江省哈尔滨市松北区黑龙江科技大学3号公寓303室', 1),
(4, '小美', '13845678904', '黑龙江省', '哈尔滨市', '松北区', '4号公寓404室', '黑龙江省哈尔滨市松北区黑龙江科技大学4号公寓404室', 1),
(5, '小强', '13845678905', '黑龙江省', '哈尔滨市', '松北区', '5号公寓505室', '黑龙江省哈尔滨市松北区黑龙江科技大学5号公寓505室', 1),
(6, '小花', '13845678906', '黑龙江省', '哈尔滨市', '松北区', '6号公寓606室', '黑龙江省哈尔滨市松北区黑龙江科技大学6号公寓606室', 1),
(7, '小李', '13845678907', '黑龙江省', '哈尔滨市', '松北区', '7号公寓707室', '黑龙江省哈尔滨市松北区黑龙江科技大学7号公寓707室', 1),
(8, '小张', '13845678908', '黑龙江省', '哈尔滨市', '松北区', '8号公寓808室', '黑龙江省哈尔滨市松北区黑龙江科技大学8号公寓808室', 1),
(9, '小王', '13845678909', '黑龙江省', '哈尔滨市', '松北区', '1号公寓109室', '黑龙江省哈尔滨市松北区黑龙江科技大学1号公寓109室', 1),
(10, '小刘', '13845678910', '黑龙江省', '哈尔滨市', '松北区', '2号公寓210室', '黑龙江省哈尔滨市松北区黑龙江科技大学2号公寓210室', 1),
(11, '小陈', '13845678911', '黑龙江省', '哈尔滨市', '松北区', '3号公寓311室', '黑龙江省哈尔滨市松北区黑龙江科技大学3号公寓311室', 1),
(12, '小杨', '13845678912', '黑龙江省', '哈尔滨市', '松北区', '4号公寓412室', '黑龙江省哈尔滨市松北区黑龙江科技大学4号公寓412室', 1),
(13, '小赵', '13845678913', '黑龙江省', '哈尔滨市', '松北区', '5号公寓513室', '黑龙江省哈尔滨市松北区黑龙江科技大学5号公寓513室', 1),
(14, '小孙', '13845678914', '黑龙江省', '哈尔滨市', '松北区', '6号公寓614室', '黑龙江省哈尔滨市松北区黑龙江科技大学6号公寓614室', 1),
(15, '小周', '13845678915', '黑龙江省', '哈尔滨市', '松北区', '7号公寓715室', '黑龙江省哈尔滨市松北区黑龙江科技大学7号公寓715室', 1),
(16, '小吴', '13845678916', '黑龙江省', '哈尔滨市', '松北区', '8号公寓816室', '黑龙江省哈尔滨市松北区黑龙江科技大学8号公寓816室', 1),
(17, '小郑', '13845678917', '黑龙江省', '哈尔滨市', '松北区', '1号公寓117室', '黑龙江省哈尔滨市松北区黑龙江科技大学1号公寓117室', 1),
(18, '小冯', '13845678918', '黑龙江省', '哈尔滨市', '松北区', '2号公寓218室', '黑龙江省哈尔滨市松北区黑龙江科技大学2号公寓218室', 1),
(19, '小陈', '13845678919', '黑龙江省', '哈尔滨市', '松北区', '3号公寓319室', '黑龙江省哈尔滨市松北区黑龙江科技大学3号公寓319室', 1),
(20, '小蒋', '13845678920', '黑龙江省', '哈尔滨市', '松北区', '4号公寓420室', '黑龙江省哈尔滨市松北区黑龙江科技大学4号公寓420室', 1);

-- 9. 购物车数据
INSERT INTO cart (user_id, product_id, quantity) VALUES 
(1, 1, 1),
(1, 11, 2),
(2, 2, 1),
(2, 12, 1),
(3, 3, 1),
(3, 13, 3),
(4, 4, 1),
(4, 14, 2),
(5, 5, 1),
(5, 15, 1),
(6, 6, 1),
(6, 16, 2),
(7, 7, 1),
(7, 17, 1),
(8, 8, 1),
(8, 18, 3),
(9, 9, 1),
(9, 19, 2),
(10, 10, 1),
(10, 20, 1);

-- 数据导入完成提示
SELECT '黑科易购完整测试数据导入完成！' AS result;
