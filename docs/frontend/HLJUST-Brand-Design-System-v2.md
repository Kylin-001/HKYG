# 黑龙江科技大学 · 品牌视觉风格规范
# HLJUST Campus Mall Design System v2.0

> **文档版本**: v2.0  
> **适用项目**: 黑科易购校园服务平台 (HLJUST Campus Mall)  
> **设计理念**: 以黑龙江科技大学校徽标准色"科大蓝"为核心，融合校训文化、学术氛围与品牌形象  

---

## 一、品牌识别体系

### 1.1 学校基本信息

| 属性 | 内容 |
|------|------|
| **中文全称** | 黑龙江科技大学 |
| **英文全称** | Heilongjiang University of Science & Technology |
| **简称** | 黑科大 / HLJUST / USTH |
| **校训** | **厚德博学 · 强吾兴邦** |
| **办学精神** | 自强不息 · 创业创新 |
| **建校年份** | 1947年 |
| **地理位置** | 黑龙江省哈尔滨市松花江畔（江畔朝阳）|
| **学校特色** | 矿业工程为特色，被誉为"煤炭工业的脊梁" |

### 1.2 校徽元素说明

- **外环**: 毛体中文校名 + 英文校名
- **内环**: 学校主楼抽象图案 + 书籍 + 博士帽 + "1947"
- **标准色**: 科大蓝（代表科技、严谨）

---

## 二、色彩系统 (Color System)

### 2.1 主色系 — 科大蓝 (USTH Primary Blue)

基于校徽标准色 CMYK(100, 95, 25, 0) 转换而来。

```
┌─────────────────────────────────────────────────────┐
│  科大蓝色阶 (USTH Blue Scale)                        │
├──────────┬──────────┬─────────┬────────┬───────────┤
│  Dark    │ Primary  │ Light   │ 100    │ 50        │
│ #002560  │ #003B80  │ #1A5FB4  │ #6B93C0│ #E8EEF6   │
│ 深蓝     │ 主色     │ 天蓝     │ 中浅   │ 极浅      │
└──────────┴──────────┴─────────┴────────┴───────────┘
```

| Token | HEX | RGB | 用途场景 |
|-------|-----|-----|---------|
| `--color-primary` | `#003B80` | (0,59,128) | 品牌主色、导航激活、按钮、链接 |
| `--color-primary-dark` | `#002560` | (0,37,96) | 深色背景、标题强调、hover状态 |
| `--color-primary-light` | `#1A5FB4` | (26,95,180) | 浅色文字、渐变中间色、次要链接 |
| `--color-primary-400` | `#3B82F6` | (59,130,246) | 渐变末端、图标高亮 |
| `--color-primary-50` | `#E8EEF6` | (232,238,246) | 浅背景、标签底色、输入框focus |

### 2.2 辅助色系 (Auxiliary Colors)

| 色彩角色 | 名称 | HEX | CMYK参考 | 设计语义 |
|---------|------|-----|----------|---------|
| 🥇 **学士金** | Gold | `#B8860B` | C20 M30 Y95 K15 | 成就、VIP、重点标记、CTA按钮 |
| 🥇 **淡金** | Gold Light | `#DAA520` | C10 M25 Y85 K0 | 渐变高光、装饰线 |
| 🔴 **兴邦红** | Crimson | `#C41E3A` | C10 M90 Y70 K5 | 重要提示、促销标签、价格、错误状态 |
| 🔴 **浅红** | Crimson Light | `#DC3545` | C0 M85 Y80 K0 | hover状态、次要红色 |
| 🌲 **松柏绿** | Pine | `#2D6A4F` | C55 M0 Y65 K35 | 校园服务、成功状态、在线指示 |
| 🌲 **浅绿** | Pine Light | `#40916C` | C40 M0 Y55 K20 | 校园功能高亮 |

### 2.3 语义化颜色映射

| 语义 | 颜色Token | HEX | 使用场景 |
|------|----------|-----|---------|
| ✅ Success | `--color-success` | `#2D8659` | 操作成功、可用状态 |
| ⚠️ Warning | `--color-warning` | `#D4A843` | 注意提示、待处理状态 |
| ❌ Error | `--color-error` | `#C41E3A` | 错误状态、删除操作 |
| ℹ️ Info | `--color-info` | `#1A5FB4` | 信息提示、帮助文本 |

### 2.4 学术灰阶中性色 (Academic Neutrals)

