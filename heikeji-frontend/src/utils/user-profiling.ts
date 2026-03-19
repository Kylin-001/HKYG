/**
 * 用户画像工具
 * 用于构建和管理用户画像
 */

export interface UserProfile {
  userId: string
  username: string
  age?: number
  gender?: string
  region?: string
  occupation?: string
  education?: string
  registrationTime: number
  lastActiveTime: number
  tags: string[]
  behaviorMetrics: BehaviorMetrics
  preferences: UserPreference
  consumptionProfile: ConsumptionProfile
}

export interface BehaviorMetrics {
  totalOrders: number
  totalSpent: number
  averageOrderAmount: number
  favoriteCategories: string[]
  favoriteShops: string[]
  browseFrequency: number
  searchFrequency: number
  favoriteTimeSlots: string[]
  favoriteDays: string[]
  devicePreference: string
  paymentMethods: string[]
}

export interface UserPreference {
  priceRange: { min: number; max: number }
  brandPreferences: string[]
  categoryPreferences: Record<string, number>
  discountSensitivity: number
  qualitySensitivity: number
}

export interface ConsumptionProfile {
  consumptionLevel: 'low' | 'medium' | 'high' | 'vip'
  purchaseFrequency: 'rare' | 'occasional' | 'regular' | 'frequent'
  categoryAffinity: Record<string, number>
  brandLoyalty: number
  priceSensitivity: number
}

export interface UserSegment {
  id: string
  name: string
  description: string
  criteria: SegmentCriteria
  userCount: number
  createdAt: number
}

export interface SegmentCriteria {
  ageRange?: [number, number]
  gender?: string[]
  totalSpentRange?: [number, number]
  orderCountRange?: [number, number]
  tags?: string[]
  registrationDaysAgo?: number
  lastActiveDaysAgo?: number
}

export interface TagWeight {
  tag: string
  weight: number
  source: 'purchase' | 'browse' | 'search' | 'manual'
}

class UserProfilingEngine {
  private userProfiles: Map<string, UserProfile> = new Map()
  private userTags: Map<string, TagWeight[]> = new Map()
  private segments: UserSegment[] = []

  constructor() {}

  /**
   * 创建用户画像
   */
  createProfile(userId: string, username: string): UserProfile {
    const profile: UserProfile = {
      userId,
      username,
      registrationTime: Date.now(),
      lastActiveTime: Date.now(),
      tags: [],
      behaviorMetrics: {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderAmount: 0,
        favoriteCategories: [],
        favoriteShops: [],
        browseFrequency: 0,
        searchFrequency: 0,
        favoriteTimeSlots: [],
        favoriteDays: [],
        devicePreference: 'unknown',
        paymentMethods: [],
      },
      preferences: {
        priceRange: { min: 0, max: 999999 },
        brandPreferences: [],
        categoryPreferences: {},
        discountSensitivity: 0.5,
        qualitySensitivity: 0.5,
      },
      consumptionProfile: {
        consumptionLevel: 'medium',
        purchaseFrequency: 'occasional',
        categoryAffinity: {},
        brandLoyalty: 0.5,
        priceSensitivity: 0.5,
      },
    }

    this.userProfiles.set(userId, profile)
    return profile
  }

  /**
   * 更新用户画像
   */
  updateProfile(userId: string, updates: Partial<UserProfile>): void {
    const profile = this.userProfiles.get(userId)
    if (profile) {
      Object.assign(profile, updates)
    }
  }

  /**
   * 获取用户画像
   */
  getProfile(userId: string): UserProfile | undefined {
    return this.userProfiles.get(userId)
  }

  /**
   * 更新行为指标
   */
  updateBehaviorMetrics(
    userId: string,
    metrics: {
      orderCount?: number
      orderAmount?: number
      category?: string
      shopId?: string
      browseCount?: number
      searchCount?: number
      timeSlot?: string
      day?: string
      device?: string
      paymentMethod?: string
    }
  ): void {
    const profile = this.userProfiles.get(userId)
    if (!profile) return

    const bm = profile.behaviorMetrics

    if (metrics.orderCount !== undefined) {
      bm.totalOrders += metrics.orderCount
    }
    if (metrics.orderAmount !== undefined) {
      bm.totalSpent += metrics.orderAmount
      bm.averageOrderAmount = bm.totalSpent / bm.totalOrders
    }
    if (metrics.category) {
      if (!bm.favoriteCategories.includes(metrics.category)) {
        bm.favoriteCategories.push(metrics.category)
      }
      if (bm.favoriteCategories.length > 5) {
        bm.favoriteCategories = bm.favoriteCategories.slice(-5)
      }
    }
    if (metrics.shopId) {
      if (!bm.favoriteShops.includes(metrics.shopId)) {
        bm.favoriteShops.push(metrics.shopId)
      }
    }
    if (metrics.browseCount !== undefined) {
      bm.browseFrequency += metrics.browseCount
    }
    if (metrics.searchCount !== undefined) {
      bm.searchFrequency += metrics.searchCount
    }
    if (metrics.timeSlot && !bm.favoriteTimeSlots.includes(metrics.timeSlot)) {
      bm.favoriteTimeSlots.push(metrics.timeSlot)
    }
    if (metrics.day && !bm.favoriteDays.includes(metrics.day)) {
      bm.favoriteDays.push(metrics.day)
    }
    if (metrics.device) {
      bm.devicePreference = metrics.device
    }
    if (metrics.paymentMethod && !bm.paymentMethods.includes(metrics.paymentMethod)) {
      bm.paymentMethods.push(metrics.paymentMethod)
    }

    this.updateConsumptionProfile(profile)
  }

