package com.heikeji.mall.campus.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.campus.entity.EmptyClassroom;

import java.util.List;
import java.util.Map;

/**
 * 空教室服务接口
 */
public interface EmptyClassroomService extends IService<EmptyClassroom> {
    
    /**
     * 查询空教室列表
     */
    List<EmptyClassroom> getEmptyClassrooms(Map<String, Object> params);
    
    /**
     * 根据教学楼查询空教室
     */
    List<EmptyClassroom> getEmptyClassroomsByBuilding(Long buildingId, Integer weekday, Integer classSection);
    
    /**
     * 根据校区查询空教室
     */
    List<EmptyClassroom> getEmptyClassroomsByCampus(Long campusId, Integer weekday, Integer classSection);
    
    /**
     * 查询可用的教室类型
     */
    List<Integer> getAvailableClassroomTypes();
    
    /**
     * 查询当前时间段的空教室
     */
    List<EmptyClassroom> getCurrentEmptyClassrooms();
    
    /**
     * 根据时间范围查询空教室
     */
    List<EmptyClassroom> getEmptyClassroomsByTimeRange(Integer weekday, Integer startSection, Integer endSection);
}
