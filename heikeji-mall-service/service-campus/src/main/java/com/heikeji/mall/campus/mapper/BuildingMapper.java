package com.heikeji.mall.campus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.campus.entity.Building;
import java.util.List;
import java.util.Map;

/**
 * 楼栋Mapper接口
 */
public interface BuildingMapper extends BaseMapper<Building> {

    /**
     * 查询楼栋列表
     * @param params 查询参数
     * @return 楼栋列表
     */
    List<Building> selectBuildingList(Map<String, Object> params);

    /**
     * 根据ID查询楼栋
     * @param id 楼栋ID
     * @return 楼栋信息
     */
    Building selectBuildingById(Long id);

    /**
     * 根据校区ID查询楼栋列表
     * @param campusId 校区ID
     * @return 楼栋列表
     */
    List<Building> selectBuildingsByCampusId(Long campusId);

    /**
     * 校验楼栋名称是否唯一
     * @param params 参数（包含楼栋名称、校区ID、排除ID）
     * @return 数量
     */
    Integer checkBuildingName(Map<String, Object> params);

    /**
     * 校验楼栋编码是否唯一
     * @param params 参数（包含楼栋编码、排除ID）
     * @return 数量
     */
    Integer checkBuildingCode(Map<String, Object> params);
}
