-- 更新 admin 用户密码
USE heikeji_mall;
UPDATE user SET password='$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO' WHERE username='admin';
SELECT username, password FROM user WHERE username='admin';
