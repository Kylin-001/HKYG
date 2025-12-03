package com.heikeji.mall.product.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.product.entity.ProductHotWord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 商品热词Mapper接口
 */
@Mapper
public interface ProductHotWordMapper extends BaseMapper<ProductHotWord> {

    /**
     * 获取热门搜索词列表
     * @param limit 限制数量
     * @return 热门搜索词列表
     */
    List<ProductHotWord> getHotWords(@Param("limit") Integer limit);

    /**
     * 获取首页展示的热词
     * @param limit 限制数量
     * @return 首页展示的热词列表
     */
    List<ProductHotWord> getHomeShowHotWords(@Param("limit") Integer limit);

    /**
     * 增加热词搜索次数
     * @param word 热词
     * @return 影响行数
     */
    int incrementSearchCount(@Param("word") String word);

    /**
     * 根据关键词获取热词
     * @param word 关键词
     * @return 热词对象
     */
    ProductHotWord getByWord(@Param("word") String word);
}