<!--
  SearchBar 使用示例
  展示 SearchBar 组件 v3.0 的各种用法和配置
-->

<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'

// 基础示例
const keyword = ref('')

// 完整配置示例
const fullKeyword = ref('')
const isSearching = ref(false)

// 导航栏紧凑版
const navKeyword = ref('')

// ==================== 事件处理函数 ====================

/** 基础搜索 */
function handleSearch(value: string) {
  console.log('执行搜索:', value)
  // 这里可以添加路由跳转或API调用
}

/** 实时输入（可用于联想搜索）*/
function handleInput(value: string) {
  console.log('实时输入:', value)
  // 可以在这里调用联想搜索API
}

/** 清除输入 */
function handleClear() {
  console.log('已清除')
}

/** 聚焦事件 */
function handleFocus(event: FocusEvent) {
  console.log('聚焦', event)
}

/** 失焦事件 */
function handleBlur(event: FocusEvent) {
  console.log('失焦', event)
}

/** 完整配置的搜索处理 */
async function handleFullSearch(value: string) {
  isSearching.value = true
  
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('搜索完成:', value)
  } finally {
    isSearching.value = false
  }
}
</script>

<template>
  <div class="search-bar-examples">
    <!-- 示例1：基础用法 -->
    <section class="example-section">
      <h2>基础用法</h2>
      <p>最简单的搜索框，支持 v-model 双向绑定</p>
      
      <SearchBar
        v-model="keyword"
        placeholder="搜索商品、店铺..."
        @search="handleSearch"
      />
      
      <div class="result">
        当前值: {{ keyword || '(空)' }}
      </div>
    </section>

    <!-- 示例2：完整配置 -->
    <section class="example-section">
      <h2>完整配置</h2>
      <p>展示所有可用选项的完整配置</p>
      
      <SearchBar
        v-model="fullKeyword"
        placeholder="搜索商品、外卖、二手好物..."
        size="lg"
        variant="default"
        :show-button="true"
        :clearable="true"
        :show-word-count="true"
        :maxlength="50"
        :loading="isSearching"
        :debounce-delay="300"
        @search="handleFullSearch"
        @input="handleInput"
        @clear="handleClear"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <div class="result">
        <p>当前值: {{ fullKeyword || '(空)' }}</p>
        <p>字数: {{ fullKeyword.length }}/50</p>
      </div>
    </section>

    <!-- 示例3：不同尺寸 -->
    <section class="example-section">
      <h2>尺寸规格</h2>
      <p>4种预设尺寸：sm (36px)、md (44px)、lg (52px)、full (56px)</p>
      
      <div class="size-examples">
        <div>
          <label>sm (小)</label>
          <SearchBar
            v-model="keyword"
            size="sm"
            placeholder="小尺寸"
          />
        </div>
        
        <div>
          <label>md (中) - 默认</label>
          <SearchBar
            v-model="keyword"
            size="md"
            placeholder="中等尺寸"
          />
        </div>
        
        <div>
          <label>lg (大)</label>
          <SearchBar
            v-model="keyword"
            size="lg"
            placeholder="大尺寸"
          />
        </div>
        
        <div>
          <label>full (全)</label>
          <SearchBar
            v-model="keyword"
            size="full"
            placeholder="完整尺寸"
          />
        </div>
      </div>
    </section>

    <!-- 示例4：视觉变体 -->
    <section class="example-section">
      <h2>视觉变体</h2>
      <p>4种风格变体：default、filled、outlined、rounded</p>
      
      <div class="variant-examples">
        <div>
          <label>default (默认)</label>
          <SearchBar
            v-model="keyword"
            variant="default"
            placeholder="默认样式"
          />
        </div>
        
        <div>
          <label>filled (填充式)</label>
          <SearchBar
            v-model="keyword"
            variant="filled"
            placeholder="填充样式"
          />
        </div>
        
        <div>
          <label>outlined (轮廓式)</label>
          <SearchBar
            v-model="keyword"
            variant="outlined"
            placeholder="轮廓样式"
          />
        </div>
        
        <div>
          <label>rounded (胶囊形)</label>
          <SearchBar
            v-model="keyword"
            variant="rounded"
            placeholder="胶囊样式"
          />
        </div>
      </div>
    </section>

    <!-- 示例5：导航栏紧凑版 -->
    <section class="example-section navbar-example">
      <h2>导航栏紧凑版</h2>
      <p>适用于顶部导航栏的胶囊形搜索框</p>
      
      <div class="navbar">
        <div class="navbar-logo">Logo</div>
        
        <SearchBar
          v-model="navKeyword"
          size="sm"
          variant="rounded"
          placeholder="搜索..."
          @search="handleSearch"
          class="navbar-search"
        />
        
        <div class="navbar-actions">
          <button>登录</button>
        </div>
      </div>
    </section>

    <!-- 示例6：禁用状态 -->
    <section class="example-section">
      <h2>禁用状态</h2>
      
      <SearchBar
        v-model="keyword"
        placeholder="禁用的搜索框"
        :disabled="true"
      />
    </section>

    <!-- 示例7：自动聚焦 -->
    <section class="example-section">
      <h2>自动聚焦</h2>
      <p>页面加载时自动聚焦到搜索框（autofocus）</p>
      
      <SearchBar
        v-model="keyword"
        placeholder="我会自动聚焦..."
        :autofocus="true"
      />
    </section>

    <!-- 示例8：快捷键提示 -->
    <section class="example-section">
      <h2>键盘快捷键</h2>
      <p>按 <kbd>Ctrl</kbd> + <kbd>K</kbd> (Mac: <kbd>⌘</kbd> + <kbd>K</kbd>) 可快速聚焦搜索框</p>
      
      <SearchBar
        v-model="keyword"
        placeholder="试试按 Ctrl+K"
      />
    </section>

    <!-- 示例9：无清除按钮 -->
    <section class="example-section">
      <h2>隐藏清除按钮</h2>
      <p>设置 clearable=false 可隐藏清除按钮</p>
      
      <SearchBar
        v-model="keyword"
        placeholder="没有清除按钮"
        :clearable="false"
      />
    </section>

    <!-- 示例10：自定义类名 -->
    <section class="example-section">
      <h2>自定义样式</h2>
      <p>通过 class prop 添加自定义类名进行样式扩展</p>
      
      <SearchBar
        v-model="keyword"
        placeholder="带自定义样式的搜索框"
        class="custom-search-bar"
      />
    </section>
  </div>
