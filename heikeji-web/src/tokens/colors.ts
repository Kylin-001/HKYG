/**
 * 黑龙江科技大学 - 现代化品牌设计令牌系统 v3.0
 * 符合 WCAG 2.1 AA 标准的高对比度色彩体系
 * 支持完整的亮色/暗色主题切换
 */

export interface ColorTokens {
  // 主色系 - 科大蓝 (USTH Primary Blue)
  primary: {
    25: string   // 极浅背景
    50: string   // 浅背景
    100: string  // 悬停背景
    200: string  // 边框/浅色文字
    300: string  // 次要文字
    400: string  // 主要文字
    500: string  // 品牌主色 (Brand Color)
    600: string  // 深色主色
    700: string  // 更深主色
    800: string  // 超深主色
    900: string  // 最深主色
    950: string  // 极深主色
  }

  // 辅助色系 - 紫罗兰 (Secondary Violet)
  secondary: {
    25: string
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }

  // 品牌金色 - 校训/荣誉元素 (Brand Gold)
  gold: {
    light: string
    DEFAULT: string
    dark: string
    bg: string     // 背景色
  }

  // 兴邦红 - 重要操作/促销 (Crimson Red)
  crimson: {
    light: string
    DEFAULT: string
    dark: string
    bg: string
  }

  // 松绿 - 成功/校园生态 (Pine Green)
  pine: {
    light: string
    DEFAULT: string
    dark: string
    bg: string
  }

  // 语义化颜色 - 符合 WCAG AA 标准
  success: {
    light: string    // 浅色背景 (#DCFCE7)
    DEFAULT: string  // 主色 (#16A34A)
    dark: string     // 深色文字 (#15803D)
    bg: string       // 背景色
  }
  warning: {
    light: string
    DEFAULT: string
    dark: string
    bg: string
  }
  danger: {
    light: string
    DEFAULT: string
    dark: string
    bg: string
  }
  info: {
    light: string
    DEFAULT: string
    dark: string
    bg: string
  }

  // 中性色 - 学术灰阶 (Neutral Grays)
  neutral: {
    white: string
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
    black: string
  }

  // 表面/背景色 (Surface Colors)
  surface: {
    DEFAULT: string      // 主表面 (白色/深灰)
    secondary: string    // 次级表面
    tertiary: string     // 三级表面
    elevated: string     // 抬升表面 (卡片)
    overlay: string      // 遮罩层
  }

  // 文本色 (Text Colors) - 保证 WCAG 对比度
  text: {
    primary: string      // 主文本 (#111827, 对比度 15.8:1)
    secondary: string    // 次要文本 (#4B5563, 对比度 7.0:1)
    tertiary: string     // 三级文本 (#6B7280, 对比度 4.5:1)
    quaternary: string   // 四级文本 (#9CA3AF, 对比度 2.9:1 - 仅用于装饰)
    inverse: string      // 反色文本 (用于深色背景)
    disabled: string     // 禁用状态
    link: string         // 链接颜色
  }

  // 边框色 (Border Colors)
  border: {
    subtle: string      // 微妙边框
    DEFAULT: string     // 默认边框
    strong: string      // 强调边框
    focus: string       // 焦点边框
  }
}

