package com.heikeji.mall.campus.controller;

import com.heikeji.mall.campus.domain.vo.BuildingVO;
import com.heikeji.mall.campus.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 楼栋管理控制器
 */
@RestController
@RequestMapping("/building")
public class BuildingController {

    @Autowired
    private BuildingService buildingService;

    /**
     * 获取楼栋列表
     */
    @GetMapping("/list")
    public List<BuildingVO> list(@RequestParam Map<String, Object> params) {
        return buildingService.getBuildingList(params);
    }

    /**
     * 根据ID获取楼栋详情
     */
    @GetMapping("/info/{id}")
    public BuildingVO info(@PathVariable("id") Long id) {
        return buildingService.getBuildingById(id);
    }

    /**
     * 新增楼栋
     */
    @PostMapping("/save")
    public Integer save(@RequestBody BuildingVO buildingVO) {
        return buildingService.addBuilding(buildingVO);
    }

    /**
     * 修改楼栋
     */
    @PostMapping("/update")
    public Integer update(@RequestBody BuildingVO buildingVO) {
        return buildingService.updateBuilding(buildingVO);
    }

    /**
     * 删除楼栋
     */
    @PostMapping("/delete")
    public Integer delete(@RequestBody Long[] ids) {
        return buildingService.deleteBuilding(ids);
    }
}
