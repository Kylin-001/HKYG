-- 创建商品表
CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id BIGINT,
    store_id BIGINT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    stock INT NOT NULL,
    sales_count INT DEFAULT 0,
    sales INT DEFAULT 0,
    images VARCHAR(500),
    description TEXT,
    specifications TEXT,
    status INT DEFAULT 1,
    is_featured INT DEFAULT 0,
    is_recommend INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    del_flag INT DEFAULT 0,
    sort_order INT DEFAULT 0
);

-- 创建商品热词表
CREATE TABLE IF NOT EXISTS product_hot_word (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(50) NOT NULL,
    search_count INT DEFAULT 0,
    is_home_show INT DEFAULT 0,
    show_on_home INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建商品分类表
CREATE TABLE IF NOT EXISTS category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    parent_id BIGINT DEFAULT 0,
    level INT DEFAULT 1,
    sort_order INT DEFAULT 0,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建库存表
CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    stock INT NOT NULL,
    locked_stock INT DEFAULT 0,
    alert_stock INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入测试数据
INSERT INTO product (name, category_id, store_id, price, original_price, stock, sales_count, sales, images, description, specifications, status, is_featured, is_recommend)
VALUES 
('测试商品1', 1, 1, 100.00, 120.00, 100, 50, 50, 'test1.jpg', '测试商品1描述', '测试商品1规格', 1, 1, 1),
('测试商品2', 1, 1, 200.00, 250.00, 50, 20, 20, 'test2.jpg', '测试商品2描述', '测试商品2规格', 1, 1, 1),
('测试商品3', 2, 2, 150.00, 180.00, 80, 30, 30, 'test3.jpg', '测试商品3描述', '测试商品3规格', 1, 0, 0);

-- 插入库存数据
INSERT INTO inventory (product_id, stock, locked_stock, alert_stock)
VALUES 
(1, 100, 0, 10),
(2, 50, 0, 5),
(3, 80, 0, 8);

INSERT INTO product_hot_word (word, search_count, is_home_show, sort_order, status)
VALUES 
('手机', 100, 1, 1, 1),
('电脑', 80, 1, 2, 1),
('平板', 50, 0, 3, 1);

INSERT INTO category (name, parent_id, level, sort_order, status)
VALUES 
('电子产品', 0, 1, 1, 1),
('手机', 1, 2, 1, 1),
('电脑', 1, 2, 2, 1);