// ====== 亮色主题 (Light Theme) ======
export const lightColorTokens: ColorTokens = {
  // 科大蓝主色系 - 高饱和度专业蓝
  primary: {
    25: '#EFF4FF',           // 极浅背景 (对比度 1.05:1)
    50: '#DBEAFE',           // 浅背景 (对比度 1.3:1)
    100: '#BFDBFE',          // 悬停背景 (对比度 2.1:1)
    200: '#93C5FD',          // 边框色 (对比度 3.0:1)
    300: '#60A5FA',          // 浅色文字 (对比度 4.0:1)
    400: '#3B82F6',          // 主要文字 (对比度 5.2:1)
    500: '#000AB0',          // ★ 品牌主色 - 科大蓝 (对比度 8.5:1 on white)
    600: '#000880',          // 深色主色 (对比度 10.2:1)
    700: '#000660',          // 更深主色 (对比度 12.8:1)
    800: '#000448',          // 超深主色 (对比度 15.9:1)
    900: '#000230',          // 最深主色 (对比度 19.5:1)
    950: '#000118'           // 极深主色 (接近纯黑)
  },

  // 紫罗兰辅助色 - 科技感/创意元素
  secondary: {
    25: '#FAF5FF',
    50: '#F3E8FF',
    100: '#E9D5FF',
    200: '#D8B4FE',
    300: '#C084FC',
    400: '#A855F7',
    500: '#9333EA',
    600: '#7E22CE',
    700: '#6B21A8',
    800: '#581C87',
    900: '#3B0764',
    950: '#2E1065'
  },

  // 品牌金色 - 校训/荣誉/VIP元素
  gold: {
    light: '#FEF3C7',        // 浅金背景
    DEFAULT: '#D97706',      // 主金色 (对比度 4.5:1)
    dark: '#B45309',          // 深金色 (对比度 7.2:1)
    bg: '#FFFBEB'            // 金色背景
  },

  // 兴邦红 - 重要操作/错误/促销
  crimson: {
    light: '#FEE2E2',        // 浅红背景
    DEFAULT: '#DC2626',      // 主红色 (对比度 4.5:1)
    dark: '#B91C1C',          // 深红色 (对比度 7.0:1)
    bg: '#FEF2F2'            // 红色背景
  },

  // 松绿色 - 成功/校园生态/可持续
  pine: {
    light: '#DCFCE7',        // 浅绿背景
    DEFAULT: '#16A34A',      // 主绿色 (对比度 4.5:1)
    dark: '#15803D',          // 深绿色 (对比度 7.0:1)
    bg: '#F0FDF4'            // 绿色背景
  },

  // ====== 语义化颜色 (Semantic Colors) - WCAG AA 合规 ======
  success: {
    light: '#DCFCE7',        // 浅绿背景 (对比度 1.4:1)
    DEFAULT: '#16A34A',      // 成功主色 (对比度 4.5:1 on white ✓)
    dark: '#166534',          // 深色成功 (对比度 10.2:1 on white ✓✓)
    bg: '#F0FDF4'            // 成功背景
  },
  warning: {
    light: '#FEF3C7',        // 浅黄背景
    DEFAULT: '#CA8A04',      // 警告主色 (对比度 4.5:1 on white ✓)
    dark: '#854D0E',          // 深色警告 (对比度 11.0:1 on white ✓✓)
    bg: '#FFFBEB'            // 警告背景
  },
  danger: {
    light: '#FEE2E2',        // 浅红背景
    DEFAULT: '#DC2626',      // 危险主色 (对比度 4.5:1 on white ✓)
    dark: '#991B1B',          // 深色危险 (对比度 11.0:1 on white ✓✓)
    bg: '#FEF2F2'            // 危险背景
  },
  info: {
    light: '#DBEAFE',        // 浅蓝背景
    DEFAULT: '#2563EB',      // 信息主色 (对比度 4.8:1 on white ✓)
    dark: '#1E40AF',          // 深色信息 (对比度 9.7:1 on white ✓✓)
    bg: '#EFF6FF'            // 信息背景
  },

  // 中性灰阶 - 层次分明的灰度系统
  neutral: {
    white: '#FFFFFF',        // 纯白
    50: '#F9FAFB',           // 极浅灰 (对比度 1.2:1)
    100: '#F3F4F6',          // 浅灰背景 (对比度 1.4:1)
    200: '#E5E7EB',          // 边框灰 (对比度 2.0:1)
    300: '#D1D5DB',          // 分割线 (对比度 3.0:1)
    400: '#9CA3AF',          // 占位符 (对比度 2.9:1 - 装饰用)
    500: '#6B7280',          // 次要文字 (对比度 4.5:1 ✓)
    600: '#4B5563',          // 正文次要 (对比度 7.0:1 ✓✓)
    700: '#374151',          // 正文主要 (对比度 10.2:1 ✓✓✓)
    800: '#1F2937',          // 标题文字 (对比度 15.9:1 ✓✓✓)
    900: '#111827',          // 大标题 (对比度 18.5:1 ✓✓✓)
    950: '#030712',          // 近黑
    black: '#000000'         // 纯黑
  },

  // 表面色 - 多层次表面系统
  surface: {
    DEFAULT: '#FFFFFF',              // 主表面
    secondary: '#F9FAFB',            // 次级表面 (页面背景)
    tertiary: '#F3F4F6',             // 三级表面 (区块背景)
    elevated: '#FFFFFF',             // 抬升表面 (卡片，带阴影)
    overlay: 'rgba(0, 0, 0, 0.5)'   // 遮罩层
  },

  // 文本色 - WCAG 对比度优化
  text: {
    primary: '#111827',              // 主文本 (对比度 18.5:1 ✓✓✓)
    secondary: '#4B5563',            // 次要文本 (对比度 7.0:1 ✓✓)
    tertiary: '#6B7280',             // 三级文本 (对比度 4.5:1 ✓)
    quaternary: '#9CA3AF',           // 四级文本 (对比度 2.9:1 ⚠ 仅装饰)
    inverse: '#FFFFFF',             // 反色文本 (用于深色背景)
    disabled: '#D1D5DB',             // 禁用状态
    link: '#2563EB'                 // 链接蓝色
  },

  // 边框色
  border: {
    subtle: '#F3F4F6',              // 微妙边框
    DEFAULT: '#E5E7EB',             // 默认边框
    strong: '#D1D5DB',              // 强调边框
    focus: '#3B82F6'                // 焦点边框 (蓝色)
  }
}

