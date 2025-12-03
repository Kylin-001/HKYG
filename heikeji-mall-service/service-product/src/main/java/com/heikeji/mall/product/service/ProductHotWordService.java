package com.heikeji.mall.product.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.product.entity.ProductHotWord;

import java.util.List;

/**
 * 商品热词Service接口
 */
public interface ProductHotWordService extends IService<ProductHotWord> {

    /**
     * 获取热门搜索词列表
     * @param limit 限制数量
     * @return 热门搜索词列表
     */
    List<ProductHotWord> getHotWords(Integer limit);

    /**
     * 获取首页展示的热词
     * @param limit 限制数量
     * @return 首页展示的热词列表
     */
    List<ProductHotWord> getHomeShowHotWords(Integer limit);

    /**
     * 增加热词搜索次数
     * @param word 热词
     */
    void incrementSearchCount(String word);

    /**
     * 获取搜索建议（根据关键词前缀匹配）
     * @param keyword 关键词
     * @param limit 限制数量
     * @return 搜索建议列表
     */
    List<String> getSearchSuggestions(String keyword, Integer limit);
}
