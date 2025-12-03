# 黑科易购后台管理系统

## 项目介绍
heikeji-admin 是黑科易购电商平台的后台管理系统，提供用户管理、商品管理、订单管理等功能的管理界面和API接口。

## 技术栈
- Java 17
- Spring Boot 3.x
- Spring Security
- MyBatis-Plus
- MySQL
- Redis
- JWT
- Nacos

## 主要功能
1. 用户管理：管理员账户的增删改查、角色分配
2. 权限管理：菜单权限、操作权限的配置
3. 部门管理：企业部门结构管理
4. 角色管理：角色定义和权限分配
5. 系统监控：登录日志、操作日志等

## 项目结构
```
src/main/java/com/heikeji/admin/
├── config/            # 配置类
├── controller/        # 控制器
├── service/           # 业务逻辑
│   └── impl/          # 业务实现
├── mapper/            # 数据访问层
├── entity/            # 实体类
├── dto/               # 数据传输对象
├── vo/                # 视图对象
├── security/          # 安全相关
└── common/            # 公共工具类
```

## 快速开始

### 1. 环境准备
- JDK 17
- Maven 3.6+
- MySQL 8.0+
- Redis 5.0+
- Nacos 2.0+

### 2. 数据库初始化
- 执行 `src/main/resources/init.sql` 脚本创建数据库表和初始数据
- 默认管理员账号：admin / 123456

### 3. 配置修改
- 修改 `application-dev.yml` 中的数据库连接信息
- 修改 Redis 和 Nacos 配置

### 4. 运行项目
```bash
# 开发环境启动
mvn spring-boot:run

# 打包部署
mvn clean package -DskipTests
java -jar heikeji-admin.jar --spring.profiles.active=prod
```

## API接口说明

### 认证相关
- POST `/api/auth/login` - 管理员登录
- POST `/api/auth/logout` - 管理员登出
- GET `/api/auth/info` - 获取用户信息
- GET `/api/auth/captcha` - 获取验证码

### 用户管理
- GET `/api/user/list` - 分页查询用户列表
- GET `/api/user/{id}` - 获取用户详情
- POST `/api/user/` - 添加用户
- PUT `/api/user/{id}` - 修改用户
- DELETE `/api/user/{id}` - 删除用户
- DELETE `/api/user/batch` - 批量删除用户
- PUT `/api/user/{id}/status` - 修改用户状态
- PUT `/api/user/password` - 修改密码
- PUT `/api/user/{id}/reset` - 重置密码

## 注意事项
1. 首次使用时请运行初始化SQL脚本
2. 生产环境请修改默认密码和JWT密钥
3. 确保Nacos服务正常运行
4. 定期备份数据库

## 开发说明
1. 遵循RESTful API设计规范
2. 所有接口返回统一格式
3. 异常处理统一在GlobalExceptionHandler中处理
4. 数据库操作使用MyBatis-Plus
5. 安全认证使用JWT + Spring Security