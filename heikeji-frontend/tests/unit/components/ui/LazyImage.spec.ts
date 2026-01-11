import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LazyImage from '@/components/ui/LazyImage.vue'

describe('LazyImage组件测试', () => {
  beforeEach(() => {
    // 重置所有模拟
    vi.restoreAllMocks()
  })

  it('应该正确渲染并显示默认属性', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片'
      }
    })

    // 验证组件是否渲染
    expect(wrapper.exists()).toBe(true)
    
    // 验证默认类名是否应用
    expect(wrapper.classes()).toContain('lazy-image')
    
    // 验证默认属性
    expect(wrapper.props('src')).toBe('https://example.com/image.jpg')
    expect(wrapper.props('alt')).toBe('测试图片')
  })

  it('应该支持自定义图片样式', () => {
    const customImageStyle = { objectFit: 'contain', borderRadius: '8px' }
    
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
        imageStyle: customImageStyle
      }
    })
  })

  it('应该支持自定义图片类名', () => {
    const customImageClass = 'custom-image-class'
    
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
        imageClass: customImageClass
      }
    })
    
    // 验证自定义图片类名是否应用
    const imgElement = wrapper.find('img')
    expect(imgElement.classes()).toContain(customImageClass)
  })

  it('应该在图片加载成功时触发onLoad事件', async () => {
    const onLoadSpy = vi.fn()
    
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
        onLoad: onLoadSpy
      }
    })
    
    // 触发load事件
    const imgElement = wrapper.find('img')
    await imgElement.trigger('load')
    
    // 验证onLoad事件是否被调用
    expect(onLoadSpy).toHaveBeenCalled()
  })

  it('应该在图片加载失败时触发onError事件', async () => {
    const onErrorSpy = vi.fn()
    
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/invalid-image.jpg',
        alt: '测试图片',
        onError: onErrorSpy
      }
    })
    
    // 触发error事件
    const imgElement = wrapper.find('img')
    await imgElement.trigger('error')
    
    // 验证onError事件是否被调用
    expect(onErrorSpy).toHaveBeenCalled()
  })

  it('应该支持延迟加载', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
        delay: 500
      }
    })
    
    // 验证延迟属性是否正确设置
    expect(wrapper.props('delay')).toBe(500)
  })

  it('应该支持立即加载', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
        immediate: true
      }
    })
    
    // 验证立即加载属性是否正确设置
    expect(wrapper.props('immediate')).toBe(true)
  })

  it('应该支持重试机制', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
        retryCount: 3
      }
    })
    
    // 验证重试次数属性是否正确设置
    expect(wrapper.props('retryCount')).toBe(3)
  })

  it('应该支持自定义加载和错误图标大小', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
        loadingSize: 32,
        errorSize: 32
      }
    })
    
    // 验证图标大小属性是否正确设置
    expect(wrapper.props('loadingSize')).toBe(32)
    expect(wrapper.props('errorSize')).toBe(32)
  })

  it('应该显示默认占位符', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
        placeholder: true
      }
    })
    
    // 验证占位符是否显示
    expect(wrapper.find('.lazy-image-placeholder').exists()).toBe(true)
  })

  it('应该支持自定义占位符图片', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: '测试图片',
        placeholder: 'https://example.com/placeholder.jpg'
      }
    })
    
    // 验证自定义占位符图片是否显示
    const placeholderImage = wrapper.find('.placeholder-image')
    expect(placeholderImage.exists()).toBe(true)
  })
})
