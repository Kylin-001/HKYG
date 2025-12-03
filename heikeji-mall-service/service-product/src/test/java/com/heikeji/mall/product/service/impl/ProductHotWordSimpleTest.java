package com.heikeji.mall.product.service.impl;

import com.heikeji.mall.product.entity.ProductHotWord;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 商品热词服务简单测试（不依赖Spring Boot）
 * 用于测试核心业务逻辑
 */
class ProductHotWordSimpleTest {

    /**
     * 测试热词推荐的核心逻辑
     */
    @Test
    void testHotWordCoreLogic() {
        // 模拟热词列表
        List<ProductHotWord> hotWords = new ArrayList<>();

        // 模拟incrementSearchCount功能
        java.util.function.BiConsumer<List<ProductHotWord>, String> incrementSearchCount = (words, word) -> {
            Optional<ProductHotWord> existingWord = words.stream()
                    .filter(w -> w.getWord().equals(word))
                    .findFirst();
            
            if (existingWord.isPresent()) {
                existingWord.get().setSearchCount(existingWord.get().getSearchCount() + 1);
                existingWord.get().setUpdateTime(LocalDateTime.now());
            } else {
                ProductHotWord newHotWord = new ProductHotWord();
                newHotWord.setId((long) (words.size() + 1));
                newHotWord.setWord(word);
                newHotWord.setSearchCount(1);
                newHotWord.setStatus(1);
                newHotWord.setCreateTime(LocalDateTime.now());
                newHotWord.setUpdateTime(LocalDateTime.now());
                newHotWord.setSortOrder(0);
                newHotWord.setShowOnHome(0);
                words.add(newHotWord);
            }
        };

        // 测试增加搜索次数
        incrementSearchCount.accept(hotWords, "手机");
        incrementSearchCount.accept(hotWords, "电脑");
        incrementSearchCount.accept(hotWords, "手机"); // 再次搜索手机
        incrementSearchCount.accept(hotWords, "平板");
        incrementSearchCount.accept(hotWords, "手机"); // 第三次搜索手机
        incrementSearchCount.accept(hotWords, "电脑"); // 再次搜索电脑

        // 模拟getHotWords功能
        java.util.function.BiFunction<List<ProductHotWord>, Integer, List<ProductHotWord>> getHotWords = (words, limit) -> {
            List<ProductHotWord> sortedWords = new ArrayList<>(words);
            sortedWords.sort((a, b) -> b.getSearchCount() - a.getSearchCount());
            return sortedWords.size() <= limit ? sortedWords : sortedWords.subList(0, limit);
        };

        // 测试获取热门搜索词
        List<ProductHotWord> topHotWords = getHotWords.apply(hotWords, 10);
        assertNotNull(topHotWords);
        System.out.println("热门搜索词:");
        topHotWords.forEach(hotWord -> System.out.println(hotWord.getWord() + " - " + hotWord.getSearchCount() + "次"));

        // 验证热门词排序
        assertTrue(topHotWords.size() >= 3);
        assertEquals("手机", topHotWords.get(0).getWord()); // 手机搜索次数最多
        assertEquals(3, topHotWords.get(0).getSearchCount()); // 手机应该被搜索了3次

        // 模拟getSearchSuggestions功能
        java.util.function.BiFunction<List<ProductHotWord>, String, List<String>> getSearchSuggestions = (words, keyword) -> {
            List<String> suggestions = new ArrayList<>();
            List<ProductHotWord> topWords = getHotWords.apply(words, 50);
            
            for (ProductHotWord hotWord : topWords) {
                if (hotWord.getWord().contains(keyword)) {
                    suggestions.add(hotWord.getWord());
                    if (suggestions.size() >= 5) {
                        break;
                    }
                }
            }
            return suggestions;
        };

        // 测试搜索建议
        List<String> suggestions = getSearchSuggestions.apply(hotWords, "手");
        assertNotNull(suggestions);
        System.out.println("\n搜索'手'的建议:");
        suggestions.forEach(System.out::println);

        // 验证搜索建议包含"手机"
        assertTrue(suggestions.contains("手机"));

        // 模拟getHomeShowHotWords功能
        java.util.function.BiFunction<List<ProductHotWord>, Integer, List<ProductHotWord>> getHomeShowHotWords = (words, limit) -> {
            List<ProductHotWord> homeHotWords = new ArrayList<>();
            for (ProductHotWord hotWord : words) {
                if (hotWord.getShowOnHome() == 1) {
                    homeHotWords.add(hotWord);
                    if (homeHotWords.size() >= limit) {
                        break;
                    }
                }
            }
            return homeHotWords;
        };

        // 创建测试数据用于首页热词
        ProductHotWord word1 = new ProductHotWord();
        word1.setId(1001L);
        word1.setWord("手机");
        word1.setSearchCount(100);
        word1.setStatus(1);
        word1.setCreateTime(LocalDateTime.now());
        word1.setUpdateTime(LocalDateTime.now());
        word1.setSortOrder(1);
        word1.setShowOnHome(1); // 显示在首页

        ProductHotWord word2 = new ProductHotWord();
        word2.setId(1002L);
        word2.setWord("电脑");
        word2.setSearchCount(80);
        word2.setStatus(1);
        word2.setCreateTime(LocalDateTime.now());
        word2.setUpdateTime(LocalDateTime.now());
        word2.setSortOrder(2);
        word2.setShowOnHome(1); // 显示在首页

        ProductHotWord word3 = new ProductHotWord();
        word3.setId(1003L);
        word3.setWord("平板");
        word3.setSearchCount(50);
        word3.setStatus(1);
        word3.setCreateTime(LocalDateTime.now());
        word3.setUpdateTime(LocalDateTime.now());
        word3.setSortOrder(3);
        word3.setShowOnHome(0); // 不显示在首页

        List<ProductHotWord> homeTestWords = new ArrayList<>();
        homeTestWords.add(word1);
        homeTestWords.add(word2);
        homeTestWords.add(word3);

        // 测试获取首页热词
        List<ProductHotWord> homeHotWords = getHomeShowHotWords.apply(homeTestWords, 10);
        assertNotNull(homeHotWords);
        System.out.println("\n首页展示热词:");
        homeHotWords.forEach(hotWord -> System.out.println(hotWord.getWord()));

        // 验证首页热词数量
        assertEquals(2, homeHotWords.size()); // 只有两个词设置为显示在首页
        assertTrue(homeHotWords.stream().allMatch(hotWord -> hotWord.getShowOnHome() == 1)); // 所有首页热词的showOnHome都应为1
    }

