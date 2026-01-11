package com.heikeji.mall.campus.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.campus.entity.CampusNotice;

import java.util.List;
import java.util.Map;

/**
 * 校园公告服务接口
 */
public interface CampusNoticeService extends IService<CampusNotice> {
    
    /**
     * 获取公告列表
     */
    List<CampusNotice> getNoticeList(Map<String, Object> params);
    
    /**
     * 根据ID获取公告详情
     */
    CampusNotice getNoticeById(Long id);
    
    /**
     * 新增公告
     */
    boolean addNotice(CampusNotice notice);
    
    /**
     * 修改公告
     */
    boolean updateNotice(CampusNotice notice);
    
    /**
     * 删除公告
     */
    boolean deleteNotice(Long id);
    
    /**
     * 批量删除公告
     */
    boolean batchDeleteNotices(List<Long> ids);
    
    /**
     * 更新公告状态
     */
    boolean updateNoticeStatus(Long id, Integer status);
    
    /**
     * 更新公告置顶状态
     */
    boolean updateNoticeTopStatus(Long id, Integer isTop);
    
    /**
     * 根据校区ID获取公告列表
     */
    List<CampusNotice> getNoticesByCampusId(Long campusId);
    
    /**
     * 根据类型获取公告列表
     */
    List<CampusNotice> getNoticesByType(String type);
    
    /**
     * 获取已发布的公告列表
     */
    List<CampusNotice> getPublishedNotices();
    
    /**
     * 获取置顶公告
     */
    List<CampusNotice> getTopNotices();
    
    /**
     * 增加公告点击量
     */
    boolean incrementClickCount(Long id);
    
    /**
     * 同步校园公告
     */
    boolean syncCampusNotices();
}
