/**
 * 黑龙江科技大学 - 现代化排版系统 v3.0
 * Typography System - 高校规范字体层级
 * 优化的中英文混排效果和可读性
 */

export interface TypographyTokens {
  // 字体族 (Font Families)
  fontFamily: {
    sans: string        // 无衬线字体（主字体）
    serif: string       // 衬线字体（用于标题/引用）
    mono: string        // 等宽字体（代码/数据）
    display: string     // 展示字体（大标题/校训）
  }

  // 字体尺寸 (Font Sizes) - 使用流体排版 (Fluid Typography)
  fontSize: {
    xs: string          // 超小字 (12px) - 标签、角标
    sm: string          // 小字 (14px) - 辅助文字、说明
    base: string        // 基础字 (16px) - 正文
    lg: string          // 大字 (18px) - 强调文字
    xl: string          // 超大字 (20px) - 小标题
    '2xl': string       // 双倍大 (24px) - 二级标题
    '3xl': string       // 三倍大 (30px) - 一级标题
    '4xl': string       // 四倍大 (36px) - 大标题
    '5xl': string       // 五倍大 (48px) - 展示标题
    '6xl': string       // 六倍大 (60px) - 巨型标题（Hero）
  }

  // 字重 (Font Weights)
  fontWeight: {
    light: number       // 细体 (300)
    normal: number      // 常规 (400)
    medium: number      // 中等 (500)
    semibold: number    // 半粗 (600)
    bold: number        // 粗体 (700)
    extrabold: number   // 特粗 (800)
  }

  // 行高 (Line Heights) - 针对中文优化
  lineHeight: {
    none: number        // 无行高 (1) - 用于多行文本截断
    tight: number       // 紧凑 (1.25) - 英文标题
    snug: number        // 适中 (1.375) - 中文标题
    normal: number      // 正常 (1.5) - 中文正文
    relaxed: number     // 宽松 (1.625) - 长篇文章
    loose: number       // 极松 (2) - 特殊用途
  }

  // 字间距 (Letter Spacing)
  letterSpacing: {
    tighter: string     // 更紧 (-0.05em)
    tight: string       // 紧凑 (-0.025em)
    normal: string      // 正常 (0em)
    wide: string        // 宽松 (0.025em)
    wider: string       // 更宽 (0.05em)
    widest: string      // 最宽 (0.1em) - 用于校训/英文大写
  }

  // 段落间距 (Paragraph Spacing)
  paragraphSpacing: {
    xs: string          // 超小 (8px)
    sm: string          // 小 (12px)
    md: string          // 中 (16px)
    lg: string          // 大 (24px)
    xl: string          // 超大 (32px)
  }

  // 文本层级定义 (Text Hierarchy) - 语义化命名
  textHierarchy: {
    display: {         // 展示文本（Hero区域）
      fontSize: string
      fontWeight: number
      lineHeight: number
      letterSpacing: string
    }
    h1: {              // 一级标题（页面主标题）
      fontSize: string
      fontWeight: number
      lineHeight: number
      letterSpacing: string
    }
    h2: {              // 二级标题（区块标题）
      fontSize: string
      fontWeight: number
      lineHeight: number
      letterSpacing: string
    }
    h3: {              // 三级标题（卡片标题）
      fontSize: string
      fontWeight: number
      lineHeight: number
      letterSpacing: string
    }
    h4: {              // 四级标题（小组件标题）
      fontSize: string
      fontWeight: number
      lineHeight: number
      letterSpacing: string
    }
    body: {            // 正文（主要阅读内容）
      fontSize: string
      fontWeight: number
      lineHeight: number
      letterSpacing: string
    }
    bodyLarge: {       // 大正文（强调段落）
      fontSize: string
      fontWeight: number
      lineHeight: number
      letterSpacing: string
    }
    caption: {         // 说明文字（辅助说明）
      fontSize: string
      fontWeight: number
      lineHeight: number
      letterSpacing: string
    }
    overline: {        // 上标文字（标签、导航）
      fontSize: string
      fontWeight: number
      lineHeight: number
      letterSpacing: string
    }
    button: {          // 按钮文字
      fontSize: string
      fontWeight: number
      lineHeight: number
      letterSpacing: string
    }
  }
}