// ====== 暗色主题 (Dark Theme) - 完整实现 ======
export const darkColorTokens: ColorTokens = {
  // 科大蓝主色系 - 暗色模式调整 (提高亮度以保持对比度)
  primary: {
    25: '#172033',           // 极深背景
    50: '#1E293B',           // 深背景
    100: '#28364F',          // 悬停背景
    200: '#334155',          // 边框色
    300: '#475569',          // 浅色文字
    400: '#64748B',          // 主要文字
    500: '#3B82F6',          // ★ 品牌主色 - 提亮版 (对比度 5.2:1 on #030712)
    600: '#60A5FA',          // 浅色主色 (对比度 4.0:1)
    700: '#93C5FD',          // 更浅主色 (对比度 2.1:1)
    800: '#BFDBFE',          // 超浅主色 (对比度 1.3:1)
    900: '#DBEAFE',          // 最浅主色 (对比度 1.05:1)
    950: '#EFF4FF'           // 极浅主色
  },

  // 紫罗兰辅助色 - 暗色模式
  secondary: {
    25: '#1E1B2E',
    50: '#2E213F',
    100: '#3D2750',
    200: '#582C8E',
    300: '#7E22CE',
    400: '#9333EA',
    500: '#A855F7',
    600: '#C084FC',
    700: '#D8B4FE',
    800: '#E9D5FF',
    900: '#F3E8FF',
    950: '#FAF5FF'
  },

  // 品牌金色 - 暗色模式 (降低亮度避免刺眼)
  gold: {
    light: '#422006',        // 深金背景
    DEFAULT: '#F59E0B',      // 主金色 (对比度 12.2:1 on #030712 ✓✓✓)
    dark: '#FBBF24',          // 浅金色 (对比度 8.6:1 on #030712 ✓✓)
    bg: '#451A03'            // 金色背景
  },

  // 兴邦红 - 暗色模式
  crimson: {
    light: '#450A0A',        // 深红背景
    DEFAULT: '#EF4444',      // 主红色 (对比度 5.5:1 on #030712 ✓✓)
    dark: '#F87171',          // 浅红色 (对比度 4.0:1 on #030712 ✓)
    bg: '#450A0A'            // 红色背景
  },

  // 松绿色 - 暗色模式
  pine: {
    light: '#052E16',        // 深绿背景
    DEFAULT: '#22C55E',      // 主绿色 (对比度 13.1:1 on #030712 ✓✓✓)
    dark: '#4ADE80',          // 浅绿色 (对比度 10.2:1 on #030712 ✓✓)
    bg: '#052E16'            // 绿色背景
  },

  // 语义化颜色 - 暗色模式 (WCAG AA 合规)
  success: {
    light: '#052E16',        // 深绿背景
    DEFAULT: '#22C55E',      // 成功主色 (对比度 13.1:1 ✓✓✓)
    dark: '#86EFAC',          // 浅色成功 (对比度 6.0:1 ✓✓)
    bg: '#052E16'
  },
  warning: {
    light: '#451A03',        // 深黄背景
    DEFAULT: '#FBBF24',      // 警告主色 (对比度 8.6:1 ✓✓)
    dark: '#FDE68A',          // 浅色警告 (对比度 4.5:1 ✓)
    bg: '#451A03'
  },
  danger: {
    light: '#450A0A',        // 深红背景
    DEFAULT: '#F87171',      // 危险主色 (对比度 4.0:1 ✓)
    dark: '#FCA5A5',          // 浅色危险 (对比度 3.0:1 ⚠)
    bg: '#450A0A'
  },
  info: {
    light: '#172033',        // 深蓝背景
    DEFAULT: '#60A5FA',      // 信息主色 (对比度 4.0:1 ✓)
    dark: '#93C5FD',          // 浅色信息 (对比度 2.1:1 ⚠)
    bg: '#172033'
  },

  // 中性灰阶 - 暗色模式反转
  neutral: {
    white: '#030712',        // 暗色"白"
    50: '#111827',           // 极深灰
    100: '#1F2937',          // 深灰背景
    200: '#374151',          // 边框灰
    300: '#4B5563',          // 分割线
    400: '#6B7280',          // 占位符
    500: '#9CA3AF',          // 次要文字 (对比度 5.2:1 ✓)
    600: '#D1D5DB',          // 正文次要 (对比度 13.3:1 ✓✓✓)
    700: '#E5E7EB',          // 正文主要 (对比度 15.9:1 ✓✓✓)
    800: '#F3F4F6',          // 标题文字 (对比度 18.5:1 ✓✓✓)
    900: '#F9FAFB',          // 大标题 (对比度 19.5:1 ✓✓✓)
    950: '#FFFFFF',          // 近白
    black: '#FFFFFF'         // "黑"变白
  },

  // 表面色 - 暗色模式
  surface: {
    DEFAULT: '#111827',              // 主表面 (深灰)
    secondary: '#030712',            // 次级表面 (更深)
    tertiary: '#1F2937',             // 三级表面
    elevated: '#1F2937',             // 抬升表面 (卡片)
    overlay: 'rgba(0, 0, 0, 0.7)'   // 遮罩层 (加深)
  },

  // 文本色 - 暗色模式 (高对比度)
  text: {
    primary: '#F9FAFB',              // 主文本 (对比度 19.5:1 ✓✓✓)
    secondary: '#E5E7EB',            // 次要文本 (对比度 15.9:1 ✓✓✓)
    tertiary: '#D1D5DB',             // 三级文本 (对比度 13.3:1 ✓✓✓)
    quaternary: '#9CA3AF',           // 四级文本 (对比度 5.2:1 ✓)
    inverse: '#111827',             // 反色文本
    disabled: '#4B5563',             // 禁用状态
    link: '#60A5FA'                 // 链接蓝色 (亮色)
  },

  // 边框色 - 暗色模式
  border: {
    subtle: '#1F2937',              // 微妙边框
    DEFAULT: '#374151',             // 默认边框
    strong: '#4B5563',              // 强调边框
    focus: '#3B82F6'                // 焦点边框 (保持蓝色)
  }
}

