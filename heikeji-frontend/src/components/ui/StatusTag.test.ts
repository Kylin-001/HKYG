import { describe, it, expect, vi } from 'vitest'
import { testUserData } from '@/config/test'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import StatusTag from '@/components/ui/StatusTag.vue'

describe('StatusTag Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render correctly with default props', () => {
    const wrapper = mount(StatusTag, {
      props: {
        status: 'success',
      },
    })

    expect(wrapper.find('.status-tag').exists()).toBe(true)
    expect(wrapper.text()).toContain('success')
  })

  it('should apply correct color class based on status', () => {
    const wrapper = mount(StatusTag, {
      props: {
        status: 'error',
      },
    })

    expect(wrapper.find('.status-tag--error').exists()).toBe(true)
  })

  it('should render custom text when provided', () => {
    const wrapper = mount(StatusTag, {
      props: {
        status: 'success',
        text: '已完成',
      },
    })

    expect(wrapper.text()).toBe('已完成')
  })

  it('should emit click event when clicked', async () => {
    const wrapper = mount(StatusTag, {
      props: {
        status: 'success',
        clickable: true,
      },
    })

    await wrapper.find('.status-tag').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('should not emit click event when not clickable', async () => {
    const wrapper = mount(StatusTag, {
      props: {
        status: 'success',
        clickable: false,
      },
    })

    await wrapper.find('.status-tag').trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
