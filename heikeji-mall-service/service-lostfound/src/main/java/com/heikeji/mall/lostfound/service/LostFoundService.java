package com.heikeji.mall.lostfound.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.lostfound.entity.LostFound;

import java.util.List;
import java.util.Map;

/**
 * 失物招领服务接口
 */
public interface LostFoundService extends IService<LostFound> {

    /**
     * 发布失物招领信息
     * @param lostFound 失物招领信息
     * @return 失物招领ID
     */
    Long publishLostFound(LostFound lostFound);

    /**
     * 获取失物招领详情
     * @param id 失物招领ID
     * @return 失物招领详情
     */
    LostFound getLostFoundDetail(Long id);

    /**
     * 失物招领列表查询
     * @param params 查询参数
     * @return 失物招领列表
     */
    List<LostFound> getLostFoundList(Map<String, Object> params);

    /**
     * 失物招领审核
     * @param id 失物招领ID
     * @param status 审核状态
     * @param auditRemark 审核意见
     * @return 是否成功
     */
    boolean auditLostFound(Long id, Integer status, String auditRemark);

    /**
     * 更新失物招领状态
     * @param id 失物招领ID
     * @param status 状态
     * @return 是否成功
     */
    boolean updateLostFoundStatus(Long id, Integer status);

    /**
     * 增加浏览量
     * @param id 失物招领ID
     */
    void increaseViewCount(Long id);

    /**
     * 获取热门失物招领
     * @param limit 数量限制
     * @return 热门失物招领列表
     */
    List<LostFound> getHotLostFound(Integer limit);

    /**
     * 失物招领搜索
     * @param keyword 搜索关键词
     * @param type 类型：0-失物，1-招领
     * @param categoryId 分类ID
     * @param sort 排序方式
     * @param page 页码
     * @param size 每页大小
     * @return 搜索结果
     */
    Map<String, Object> searchLostFound(String keyword, Integer type, Long categoryId, String sort, Integer page, Integer size);

}