export const typographyTokens: TypographyTokens = {
  // ====== 字体族 (Font Families) ======
  fontFamily: {
    // 主字体 - 专为中文优化的无衬线字体栈
    // 优先使用系统字体，确保最佳渲染性能
    sans: [
      // 苹果系统字体（macOS/iOS）
      '-apple-system',
      'BlinkMacSystemFont',
      // Windows 系统字体
      '"Segoe UI"',
      'Roboto',
      // 中文优先字体
      '"PingFang SC"',           // 苹方（苹果中文首选）
      '"Microsoft YaHei"',       // 微软雅黑（Windows中文首选）
      '"Hiragino Sans GB"',      // 冬青黑体（老版本macOS）
      '"Noto Sans SC"',           // 思源黑体（开源跨平台）
      // 回退到通用无衬线字体
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(', '),

    // 衬线字体 - 用于引用、特殊标题
    serif: [
      '"Noto Serif SC"',          // 思源宋体（中文衬线首选）
      '"SimSun"',                 // 宋体（Windows默认）
      '"STSong"',                 // 华文宋体（macOS）
      'Georgia',
      '"Times New Roman"',
      'Times',
      'serif'
    ].join(', '),

    // 等宽字体 - 用于代码、数据展示
    mono: [
      // 现代等宽字体
      '"SF Mono"',
      "\"SFMono-Regular\"",
      'Consolas',
      '"Liberation Mono"',
      // 中文等宽字体
      '"Noto Sans Mono CJK SC"',
      // 回退
      'Menlo',
      'Courier',
      'monospace'
    ].join(', '),

    // 展示字体 - 用于大标题、校训等特殊场景
    display: [
      '"PingFang SC"',
      '"Microsoft YaHei"',
      '-apple-system',
      'sans-serif'
    ].join(', ')
  },

  // ====== 字体尺寸 (Fluid Typography - 流体排版) ======
  // 使用 clamp() 实现响应式字体大小
  fontSize: {
    xs: '0.75rem',               // 12px - 标签、角标、徽章
    sm: '0.875rem',              // 14px - 辅助文字、说明、小按钮
    base: '1rem',                // 16px - 正文（基准尺寸）
    lg: '1.125rem',              // 18px - 强调文字、大按钮
    xl: '1.25rem',               // 20px - 小标题
    '2xl': '1.5rem',             // 24px - 二级标题
    '3xl': 'clamp(1.75rem, 4vw, 1.875rem)',  // 28-30px - 一级标题（响应式）
    '4xl': 'clamp(2rem, 5vw, 2.25rem)',     // 32-36px - 大标题（响应式）
    '5xl': 'clamp(2.5rem, 6vw, 3rem)',      // 40-48px - 展示标题（响应式）
    '6xl': 'clamp(3rem, 7vw, 3.75rem)'      // 48-60px - 巨型标题（响应式）
  },

  // ====== 字重 (Font Weights) ======
  fontWeight: {
    light: 300,                   // 细体 - 装饰性文字
    normal: 400,                  // 常规 - 正文
    medium: 500,                  // 中等 - 按钮文字、标签
    semibold: 600,                // 半粗 - 小标题、强调
    bold: 700,                    // 粗体 - 标题
    extrabold: 800                // 特粗 - 展示标题、校训
  },

  // ====== 行高 (Line Heights) - 针对中英文混排优化 ======
  lineHeight: {
    none: 1,                      // 无行高 - 多行文本截断用
    tight: 1.25,                  // 紧凑 - 英文标题/数字
    snug: 1.375,                  // 适中 - 中文标题（推荐）
    normal: 1.5,                  // 正常 - 中文正文（标准）
    relaxed: 1.625,               // 宽松 - 长篇文章/说明文字
    loose: 2                       // 极松 - 特殊排版需求
  },

  // ====== 字间距 (Letter Spacing) ======
  letterSpacing: {
    tighter: '-0.05em',            // 更紧 - 紧凑排版
    tight: '-0.025em',            // 紧凑 - 大写英文
    normal: '0em',                // 正常 - 默认
    wide: '0.025em',              // 宽松 - 小字号文字
    wider: '0.05em',             // 更宽 - 导航/标签
    widest: '0.15em'             // 最宽 - 校训/品牌文字
  },

  // ====== 段落间距 (Paragraph Spacing) ======
  paragraphSpacing: {
    xs: '0.5rem',                  // 8px
    sm: '0.75rem',                 // 12px
    md: '1rem',                    // 16px
    lg: '1.5rem',                  // 24px
    xl: '2rem'                     // 32px
  },

  // ====== 文本层级定义 (Text Hierarchy) - 语义化配置 ======
  textHierarchy: {
    // 展示文本 - Hero区域的大标题（如首页Banner）
    display: {
      fontSize: 'clamp(2.5rem, 6vw, 3rem)',
      fontWeight: 800,
      lineHeight: 1.15,
      letterSpacing: '-0.03em'
    },
    
    // 一级标题 - 页面主标题
    h1: {
      fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.02em'
    },
    
    // 二级标题 - 区块标题（如"热门推荐"）
    h2: {
      fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em'
    },
    
    // 三级标题 - 卡片标题（如商品名称）
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '-0.01em'
    },
    
    // 四级标题 - 小组件标题（如侧边栏项目）
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em'
    },
    
    // 正文 - 主要阅读内容
    body: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.625,          // 中文正文推荐行高
      letterSpacing: '0.01em'    // 微调字间距提升可读性
    },
    
    // 大正文 - 强调段落（如商品描述）
    bodyLarge: {
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.005em'
    },
    
    // 说明文字 - 辅助说明（如表单提示）
    caption: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01em'
    },
    
    // 上标文字 - 标签、导航、分类名
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.05em'    // 大写字母需要更大字间距
    },
    
    // 按钮文字
    button: {
      fontSize: '0.9375rem',     // 15px
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '0.01em'
    },

    // 三倍大文本 - 统计数字、价格（如"¥128,450"）
    '3xl': {
      fontSize: 'clamp(1.75rem, 4vw, 1.875rem)',  // 28-30px 响应式
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em'
    }
  }
}

