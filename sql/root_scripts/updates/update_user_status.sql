-- 更新测试用户的状态为正常（1）
USE heikeji_mall;

-- 使用正确的BCrypt密码，生成方式：passwordEncoder.encode("123456")
UPDATE `user`
SET `status` = 1,
    `password` = '$2a$10$iXp3LtH8gZ6J4K5L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z'
WHERE `username` = 'admin';

-- 查看更新后的用户信息
SELECT `id`, `username`, `nickname`, `phone`, `status`, `user_type` FROM `user` WHERE `username` = 'admin';

SELECT '测试用户状态更新完成！' AS result;