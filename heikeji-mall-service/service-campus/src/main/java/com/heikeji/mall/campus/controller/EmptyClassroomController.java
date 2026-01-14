package com.heikeji.mall.campus.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.campus.entity.EmptyClassroom;
import com.heikeji.mall.campus.service.EmptyClassroomService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 空教室控制器
 */
@RestController
@RequestMapping("/api/campus/empty-classroom")
@Tag(name = "空教室查询")
public class EmptyClassroomController {

    @Autowired
    private EmptyClassroomService emptyClassroomService;

    /**
     * 查询空教室列表
     */
    @GetMapping("/list")
    @Operation(summary = "查询空教室列表")
    public R<List<EmptyClassroom>> getEmptyClassrooms(@RequestParam Map<String, Object> params) {
        List<EmptyClassroom> emptyClassrooms = emptyClassroomService.getEmptyClassrooms(params);
        return R.success(emptyClassrooms);
    }

    /**
     * 根据教学楼查询空教室
     */
    @GetMapping("/by-building")
    @Operation(summary = "根据教学楼查询空教室")
    public R<List<EmptyClassroom>> getEmptyClassroomsByBuilding(
            @RequestParam Long buildingId,
            @RequestParam(required = false) Integer weekday,
            @RequestParam(required = false) Integer classSection) {
        List<EmptyClassroom> emptyClassrooms = emptyClassroomService.getEmptyClassroomsByBuilding(buildingId, weekday, classSection);
        return R.success(emptyClassrooms);
    }

    /**
     * 根据校区查询空教室
     */
    @GetMapping("/by-campus")
    @Operation(summary = "根据校区查询空教室")
    public R<List<EmptyClassroom>> getEmptyClassroomsByCampus(
            @RequestParam Long campusId,
            @RequestParam(required = false) Integer weekday,
            @RequestParam(required = false) Integer classSection) {
        List<EmptyClassroom> emptyClassrooms = emptyClassroomService.getEmptyClassroomsByCampus(campusId, weekday, classSection);
        return R.success(emptyClassrooms);
    }

    /**
     * 查询当前时间段的空教室
     */
    @GetMapping("/current")
    @Operation(summary = "查询当前时间段的空教室")
    public R<List<EmptyClassroom>> getCurrentEmptyClassrooms() {
        List<EmptyClassroom> emptyClassrooms = emptyClassroomService.getCurrentEmptyClassrooms();
        return R.success(emptyClassrooms);
    }

    /**
     * 根据时间范围查询空教室
     */
    @GetMapping("/by-time-range")
    @Operation(summary = "根据时间范围查询空教室")
    public R<List<EmptyClassroom>> getEmptyClassroomsByTimeRange(
            @RequestParam Integer weekday,
            @RequestParam Integer startSection,
            @RequestParam Integer endSection) {
        List<EmptyClassroom> emptyClassrooms = emptyClassroomService.getEmptyClassroomsByTimeRange(weekday, startSection, endSection);
        return R.success(emptyClassrooms);
    }

    /**
     * 查询可用的教室类型
     */
    @GetMapping("/available-types")
    @Operation(summary = "查询可用的教室类型")
    public R<List<Integer>> getAvailableClassroomTypes() {
        List<Integer> types = emptyClassroomService.getAvailableClassroomTypes();
        return R.success(types);
    }
}