// ====== 排版工具函数 (Typography Utilities) ======

/**
 * 获取文本层级的完整样式对象
 * @param level - 文本层级名称
 * @returns CSS样式对象
 */
export function getTextStyle(level: keyof TypographyTokens['textHierarchy']) {
  return typographyTokens.textHierarchy[level]
}

/**
 * 生成响应式字体大小CSS
 * @param minSize - 最小字体大小（移动端）
 * @param maxSize - 最大字体大小（桌面端）
 * @param viewportWidth - 视口宽度基准（默认100vw）
 */
export function fluidFontSize(
  minSize: string,
  maxSize: string,
  viewportWidth: string = '100vw'
): string {
  return `clamp(${minSize}, calc(${viewportWidth} * 0.03 + ${minSize}), ${maxSize})`
}

// ====== 排版预设类名 (Typography Presets) ======
export const typographyPresets = {
  // 平衡型 - 适合长文章阅读
  balanced: {
    headingLineHeight: 1.25 as const,
    bodyLineHeight: 1.7 as const,
    paragraphMarginBottom: '1.5em' as const,
    headingMarginTop: '1.5em' as const
  },
  
  // 紧凑型 - 适合仪表盘/数据密集界面
  compact: {
    headingLineHeight: 1.2 as const,
    bodyLineHeight: 1.4 as const,
    paragraphMarginBottom: '1em' as const,
    headingMarginTop: '1em' as const
  },
  
  // 舒适型 - 适合营销页面/Landing Page
  comfortable: {
    headingLineHeight: 1.3 as const,
    bodyLineHeight: 1.75 as const,
    paragraphMarginBottom: '1.75em' as const,
    headingMarginTop: '2em' as const
  }
}
