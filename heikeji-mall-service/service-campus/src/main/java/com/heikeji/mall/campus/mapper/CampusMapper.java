package com.heikeji.mall.campus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.campus.entity.Campus;

import java.util.List;
import java.util.Map;

/**
 * 校区Mapper
 */
public interface CampusMapper extends BaseMapper<Campus> {

    /**
     * 查询校区列表
     */
    List<Campus> selectCampusList(Map<String, Object> params);

    /**
     * 根据ID查询校区
     */
    Campus selectCampusById(Long id);

    /**
     * 检查校区名称是否存在
     */
    int checkCampusName(Map<String, Object> params);
}
