package com.heikeji.mall.campus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.campus.entity.DormitoryStudent;
import org.apache.ibatis.annotations.Mapper;

/**
 * 宿舍学生关联Mapper
 */
@Mapper
public interface DormitoryStudentMapper extends BaseMapper<DormitoryStudent> {
}
