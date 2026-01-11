package com.heikeji.mall.campus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.campus.entity.CampusNotice;

import java.util.List;

/**
 * 校园公告Mapper接口
 */
public interface CampusNoticeMapper extends BaseMapper<CampusNotice> {
    
    /**
     * 根据校区ID获取公告列表
     */
    List<CampusNotice> selectByCampusId(Long campusId);
    
    /**
     * 根据类型获取公告列表
     */
    List<CampusNotice> selectByType(String type);
    
    /**
     * 获取已发布的公告列表
     */
    List<CampusNotice> selectPublishedNotices();
    
    /**
     * 获取置顶公告
     */
    List<CampusNotice> selectTopNotices();
    
    /**
     * 增加点击量
     */
    int incrementClickCount(Long id);
}
