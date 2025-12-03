package com.heikeji.mall.lostfound.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.lostfound.entity.LostFound;

/**
 * 失物招领Mapper接口
 */
public interface LostFoundMapper extends BaseMapper<LostFound> {

    /**
     * 增加浏览量
     * @param id 失物招领ID
     */
    void increaseViewCount(Long id);

}