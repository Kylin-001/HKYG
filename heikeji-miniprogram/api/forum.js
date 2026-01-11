// 社区论坛相关API
import request from '../utils/request';

/**
 * 获取论坛分类列表
 * @returns {Promise}
 */
export function getForumCategories() {
  return request({
    url: '/forum/categories',
    method: 'GET'
  });
}

/**
 * 获取论坛帖子列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getPostList(params) {
  return request({
    url: '/forum/posts',
    method: 'GET',
    data: params
  });
}

/**
 * 获取帖子详情
 * @param {string} id - 帖子ID
 * @returns {Promise}
 */
export function getPostDetail(id) {
  return request({
    url: `/forum/posts/${id}`,
    method: 'GET'
  });
}

/**
 * 创建帖子
 * @param {Object} data - 帖子数据
 * @returns {Promise}
 */
export function createPost(data) {
  return request({
    url: '/forum/posts',
    method: 'POST',
    data: data
  });
}

/**
 * 编辑帖子
 * @param {string} id - 帖子ID
 * @param {Object} data - 帖子数据
 * @returns {Promise}
 */
export function updatePost(id, data) {
  return request({
    url: `/forum/posts/${id}`,
    method: 'PUT',
    data: data
  });
}

/**
 * 删除帖子
 * @param {string} id - 帖子ID
 * @returns {Promise}
 */
export function deletePost(id) {
  return request({
    url: `/forum/posts/${id}`,
    method: 'DELETE'
  });
}

/**
 * 点赞/取消点赞帖子
 * @param {string} postId - 帖子ID
 * @returns {Promise}
 */
export function togglePostLike(postId) {
  return request({
    url: `/forum/posts/${postId}/like`,
    method: 'POST'
  });
}

/**
 * 收藏/取消收藏帖子
 * @param {string} postId - 帖子ID
 * @returns {Promise}
 */
export function togglePostFavorite(postId) {
  return request({
    url: `/forum/posts/${postId}/favorite`,
    method: 'POST'
  });
}

/**
 * 获取帖子评论列表
 * @param {string} postId - 帖子ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getCommentList(postId, params) {
  return request({
    url: `/forum/posts/${postId}/comments`,
    method: 'GET',
    data: params
  });
}

/**
 * 创建评论
 * @param {string} postId - 帖子ID
 * @param {Object} data - 评论数据
 * @returns {Promise}
 */
export function createComment(postId, data) {
  return request({
    url: `/forum/posts/${postId}/comments`,
    method: 'POST',
    data: data
  });
}

/**
 * 编辑评论
 * @param {string} commentId - 评论ID
 * @param {Object} data - 评论数据
 * @returns {Promise}
 */
export function updateComment(commentId, data) {
  return request({
    url: `/forum/comments/${commentId}`,
    method: 'PUT',
    data: data
  });
}

/**
 * 删除评论
 * @param {string} commentId - 评论ID
 * @returns {Promise}
 */
export function deleteComment(commentId) {
  return request({
    url: `/forum/comments/${commentId}`,
    method: 'DELETE'
  });
}

/**
 * 点赞/取消点赞评论
 * @param {string} commentId - 评论ID
 * @returns {Promise}
 */
export function toggleCommentLike(commentId) {
  return request({
    url: `/forum/comments/${commentId}/like`,
    method: 'POST'
  });
}

/**
 * 获取用户发布的帖子
 * @param {string} userId - 用户ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getUserPosts(userId, params) {
  return request({
    url: `/forum/users/${userId}/posts`,
    method: 'GET',
    data: params
  });
}

/**
 * 获取用户收藏的帖子
 * @param {string} userId - 用户ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getUserFavorites(userId, params) {
  return request({
    url: `/forum/users/${userId}/favorites`,
    method: 'GET',
    data: params
  });
}

/**
 * 获取热门帖子
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getHotPosts(params) {
  return request({
    url: '/forum/posts/hot',
    method: 'GET',
    data: params
  });
}

/**
 * 搜索帖子
 * @param {string} keyword - 搜索关键词
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function searchPosts(keyword, params) {
  return request({
    url: `/forum/posts/search?keyword=${encodeURIComponent(keyword)}`,
    method: 'GET',
    data: params
  });
}

/**
 * 获取帖子点赞用户列表
 * @param {string} postId - 帖子ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getPostLikes(postId, params) {
  return request({
    url: `/forum/posts/${postId}/likes`,
    method: 'GET',
    data: params
  });
}

/**
 * 获取评论点赞用户列表
 * @param {string} commentId - 评论ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getCommentLikes(commentId, params) {
  return request({
    url: `/forum/comments/${commentId}/likes`,
    method: 'GET',
    data: params
  });
}

/**
 * 举报帖子
 * @param {string} postId - 帖子ID
 * @param {Object} data - 举报数据
 * @returns {Promise}
 */
export function reportPost(postId, data) {
  return request({
    url: `/forum/posts/${postId}/report`,
    method: 'POST',
    data: data
  });
}

/**
 * 举报评论
 * @param {string} commentId - 评论ID
 * @param {Object} data - 举报数据
 * @returns {Promise}
 */
export function reportComment(commentId, data) {
  return request({
    url: `/forum/comments/${commentId}/report`,
    method: 'POST',
    data: data
  });
}

/**
 * 获取论坛统计数据
 * @returns {Promise}
 */
export function getForumStatistics() {
  return request({
    url: '/forum/statistics',
    method: 'GET'
  });
}
