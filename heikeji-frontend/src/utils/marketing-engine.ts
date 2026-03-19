/**
 * 精准营销引擎
 * 用于创建和管理精准营销活动
 */

import { userProfilingEngine } from './user-profiling'

export type MarketingChannel = 'sms' | 'email' | 'wechat' | 'in_app' | 'push'
export type MarketingStatus =
  | 'draft'
  | 'scheduled'
  | 'running'
  | 'paused'
  | 'completed'
  | 'cancelled'

export interface MarketingCampaign {
  id: string
  name: string
  description: string
  type:
    | 'discount'
    | 'coupon'
    | 'flash_sale'
    | 'new_user'
    | 'loyalty'
    | 'retention'
    | 'cross_sell'
    | 'upsell'
  targetAudience: TargetAudience
  content: MarketingContent
  schedule: MarketingSchedule
  channel: MarketingChannel[]
  status: MarketingStatus
  budget?: number
  actualCost?: number
  metrics?: CampaignMetrics
  createdBy: string
  createdAt: number
  updatedAt: number
}

export interface TargetAudience {
  segmentIds?: string[]
  tags?: string[]
  userType?: 'new' | 'active' | 'inactive' | 'vip' | 'all'
  purchaseHistory?: {
    minOrders?: number
    maxOrders?: number
    minSpent?: number
    maxSpent?: number
    lastPurchaseDaysAgo?: number
  }
  region?: string[]
  excludeTags?: string[]
}

export interface MarketingContent {
  title: string
  body: string
  imageUrl?: string
  actionUrl?: string
  actionText?: string
  templateId?: string
}

export interface MarketingSchedule {
  type: 'immediate' | 'scheduled' | 'recurring'
  startTime?: number
  endTime?: number
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    time: string
    daysOfWeek?: number[]
    daysOfMonth?: number[]
  }
}

export interface CampaignMetrics {
  targetCount: number
  sentCount: number
  deliveredCount: number
  openedCount: number
  clickedCount: number
  convertedCount: number
  revenue?: number
  roi?: number
}

export interface PushNotification {
  id: string
  userId: string
  title: string
  body: string
  imageUrl?: string
  actionUrl?: string
  sentAt?: number
  readAt?: number
  clickedAt?: number
}

class MarketingEngine {
  private campaigns: Map<string, MarketingCampaign> = new Map()
  private pushHistory: Map<string, PushNotification[]> = new Map()

  constructor() {}

