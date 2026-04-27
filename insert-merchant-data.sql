USE heikeji_mall;

INSERT INTO merchant (
    id, name, description, logo, address, phone, 
    business_hours, min_price, delivery_fee, 
    rating, sales, status
) VALUES 
(9, 'Zhang Liang Malatang', 'Authentic Northeast Malatang, spicy and delicious', '/images/merchant/malatang.jpg', 'Canteen 3, Heilongjiang University of Science and Technology', '13800138001', 
'09:00-22:00', 15.00, 2.00, 
4.80, 3500, 1),

(10, 'McDonalds', 'World famous fast food brand, delicious burgers and fried chicken', '/images/merchant/mcdonalds.jpg', 'Commercial Street A, Heilongjiang University of Science and Technology', '13800138002', 
'08:00-23:00', 20.00, 0.00, 
4.90, 5600, 1),

(11, 'HeyTea', 'Creator of new style tea drinks, cheese tea series', '/images/merchant/heytea.jpg', 'Library, Heilongjiang University of Science and Technology', '13800138003', 
'10:00-22:00', 18.00, 1.00, 
4.70, 4200, 1),

(12, 'Northeast BBQ', 'Authentic Northeast BBQ, lamb skewers, grilled chicken wings', '/images/merchant/bbq.jpg', 'Back Gate Food Street, Heilongjiang University of Science and Technology', '13800138004', 
'17:00-02:00', 30.00, 3.00, 
4.60, 2100, 1),

(13, 'Lanzhou Lamian', 'Authentic Lanzhou beef noodles, clear soup and fresh taste', '/images/merchant/lanzhou.jpg', 'Canteen 1, Heilongjiang University of Science and Technology', '13800138005', 
'07:00-21:00', 12.00, 1.50, 
4.50, 3800, 1),

(14, 'Sushi Master', 'Fresh Japanese cuisine, sushi, sashimi, ramen', '/images/merchant/sushi.jpg', 'Commercial Street B, Heilongjiang University of Science and Technology', '13800138006', 
'10:30-21:30', 25.00, 2.50, 
4.80, 1200, 1)
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    description = VALUES(description),
    status = VALUES(status);
