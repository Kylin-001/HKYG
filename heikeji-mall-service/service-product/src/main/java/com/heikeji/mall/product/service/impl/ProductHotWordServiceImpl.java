package com.heikeji.mall.product.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.product.entity.ProductHotWord;
import com.heikeji.mall.product.mapper.ProductHotWordMapper;
import com.heikeji.mall.product.service.ProductHotWordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 商品热词Service实现类
 */
@Service
public class ProductHotWordServiceImpl extends ServiceImpl<ProductHotWordMapper, ProductHotWord> implements ProductHotWordService {

    @Autowired
    private ProductHotWordMapper productHotWordMapper;

    @Override
    public List<ProductHotWord> getHotWords(Integer limit) {
        if (limit == null || limit <= 0) {
            limit = 10;
        }
        return productHotWordMapper.getHotWords(limit);
    }

    @Override
    public List<ProductHotWord> getHomeShowHotWords(Integer limit) {
        if (limit == null || limit <= 0) {
            limit = 10;
        }
        return productHotWordMapper.getHomeShowHotWords(limit);
    }

    @Override
    public void incrementSearchCount(String word) {
        if (!StringUtils.hasText(word)) {
            return;
        }

        // 先尝试增加搜索次数
        int result = productHotWordMapper.incrementSearchCount(word);
        
        // 如果没有找到该热词，则创建一个新的
        if (result == 0) {
            ProductHotWord hotWord = productHotWordMapper.getByWord(word);
            if (hotWord == null) {
                hotWord = new ProductHotWord();
                hotWord.setWord(word);
                hotWord.setSearchCount(1);
                hotWord.setStatus(1);
                hotWord.setCreateTime(LocalDateTime.now());
                hotWord.setUpdateTime(LocalDateTime.now());
                hotWord.setSortOrder(0);
                hotWord.setShowOnHome(0);
                this.save(hotWord);
            } else {
                // 如果存在但状态为禁用，则启用它
                if (hotWord.getStatus() == 0) {
                    hotWord.setStatus(1);
                    hotWord.setSearchCount(1);
                    hotWord.setUpdateTime(LocalDateTime.now());
                    this.updateById(hotWord);
                }
            }
        }
    }

    @Override
    public List<String> getSearchSuggestions(String keyword, Integer limit) {
        if (!StringUtils.hasText(keyword) || limit == null || limit <= 0) {
            return new ArrayList<>();
        }

        // 这里可以扩展实现更复杂的搜索建议逻辑
        // 例如：从Elasticsearch获取热门搜索建议，或者从数据库模糊匹配
        
        // 暂时从热门词中过滤包含关键词的词
        List<ProductHotWord> hotWords = productHotWordMapper.getHotWords(50);
        List<String> suggestions = new ArrayList<>();
        
        for (ProductHotWord hotWord : hotWords) {
            if (hotWord.getWord().contains(keyword)) {
                suggestions.add(hotWord.getWord());
                if (suggestions.size() >= limit) {
                    break;
                }
            }
        }
        
        return suggestions;
    }
}
