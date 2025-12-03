package com.heikeji.mall.campus.service;

import com.heikeji.mall.campus.domain.vo.BuildingVO;
import java.util.List;
import java.util.Map;

/**
 * 楼栋服务接口
 */
public interface BuildingService {

    /**
     * 获取楼栋列表
     * @param params 查询参数
     * @return 楼栋列表
     */
    List<BuildingVO> getBuildingList(Map<String, Object> params);

    /**
     * 根据ID获取楼栋详情
     * @param id 楼栋ID
     * @return 楼栋详情
     */
    BuildingVO getBuildingById(Long id);

    /**
     * 根据校区ID获取楼栋列表
     * @param campusId 校区ID
     * @return 楼栋列表
     */
    List<BuildingVO> getBuildingsByCampusId(Long campusId);

    /**
     * 新增楼栋
     * @param buildingVO 楼栋信息
     * @return 影响行数
     */
    Integer addBuilding(BuildingVO buildingVO);

    /**
     * 修改楼栋
     * @param buildingVO 楼栋信息
     * @return 影响行数
     */
    Integer updateBuilding(BuildingVO buildingVO);

    /**
     * 删除楼栋
     * @param ids 楼栋ID数组
     * @return 影响行数
     */
    Integer deleteBuilding(Long[] ids);
}
