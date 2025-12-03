package com.heikeji.mall.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.campus.domain.vo.CampusVO;
import com.heikeji.mall.campus.entity.Campus;
import com.heikeji.mall.campus.mapper.CampusMapper;
import com.heikeji.mall.campus.service.CampusService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 校区服务实现类
 */
@Service
public class CampusServiceImpl extends ServiceImpl<CampusMapper, Campus> implements CampusService {

    @Override
    public List<CampusVO> getCampusList(Map<String, Object> params) {
        // 查询条件构建
        QueryWrapper<Campus> queryWrapper = new QueryWrapper<>();
        
        // 根据参数添加查询条件
        if (params != null) {
            if (params.containsKey("campusName")) {
                queryWrapper.like("campus_name", params.get("campusName"));
            }
            if (params.containsKey("status")) {
                queryWrapper.eq("status", params.get("status"));
            }
        }
        
        // 执行查询
        List<Campus> campusList = baseMapper.selectList(queryWrapper);
        
        // 转换为VO
        return campusList.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    public CampusVO getCampusById(Long id) {
        Campus campus = baseMapper.selectById(id);
        return campus != null ? convertToVO(campus) : null;
    }

    @Override
    public Integer addCampus(CampusVO campusVO) {
        // 转换为实体
        Campus campus = new Campus();
        BeanUtils.copyProperties(campusVO, campus);
        
        // 检查校区名称和编码是否已存在
        if (checkCampusName(campus.getCampusName()) || checkCampusCode(campus.getCampusCode())) {
            return 0;
        }
        
        boolean result = save(campus);
        return result ? 1 : 0;
    }

    @Override
    public Integer updateCampus(CampusVO campusVO) {
        // 转换为实体
        Campus campus = new Campus();
        BeanUtils.copyProperties(campusVO, campus);
        
        // 检查校区名称和编码是否已存在（排除当前记录）
        QueryWrapper<Campus> queryWrapper = new QueryWrapper<>();
        queryWrapper.ne("id", campus.getId());
        queryWrapper.and(qw -> qw.eq("campus_name", campus.getCampusName()).or().eq("campus_code", campus.getCampusCode()));
        if (baseMapper.selectCount(queryWrapper) > 0) {
            return 0;
        }
        
        boolean result = updateById(campus);
        return result ? 1 : 0;
    }

    @Override
    public Integer deleteCampus(Long[] ids) {
        boolean result = removeByIds(Arrays.asList(ids));
        return result ? ids.length : 0;
    }

    /**
     * 检查校区名称是否已存在
     */
    private boolean checkCampusName(String campusName) {
        QueryWrapper<Campus> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("campus_name", campusName);
        return baseMapper.selectCount(queryWrapper) > 0;
    }

    /**
     * 检查校区编码是否已存在
     */
    private boolean checkCampusCode(String campusCode) {
        QueryWrapper<Campus> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("campus_code", campusCode);
        return baseMapper.selectCount(queryWrapper) > 0;
    }

    /**
     * 实体转VO
     */
    private CampusVO convertToVO(Campus campus) {
        CampusVO vo = new CampusVO();
        BeanUtils.copyProperties(campus, vo);
        return vo;
    }
}
