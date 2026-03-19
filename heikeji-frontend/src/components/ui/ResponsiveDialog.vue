<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="dialogWidth"
    :fullscreen="isMobile && fullscreenOnMobile"
    :top="isMobile ? '0' : top"
    :modal-class="modalClass"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :destroy-on-close="destroyOnClose"
    :center="center"
    @close="handleClose"
  >
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useResponsive } from '@/utils/responsive'

interface Props {
  modelValue?: boolean
  title?: string
  width?: string | number
  fullscreenOnMobile?: boolean
  top?: string
  modalClass?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  destroyOnClose?: boolean
  center?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  width: '50%',
  fullscreenOnMobile: true,
  top: '15vh',
  modalClass: '',
  closeOnClickModal: false,
  closeOnPressEscape: true,
  showClose: true,
  destroyOnClose: false,
  center: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const { isMobile } = useResponsive()

const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const dialogWidth = computed(() => {
  if (typeof props.width === 'number') {
    return isMobile.value ? '100%' : `${props.width}px`
  }
  if (props.width.includes('%')) {
    const num = parseInt(props.width)
    return isMobile.value ? '100%' : `${num}%`
  }
  return isMobile.value ? '100%' : props.width
})

const handleClose = () => {
  emit('close')
}
</script>

<style lang="scss">
.mobile-dialog {
  .el-dialog__header {
    padding: 16px;
    border-bottom: 1px solid #eee;
    margin-right: 0;
  }

  .el-dialog__title {
    font-size: 18px;
    font-weight: 600;
  }

  .el-dialog__body {
    padding: 16px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .el-dialog__footer {
    padding: 16px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
