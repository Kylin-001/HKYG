/**
 * lint-staged 配置文件
 * 提交前代码检查规则
 */
module.exports = {
  // 对所有JavaScript/TypeScript/Vue文件执行ESLint和Prettier
  '*.{js,jsx,ts,tsx,vue}': [
    'eslint --fix',
    'prettier --write'
  ],
  // 对样式文件执行Prettier
  '*.{css,scss,less,vue}': [
    'prettier --write'
  ],
  // 对JSON和JSON5文件执行Prettier
  '*.{json,json5}': [
    'prettier --write'
  ],
  // 对Markdown文件执行Prettier
  '*.md': [
    'prettier --write'
  ]
}
