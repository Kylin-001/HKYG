/**
 * 推荐算法工具
 * 提供多种推荐算法的实现
 */

export interface UserProfile {
  userId: string
  age?: number
  gender?: string
  preferences: Record<string, number>
  purchaseHistory: string[]
  browseHistory: string[]
  tags: string[]
}

export interface Product {
  id: string
  name: string
  category: string
  tags: string[]
  price: number
  rating: number
  sales: number
  features: string[]
}

export interface RecommendationItem {
  productId: string
  score: number
  reason: string
}

export interface CollaborativeFilteringResult {
  productId: string
  score: number
  similarUsers: string[]
}

export interface ContentBasedResult {
  productId: string
  score: number
  matchedFeatures: string[]
}

class RecommendationEngine {
  private userProfiles: Map<string, UserProfile> = new Map()
  private productMatrix: Map<string, Product> = new Map()
  private userProductRating: Map<string, Map<string, number>> = new Map()

  constructor() {}

  setUserProfile(profile: UserProfile): void {
    this.userProfiles.set(profile.userId, profile)
  }

  setProduct(product: Product): void {
    this.productMatrix.set(product.id, product)
  }

  setUserRating(userId: string, productId: string, rating: number): void {
    if (!this.userProductRating.has(userId)) {
      this.userProductRating.set(userId, new Map())
    }
    this.userProductRating.get(userId)!.set(productId, rating)
  }