  /**
   * 更新消费画像
   */
  private updateConsumptionProfile(profile: UserProfile): void {
    const bm = profile.behaviorMetrics

    if (bm.totalSpent < 100) {
      profile.consumptionProfile.consumptionLevel = 'low'
    } else if (bm.totalSpent < 500) {
      profile.consumptionProfile.consumptionLevel = 'medium'
    } else if (bm.totalSpent < 2000) {
      profile.consumptionProfile.consumptionLevel = 'high'
    } else {
      profile.consumptionProfile.consumptionLevel = 'vip'
    }

    if (bm.totalOrders < 3) {
      profile.consumptionProfile.purchaseFrequency = 'rare'
    } else if (bm.totalOrders < 10) {
      profile.consumptionProfile.purchaseFrequency = 'occasional'
    } else if (bm.totalOrders < 30) {
      profile.consumptionProfile.purchaseFrequency = 'regular'
    } else {
      profile.consumptionProfile.purchaseFrequency = 'frequent'
    }
  }

  /**
   * 添加用户标签
   */
  addTag(userId: string, tag: string, weight: number, source: TagWeight['source']): void {
    if (!this.userTags.has(userId)) {
      this.userTags.set(userId, [])
    }

    const tags = this.userTags.get(userId)!
    const existingIndex = tags.findIndex(t => t.tag === tag)

    if (existingIndex >= 0) {
      const oldWeight = tags[existingIndex].weight
      tags[existingIndex] = {
        tag,
        weight: (oldWeight + weight) / 2,
        source,
      }
    } else {
      tags.push({ tag, weight, source })
    }
  }

  /**
   * 获取用户标签
   */
  getTags(userId: string): TagWeight[] {
    return this.userTags.get(userId) || []
  }

  /**
   * 自动打标签
   */
  autoTag(userId: string): void {
    const profile = this.userProfiles.get(userId)
    if (!profile) return

    const bm = profile.behaviorMetrics

    if (bm.totalSpent > 2000) {
      this.addTag(userId, '高消费', 0.9, 'purchase')
    }
    if (bm.totalOrders > 20) {
      this.addTag(userId, '活跃用户', 0.8, 'purchase')
    }
    if (bm.averageOrderAmount < 20) {
      this.addTag(userId, '价格敏感', 0.7, 'purchase')
    }
    if (bm.favoriteCategories.length > 0) {
      bm.favoriteCategories.forEach(cat => {
        this.addTag(userId, `喜欢${cat}`, 0.6, 'purchase')
      })
    }
    if (bm.browseFrequency > 100) {
      this.addTag(userId, '浏览型用户', 0.5, 'browse')
    }

    const tags = this.userTags.get(userId) || []
    profile.tags = tags
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10)
      .map(t => t.tag)
  }

  /**
   * 创建用户分群
   */
  createSegment(segment: Omit<UserSegment, 'id' | 'createdAt' | 'userCount'>): UserSegment {
    const newSegment: UserSegment = {
      ...segment,
      id: `seg_${Date.now()}`,
      createdAt: Date.now(),
      userCount: 0,
    }

    this.segments.push(newSegment)
    this.updateSegmentUserCount(newSegment.id)

    return newSegment
  }

  /**
   * 检查用户是否属于某个分群
   */
  isInSegment(userId: string, segmentId: string): boolean {
    const segment = this.segments.find(s => s.id === segmentId)
    if (!segment) return false

    const profile = this.userProfiles.get(userId)
    if (!profile) return false

    return this.matchCriteria(profile, segment.criteria)
  }

  /**
   * 获取用户所属分群
   */
  getUserSegments(userId: string): UserSegment[] {
    return this.segments.filter(seg => this.isInSegment(userId, seg.id))
  }

  /**
   * 更新分群用户数
   */
  private updateSegmentUserCount(segmentId: string): void {
    const segment = this.segments.find(s => s.id === segmentId)
    if (!segment) return

    let count = 0
    for (const profile of this.userProfiles.values()) {
      if (this.matchCriteria(profile, segment.criteria)) {
        count++
      }
    }
    segment.userCount = count
  }

  /**
   * 匹配分群条件
   */
  private matchCriteria(profile: UserProfile, criteria: SegmentCriteria): boolean {
    if (criteria.ageRange) {
      if (!profile.age) return false
      if (profile.age < criteria.ageRange[0] || profile.age > criteria.ageRange[1]) {
        return false
      }
    }

    if (criteria.gender?.length) {
      if (!profile.gender || !criteria.gender.includes(profile.gender)) {
        return false
      }
    }

    if (criteria.totalSpentRange) {
      const spent = profile.behaviorMetrics.totalSpent
      if (spent < criteria.totalSpentRange[0] || spent > criteria.totalSpentRange[1]) {
        return false
      }
    }

    if (criteria.orderCountRange) {
      const orders = profile.behaviorMetrics.totalOrders
      if (orders < criteria.orderCountRange[0] || orders > criteria.orderCountRange[1]) {
        return false
      }
    }

    if (criteria.tags?.length) {
      const userTags = profile.tags
      if (!criteria.tags.some(tag => userTags.includes(tag))) {
        return false
      }
    }

    return true
  }

  /**
   * 获取所有分群
   */
  getSegments(): UserSegment[] {
    return [...this.segments]
  }

  /**
   * 删除分群
   */
  deleteSegment(segmentId: string): void {
    this.segments = this.segments.filter(s => s.id !== segmentId)
  }
}

export const userProfilingEngine = new UserProfilingEngine()

export default userProfilingEngine