</template>

<style scoped>
.search-bar-examples {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.example-section {
  margin-bottom: 48px;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.example-section h2 {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.example-section p {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #6B7280;
  line-height: 1.5;
}

.result {
  margin-top: 16px;
  padding: 12px 16px;
  background: #F9FAFB;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
}

.result p {
  margin: 4px 0;
}

/* 尺寸示例布局 */
.size-examples,
.variant-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.size-examples > div,
.variant-examples > div {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.size-examples label,
.variant-examples label {
  font-size: 13px;
  font-weight: 500;
  color: #6B7280;
}

/* 导航栏示例 */
.navbar-example {
  background: linear-gradient(135deg, #000AB0 0%, #3B82F6 100%);
  color: white;
}

.navbar-example h2,
.navbar-example p {
  color: white;
}

.navbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
}

.navbar-logo {
  font-size: 18px;
  font-weight: 700;
  color: #000AB0;
}

.navbar-search {
  flex: 1;
  max-width: 400px;
}

.navbar-actions button {
  padding: 8px 16px;
  background: #000AB0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.navbar-actions button:hover {
  background: #000880;
}

/* 自定义样式示例 */
.custom-search-bar {
  border: 2px solid #D97706;
  border-radius: 12px;
}

.custom-search-bar:focus-within {
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
}

/* 响应式适配 */
@media (max-width: 640px) {
  .search-bar-examples {
    padding: 20px 16px;
  }
  
  .example-section {
    padding: 16px;
    margin-bottom: 32px;
  }
  
  .size-examples,
  .variant-examples {
    grid-template-columns: 1fr;
  }
  
  .navbar {
    flex-wrap: wrap;
  }
  
  .navbar-search {
    order: 3;
    max-width: 100%;
    width: 100%;
    margin-top: 12px;
  }
}

/* kbd 样式 */
kbd {
  display: inline-block;
  padding: 2px 6px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  background: #F3F4F6;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}
</style>
