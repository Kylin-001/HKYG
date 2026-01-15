-- 更新测试用户的密码为正确的BCrypt哈希值
USE heikeji_mall;

-- 使用Spring Security BCryptPasswordEncoder生成的哈希值，明文密码为123456
UPDATE `user`
SET `password` = '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW'
WHERE `username` = 'admin' OR `phone` = '13800138000';

-- 查看更新后的用户信息
SELECT `id`, `username`, `nickname`, `phone`, `status` FROM `user` WHERE `username` = 'admin';

SELECT '测试用户密码更新完成！' AS result;