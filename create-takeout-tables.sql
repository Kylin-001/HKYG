-- 创建外卖相关表结构

USE heikeji_mall;

-- 商家分类表
CREATE TABLE IF NOT EXISTS takeout_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    icon VARCHAR(255) COMMENT '图标',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除：0-否 1-是'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='外卖分类表';

-- 商家表
CREATE TABLE IF NOT EXISTS takeout_merchant (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '商家名称',
    logo VARCHAR(255) COMMENT '商家logo',
    description TEXT COMMENT '商家描述',
    address VARCHAR(255) COMMENT '商家地址',
    phone VARCHAR(20) COMMENT '联系电话',
    business_hours VARCHAR(50) COMMENT '营业时间',
    min_delivery_amount DECIMAL(10,2) DEFAULT 0 COMMENT '起送金额',
    delivery_fee DECIMAL(10,2) DEFAULT 0 COMMENT '配送费',
    rating DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
    rating_count INT DEFAULT 0 COMMENT '评分人数',
    monthly_sales INT DEFAULT 0 COMMENT '月销量',
    status TINYINT DEFAULT 0 COMMENT '状态：0-休息中 1-营业中',
    is_recommended TINYINT DEFAULT 0 COMMENT '是否推荐：0-否 1-是',
    sort_order INT DEFAULT 0 COMMENT '排序',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除：0-否 1-是'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='外卖商家表';

-- 商家分类关联表
CREATE TABLE IF NOT EXISTS takeout_merchant_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    merchant_id BIGINT NOT NULL COMMENT '商家ID',
    category_id BIGINT NOT NULL COMMENT '分类ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_merchant_category (merchant_id, category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家分类关联表';

-- 商品表
CREATE TABLE IF NOT EXISTS takeout_product (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    merchant_id BIGINT NOT NULL COMMENT '商家ID',
    name VARCHAR(100) NOT NULL COMMENT '商品名称',
    description TEXT COMMENT '商品描述',
    image VARCHAR(255) COMMENT '商品图片',
    price DECIMAL(10,2) NOT NULL COMMENT '售价',
    original_price DECIMAL(10,2) COMMENT '原价',
    category_id BIGINT COMMENT '分类ID',
    is_recommended TINYINT DEFAULT 0 COMMENT '是否推荐：0-否 1-是',
    status TINYINT DEFAULT 1 COMMENT '状态：0-下架 1-上架',
    sort_order INT DEFAULT 0 COMMENT '排序',
    sales_count INT DEFAULT 0 COMMENT '销量',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除：0-否 1-是'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='外卖商品表';

-- 插入默认分类
INSERT INTO takeout_category (id, name, icon, sort_order, status) VALUES
(1, 'Food', '/images/category/food.png', 1, 1),
(2, 'Fast Food', '/images/category/fastfood.png', 2, 1),
(3, 'Drinks', '/images/category/drinks.png', 3, 1),
(4, 'Late Night', '/images/category/night.png', 4, 1),
(5, 'Japanese', '/images/category/japanese.png', 5, 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

SELECT 'Tables created successfully' as message;
