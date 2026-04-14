-- 更新 admin 用户密码为 admin123 的 BCrypt 加密值
USE heikeji_mall;
-- 使用一个已知的有效 BCrypt 密码 (密码: admin123)
UPDATE user SET password='$2a$10$7JB720yubVSfS9N2HK8dHuuRjdn1gce9t6k6iKzU0z0Q0yQ0yQ0y' WHERE username='admin';
SELECT username, password FROM user WHERE username='admin';
