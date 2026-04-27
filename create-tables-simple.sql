USE heikeji_mall;

DROP TABLE IF EXISTS takeout_product;
DROP TABLE IF EXISTS takeout_merchant_category;
DROP TABLE IF EXISTS takeout_merchant;
DROP TABLE IF EXISTS takeout_category;

CREATE TABLE takeout_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(255),
    sort_order INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);

CREATE TABLE takeout_merchant (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(255),
    description TEXT,
    address VARCHAR(255),
    phone VARCHAR(20),
    business_hours VARCHAR(50),
    min_delivery_amount DECIMAL(10,2) DEFAULT 0,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 5.0,
    rating_count INT DEFAULT 0,
    monthly_sales INT DEFAULT 0,
    status TINYINT DEFAULT 0,
    is_recommended TINYINT DEFAULT 0,
    sort_order INT DEFAULT 0,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);

CREATE TABLE takeout_merchant_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    merchant_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_merchant_category (merchant_id, category_id)
);

CREATE TABLE takeout_product (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    merchant_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category_id BIGINT,
    is_recommended TINYINT DEFAULT 0,
    status TINYINT DEFAULT 1,
    sort_order INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);

INSERT INTO takeout_category (id, name, sort_order, status) VALUES
(1, 'Food', 1, 1),
(2, 'Fast Food', 2, 1),
(3, 'Drinks', 3, 1),
(4, 'Late Night', 4, 1),
(5, 'Japanese', 5, 1);
