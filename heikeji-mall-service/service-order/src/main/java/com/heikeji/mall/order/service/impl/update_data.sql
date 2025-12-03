USE heikeji_mall;
INSERT INTO category(name) VALUES('Food'),('Daily'),('Stationery');
INSERT INTO product(name, category_id, merchant_id, price, stock) VALUES('Cookie', 1, 1, 5.50, 100),('Water', 1, 1, 2.00, 200);