package com.heikeji.mall.product.service.impl;

import com.heikeji.mall.product.entity.ProductHotWord;
import com.heikeji.mall.product.service.ProductHotWordService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 商品热词服务实现类测试
 */
@SpringBootTest
class ProductHotWordServiceImplTest {

    @Resource
    private ProductHotWordService productHotWordService;

    /**
     * 测试获取热门搜索词
     */
    @Test
    void testGetHotWords() {
        List<ProductHotWord> hotWords = productHotWordService.getHotWords(10);
        assertNotNull(hotWords, "热门搜索词列表不应为空");
        System.out.println("热门搜索词数量: " + hotWords.size());
        hotWords.forEach(hotWord -> System.out.println("热门词: " + hotWord.getWord() + ", 搜索次数: " + hotWord.getSearchCount()));
    }

    /**
     * 测试获取首页展示热词
     */
    @Test
    void testGetHomeShowHotWords() {
        List<ProductHotWord> homeHotWords = productHotWordService.getHomeShowHotWords(8);
        assertNotNull(homeHotWords, "首页展示热词列表不应为空");
        System.out.println("首页展示热词数量: " + homeHotWords.size());
        homeHotWords.forEach(hotWord -> System.out.println("首页热词: " + hotWord.getWord() + ", 搜索次数: " + hotWord.getSearchCount()));
    }

    /**
     * 测试增加搜索次数
     */
    @Test
    void testIncrementSearchCount() {
        String testWord = "测试热词";
        
        // 增加搜索次数
        productHotWordService.incrementSearchCount(testWord);
        System.out.println("已增加热词 '" + testWord + "' 的搜索次数");
        
        // 验证搜索次数是否增加
        testWord = "测试热词";
        productHotWordService.incrementSearchCount(testWord);
        System.out.println("已再次增加热词 '" + testWord + "' 的搜索次数");
    }

    /**
     * 测试获取搜索建议
     */
    @Test
    void testGetSearchSuggestions() {
        String keyword = "测试";
        List<String> suggestions = productHotWordService.getSearchSuggestions(keyword, 5);
        assertNotNull(suggestions, "搜索建议列表不应为空");
        System.out.println("搜索建议数量: " + suggestions.size());
        suggestions.forEach(suggestion -> System.out.println("搜索建议: " + suggestion));
    }
}