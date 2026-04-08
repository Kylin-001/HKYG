import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Skeleton from '@/components/Skeleton.vue'

describe('Skeleton.vue', () => {
  it('渲染 heading 类型骨架屏', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'heading' },
    })

    const skeletonEl = wrapper.find('.skeleton--shimmer')
    expect(skeletonEl.exists()).toBe(true)
    // heading 默认高度应该是 28px
    expect(skeletonEl.attributes('style')).toContain('height: 28px')
  })

  it('渲染 text 类型骨架屏', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'text', rows: 3 },
    })

    const textGroup = wrapper.find('.skeleton-text-group')
    expect(textGroup.exists()).toBe(true)

    // 应该有 3 行文本骨架
    const rows = wrapper.findAll('.skeleton--shimmer')
    expect(rows.length).toBe(3)

    // 最后一行宽度应该是 60%
    const lastRow = rows[rows.length - 1]
    expect(lastRow.attributes('style')).toContain('width: 60%')
  })

  it('渲染 image 类型骨架屏', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'image' },
    })

    const skeletonEl = wrapper.find('.skeleton--shimmer')
    expect(skeletonEl.exists()).toBe(true)
    // image 默认高度应该是 200px
    expect(skeletonEl.attributes('style')).toContain('height: 200px')
  })

  it('渲染 button 类型骨架屏', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'button' },
    })

    const skeletonEl = wrapper.find('.skeleton--shimmer')
    expect(skeletonEl.exists()).toBe(true)
    // button 默认高度应该是 40px，默认宽度是 120px（非100%时）
    expect(skeletonEl.attributes('style')).toContain('height: 40px')
    expect(skeletonEl.attributes('style')).toContain('width: 120px')
  })

  it('渲染 card 类型骨架屏', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'card' },
    })

    const card = wrapper.find('.skeleton-card')
    expect(card.exists()).toBe(true)

    // 卡片应该包含图片区域、标题、文本和价格
    expect(card.find('.skeleton-card__img').exists()).toBe(true)
    expect(card.find('.skeleton-card__title').exists()).toBe(true)
    expect(card.find('.skeleton-card__text').exists()).toBe(true)
    expect(card.find('.skeleton-card__price').exists()).toBe(true)
  })

  it('渲染 list 类型骨架屏', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'list', rows: 5 },
    })

    const list = wrapper.find('.skeleton-list')
    expect(list.exists()).toBe(true)

    // 应该有 5 个列表项
    const items = wrapper.findAll('.skeleton-list__item')
    expect(items.length).toBe(5)

    // 每个列表项应该包含头像和内容区
    items.forEach((item) => {
      expect(item.find('.skeleton-list__avatar').exists()).toBe(true)
      expect(item.find('.skeleton-list__content').exists()).toBe(true)
    })
  })

  it('渲染 table 类型骨架屏', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'table', rows: 3 },
    })

    const table = wrapper.find('.skeleton-table')
    expect(table.exists()).toBe(true)

    // 应该有表头行 + 数据行（至少3行数据）
    const rows = wrapper.findAll('.skeleton-table__row')
    // 表头 + Math.max(3, 3) = 4 行
    expect(rows.length).toBeGreaterThanOrEqual(4)

    // 表头行应该有 4 列
    const headerRow = wrapper.find('.skeleton-table__header')
    const headerCells = headerRow.findAll('.skeleton-table__cell')
    expect(headerCells.length).toBe(4)
  })

  it('shimmer 动画 CSS 类存在', () => {
    const types = ['heading', 'text', 'image', 'button']

    types.forEach((type) => {
      const wrapper = mount(Skeleton, {
        props: { type: type as any },
      })

      const shimmerElement = wrapper.find('.skeleton--shimmer')
      expect(shimmerElement.exists()).toBe(true)
      expect(shimmerElement.classes()).toContain('skeleton--shimmer')
    })
  })

  it('支持自定义 rows 属性', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'text', rows: 5 },
    })

    const rows = wrapper.findAll('.skeleton--shimmer')
    expect(rows.length).toBe(5)
  })

  it('支持自定义 width 属性', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'heading', width: '200px' },
    })

    const skeletonEl = wrapper.find('.skeleton--shimmer')
    expect(skeletonEl.attributes('style')).toContain('width: 200px')
  })

  it('支持数字类型 width 属性', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'heading', width: 300 },
    })

    const skeletonEl = wrapper.find('.skeleton--shimmer')
    expect(skeletonEl.attributes('style')).toContain('width: 300px')
  })

  it('支持自定义 height 属性', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'image', height: '150px' },
    })

    const skeletonEl = wrapper.find('.skeleton--shimmer')
    expect(skeletonEl.attributes('style')).toContain('height: 150px')
  })

  it('支持数字类型 height 属性', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'image', height: 250 },
    })

    const skeletonEl = wrapper.find('.skeleton--shimmer')
    expect(skeletonEl.attributes('style')).toContain('height: 250px')
  })

  it('不传 type 时默认为 text 类型', () => {
    const wrapper = mount(Skeleton)

    // 应该渲染 text 类型的结构
    const textGroup = wrapper.find('.skeleton-text-group')
    expect(textGroup.exists()).toBe(true)

    // 默认 3 行
    const rows = wrapper.findAll('.skeleton--shimmer')
    expect(rows.length).toBe(3)
  })

  it('list 类型使用自定义 rows 渲染正确数量的项', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'list', rows: 2 },
    })

    const items = wrapper.findAll('.skeleton-list__item')
    expect(items.length).toBe(2)
  })

  it('table 类型最少渲染 3 行数据行', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'table', rows: 1 },
    })

    // 即使 rows=1，也应该至少渲染 3 行数据
    const dataRows = wrapper.findAll('.skeleton-table__row:not(.skeleton-table__header)')
    expect(dataRows.length).toBeGreaterThanOrEqual(3)
  })

  it('card 骨架屏包含完整的卡片结构', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'card' },
    })

    const card = wrapper.find('.skeleton-card')

    // 验证各部分存在
    const img = card.find('.skeleton-card__img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('style')).toBeTruthy()

    const title = card.find('.skeleton-card__title')
    expect(title.exists()).toBe(true)
    expect(title.attributes('style')).toBeTruthy()

    const text = card.find('.skeleton-card__text')
    expect(text.exists()).toBe(true)

    const price = card.find('.skeleton-card__price')
    expect(price.exists()).toBe(true)
    expect(price.attributes('style')).toBeTruthy()
  })
})