| 层级 | Token | HEX | 用途 |
|------|-------|-----|------|
| 主文字 | `--color-text-primary` | `#1A1A2E` | 标题、正文、重要信息 |
| 次要文字 | `--color-text-secondary` | `#4A5568` | 描述文字、副标题 |
| 三级文字 | `--color-text-tertiary` | `#718096` | 辅助说明、占位符 |
| 四级文字 | `--color-text-quaternary` | `#A0AEC0` | 时间戳、禁用文字 |
| 页面背景 | `--color-background` | `#F5F7FA` | 全局页面底色 |
| 卡片背景 | `--color-surface` | `#FFFFFF` | 卡片、弹窗、表单 |
| 分割线 | `--color-divider` | `rgba(0,59,128,0.08)` | 科大蓝色调分割线 |

### 2.5 品牌渐变色 (Brand Gradients)

```css
/* 主品牌渐变 - 用于Logo、主按钮、登录框 */
--gradient-primary: linear-gradient(135deg, #003B80 0%, #1A5FB4 50%, #3B82F6 100%);

/* 深色品牌渐变 - 用于深色头部 */
--gradient-primary-deep: linear-gradient(135deg, #002560 0%, #003B80 60%, #1A5FB4 100%);

/* 金色渐变 - 用于CTA按钮、校训装饰线 */
--gradient-gold: linear-gradient(135deg, #B8860B 0%, #DAA520 50%, #F0C14B 100%);

/* 校园渐变 - 用于校园模块 */
--gradient-campus: linear-gradient(135deg, #003B80 0%, #2D6A4F 100%);

/* 活力渐变 - 用于促销、活动 */
--gradient-warm: linear-gradient(135deg, #C41E3A 0%, #D4A843 100%);
```

---

## 三、模块色彩分配方案

每个业务模块使用独特的渐变色主题，同时保持整体和谐：

| 模块 | 渐变方向 | 色值范围 | Tab激活色 | 设计意图 |
|------|---------|----------|-----------|---------|
| **🛍️ 商品中心** | 蓝→亮蓝→浅蓝 | `primary → primary-light → primary-400` | `border-primary` | 科技感、专业品质 |
| **🍔 校园外卖** | 红→浅红→金 | `crimson → crimson-light → gold` | `border-crimson` | 活力、食欲、温暖 |
| **♻️ 二手市场** | 深蓝→主蓝→天蓝 | `primary-dark → primary → primary-light` | `border-primary` | 可靠、循环、信任 |
| **💬 社区论坛** | 金→淡金→浅金 | `gold → gold-light → gold-pale` | `border-gold` | 温暖、交流、归属感 |
| **🏫 校园服务** | 松绿→浅松绿→蓝 | `pine → pine-light → primary` | `border-pine` | 学术、成长、自然 |
| **📦 订单管理** | 深蓝→主蓝→天蓝 | `primary-dark → primary → primary-light` | `border-primary` | 正式、可靠、清晰 |
| **👤 用户中心** | 深蓝→主蓝→天蓝(径向) | `primary-dark → primary → primary-light` | `border-primary` | 专业、身份、归属 |

---

## 四、字体规范 (Typography)

### 4.1 字体栈 (Font Family)

```css
/* 主字体 - 中文优先 */
font-family: 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB',
             'Noto Sans SC', -apple-system, BlinkMacSystemFont, 
             'Segoe UI', 'Helvetica Neue', Arial, sans-serif;

/* 衬线字体 - 用于校训等正式场合 */
font-family-serif: 'Noto Serif SC', 'SimSun', 'STSong', serif;
```

### 4.2 字号体系

| 级别 | 大小 | 行高 | 字间距 | 场景 |
|------|------|------|--------|------|
| `3xl` | 36px | 44px | -0.02em | Hero标题、校训大字 |
| `2xl` | 30px | 38px | -0.02em | 页面主标题 |
| `xl` | 24px | 34px | -0.01em | 区块标题 |
| `lg` | 19px | 30px | 0 | 小节标题 |
| `base` | 16px | 26px | 0.01em | 正文（高校标准） |
| `sm` | 13px | 20px | 0.01em | 辅助文字 |
| `xs` | 12px | 18px | 0.02em | 标签、时间戳 |

### 4.3 字重

| 名称 | 值 | 使用场景 |
|------|-----|---------|
| Regular | 400 | 正文、描述 |
| Medium | 500 | 按钮文字、标签 |
| Semibold | 600 | 标题、导航 |
| Bold | 700 | 数字强调、Hero标题 |

---

## 五、阴影系统 (Shadow System)

所有阴影使用**科大蓝色调**透明度，保持品牌一致性：

