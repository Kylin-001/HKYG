import { ref, onMounted, onUnmounted, Ref } from 'vue'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

interface DeviceInfo {
  width: number
  height: number
  deviceType: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isIOS: boolean
  isAndroid: boolean
  isWechat: boolean
  isMobile$: ReturnType<typeof ref<boolean>>
  isTablet$: ReturnType<typeof ref<boolean>>
  isDesktop$: ReturnType<typeof ref<boolean>>
}

const deviceInfo = ref<DeviceInfo>({
  width: 0,
  height: 0,
  deviceType: 'desktop',
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isIOS: false,
  isAndroid: false,
  isWechat: false,
  isMobile$: ref(false),
  isTablet$: ref(false),
  isDesktop$: ref(true),
})

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

function getDeviceType(width: number): DeviceType {
  if (width < MOBILE_BREAKPOINT) {
    return 'mobile'
  } else if (width < TABLET_BREAKPOINT) {
    return 'tablet'
  }
  return 'desktop'
}

function getOS(): string {
  const { userAgent } = navigator
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'ios'
  }
  if (/Android/i.test(userAgent)) {
    return 'android'
  }
  return 'unknown'
}

function isWechatBrowser(): boolean {
  return /MicroMessenger/i.test(navigator.userAgent)
}

function updateDeviceInfo(): void {
  const width = window.innerWidth
  const height = window.innerHeight
  const deviceType = getDeviceType(width)
  const os = getOS()

  deviceInfo.value = {
    width,
    height,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isIOS: os === 'ios',
    isAndroid: os === 'android',
    isWechat: isWechatBrowser(),
    isMobile$: ref(deviceType === 'mobile'),
    isTablet$: ref(deviceType === 'tablet'),
    isDesktop$: ref(deviceType === 'desktop'),
  }
}

export function useResponsive() {
  let mounted = false

  onMounted(() => {
    if (!mounted) {
      mounted = true
      updateDeviceInfo()
      window.addEventListener('resize', updateDeviceInfo)
      window.addEventListener('orientationchange', updateDeviceInfo)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateDeviceInfo)
    window.removeEventListener('orientationchange', updateDeviceInfo)
  })

  return deviceInfo
}

export function useDevice() {
  return deviceInfo
}

export function useMediaQuery(query: string): Ref<boolean> {
  const matches = ref(false)

  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia(query)
    matches.value = mediaQuery.matches

    const handler = (e: MediaQueryListEvent) => {
      matches.value = e.matches
    }

    mediaQuery.addEventListener('change', handler)

    onUnmounted(() => {
      mediaQuery.removeEventListener('change', handler)
    })
  }

  return matches
}

export const breakpoints = {
  xs: '(max-width: 479px)',
  sm: '(min-width: 480px) and (max-width: 767px)',
  md: '(min-width: 768px) and (max-width: 991px)',
  lg: '(min-width: 992px) and (max-width: 1199px)',
  xl: '(min-width: 1200px) and (max-width: 1599px)',
  xxl: '(min-width: 1600px)',
  belowXs: '(max-width: 479px)',
  belowSm: '(max-width: 767px)',
  belowMd: '(max-width: 991px)',
  belowLg: '(max-width: 1199px)',
  aboveXs: '(min-width: 480px)',
  aboveSm: '(min-width: 768px)',
  aboveMd: '(min-width: 992px)',
  aboveLg: '(min-width: 1200px)',
  aboveXl: '(min-width: 1600px)',
}

export default useResponsive
