# 本地图片存储方案

## 目录结构

```
public/
  images/
    dishes/           # 菜品图片
      红烧肉.jpg
      宫保鸡丁.jpg
      ...
    icons/            # 自定义图标
      logo.png
      app-icon.png
      ...
    banners/          # 轮播图、广告图
      home-banner-1.jpg
      home-banner-2.jpg
      ...
    merchants/        # 商家Logo、封面图
      merchant-1.jpg
      merchant-2.jpg
      ...
```

## 使用方式

### 1. 在 Mock 数据中使用

```typescript
// src/mock/index.ts
{
  id: 101,
  name: '红烧肉套餐',
  image: '/images/dishes/红烧肉.jpg',  // 本地图片路径
  // ...
}
```

### 2. 在组件中使用

```vue
<template>
  <!-- 菜品图片 -->
  <img src="/images/dishes/红烧肉.jpg" alt="红烧肉" />
  
  <!-- 商家Logo -->
  <img src="/images/merchants/merchant-1.jpg" alt="商家Logo" />
  
  <!-- 轮播图 -->
  <img src="/images/banners/home-banner-1.jpg" alt="活动 banner" />
</template>
```

### 3. 动态路径

```vue
<template>
  <img :src="getDishImage(dishName)" :alt="dishName" />
</template>

<script setup>
import { getDishImage, getMerchantImage } from '@/utils/image'

const dishName = '红烧肉'
</script>
```

## 图片命名规范

1. **菜品图片**：使用菜品完整名称，如 `红烧肉.jpg`、`宫保鸡丁.jpg`
2. **商家图片**：使用 `merchant-{id}.jpg` 格式
3. **Banner图**：使用 `home-banner-{序号}.jpg` 格式
4. **图标**：使用英文小写，如 `logo.png`、`app-icon.png`

## 图片尺寸建议

| 类型 | 建议尺寸 | 格式 |
|------|---------|------|
| 菜品图 | 400x400px | JPG |
| 商家Logo | 200x200px | JPG/PNG |
| Banner | 750x300px | JPG |
| 图标 | 64x64px | PNG |

## 图片压缩

建议上传前压缩图片，推荐工具：
- [TinyPNG](https://tinypng.com/) - 在线压缩
- [Squoosh](https://squoosh.app/) - Google 出品

## 批量下载网络图片脚本

```bash
# 安装依赖
npm install -g download-cli

# 批量下载（示例）
download https://example.com/image1.jpg -o public/images/dishes/
download https://example.com/image2.jpg -o public/images/dishes/
```