| 级别 | Token | 值 | 使用场景 |
|------|-------|-----|---------|
| XS | `--shadow-sm` | `0 1px 3px rgba(0,59,128,0.06)` | 轻微浮起 |
| SM | `--shadow-md` | `0 4px 12px rgba(0,59,128,0.08)` | 卡片默认 |
| LG | `--shadow-lg` | `0 8px 24px rgba(0,59,128,0.12)` | 弹窗、下拉 |
| XL | `--shadow-xl` | `0 16px 48px rgba(0,59,128,0.16)` | 模态框 |
| **Brand** | `--shadow-brand` | `0 4px 14px rgba(0,59,128,0.18), 0 0 1px rgba(0,59,128,0.08)` | **品牌按钮/Logo** |
| Gold | `--shadow-gold` | `0 4px 14px rgba(184,134,11,0.25)` | 金色CTA按钮 |

---

## 六、圆角系统 (Border Radius)

| 级别 | 值 | 使用场景 |
|------|-----|---------|
| SM | 8px | 小标签、图标容器 |
| MD | 12px | 输入框、小卡片 |
| LG | 16px | 卡片、面板 |
| XL | 20px | 大卡片、Banner |
| Full | 9999px | 头像、徽章、按钮 |

---

## 七、品牌特色组件样式

### 7.1 校训文字装饰 (.motto-text)

用于展示"厚德博学·强吾兴邦"，带金色下划线动画效果：

```css
.motto-text {
  position: relative;
  letter-spacing: 0.2em;  /* 加宽字距体现庄重感 */
}
.motto-text::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #DAA520, transparent);
}
```

### 7.2 品牌按钮 (.btn-brand)

科大蓝渐变主按钮，带品牌阴影：

```css
.btn-brand {
  background: var(--gradient-primary);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: var(--shadow-brand);
}
.btn-brand:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 59, 128, 0.25);
}
```

### 7.3 学术风毛玻璃 (.glass-effect)

使用科大蓝色调边框的毛玻璃效果：

```css
.glass-effect {
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 59, 128, 0.08);  /* 科大蓝色调边框 */
}
```

---

## 八、各页面修改前后对比

### 8.1 全局设计系统

| 项目 | 修改前 (Apple风格) | 修改后 (黑科大风格) |
|------|-------------------|-------------------|
| **主色调** | iOS Blue `#007AFF` | **科大蓝 `#003B80`** |
| **辅助色** | 紫/粉/橙随机分配 | **金/红/绿** 有语义的辅助色系 |
| **字体** | SF Pro Display优先 | **PingFang SC优先** 高校规范 |
| **阴影** | 灰色透明度 | **科大蓝色调** 透明度 |
| **分割线** | `rgba(0,0,0,0.08)` | **`rgba(0,59,128,0.08)`** |
| **滚动条** | 灰色 | **科大蓝色调** |
| **选中文字** | iOS蓝色 | **科大蓝色** |
| **进度条(NProgress)** | 紫色渐变 | **科大蓝渐变** |

### 8.2 App.vue 导航栏

| 元素 | 修改前 | 修改后 |
|------|--------|--------|
| Logo | indigo→purple→pink 渐变 | **primary→primary-light→primary-400** |
| Logo文字 | "黑科易购" 灰色渐变 | **科大蓝渐变 + "HLJUST CAMPUS"英文副标** |
| Nav激活态 | `bg-indigo-50 text-indigo-600` | **`bg-primary-50 text-primary`** |
| 登录按钮 | indigo→purple 渐变 | **`from-primary to-primary-light` + shadow-brand** |
| 底部导航激活 | `text-indigo-600` | **`text-primary`** |
| 抽屉菜单 | 无品牌元素 | **+校训展示 + 学校信息底部** |

### 8.3 首页 (Home)

| 区域 | 修改前 | 修改后 |
|------|--------|--------|
| Hero Banner遮罩 | 黑色渐变 `from-black/60` | **科大蓝深色渐变 `from-primary-dark/85`** |
| Banner标签 | 白色半透明 | **金色实底 `bg-gold/90`** |
| Banner按钮 | 白色背景 | **金色渐变 `from-gold to-gold-light`** |
| 快捷入口颜色 | Tailwind原色(random) | **品牌色系: crimson/gold/pine/primary** |
| 秒杀横幅 | red→orange→amber | **crimson→crimson-light→gold** |
| 产品卡hover | `hover:border-indigo-200` | **`hover:border-primary-200` + shadow-brand** |
| 价格色 | `text-red-500` | **`text-crimson`** |
| 社区帖子标签 | `bg-pink-50 text-pink-500` | **`bg-gold/10 text-gold`** |
| **新增区域** | 无 | **校训展示区: 科大蓝渐变背景 + 学校数据统计** |

