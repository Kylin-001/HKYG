package com.heikeji.mall.campus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.campus.entity.CampusSite;
import java.util.List;
import java.util.Map;

/**
 * 校园站点Mapper接口
 */
public interface CampusSiteMapper extends BaseMapper<CampusSite> {

    /**
     * 查询站点列表
     * @param params 查询参数
     * @return 站点列表
     */
    List<CampusSite> selectSiteList(Map<String, Object> params);

    /**
     * 根据ID查询站点
     * @param id 站点ID
     * @return 站点信息
     */
    CampusSite selectSiteById(Long id);

    /**
     * 根据校区ID查询站点列表
     * @param campusId 校区ID
     * @return 站点列表
     */
    List<CampusSite> selectSitesByCampusId(Long campusId);
    
    /**
     * 根据类型查询站点列表
     * @param type 站点类型
     * @return 站点列表
     */
    List<CampusSite> selectSitesByType(String type);

    /**
     * 校验站点名称是否唯一
     * @param params 参数（包含站点名称、校区ID、排除ID）
     * @return 数量
     */
    Integer checkSiteName(Map<String, Object> params);

    /**
     * 校验站点类型是否存在
     * @param type 站点类型
     * @return 数量
     */
    Integer checkSiteType(String type);
}