  /**
   * 创建营销活动
   */
  createCampaign(
    campaign: Omit<MarketingCampaign, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'metrics'>
  ): MarketingCampaign {
    const newCampaign: MarketingCampaign = {
      ...campaign,
      id: `campaign_${Date.now()}`,
      status: 'draft',
      metrics: {
        targetCount: 0,
        sentCount: 0,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        convertedCount: 0,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    this.campaigns.set(newCampaign.id, newCampaign)
    return newCampaign
  }

  /**
   * 更新营销活动
   */
  updateCampaign(id: string, updates: Partial<MarketingCampaign>): MarketingCampaign | null {
    const campaign = this.campaigns.get(id)
    if (!campaign) return null

    const updated = {
      ...campaign,
      ...updates,
      updatedAt: Date.now(),
    }

    this.campaigns.set(id, updated)
    return updated
  }

  /**
   * 删除营销活动
   */
  deleteCampaign(id: string): boolean {
    return this.campaigns.delete(id)
  }

  /**
   * 获取营销活动
   */
  getCampaign(id: string): MarketingCampaign | undefined {
    return this.campaigns.get(id)
  }

  /**
   * 获取所有营销活动
   */
  getAllCampaigns(): MarketingCampaign[] {
    return Array.from(this.campaigns.values())
  }

  /**
   * 根据状态获取营销活动
   */
  getCampaignsByStatus(status: MarketingStatus): MarketingCampaign[] {
    return this.getAllCampaigns().filter(c => c.status === status)
  }

  /**
   * 启动营销活动
   */
  startCampaign(id: string): MarketingCampaign | null {
    return this.updateCampaign(id, { status: 'running' })
  }

  /**
   * 暂停营销活动
   */
  pauseCampaign(id: string): MarketingCampaign | null {
    return this.updateCampaign(id, { status: 'paused' })
  }

  /**
   * 完成营销活动
   */
  completeCampaign(id: string): MarketingCampaign | null {
    return this.updateCampaign(id, { status: 'completed' })
  }

  /**
   * 取消营销活动
   */
  cancelCampaign(id: string): MarketingCampaign | null {
    return this.updateCampaign(id, { status: 'cancelled' })
  }

  /**
   * 计算目标受众数量
   */
  calculateTargetCount(campaign: MarketingCampaign): number {
    let count = 0

    if (campaign.targetAudience.segmentIds?.length) {
      for (const segmentId of campaign.targetAudience.segmentIds) {
        const segment = userProfilingEngine.getSegments().find(s => s.id === segmentId)
        if (segment) {
          count += segment.userCount
        }
      }
    }

    if (campaign.targetAudience.userType) {
      const typeCount = this.getUserTypeCount(campaign.targetAudience.userType)
      count += typeCount
    }

    return count
  }

  /**
   * 获取指定类型的用户数量
   */
  private getUserTypeCount(type: string): number {
    const profiles = Array.from((userProfilingEngine as any).userProfiles?.values() || [])

    switch (type) {
      case 'new':
        return Math.floor(profiles.length * 0.1)
      case 'active':
        return Math.floor(profiles.length * 0.6)
      case 'inactive':
        return Math.floor(profiles.length * 0.2)
      case 'vip':
        return Math.floor(profiles.length * 0.1)
      default:
        return profiles.length
    }
  }

  /**
   * 获取目标用户列表
   */
  getTargetUsers(campaign: MarketingCampaign): string[] {
    const userIds: Set<string> = new Set()

    if (campaign.targetAudience.segmentIds?.length) {
      for (const profile of (userProfilingEngine as any).userProfiles?.values() || []) {
        if (profile?.userId) {
          for (const segmentId of campaign.targetAudience.segmentIds) {
            if (userProfilingEngine.isInSegment(profile.userId, segmentId)) {
              if (!campaign.targetAudience.excludeTags?.some(tag => profile.tags?.includes(tag))) {
                userIds.add(profile.userId)
              }
            }
          }
        }
      }
    }

    if (campaign.targetAudience.tags?.length) {
      for (const profile of (userProfilingEngine as any).userProfiles?.values() || []) {
        if (profile?.userId && profile.tags) {
          if (campaign.targetAudience.tags.some(tag => profile.tags.includes(tag))) {
            if (!campaign.targetAudience.excludeTags?.some(tag => profile.tags.includes(tag))) {
              userIds.add(profile.userId)
            }
          }
        }
      }
    }

    return Array.from(userIds)
  }

  /**
   * 发送营销消息
   */
  async sendMarketingMessage(
    userId: string,
    content: MarketingContent,
    channel: MarketingChannel
  ): Promise<boolean> {
    try {
      switch (channel) {
        case 'in_app':
          return await this.sendInAppMessage(userId, content)
        case 'push':
          return await this.sendPushNotification(userId, content)
        case 'sms':
          return await this.sendSmsMessage(userId, content)
        case 'email':
          return await this.sendEmailMessage(userId, content)
        case 'wechat':
          return await this.sendWechatMessage(userId, content)
        default:
          return false
      }
    } catch (error) {
      console.error('发送营销消息失败:', error)
      return false
    }
  }

  /**
   * 发送应用内消息
   */
  private async sendInAppMessage(userId: string, content: MarketingContent): Promise<boolean> {
    console.log(`[In-App] 发送给用户 ${userId}: ${content.title}`)
    return true
  }

  /**
   * 发送推送通知
   */
  private async sendPushNotification(userId: string, content: MarketingContent): Promise<boolean> {
    const notification: PushNotification = {
      id: `push_${Date.now()}`,
      userId,
      title: content.title,
      body: content.body,
      imageUrl: content.imageUrl,
      actionUrl: content.actionUrl,
      sentAt: Date.now(),
    }

    if (!this.pushHistory.has(userId)) {
      this.pushHistory.set(userId, [])
    }
    this.pushHistory.get(userId)!.push(notification)

    console.log(`[Push] 推送给用户 ${userId}: ${content.title}`)
    return true
  }

  /**
   * 发送短信
   */
  private async sendSmsMessage(userId: string, content: MarketingContent): Promise<boolean> {
    console.log(`[SMS] 发送给用户 ${userId}: ${content.body}`)
    return true
  }

  /**
   * 发送邮件
   */
  private async sendEmailMessage(userId: string, content: MarketingContent): Promise<boolean> {
    console.log(`[Email] 发送给用户 ${userId}: ${content.title}`)
    return true
  }

  /**
   * 发送微信消息
   */
  private async sendWechatMessage(userId: string, content: MarketingContent): Promise<boolean> {
    console.log(`[Wechat] 发送给用户 ${userId}: ${content.title}`)
    return true
  }

  /**
   * 更新活动指标
   */
  updateCampaignMetrics(
    campaignId: string,
    metrics: Partial<CampaignMetrics>
  ): MarketingCampaign | null {
    const campaign = this.campaigns.get(campaignId)
    if (!campaign || !campaign.metrics) return null

    const updatedMetrics = {
      ...campaign.metrics,
      ...metrics,
    }

    if (updatedMetrics.sentCount > 0 && updatedMetrics.convertedCount > 0) {
      updatedMetrics.roi = (updatedMetrics.revenue || 0) / updatedMetrics.sentCount
    }

    return this.updateCampaign(campaignId, { metrics: updatedMetrics })
  }

  /**
   * 获取推送历史
   */
  getPushHistory(userId: string): PushNotification[] {
    return this.pushHistory.get(userId) || []
  }

  /**
   * 创建优惠券活动
   */
  createCouponCampaign(params: {
    name: string
    description: string
    couponValue: number
    minAmount: number
    targetAudience: TargetAudience
    schedule: MarketingSchedule
    channel: MarketingChannel[]
  }): MarketingCampaign {
    return this.createCampaign({
      name: params.name,
      description: params.description,
      type: 'coupon',
      targetAudience: params.targetAudience,
      content: {
        title: '您有一张优惠券待领取',
        body: `满${params.minAmount}元减${params.couponValue}元，限时领取！`,
        actionUrl: '/coupon',
        actionText: '立即领取',
      },
      schedule: params.schedule,
      channel: params.channel,
      createdBy: 'system',
    })
  }

  /**
   * 创建折扣活动
   */
  createDiscountCampaign(params: {
    name: string
    description: string
    discount: number
    category?: string
    targetAudience: TargetAudience
    schedule: MarketingSchedule
    channel: MarketingChannel[]
  }): MarketingCampaign {
    return this.createCampaign({
      name: params.name,
      description: params.description,
      type: 'discount',
      targetAudience: params.targetAudience,
      content: {
        title: '限时折扣',
        body: params.category
          ? `${params.category}商品${params.discount}折优惠，快来选购！`
          : `全场商品${params.discount}折优惠，限时抢购！`,
        actionUrl: params.category ? `/category/${params.category}` : '/',
        actionText: '立即查看',
      },
      schedule: params.schedule,
      channel: params.channel,
      createdBy: 'system',
    })
  }

  /**
   * 创建召回活动
   */
  createRetentionCampaign(params: {
    name: string
    description: string
    inactiveDays: number
    targetAudience: TargetAudience
    schedule: MarketingSchedule
    channel: MarketingChannel[]
  }): MarketingCampaign {
    return this.createCampaign({
      name: params.name,
      description: params.description,
      type: 'retention',
      targetAudience: {
        ...params.targetAudience,
        purchaseHistory: {
          lastPurchaseDaysAgo: params.inactiveDays,
        },
      },
      content: {
        title: '我们想您了',
        body: '您已经很久没有来了，我们为您准备了专属优惠，快来看看吧！',
        actionUrl: '/',
        actionText: '立即查看',
      },
      schedule: params.schedule,
      channel: params.channel,
      createdBy: 'system',
    })
  }
}

export const marketingEngine = new MarketingEngine()

export default marketingEngine