### 8.4 Layout 组件头部渐变

| 模块 | 修改前 | 修改后 |
|------|--------|--------|
| 商品中心 | blue→indigo→purple | **`from-primary via-primary-light to-primary-400`** |
| 外卖 | orange→red→pink | **`from-crimson via-crimson-light to-gold`** |
| 二手 | purple→violet→indigo | **`from-primary-dark via-primary to-primary-light`** |
| 社区 | pink→rose→red | **`from-gold via-gold-light to-gold-pale`** |
| 校园 | emerald→teal→cyan | **`from-pine via-pine-light to-primary`** |
| 订单 | blue→indigo→purple | **`from-primary-dark via-primary to-primary-light`** |
| 用户 | slate-700→slate-900 | **`from-primary-dark via-primary to-primary-light`(径向)** |

### 8.5 个人中心 (Profile)

| 元素 | 修改前 | 修改后 |
|------|--------|--------|
| 头部渐变 | indigo→purple→pink | **primary-dark→primary→primary-light** |
| VIP标签 | "校园VIP会员" 白色半透明 | **"黑科大在校生" 金色实底** |
| 在线状态点 | emerald-400 | **pine(松柏绿)** |
| 统计数字hover | `text-gray-800 hover:text-indigo-600` | **`text-text-primary hover:text-primary`** |
| 订单图标容器 | indigo-50→purple-50 | **primary-50→primary-100/50** |
| 菜单项hover | `hover:bg-gray-50` | **`hover:bg-primary-50/30`** |
| 图标容器 | bg-gray-50 | **bg-primary-50/50** |
| 底部信息 | "HKUSTH Students" | **"HLJUST Students" + 校训 + 建校年份** |

### 8.6 登录页 (Login)

| 元素 | 修改前 | 修改后 |
|------|--------|--------|
| Logo | 单字"黑"+gradient-apple阴影 | **"黑科"+品牌渐变+光泽层** |
| 副标题 | "登录黑科易购..." | **+ 英文全称 + tracking-wider** |
| 表单容器 | shadow-xl | **shadow-brand** |
| 登录按钮 | Element Plus默认蓝色 | **!bg-gradient-to-r !from-primary !to-primary-light !shadow-brand** |
| 背景装饰 | indigo/purple radial | **primary/primary-light radial** |
| 第三方登录 | green/blue random | **pine(绿)/primary(蓝)** |
| 底部 | 用户协议/隐私政策 | **+ "厚德博学·强吾兴邦—黑龙江科技大学©1947"** |

---

## 九、Tailwind CSS 类名速查

### 品牌色类名

```
主色系:
  text-primary / bg-primary / border-primary          #003B80
  text-primary-dark / bg-primary-dark               #002560
  text-primary-light / bg-primary-light             #1A5FB4
  bg-primary-50 / bg-primary-100 ... bg-primary-400  蓝色阶梯
  
辅助色:
  text-gold / bg-gold / border-gold                 #B8860B (学士金)
  text-crimson / bg-crimson / border-crimson         #C41E3A (兴邦红)
  text-pine / bg-pine / border-pine                 #2D6A4F (松柏绿)
  
中性色:
  text-text-primary / text-text-secondary           文字层级
  bg-surface-secondary / bg-surface-tertiary         背景层级
  border-primary-50                                 品牌分割线
```

### 阴影/特效类名

```
shadow-brand     品牌阴影 (按钮/Logo)
shadow-gold      金色阴影 (CTA按钮)
shadow-md/lg/xl  层级阴影 (卡片)
```

---

## 十、设计原则总结

1. **科大蓝为核心**: 所有主要交互元素以科大蓝为主色，传达科技严谨的学校气质
2. **辅助色有语义**: 金=成就/重要、红=促销/警告、绿=校园/成功
3. **学术灰阶文字**: 使用偏冷的灰度层次，营造专业学术氛围
4. **校训融入界面**: 关键位置展示"厚德博学·强吾兴邦"
5. **品牌一致性**: 阴影、分割线、滚动条等细节统一使用科大蓝色调
6. **模块差异化**: 各业务模块用不同渐变主题区分，但整体和谐
7. **移动端优先**: 保持响应式设计，移动端体验优先

---

*本文档由黑科易购前端团队维护 · 最后更新: 2026年*
*遵循黑龙江科技大学VI视觉识别系统规范*
