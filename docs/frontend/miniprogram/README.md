# 黑科易购小程序

## 项目概述

黑科易购是面向黑龙江科技大学的校园生活服务平台小程序，提供外卖订餐、校园跑腿、快递代取、商品商城等功能。

## 项目结构

```
heikeji-miniprogram/
├── app.js                 # 小程序全局JS文件
├── app.json               # 小程序全局配置
├── app.wxss               # 小程序全局样式
├── sitemap.json           # 小程序索引配置
├── README.md              # 项目说明文档
├── config/                # 配置文件
│   └── config.js          # 项目配置
├── pages/                 # 页面目录
│   ├── index/             # 首页
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── takeout/           # 外卖订餐
│   ├── product/           # 商品商城
│   ├── errand/            # 校园跑腿
│   ├── courier/           # 快递代取
│   ├── order/             # 订单管理
│   ├── user/              # 用户中心
│   ├── wallet/            # 钱包
│   ├── address/           # 地址管理
│   ├── cart/              # 购物车
│   ├── merchant/          # 商家信息
│   ├── campus/            # 校园服务
│   ├── coupon/            # 优惠券
│   ├── announcement/      # 校园公告
│   ├── login/             # 登录页面
│   └── more/              # 更多功能
├── components/            # 组件目录
│   ├── common/            # 通用组件
│   ├── product/           # 商品相关组件
│   └── order/             # 订单相关组件
├── utils/                 # 工具类
│   └── request.js         # 网络请求封装
├── api/                   # API接口
│   ├── user.js            # 用户相关API
│   ├── product.js         # 商品相关API
│   ├── order.js           # 订单相关API
│   └── merchant.js        # 商家相关API
└── assets/                # 静态资源
    ├── images/            # 图片资源
    └── icons/             # 图标资源
```

## 功能模块

### 1. 首页 (index)
- 轮播图展示
- 快捷入口导航
- 推荐商品展示
- 热门商家列表
- 校园公告

### 2. 外卖订餐 (takeout)
- 商家列表和搜索
- 菜品分类浏览
- 购物车管理
- 订单提交和支付
- 订单状态跟踪

### 3. 校园跑腿 (errand)
- 跑腿服务发布
- 任务接单
- 位置定位
- 费用计算

### 4. 快递代取 (courier)
- 快递信息录入
- 代取服务
- 快递柜管理
- 费用结算

### 5. 商品商城 (product)
- 商品分类浏览
- 商品搜索
- 商品详情
- 购物车
- 收藏夹

### 6. 订单管理 (order)
- 订单列表
- 订单详情
- 订单状态跟踪
- 订单评价

### 7. 用户中心 (user)
- 个人信息管理
- 地址管理
- 钱包管理
- 订单历史
- 意见反馈

## 技术架构

### 前端技术栈
- **框架**: 微信小程序原生框架
- **语言**: JavaScript (ES6+)
- **样式**: WXSS
- **UI组件**: WeUI + 自定义组件
- **状态管理**: 小程序全局状态管理

### 网络请求
- **请求封装**: 统一拦截器、Token管理
- **API设计**: RESTful风格
- **数据格式**: JSON

### 数据存储
- **本地存储**: 小程序缓存 (wx.setStorage)
- **全局数据**: getApp().globalData
- **用户信息**: 本地缓存 + 服务器同步

## 开发环境

### 必要条件
1. 微信开发者工具
2. Node.js (用于构建工具)
3. 项目对应的后端API服务

### 安装和运行

1. **克隆项目**
   ```bash
   git clone <project-url>
   cd heikeji-mall/heikeji-miniprogram
   ```

2. **导入小程序**
   - 使用微信开发者工具导入项目
   - 填写AppID (测试时可使用测试号)

3. **配置后端地址**
   - 修改 `config/config.js` 中的 `baseUrl`
   - 确保后端API服务正常运行

4. **启动开发服务**
   - 在微信开发者工具中点击"编译"
   - 预览小程序效果

## 开发规范

### 代码规范
1. **文件命名**: 使用小写字母和连字符
2. **组件命名**: 使用 PascalCase
3. **变量命名**: 使用 camelCase
4. **常量命名**: 使用 UPPER_SNAKE_CASE

### 样式规范
1. **单位使用**: 使用 rpx 作为单位
2. **颜色规范**: 统一使用设计规范中的颜色
3. **响应式**: 支持不同屏幕尺寸的适配

### API规范
1. **请求格式**: 统一使用 JSON
2. **响应格式**: 统一响应结构 `{code, message, data}`
3. **错误处理**: 统一错误处理机制

## 版本规划

### v1.0.0 (当前版本)
- [x] 小程序基础框架搭建
- [x] 首页功能实现
- [x] 基础页面结构
- [x] 网络请求封装
- [x] 用户认证体系

### v1.1.0 (计划中)
- [ ] 外卖订餐功能
- [ ] 校园跑腿功能
- [ ] 用户中心完善
- [ ] 订单管理

### v1.2.0 (计划中)
- [ ] 快递代取功能
- [ ] 商品商城功能
- [ ] 支付功能集成
- [ ] 消息推送

### v1.3.0 (计划中)
- [ ] 优惠券系统
- [ ] 积分系统
- [ ] 评价系统
- [ ] 数据统计

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 联系方式

- 项目维护者: [开发者邮箱]
- 项目地址: [GitHub地址]
- 问题反馈: [Issues地址]

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。