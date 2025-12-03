package com.heikeji.mall.campus.controller;

import com.heikeji.mall.campus.domain.vo.CampusVO;
import com.heikeji.mall.campus.service.CampusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 校区管理控制器
 */
@RestController
@RequestMapping("/campus")
public class CampusController {

    @Autowired
    private CampusService campusService;

    /**
     * 获取校区列表
     */
    @GetMapping("/list")
    public List<CampusVO> list(@RequestParam Map<String, Object> params) {
        return campusService.getCampusList(params);
    }

    /**
     * 根据ID获取校区详情
     */
    @GetMapping("/info/{id}")
    public CampusVO info(@PathVariable("id") Long id) {
        return campusService.getCampusById(id);
    }

    /**
     * 新增校区
     */
    @PostMapping("/save")
    public Integer save(@RequestBody CampusVO campusVO) {
        return campusService.addCampus(campusVO);
    }

    /**
     * 修改校区
     */
    @PostMapping("/update")
    public Integer update(@RequestBody CampusVO campusVO) {
        return campusService.updateCampus(campusVO);
    }

    /**
     * 删除校区
     */
    @PostMapping("/delete")
    public Integer delete(@RequestBody Long[] ids) {
        return campusService.deleteCampus(ids);
    }
}
