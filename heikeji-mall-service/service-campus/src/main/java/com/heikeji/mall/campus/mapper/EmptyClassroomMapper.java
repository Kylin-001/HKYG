package com.heikeji.mall.campus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.campus.entity.EmptyClassroom;

import java.util.List;
import java.util.Map;

/**
 * 空教室Mapper接口
 */
public interface EmptyClassroomMapper extends BaseMapper<EmptyClassroom> {
    
    /**
     * 查询空教室列表
     */
    List<EmptyClassroom> selectEmptyClassrooms(Map<String, Object> params);
    
    /**
     * 根据教学楼查询空教室
     */
    List<EmptyClassroom> selectEmptyClassroomsByBuilding(Long buildingId, Integer weekday, Integer classSection);
    
    /**
     * 根据校区查询空教室
     */
    List<EmptyClassroom> selectEmptyClassroomsByCampus(Long campusId, Integer weekday, Integer classSection);
    
    /**
     * 查询可用的教室类型
     */
    List<Integer> selectAvailableClassroomTypes();
}
