-- 外卖商家数据初始化脚本
-- 在 MySQL 数据库中执行此脚本添加外卖商家数据

USE heikeji_mall;

-- 插入外卖商家数据
INSERT INTO takeout_merchant (
    id, name, logo, description, address, phone, 
    business_hours, min_delivery_amount, delivery_fee, 
    rating, rating_count, monthly_sales, 
    status, is_recommended, sort_order, 
    create_time, update_time, is_deleted
) VALUES 
(1, 'Zhang Liang Malatang', '/images/merchant/malatang.jpg', 'Authentic Northeast Malatang, spicy and delicious', 'Canteen 3, Heilongjiang University of Science and Technology', '13800138001', 
'09:00-22:00', 15.00, 2.00, 
4.8, 1250, 3500, 
1, 1, 1, 
NOW(), NOW(), 0),

(2, 'McDonalds', '/images/merchant/mcdonalds.jpg', 'World famous fast food brand, delicious burgers and fried chicken', 'Commercial Street A, Heilongjiang University of Science and Technology', '13800138002', 
'08:00-23:00', 20.00, 0.00, 
4.9, 2300, 5600, 
1, 1, 2, 
NOW(), NOW(), 0),

(3, 'HeyTea', '/images/merchant/heytea.jpg', 'Creator of new style tea drinks, cheese tea series', 'Library, Heilongjiang University of Science and Technology', '13800138003', 
'10:00-22:00', 18.00, 1.00, 
4.7, 1800, 4200, 
1, 1, 3, 
NOW(), NOW(), 0),

(4, 'Northeast BBQ', '/images/merchant/bbq.jpg', 'Authentic Northeast BBQ, lamb skewers, grilled chicken wings', 'Back Gate Food Street, Heilongjiang University of Science and Technology', '13800138004', 
'17:00-02:00', 30.00, 3.00, 
4.6, 890, 2100, 
1, 0, 4, 
NOW(), NOW(), 0),

(5, 'Lanzhou Lamian', '/images/merchant/lanzhou.jpg', 'Authentic Lanzhou beef noodles, clear soup and fresh taste', 'Canteen 1, Heilongjiang University of Science and Technology', '13800138005', 
'07:00-21:00', 12.00, 1.50, 
4.5, 1500, 3800, 
1, 0, 5, 
NOW(), NOW(), 0),

(6, 'Sushi Master', '/images/merchant/sushi.jpg', 'Fresh Japanese cuisine, sushi, sashimi, ramen', 'Commercial Street B, Heilongjiang University of Science and Technology', '13800138006', 
'10:30-21:30', 25.00, 2.50, 
4.8, 650, 1200, 
1, 1, 6, 
NOW(), NOW(), 0);

-- 插入商家分类关联
INSERT INTO takeout_merchant_category (
    id, merchant_id, category_id, create_time
) VALUES 
(1, 1, 1, NOW()),
(2, 2, 2, NOW()),
(3, 3, 3, NOW()),
(4, 4, 4, NOW()),
(5, 5, 1, NOW()),
(6, 6, 5, NOW());

-- 插入商品数据
INSERT INTO takeout_product (
    id, merchant_id, name, description, image, 
    price, original_price, category_id, 
    is_recommended, status, sort_order, sales_count,
    create_time, update_time, is_deleted
) VALUES 
(1, 1, 'Classic Malatang', 'Self-selected dishes, spicy and delicious', '/images/product/malatang1.jpg', 
18.00, 22.00, 1, 
1, 1, 1, 850, NOW(), NOW(), 0),

(2, 1, 'Bone Soup Malatang', 'Rich bone soup, nutritious and delicious', '/images/product/malatang2.jpg', 
20.00, 25.00, 1, 
0, 1, 2, 620, NOW(), NOW(), 0),

(3, 2, 'Big Mac Meal', 'Classic burger + fries + coke', '/images/product/bigmac.jpg', 
35.00, 42.00, 2, 
1, 1, 1, 1200, NOW(), NOW(), 0),

(4, 2, 'Spicy Chicken Wings', 'Spicy and crispy, unforgettable taste', '/images/product/wings.jpg', 
12.00, 15.00, 2, 
1, 1, 2, 980, NOW(), NOW(), 0),

(5, 3, 'Cheese Strawberry', 'Fresh strawberry + rich cheese', '/images/product/strawberry.jpg', 
28.00, 32.00, 3, 
1, 1, 1, 1500, NOW(), NOW(), 0),

(6, 3, 'Grape Tea', 'Hand-peeled grapes + refreshing tea', '/images/product/grape.jpg', 
26.00, 30.00, 3, 
1, 1, 2, 1100, NOW(), NOW(), 0);

SELECT 'Takeout merchant data inserted successfully' as message;
SELECT COUNT(*) as merchant_count FROM takeout_merchant WHERE is_deleted = 0;
SELECT COUNT(*) as product_count FROM takeout_product WHERE is_deleted = 0;
