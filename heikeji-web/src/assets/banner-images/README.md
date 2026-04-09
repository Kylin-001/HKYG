# Banner图片使用说明

## 当前状态
当前Banner使用的是占位图片（Unsplash的校园建筑照片）。

## 替换为真实照片步骤

### 1. 准备图片
- 获取黑龙江科技大学**碳谷大厦**的真实照片
- 建议尺寸：**1200 x 400 像素** 或更宽
- 格式：JPG 或 PNG
- 文件大小：建议不超过 500KB

### 2. 放置图片
将照片文件放入此目录：
```
src/assets/banner-images/
```

例如：
```
src/assets/banner-images/tangu-building.jpg
```

### 3. 修改代码
打开文件：`src/views/home/Index.vue`

找到第 195 行左右的图片代码：
```vue
<img 
  src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=400&fit=crop" 
  alt="碳谷大厦 - 黑龙江科技大学标志性建筑"
  class="w-full h-full object-cover"
/>
```

修改为：
```vue
<img 
  src="@/assets/banner-images/tangu-building.jpg" 
  alt="碳谷大厦 - 黑龙江科技大学标志性建筑"
  class="w-full h-full object-cover"
/>
```

### 4. 多张轮播图片（可选）
如需多张轮播，修改 `banners` 数据，为每个banner指定不同图片：

```javascript
const banners = ref([
  {
    id: 1,
    image: '/src/assets/banner-images/tangu-building-1.jpg',
    title: '...',
    // ...
  },
  {
    id: 2,
    image: '/src/assets/banner-images/campus-2.jpg',
    title: '...',
    // ...
  }
])
```

## 推荐图片来源
1. 学校官网：http://www.usth.edu.cn
2. 学校官方微信公众号
3. 学校宣传部
4. 自己拍摄

## 注意事项
- 确保有图片使用授权
- 图片质量要高，避免模糊
- 建议选择光线明亮、构图美观的照片
