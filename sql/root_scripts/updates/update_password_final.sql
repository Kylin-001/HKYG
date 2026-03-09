-- 更新测试用户的密码为正确的BCrypt哈希值
USE heikeji_mall;

-- 使用Python生成的BCrypt哈希值，明文密码为123456
UPDATE `user`
SET `password` = '$2b$12$w9gij16uY31Ao3fhq9pnvuGZ/A26ztnVtwnOld2dD0yW5fZKy5wHS'
WHERE `username` = 'admin' OR `phone` = '13800138000';

-- 查看更新后的用户信息
SELECT `id`, `username`, `nickname`, `phone`, `status`, `password` FROM `user` WHERE `username` = 'admin';

SELECT '测试用户密码更新完成！' AS result;