  /**
   * 基于内容的推荐
   * 根据用户偏好和商品特征进行推荐
   */
  contentBasedRecommend(userId: string, limit: number = 10): RecommendationItem[] {
    const userProfile = this.userProfiles.get(userId)
    if (!userProfile) {
      return this.getPopularProducts(limit)
    }

    const results: ContentBasedResult[] = []

    for (const [productId, product] of this.productMatrix) {
      if (
        userProfile.browseHistory.includes(productId) ||
        userProfile.purchaseHistory.includes(productId)
      ) {
        continue
      }

      let score = 0
      const matchedFeatures: string[] = []

      for (const [prefCategory, prefScore] of Object.entries(userProfile.preferences)) {
        if (product.category === prefCategory) {
          score += prefScore * 0.5
          matchedFeatures.push(`category:${product.category}`)
        }
      }

      for (const tag of product.tags) {
        if (userProfile.tags.includes(tag)) {
          score += 0.3
          matchedFeatures.push(`tag:${tag}`)
        }
      }

      for (const feature of product.features) {
        if (userProfile.preferences[feature]) {
          score += userProfile.preferences[feature] * 0.2
          matchedFeatures.push(`feature:${feature}`)
        }
      }

      score += product.rating * 0.1

      if (score > 0) {
        results.push({ productId, score, matchedFeatures })
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => ({
        productId: r.productId,
        score: r.score,
        reason: `匹配特征: ${r.matchedFeatures.slice(0, 3).join(', ')}`,
      }))
  }

  /**
   * 协同过滤推荐
   * 基于相似用户的推荐
   */
  collaborativeFilteringRecommend(userId: string, limit: number = 10): RecommendationItem[] {
    const targetUserRatings = this.userProductRating.get(userId)
    if (!targetUserRatings || targetUserRatings.size < 3) {
      return this.contentBasedRecommend(userId, limit)
    }

    const similarities: Array<{ userId: string; similarity: number }> = []

    for (const [otherUserId, otherRatings] of this.userProductRating) {
      if (otherUserId === userId) continue

      const similarity = this.calculateCosineSimilarity(targetUserRatings, otherRatings)

      if (similarity > 0.1) {
        similarities.push({ userId: otherUserId, similarity })
      }
    }

    similarities.sort((a, b) => b.similarity - a.similarity)
    const topSimilarUsers = similarities.slice(0, 20)

    const productScores: Map<string, number> = new Map()

    for (const { userId: similarUserId, similarity } of topSimilarUsers) {
      const similarUserRatings = this.userProductRating.get(similarUserId)
      if (!similarUserRatings) continue

      for (const [productId, rating] of similarUserRatings) {
        if (targetUserRatings.has(productId)) continue

        const currentScore = productScores.get(productId) || 0
        productScores.set(productId, currentScore + similarity * rating)
      }
    }

    const results: CollaborativeFilteringResult[] = []

    for (const [productId, score] of productScores) {
      results.push({
        productId,
        score,
        similarUsers: topSimilarUsers.slice(0, 5).map(s => s.userId),
      })
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => ({
        productId: r.productId,
        score: r.score,
        reason: `相似用户也喜欢 (${r.similarUsers.length}人)`,
      }))
  }

  /**
   * 混合推荐
   * 结合多种推荐算法
   */
  hybridRecommend(
    userId: string,
    limit: number = 10,
    weights: { content: number; collaborative: number; popular: number } = {
      content: 0.4,
      collaborative: 0.4,
      popular: 0.2,
    }
  ): RecommendationItem[] {
    const contentResults = this.contentBasedRecommend(userId, limit * 2)
    const collaborativeResults = this.collaborativeFilteringRecommend(userId, limit * 2)
    const popularResults = this.getPopularProducts(limit * 2)

    const contentMap = new Map(contentResults.map(r => [r.productId, r.score]))
    const collaborativeMap = new Map(collaborativeResults.map(r => [r.productId, r.score]))
    const popularMap = new Map(popularResults.map(r => [r.productId, r.score]))

    const allProductIds = new Set([
      ...contentMap.keys(),
      ...collaborativeMap.keys(),
      ...popularMap.keys(),
    ])

    const hybridScores: RecommendationItem[] = []

    for (const productId of allProductIds) {
      const contentScore = contentMap.get(productId) || 0
      const collaborativeScore = collaborativeMap.get(productId) || 0
      const popularScore = popularMap.get(productId) || 0

      const finalScore =
        contentScore * weights.content +
        collaborativeScore * weights.collaborative +
        popularScore * weights.popular

      let reason = ''
      if (contentScore > 0 && collaborativeScore > 0) {
        reason = '根据您的偏好和相似用户'
      } else if (contentScore > 0) {
        reason = '根据您的偏好推荐'
      } else if (collaborativeScore > 0) {
        reason = '相似用户也喜欢'
      } else {
        reason = '热门商品'
      }

      hybridScores.push({ productId, score: finalScore, reason })
    }

    return hybridScores.sort((a, b) => b.score - a.score).slice(0, limit)
  }

  /**
   * 热门商品推荐
   */
  getPopularProducts(limit: number = 10): RecommendationItem[] {
    const results: RecommendationItem[] = []

    for (const [productId, product] of this.productMatrix) {
      const score = product.sales * 0.5 + product.rating * 100
      results.push({
        productId,
        score,
        reason: '热门商品',
      })
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit)
  }

  /**
   * 新品推荐
   */
  getNewProducts(limit: number = 10): RecommendationItem[] {
    return Array.from(this.productMatrix.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit)
      .map(p => ({
        productId: p.id,
        score: 1,
        reason: '新品上架',
      }))
  }

  /**
   * 相似商品推荐
   */
  getSimilarProducts(productId: string, limit: number = 10): RecommendationItem[] {
    const targetProduct = this.productMatrix.get(productId)
    if (!targetProduct) return []

    const similarities: Array<{ productId: string; score: number }> = []

    for (const [id, product] of this.productMatrix) {
      if (id === productId) continue

      let score = 0

      if (product.category === targetProduct.category) {
        score += 0.4
      }

      const commonTags = product.tags.filter(t => targetProduct.tags.includes(t))
      score += commonTags.length * 0.15

      const commonFeatures = product.features.filter(f => targetProduct.features.includes(f))
      score += commonFeatures.length * 0.1

      const priceDiff = Math.abs(product.price - targetProduct.price) / targetProduct.price
      if (priceDiff < 0.2) {
        score += 0.2
      }

      if (score > 0.1) {
        similarities.push({ productId: id, score })
      }
    }

    return similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => ({
        productId: r.productId,
        score: r.score,
        reason: '相似商品',
      }))
  }

  /**
   * 计算余弦相似度
   */
  private calculateCosineSimilarity(
    ratings1: Map<string, number>,
    ratings2: Map<string, number>
  ): number {
    const commonProducts = [...ratings1.keys()].filter(p => ratings2.has(p))
    if (commonProducts.length === 0) return 0

    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0

    for (const productId of commonProducts) {
      const r1 = ratings1.get(productId)!
      const r2 = ratings2.get(productId)!
      dotProduct += r1 * r2
      norm1 += r1 * r1
      norm2 += r2 * r2
    }

    if (norm1 === 0 || norm2 === 0) return 0

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
  }
}

export const recommendationEngine = new RecommendationEngine()

export default recommendationEngine