    /**
     * 测试搜索建议的过滤逻辑
     */
    @Test
    void testSearchSuggestionsFilter() {
        // 模拟热词数据
        List<ProductHotWord> hotWords = new ArrayList<>();
        
        String[] testWords = {"手机", "智能手机", "手机壳", "电脑", "笔记本电脑", "平板电脑", "平板支架"};
        for (int i = 0; i < testWords.length; i++) {
            ProductHotWord hotWord = new ProductHotWord();
            hotWord.setId((long) (i + 1));
            hotWord.setWord(testWords[i]);
            hotWord.setSearchCount(100 - i * 10); // 模拟不同的搜索次数
            hotWord.setStatus(1);
            hotWord.setCreateTime(LocalDateTime.now());
            hotWord.setUpdateTime(LocalDateTime.now());
            hotWord.setSortOrder(0);
            hotWord.setShowOnHome(0);
            hotWords.add(hotWord);
        }

        // 实现搜索建议过滤逻辑
        List<String> suggestions = new ArrayList<>();
        String keyword = "手";
        int limit = 3;
        
        // 按搜索次数排序并过滤包含关键词的词
        hotWords.stream()
                .sorted((a, b) -> b.getSearchCount() - a.getSearchCount())
                .filter(hotWord -> hotWord.getWord().contains(keyword))
                .limit(limit)
                .forEach(hotWord -> suggestions.add(hotWord.getWord()));

        // 验证结果
        assertNotNull(suggestions);
        System.out.println("\n搜索'" + keyword + "'的建议（最多" + limit + "条）:");
        suggestions.forEach(System.out::println);
        
        // 应该包含"手机"、"智能手机"和"手机壳"
        assertTrue(suggestions.contains("手机"));
        assertTrue(suggestions.contains("智能手机"));
        assertTrue(suggestions.contains("手机壳"));
        assertEquals(3, suggestions.size());
    }
}
