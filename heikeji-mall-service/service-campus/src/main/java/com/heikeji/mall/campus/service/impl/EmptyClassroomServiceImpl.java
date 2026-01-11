package com.heikeji.mall.campus.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.campus.entity.EmptyClassroom;
import com.heikeji.mall.campus.mapper.EmptyClassroomMapper;
import com.heikeji.mall.campus.service.EmptyClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.List;
import java.util.Map;

/**
 * 空教室服务实现类
 */
@Service
public class EmptyClassroomServiceImpl extends ServiceImpl<EmptyClassroomMapper, EmptyClassroom> implements EmptyClassroomService {

    @Autowired
    private EmptyClassroomMapper emptyClassroomMapper;

    /**
     * 查询空教室列表
     */
    @Override
    @Cacheable(value = "campusCache", key = "'empty_classrooms_' + #params.toString().replaceAll('\\s', '')", unless = "#result == null")
    public List<EmptyClassroom> getEmptyClassrooms(Map<String, Object> params) {
        return emptyClassroomMapper.selectEmptyClassrooms(params);
    }

    /**
     * 根据教学楼查询空教室
     */
    @Override
    @Cacheable(value = "campusCache", key = "'empty_classrooms_building_' + #buildingId + '_' + #weekday + '_' + #classSection", unless = "#result == null")
    public List<EmptyClassroom> getEmptyClassroomsByBuilding(Long buildingId, Integer weekday, Integer classSection) {
        return emptyClassroomMapper.selectEmptyClassroomsByBuilding(buildingId, weekday, classSection);
    }

    /**
     * 根据校区查询空教室
     */
    @Override
    @Cacheable(value = "campusCache", key = "'empty_classrooms_campus_' + #campusId + '_' + #weekday + '_' + #classSection", unless = "#result == null")
    public List<EmptyClassroom> getEmptyClassroomsByCampus(Long campusId, Integer weekday, Integer classSection) {
        return emptyClassroomMapper.selectEmptyClassroomsByCampus(campusId, weekday, classSection);
    }

    /**
     * 查询可用的教室类型
     */
    @Override
    @Cacheable(value = "campusCache", key = "'available_classroom_types'", unless = "#result == null")
    public List<Integer> getAvailableClassroomTypes() {
        return emptyClassroomMapper.selectAvailableClassroomTypes();
    }

    /**
     * 查询当前时间段的空教室
     */
    @Override
    @Cacheable(value = "campusCache", key = "'current_empty_classrooms'", unless = "#result == null")
    public List<EmptyClassroom> getCurrentEmptyClassrooms() {
        // 获取当前时间信息
        Calendar calendar = Calendar.getInstance();
        int weekday = calendar.get(Calendar.DAY_OF_WEEK); // 1-7表示周日到周六，需要转换为1-7表示周一到周日
        if (weekday == 1) { // 周日
            weekday = 7;
        } else {
            weekday -= 1;
        }
        
        // 根据当前时间计算当前是第几节课
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);
        int currentMinute = hour * 60 + minute;
        
        int classSection = 1;
        // 假设课程时间安排如下：
        // 第1节：08:00-08:45
        // 第2节：08:55-09:40
        // 第3节：10:00-10:45
        // 第4节：10:55-11:40
        // 第5节：14:00-14:45
        // 第6节：14:55-15:40
        // 第7节：16:00-16:45
        // 第8节：16:55-17:40
        // 第9节：18:30-19:15
        // 第10节：19:25-20:10
        // 第11节：20:20-21:05
        // 第12节：21:15-22:00
        
        int[][] classTimes = {
            {480, 525},   // 第1节
            {535, 580},   // 第2节
            {600, 645},   // 第3节
            {655, 700},   // 第4节
            {840, 885},   // 第5节
            {895, 940},   // 第6节
            {960, 1005},  // 第7节
            {1015, 1060}, // 第8节
            {1110, 1155}, // 第9节
            {1165, 1210}, // 第10节
            {1220, 1265}, // 第11节
            {1275, 1320}  // 第12节
        };
        
        for (int i = 0; i < classTimes.length; i++) {
            if (currentMinute >= classTimes[i][0] && currentMinute <= classTimes[i][1]) {
                classSection = i + 1;
                break;
            }
        }
        
        // 查询当前时间段的空教室
        // 这里简化处理，查询所有校区的当前空教室
        return emptyClassroomMapper.selectEmptyClassroomsByCampus(null, weekday, classSection);
    }

    /**
     * 根据时间范围查询空教室
     */
    @Override
    @Cacheable(value = "campusCache", key = "'empty_classrooms_time_range_' + #weekday + '_' + #startSection + '_' + #endSection", unless = "#result == null")
    public List<EmptyClassroom> getEmptyClassroomsByTimeRange(Integer weekday, Integer startSection, Integer endSection) {
        // 这里简化处理，查询所有校区的指定时间范围的空教室
        // 实际实现中可以根据需要添加更多查询条件
        return baseMapper.selectList(null);
    }
}
