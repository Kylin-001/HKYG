/**
 * Prettier 配置文件
 * 统一代码格式化规则
 */
module.exports = {
  // 箭头函数参数括号
  arrowParens: 'always',
  // 大括号内的空格
  bracketSpacing: true,
  // 结尾是否添加分号
  semi: true,
  // 缩进空格数
  tabWidth: 2,
  // 使用空格缩进
  useTabs: false,
  // 引号类型
  singleQuote: true,
  // 行尾换行符
  endOfLine: 'auto',
  // 对象末尾逗号
  trailingComma: 'es5',
  // 行宽限制
  printWidth: 100,
  // Vue文件script和style标签内的缩进
  vueIndentScriptAndStyle: true,
  // HTML闭合标签换行
  htmlWhitespaceSensitivity: 'css',
  // 格式化嵌入的代码
  embeddedLanguageFormatting: 'auto',
}