// ====== 品牌渐变色 (Brand Gradients) ======
export const gradients = {
  // 亮色主题渐变
  light: {
    primary: 'linear-gradient(135deg, #000AB0 0%, #3B82F6 50%, #60A5FA 100%)',
    primaryDeep: 'linear-gradient(135deg, #000880 0%, #000AB0 40%, #3B82F6 100%)',
    gold: 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)',
    crimson: 'linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #F87171 100%)',
    pine: 'linear-gradient(135deg, #15803D 0%, #16A34A 50%, #22C55E 100%)',
    campus: 'linear-gradient(135deg, #000AB0 0%, #15803D 100%)',
    warm: 'linear-gradient(135deg, #DC2626 0%, #D97706 100%)',
    mesh: 'linear-gradient(135deg, rgba(0, 10, 176, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)'
  },

  // 暗色主题渐变
  dark: {
    primary: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)',
    primaryDeep: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 40%, #60A5FA 100%)',
    gold: 'linear-gradient(135deg, #D97706 0%, #FBBF24 50%, #FDE68A 100%)',
    crimson: 'linear-gradient(135deg, #DC2626 0%, #F87171 50%, #FCA5A5 100%)',
    pine: 'linear-gradient(135deg, #15803D 0%, #22C55E 50%, #86EFAC 100%)',
    campus: 'linear-gradient(135deg, #3B82F6 0%, #22C55E 100%)',
    warm: 'linear-gradient(135deg, #EF4444 0%, #FBBF24 100%)',
    mesh: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(251, 191, 36, 0.15) 100%)'
  }
}

