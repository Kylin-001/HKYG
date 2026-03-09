-- 更新测试用户的密码为BCrypt加密后的123456
USE heikeji_mall;

-- 使用一个已知的BCrypt加密密码，明文为123456
UPDATE `user`
SET `password` = '$2a$10$eFh6dGJ5cHl7eXk5dQw3eRf5tY7uI9oK1mJ3hG5fD7sA9dF3gH5jK'
WHERE `username` = 'admin';

-- 也更新手机号登录的密码
UPDATE `user`
SET `password` = '$2a$10$eFh6dGJ5cHl7eXk5dQw3eRf5tY7uI9oK1mJ3hG5fD7sA9dF3gH5jK'
WHERE `phone` = '13800138000';

SELECT '测试用户密码更新完成！' AS result;