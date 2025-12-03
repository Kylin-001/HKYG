package com.heikeji.mall.campus.service;

import com.heikeji.mall.campus.domain.vo.CampusSiteVO;
import java.util.List;
import java.util.Map;

/**
 * 校园站点服务接口
 */
public interface CampusSiteService {

    /**
     * 获取站点列表
     * @param params 查询参数
     * @return 站点列表
     */
    List<CampusSiteVO> getSiteList(Map<String, Object> params);

    /**
     * 根据ID获取站点详情
     * @param id 站点ID
     * @return 站点详情
     */
    CampusSiteVO getSiteById(Long id);

    /**
     * 根据校区ID获取站点列表
     * @param campusId 校区ID
     * @return 站点列表
     */
    List<CampusSiteVO> getSitesByCampusId(Long campusId);
    
    /**
     * 根据类型获取站点列表
     * @param type 站点类型
     * @return 站点列表
     */
    List<CampusSiteVO> getSitesByType(String type);

    /**
     * 新增站点
     * @param siteVO 站点信息
     * @return 影响行数
     */
    Integer addSite(CampusSiteVO siteVO);

    /**
     * 修改站点
     * @param siteVO 站点信息
     * @return 影响行数
     */
    Integer updateSite(CampusSiteVO siteVO);

    /**
     * 删除站点
     * @param ids 站点ID数组
     * @return 影响行数
     */
    Integer deleteSite(Long[] ids);
    
    /**
     * 更新站点状态
     * @param id 站点ID
     * @param status 状态：0-禁用，1-启用
     * @return 是否成功
     */
    Boolean updateSiteStatus(Long id, Integer status);
    
    /**
     * 获取所有可用的站点类型
     * @return 站点类型列表
     */
    List<String> getAllSiteTypes();
}