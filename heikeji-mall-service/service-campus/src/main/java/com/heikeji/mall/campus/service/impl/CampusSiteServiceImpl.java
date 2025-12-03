package com.heikeji.mall.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.campus.domain.vo.CampusSiteVO;
import com.heikeji.mall.campus.entity.CampusSite;
import com.heikeji.mall.campus.mapper.CampusSiteMapper;
import com.heikeji.mall.campus.service.CampusSiteService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 校园站点服务实现类
 */
@Service
public class CampusSiteServiceImpl extends ServiceImpl<CampusSiteMapper, CampusSite> implements CampusSiteService {

    @Override
    public List<CampusSiteVO> getSiteList(Map<String, Object> params) {
        // 查询条件构建
        QueryWrapper<CampusSite> queryWrapper = new QueryWrapper<>();
        
        // 根据参数添加查询条件
        if (params != null) {
            if (params.containsKey("campusId")) {
                queryWrapper.eq("campus_id", params.get("campusId"));
            }
            if (params.containsKey("type")) {
                queryWrapper.eq("type", params.get("type"));
            }
            if (params.containsKey("status")) {
                queryWrapper.eq("status", params.get("status"));
            }
            if (params.containsKey("name")) {
                queryWrapper.like("name", params.get("name"));
            }
        }
        
        // 执行查询
        List<CampusSite> siteList = baseMapper.selectList(queryWrapper);
        
        // 转换为VO
        return siteList.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    public CampusSiteVO getSiteById(Long id) {
        CampusSite site = baseMapper.selectById(id);
        return site != null ? convertToVO(site) : null;
    }

    @Override
    public List<CampusSiteVO> getSitesByCampusId(Long campusId) {
        List<CampusSite> siteList = baseMapper.selectSitesByCampusId(campusId);
        return siteList.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    public List<CampusSiteVO> getSitesByType(String type) {
        List<CampusSite> siteList = baseMapper.selectSitesByType(type);
        return siteList.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    public Integer addSite(CampusSiteVO siteVO) {
        // 转换为实体
        CampusSite site = new CampusSite();
        BeanUtils.copyProperties(siteVO, site);
        
        // 检查站点名称是否已存在
        if (checkSiteName(siteVO.getName(), siteVO.getCampusId(), null)) {
            return 0;
        }
        
        boolean result = save(site);
        return result ? 1 : 0;
    }

    @Override
    public Integer updateSite(CampusSiteVO siteVO) {
        // 转换为实体
        CampusSite site = new CampusSite();
        BeanUtils.copyProperties(siteVO, site);
        
        // 检查站点名称是否已存在（排除当前记录）
        if (checkSiteName(siteVO.getName(), siteVO.getCampusId(), siteVO.getId())) {
            return 0;
        }
        
        boolean result = updateById(site);
        return result ? 1 : 0;
    }

    @Override
    public Integer deleteSite(Long[] ids) {
        boolean result = removeByIds(Arrays.asList(ids));
        return result ? ids.length : 0;
    }

    @Override
    public Boolean updateSiteStatus(Long id, Integer status) {
        CampusSite site = new CampusSite();
        site.setId(id);
        site.setStatus(status);
        return updateById(site);
    }

    @Override
    public List<String> getAllSiteTypes() {
        // 获取所有不重复的站点类型
        List<CampusSite> sites = baseMapper.selectList(new QueryWrapper<CampusSite>().select("DISTINCT type").ne("type", null));
        return sites.stream()
                .map(CampusSite::getType)
                .distinct()
                .collect(Collectors.toList());
    }

    /**
     * 检查站点名称是否已存在
     */
    private boolean checkSiteName(String name, Long campusId, Long excludeId) {
        Map<String, Object> params = new HashMap<>();
        params.put("name", name);
        params.put("campusId", campusId);
        if (excludeId != null) {
            params.put("id", excludeId);
        }
        return baseMapper.checkSiteName(params) > 0;
    }

    /**
     * 实体转VO
     */
    private CampusSiteVO convertToVO(CampusSite site) {
        CampusSiteVO vo = new CampusSiteVO();
        BeanUtils.copyProperties(site, vo);
        return vo;
    }
}