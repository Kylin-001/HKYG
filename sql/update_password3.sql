-- 更新 admin 用户密码
-- 使用 Spring Security BCrypt 生成的密码 (密码: admin123)
-- 生成命令: new BCryptPasswordEncoder().encode("admin123")
USE heikeji_mall;
UPDATE user SET password='$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6' WHERE username='admin';
SELECT username, password FROM user WHERE username='admin';
