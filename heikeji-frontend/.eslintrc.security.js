module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:storybook/recommended',
    'plugin:security/recommended', // 添加安全规则
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['vue', 'prettier', '@typescript-eslint', 'security'], // 添加安全插件
  rules: {
    // Prettier集成
    'prettier/prettier': 'error',

    // Vue特定规则
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'error',
    'vue/no-unused-components': 'warn',
    'vue/no-multiple-template-root': 'off',
    'vue/no-v-html': 'warn', // 从off改为warn，提醒使用v-html的风险
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/prop-name-casing': ['error', 'camelCase'],
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/v-on-event-hyphenation': ['error', 'always'],
    'vue/no-side-effects-in-computed-properties': 'error',
    'vue/no-async-in-computed-properties': 'error',
    'vue/return-in-computed-property': 'error',
    'vue/no-dupe-keys': 'error',
    'vue/no-duplicate-attributes': 'error',
    'vue/no-useless-v-bind': 'error',
    'vue/no-useless-mustaches': 'error',
    'vue/valid-v-model': 'error',
    'vue/valid-v-bind-sync': 'error',
    'vue/no-v-model-argument': 'off',

    // JavaScript核心规则
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-alert': 'error',
    'no-await-in-loop': 'error',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    'no-useless-return': 'error',
    'no-useless-concat': 'error',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'prefer-destructuring': [
      'error',
      {
        object: true,
        array: false,
      },
    ],
    'object-shorthand': 'error',
    'quote-props': ['error', 'as-needed'],
    'spaced-comment': ['error', 'always'],

    // 异步代码规则
    'no-promise-executor-return': 'error',
    'prefer-promise-reject-errors': 'error',
    'require-atomic-updates': 'error',

    // 安全性规则 - 增强
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-new-wrappers': 'error',
    'no-extend-native': 'error',
    'no-proto': 'error',
    'no-throw-literal': 'error',
    
    // 安全插件规则
    'security/detect-object-injection': 'warn', // 检测对象注入
    'security/detect-non-literal-fs-filename': 'error', // 检测非字面量文件名
    'security/detect-non-literal-regexp': 'warn', // 检测非字面量正则表达式
    'security/detect-unsafe-regex': 'error', // 检测不安全的正则表达式
    'security/detect-buffer-noassert': 'error', // 检测buffer.noassert
    'security/detect-child-process': 'warn', // 检测子进程
    'security/detect-disable-mustache-escape': 'error', // 检测禁用mustache转义
    'security/detect-eval-with-expression': 'error', // 检测带表达式的eval
    'security/detect-no-csrf-before-method-override': 'error', // 检测CSRF
    'security/detect-non-literal-require': 'warn', // 检测非字面量require
    'security/detect-possible-timing-attacks': 'warn', // 检测可能的时序攻击
    'security/detect-pseudoRandomBytes': 'error', // 检测伪随机字节
    'security/detect-unsafe-assignment': 'error', // 检测不安全的赋值
    'security/detect-unsafe-eval': 'error', // 检测不安全的eval
    'security/detect-unsafe-import': 'error', // 检测不安全的导入
    'security/detect-unsafe-negation': 'error', // 检测不安全的否定
    'security/detect-new-buffer': 'error', // 检测new Buffer
    'security/detect-no-csrf-before-method-override': 'error', // 检测CSRF

    // 性能优化规则
    'no-loop-func': 'error',
    'prefer-spread': 'error',

    // 代码风格规则
    indent: 'off',
    quotes: 'off',
    semi: 'off',
    'comma-dangle': 'off',
    'comma-spacing': 'off',
    'comma-style': 'off',
    'computed-property-spacing': 'off',
    'func-call-spacing': 'off',
    'key-spacing': 'off',
    'keyword-spacing': 'off',
    'no-multi-spaces': 'off',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-trailing-spaces': 'error',
    'object-curly-spacing': 'off',
    'array-bracket-spacing': 'off',
    'space-in-parens': 'off',
    'space-infix-ops': 'off',
    'space-before-function-paren': 'off',
    'arrow-spacing': 'off',
    'block-spacing': 'off',
    'brace-style': 'off',

    // TypeScript特定规则
    '@typescript-eslint/no-explicit-any': 'warn', // 从off改为warn
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-interface-implementation': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    
    // TypeScript安全规则
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
      },
      rules: {
        'no-console': 'off',
        'no-debugger': 'off',
        'security/detect-object-injection': 'off', // Vue模板中允许对象注入
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      rules: {
        'no-undef': 'off',
      },
    },
    {
      files: ['src/**/*.{test,spec}.{js,ts}'],
      env: {
        jest: true,
        browser: true,
        node: true,
      },
      rules: {
        'no-console': 'off',
        'no-debugger': 'off',
        'no-undef': 'off',
        'security/detect-object-injection': 'off', // 测试文件中允许对象注入
        'security/detect-non-literal-require': 'off', // 测试文件中允许非字面量require
      },
    },
    {
      files: ['tests/**/*.{js,ts}'],
      env: {
        jest: true,
        browser: true,
        node: true,
      },
      rules: {
        'no-console': 'off',
        'no-debugger': 'off',
        'no-undef': 'off',
        'security/detect-object-injection': 'off', // 测试文件中允许对象注入
        'security/detect-non-literal-require': 'off', // 测试文件中允许非字面量require
      },
    },
    {
      files: ['public/**/*'],
      rules: {
        'no-console': 'off',
        'no-debugger': 'off',
        'no-unused-vars': 'off',
      },
    },
    {
      files: ['scripts/**/*', 'config/**/*'],
      rules: {
        'no-console': 'off',
        'security/detect-child-process': 'off', // 脚本文件中允许使用子进程
        'security/detect-non-literal-fs-filename': 'off', // 脚本文件中允许非字面量文件名
        'security/detect-non-literal-require': 'off', // 脚本文件中允许非字面量require
      },
    },
  ],
}