package com.heikeji.mall.campus.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.campus.entity.CampusNotice;
import com.heikeji.mall.campus.mapper.CampusNoticeMapper;
import com.heikeji.mall.campus.service.CampusNoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 校园公告服务实现类
 */
@Service
public class CampusNoticeServiceImpl extends ServiceImpl<CampusNoticeMapper, CampusNotice> implements CampusNoticeService {

    @Autowired
    private CampusNoticeMapper campusNoticeMapper;

    /**
     * 获取公告列表
     */
    @Override
    @Cacheable(value = "campusCache", key = "'notice_list'")
    public List<CampusNotice> getNoticeList(Map<String, Object> params) {
        // 简单实现，后续可以根据params添加更多查询条件
        return campusNoticeMapper.selectList(null);
    }

    /**
     * 根据ID获取公告详情
     */
    @Override
    @Cacheable(value = "campusCache", key = "'notice_' + #id", unless = "#result == null")
    public CampusNotice getNoticeById(Long id) {
        return campusNoticeMapper.selectById(id);
    }

    /**
     * 新增公告
     */
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "campusCache", allEntries = true)
    @Override
    public boolean addNotice(CampusNotice notice) {
        Date now = new Date();
        notice.setCreateTime(now);
        notice.setUpdateTime(now);
        notice.setClickCount(0);
        // 如果是立即发布状态，设置发布时间
        if (notice.getStatus() == 1) {
            notice.setPublishTime(now);
        }
        return campusNoticeMapper.insert(notice) > 0;
    }

    /**
     * 修改公告
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean updateNotice(CampusNotice notice) {
        notice.setUpdateTime(new Date());
        // 如果状态从非发布状态变为发布状态，设置发布时间
        if (notice.getStatus() == 1) {
            CampusNotice oldNotice = campusNoticeMapper.selectById(notice.getId());
            if (oldNotice != null && oldNotice.getStatus() != 1) {
                notice.setPublishTime(new Date());
            }
        }
        return campusNoticeMapper.updateById(notice) > 0;
    }

    /**
     * 删除公告
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean deleteNotice(Long id) {
        return campusNoticeMapper.deleteById(id) > 0;
    }

    /**
     * 批量删除公告
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean batchDeleteNotices(List<Long> ids) {
        return campusNoticeMapper.deleteBatchIds(ids) > 0;
    }

    /**
     * 更新公告状态
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean updateNoticeStatus(Long id, Integer status) {
        CampusNotice notice = new CampusNotice();
        notice.setId(id);
        notice.setStatus(status);
        notice.setUpdateTime(new Date());
        // 如果是发布状态，设置发布时间
        if (status == 1) {
            notice.setPublishTime(new Date());
        }
        return campusNoticeMapper.updateById(notice) > 0;
    }

    /**
     * 更新公告置顶状态
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean updateNoticeTopStatus(Long id, Integer isTop) {
        CampusNotice notice = new CampusNotice();
        notice.setId(id);
        notice.setIsTop(isTop);
        notice.setUpdateTime(new Date());
        return campusNoticeMapper.updateById(notice) > 0;
    }

    /**
     * 根据校区ID获取公告列表
     */
    @Override
    public List<CampusNotice> getNoticesByCampusId(Long campusId) {
        return campusNoticeMapper.selectByCampusId(campusId);
    }

    /**
     * 根据类型获取公告列表
     */
    @Override
    public List<CampusNotice> getNoticesByType(String type) {
        return campusNoticeMapper.selectByType(type);
    }

    /**
     * 获取已发布的公告列表
     */
    @Override
    public List<CampusNotice> getPublishedNotices() {
        return campusNoticeMapper.selectPublishedNotices();
    }

    /**
     * 获取置顶公告
     */
    @Override
    public List<CampusNotice> getTopNotices() {
        return campusNoticeMapper.selectTopNotices();
    }

    /**
     * 增加公告点击量
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean incrementClickCount(Long id) {
        return campusNoticeMapper.incrementClickCount(id) > 0;
    }

    /**
     * 同步校园公告
     * 这里实现一个简单的逻辑，后续可以对接外部系统获取校园公告
     */
    @Override
    public boolean syncCampusNotices() {
        // 简单实现，返回true表示同步成功
        // 后续可以添加实际的同步逻辑，比如从学校官网或其他系统获取公告
        return true;
    }
}