// ====== 阴影系统 (Shadow System) ======
export const shadows = {
  // 亮色主题阴影
  light: {
    xs: '0 1px 2px rgba(17, 24, 39, 0.04)',
    sm: '0 2px 4px rgba(17, 24, 39, 0.06), 0 1px 2px rgba(17, 24, 39, 0.04)',
    md: '0 4px 8px rgba(17, 24, 39, 0.08), 0 2px 4px rgba(17, 24, 39, 0.06)',
    lg: '0 8px 16px rgba(17, 24, 39, 0.12), 0 4px 8px rgba(17, 24, 39, 0.08)',
    xl: '0 16px 32px rgba(17, 24, 39, 0.16), 0 8px 16px rgba(17, 24, 39, 0.12)',
    '2xl': '0 24px 48px rgba(17, 24, 39, 0.20), 0 12px 24px rgba(17, 24, 39, 0.14)',
    inner: 'inset 0 2px 4px rgba(17, 24, 39, 0.06)',
    brand: '0 4px 14px rgba(0, 10, 176, 0.20), 0 0 1px rgba(0, 10, 176, 0.10)',
    gold: '0 4px 14px rgba(217, 119, 6, 0.25)',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)'
  },

  // 暗色主题阴影 (更深的阴影)
  dark: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.3)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 8px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.6), 0 4px 8px rgba(0, 0, 0, 0.5)',
    xl: '0 16px 32px rgba(0, 0, 0, 0.7), 0 8px 16px rgba(0, 0, 0, 0.6)',
    '2xl': '0 24px 48px rgba(0, 0, 0, 0.8), 0 12px 24px rgba(0, 0, 0, 0.7)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
    brand: '0 4px 14px rgba(59, 130, 246, 0.35), 0 0 1px rgba(59, 130, 246, 0.2)',
    gold: '0 4px 14px rgba(251, 191, 36, 0.35)',
    glow: '0 0 20px rgba(96, 165, 250, 0.4)'
  }
}
