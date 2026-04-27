-- ============================================
-- Heikeji Mall - Add More Data
-- ============================================

USE heikeji_mall;

-- Add more categories
INSERT INTO category (name, parent_id, level, sort_order, icon, status, create_time, update_time) VALUES
('Mobile & Digital', 0, 1, 1, '📱', 1, NOW(), NOW()),
('Computer & Office', 0, 1, 2, '💻', 1, NOW(), NOW()),
('Beauty & Skincare', 0, 1, 3, '💄', 1, NOW(), NOW()),
('Food & Beverage', 0, 1, 4, '🍔', 1, NOW(), NOW()),
('Daily necessities', 0, 1, 5, '🛒', 1, NOW(), NOW()),
('Sports & Outdoor', 0, 1, 6, '⚽', 1, NOW(), NOW()),
('Books & Stationery', 0, 1, 7, '📚', 1, NOW(), NOW()),
('Clothing & Bags', 0, 1, 8, '👕', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE update_time = NOW();

-- Add more merchants
INSERT INTO merchant (name, description, logo, contact_phone, address, status, rating, total_sales, create_time, update_time) VALUES
('Digital Tech Store', 'Genuine digital products', 'https://via.placeholder.com/100x100/4A90E2/ffffff?text=Digital', '13800138001', 'Campus Business St A101', 1, 4.8, 5000, NOW(), NOW()),
('Beauty Shop', 'Genuine beauty products', 'https://via.placeholder.com/100x100/FF6B6B/ffffff?text=Beauty', '13800138002', 'Campus Business St B205', 1, 4.7, 3200, NOW(), NOW()),
('Sports Store', 'Professional sports equipment', 'https://via.placeholder.com/100x100/51CF66/ffffff?text=Sports', '13800138003', 'Gym Shop No.3', 1, 4.9, 2800, NOW(), NOW()),
('Stationery Store', 'Study supplies', 'https://via.placeholder.com/100x100/FFD93D/ffffff?text=Stationery', '13800138004', 'Library B1', 1, 4.6, 8900, NOW(), NOW())
ON DUPLICATE KEY UPDATE update_time = NOW();

-- Add takeout merchants
INSERT INTO takeout_merchant (name, category, logo, description, address, phone, rating, sales, delivery_time, delivery_fee, min_price, business_hours, status, create_time, update_time) VALUES
('McDonald\'s', 'fastfood', 'https://via.placeholder.com/100x100/FFC72C/000000?text=M', 'World famous fast food', 'Campus St A1', '400-920-0201', 4.8, 9999, 30, 0, 15, '08:00-22:00', 1, NOW(), NOW()),
('KFC', 'fastfood', 'https://via.placeholder.com/100x100/E4002B/ffffff?text=K', 'American fried chicken', 'Campus St A2', '400-882-3823', 4.7, 8567, 35, 2, 20, '09:00-23:00', 1, NOW(), NOW()),
('Pizza Hut', 'pizza', 'https://via.placeholder.com/100x100/00A651/ffffff?text=P', 'Pizza expert', 'Campus St B101', '400-812-3123', 4.6, 4321, 40, 5, 50, '10:00-22:00', 1, NOW(), NOW()),
('Starbucks', 'drink', 'https://via.placeholder.com/100x100/00704A/ffffff?text=S', 'Premium coffee', 'Library 1F', '400-820-6998', 4.9, 6789, 25, 3, 30, '07:00-22:00', 1, NOW(), NOW()),
('Hey Tea', 'drink', 'https://via.placeholder.com/100x100/000000/ffffff?text=H', 'Cheese tea creator', 'Campus St C205', '400-888-3333', 4.8, 7890, 20, 2, 25, '10:00-22:00', 1, NOW(), NOW()),
('Mixue Ice Cream', 'drink', 'https://via.placeholder.com/100x100/FF0000/ffffff?text=MX', 'High quality low price', 'Canteen 1F', '400-060-8888', 4.5, 12345, 15, 0, 8, '09:00-22:00', 1, NOW(), NOW()),
('Zhang Liang Malatang', 'noodles', 'https://via.placeholder.com/100x100/FF6B00/ffffff?text=ZL', 'Bone soup malatang', 'Campus St B303', '13800138005', 4.6, 5678, 25, 1, 15, '10:00-21:00', 1, NOW(), NOW()),
('Lanzhou Ramen', 'noodles', 'https://via.placeholder.com/100x100/8B4513/ffffff?text=LZ', 'Authentic hand-pulled noodles', 'Campus St A55', '13800138006', 4.4, 3456, 20, 0, 12, '07:00-21:00', 1, NOW(), NOW()),
('Braised Chicken Rice', 'rice', 'https://via.placeholder.com/100x100/FFD700/000000?text=HM', 'Signature braised chicken', 'Campus St B108', '13800138007', 4.5, 6789, 30, 1, 18, '10:00-21:00', 1, NOW(), NOW()),
('Shaxian Snacks', 'fastfood', 'https://via.placeholder.com/100x100/228B22/ffffff?text=SX', 'Fujian specialty snacks', 'Campus St A88', '13800138008', 4.3, 4567, 15, 0, 10, '06:00-22:00', 1, NOW(), NOW());

SELECT 'Data insertion completed' AS result;
