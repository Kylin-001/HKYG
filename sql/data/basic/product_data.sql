-- 商品基础数据
USE `heikeji_mall`;

INSERT INTO `product` (`name`, `category_id`, `merchant_id`, `price`, `original_price`, `stock`, `sales`, `images`, `detail`, `status`) VALUES
('矿泉水', 4, 1, 2.00, 2.50, 200, 50, 'http://example.com/water.jpg', '500ml瓶装矿泉水', 0),
('巧克力饼干', 5, 1, 5.50, 6.00, 100, 30, 'http://example.com/cookie.jpg', '美味巧克力饼干', 0),
('笔记本', 9, 2, 8.00, 10.00, 150, 45, 'http://example.com/notebook.jpg', 'A4笔记本，50页', 0),
('铅笔', 10, 2, 1.00, 1.50, 200, 80, 'http://example.com/pencil.jpg', 'HB铅笔，12支装', 0),
('苹果', 1, 3, 8.00, 9.00, 50, 25, 'http://example.com/apple.jpg', '新鲜红苹果，500g装', 0),
('纸巾', 7, 1, 3.50, 4.00, 100, 60, 'http://example.com/tissue.jpg', '抽纸巾，100抽/包', 0);
