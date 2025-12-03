module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not dead'],
        },
      },
    ],
  ],
  plugins: [
    // 可选链操作符
    '@babel/plugin-proposal-optional-chaining',
    // 空值合并操作符
    '@babel/plugin-proposal-nullish-coalescing-operator',
    // 私有类属性
    '@babel/plugin-proposal-class-properties',
  ],
  env: {
    development: {
      sourceMaps: true,
    },
    production: {
      // 生产环境配置
    },
  },
}
