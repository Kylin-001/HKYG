package com.heikeji.mall.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.campus.domain.vo.BuildingVO;
import com.heikeji.mall.campus.entity.Building;
import com.heikeji.mall.campus.mapper.BuildingMapper;
import com.heikeji.mall.campus.service.BuildingService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 楼栋服务实现类
 */
@Service
public class BuildingServiceImpl extends ServiceImpl<BuildingMapper, Building> implements BuildingService {

    @Override
    public List<BuildingVO> getBuildingList(Map<String, Object> params) {
        // 查询条件构建
        QueryWrapper<Building> queryWrapper = new QueryWrapper<>();
        
        // 根据参数添加查询条件
        if (params != null) {
            if (params.containsKey("buildingName")) {
                queryWrapper.like("building_name", params.get("buildingName"));
            }
            if (params.containsKey("campusId")) {
                queryWrapper.eq("campus_id", params.get("campusId"));
            }
            if (params.containsKey("status")) {
                queryWrapper.eq("status", params.get("status"));
            }
        }
        
        // 执行查询
        List<Building> buildingList = baseMapper.selectList(queryWrapper);
        
        // 转换为VO
        return buildingList.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    public BuildingVO getBuildingById(Long id) {
        Building building = baseMapper.selectById(id);
        return building != null ? convertToVO(building) : null;
    }

    @Override
    public List<BuildingVO> getBuildingsByCampusId(Long campusId) {
        QueryWrapper<Building> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("campus_id", campusId);
        queryWrapper.eq("status", 1); // 只查询启用状态的楼栋
        
        List<Building> buildingList = baseMapper.selectList(queryWrapper);
        return buildingList.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    public Integer addBuilding(BuildingVO buildingVO) {
        // 转换为实体
        Building building = new Building();
        BeanUtils.copyProperties(buildingVO, building);
        
        // 检查楼栋名称和编码是否已存在
        if (checkBuildingName(building.getBuildingName()) || checkBuildingCode(building.getBuildingCode())) {
            return 0;
        }
        
        boolean result = save(building);
        return result ? 1 : 0;
    }

    @Override
    public Integer updateBuilding(BuildingVO buildingVO) {
        // 转换为实体
        Building building = new Building();
        BeanUtils.copyProperties(buildingVO, building);
        
        // 检查楼栋名称和编码是否已存在（排除当前记录）
        QueryWrapper<Building> queryWrapper = new QueryWrapper<>();
        queryWrapper.ne("id", building.getId());
        queryWrapper.and(qw -> qw.eq("building_name", building.getBuildingName()).or().eq("building_code", building.getBuildingCode()));
        if (baseMapper.selectCount(queryWrapper) > 0) {
            return 0;
        }
        
        boolean result = updateById(building);
        return result ? 1 : 0;
    }

    @Override
    public Integer deleteBuilding(Long[] ids) {
        boolean result = removeByIds(Arrays.asList(ids));
        return result ? ids.length : 0;
    }

    /**
     * 检查楼栋名称是否已存在
     */
    private boolean checkBuildingName(String buildingName) {
        QueryWrapper<Building> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("building_name", buildingName);
        return baseMapper.selectCount(queryWrapper) > 0;
    }

    /**
     * 检查楼栋编码是否已存在
     */
    private boolean checkBuildingCode(String buildingCode) {
        QueryWrapper<Building> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("building_code", buildingCode);
        return baseMapper.selectCount(queryWrapper) > 0;
    }

    /**
     * 实体转VO
     */
    private BuildingVO convertToVO(Building building) {
        BuildingVO vo = new BuildingVO();
        BeanUtils.copyProperties(building, vo);
        return vo;
    }
}
