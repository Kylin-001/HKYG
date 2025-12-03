package com.heikeji.mall.campus.service;

import com.heikeji.mall.campus.domain.vo.CampusVO;
import java.util.List;
import java.util.Map;

/**
 * 校区服务接口
 */
public interface CampusService {

    /**
     * 获取校区列表
     * @param params 查询参数
     * @return 校区列表
     */
    List<CampusVO> getCampusList(Map<String, Object> params);

    /**
     * 根据ID获取校区详情
     * @param id 校区ID
     * @return 校区详情
     */
    CampusVO getCampusById(Long id);

    /**
     * 新增校区
     * @param campusVO 校区信息
     * @return 影响行数
     */
    Integer addCampus(CampusVO campusVO);

    /**
     * 修改校区
     * @param campusVO 校区信息
     * @return 影响行数
     */
    Integer updateCampus(CampusVO campusVO);

    /**
     * 删除校区
     * @param ids 校区ID数组
     * @return 影响行数
     */
    Integer deleteCampus(Long[] ids);
}
