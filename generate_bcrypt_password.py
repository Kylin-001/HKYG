import bcrypt

# 生成BCrypt密码哈希值
password = "123456"
# 生成盐值
salt = bcrypt.gensalt()
# 生成哈希值
hashed = bcrypt.hashpw(password.encode('utf-8'), salt)

print(f"密码: {password}")
print(f"盐值: {salt.decode('utf-8')}")
print(f"哈希值: {hashed.decode('utf-8')}")

# 验证密码
is_match = bcrypt.checkpw(password.encode('utf-8'), hashed)
print(f"验证结果: {is_match}")