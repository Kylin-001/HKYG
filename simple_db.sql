-- 简化版数据库导入文件
CREATE DATABASE IF NOT EXISTS heikeji_mall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE heikeji_mall;

-- 创建用户表
CREATE TABLE user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  nickname VARCHAR(100),
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='用户表';

-- 创建商品表
CREATE TABLE product (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='商品表';

-- 插入测试数据
INSERT INTO user (username, nickname) VALUES 
('admin', '管理员'),
('user001', '普通用户');

INSERT INTO product (name, price, stock) VALUES 
('测试商品1', 99.99, 100),
('测试商品2', 199.99, 50);
