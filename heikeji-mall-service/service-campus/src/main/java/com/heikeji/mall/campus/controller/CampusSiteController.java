package com.heikeji.mall.campus.controller;

import com.heikeji.mall.campus.domain.vo.CampusSiteVO;
import com.heikeji.mall.campus.service.CampusSiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 校园站点管理控制器
 */
@RestController
@RequestMapping("/site")
public class CampusSiteController {

    @Autowired
    private CampusSiteService campusSiteService;

    /**
     * 获取站点列表
     */
    @GetMapping("/list")
    public List<CampusSiteVO> list(@RequestParam Map<String, Object> params) {
        return campusSiteService.getSiteList(params);
    }

    /**
     * 根据ID获取站点详情
     */
    @GetMapping("/info/{id}")
    public CampusSiteVO info(@PathVariable("id") Long id) {
        return campusSiteService.getSiteById(id);
    }

    /**
     * 根据校区ID获取站点列表
     */
    @GetMapping("/byCampus/{campusId}")
    public List<CampusSiteVO> getByCampus(@PathVariable("campusId") Long campusId) {
        return campusSiteService.getSitesByCampusId(campusId);
    }

    /**
     * 根据类型获取站点列表
     */
    @GetMapping("/byType/{type}")
    public List<CampusSiteVO> getByType(@PathVariable("type") String type) {
        return campusSiteService.getSitesByType(type);
    }

    /**
     * 获取所有站点类型
     */
    @GetMapping("/types")
    public List<String> getSiteTypes() {
        return campusSiteService.getAllSiteTypes();
    }

    /**
     * 新增站点
     */
    @PostMapping("/save")
    public Integer save(@RequestBody CampusSiteVO siteVO) {
        return campusSiteService.addSite(siteVO);
    }

    /**
     * 修改站点
     */
    @PostMapping("/update")
    public Integer update(@RequestBody CampusSiteVO siteVO) {
        return campusSiteService.updateSite(siteVO);
    }

    /**
     * 删除站点
     */
    @PostMapping("/delete")
    public Integer delete(@RequestBody Long[] ids) {
        return campusSiteService.deleteSite(ids);
    }

    /**
     * 更新站点状态
     */
    @PutMapping("/status/{id}")
    public Boolean updateStatus(@PathVariable("id") Long id, @RequestParam Integer status) {
        return campusSiteService.updateSiteStatus(id, status);
    }
}