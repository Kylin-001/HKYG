package com.heikeji.mall.lostfound.util;

import com.heikeji.mall.lostfound.entity.LostFound;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class LostFoundMatcher {

    private final List<LostFound> lostItems = new ArrayList<>();
    private final List<LostFound> foundItems = new ArrayList<>();

    private static final Map<String, Double> WEIGHTS = Map.of(
            "category", 0.3,
            "name", 0.25,
            "color", 0.15,
            "location", 0.15,
            "time", 0.1,
            "description", 0.05
    );

    public void addLostItem(LostFound item) {
        if ("lost".equals(item.getType())) {
            lostItems.add(item);
        }
    }

    public void addFoundItem(LostFound item) {
        if ("found".equals(item.getType())) {
            foundItems.add(item);
        }
    }

    public List<MatchResult> findMatches(LostFound lostItem, double threshold) {
        List<MatchResult> matches = new ArrayList<>();
        
        foundItems.forEach(foundItem -> {
            double similarity = calculateSimilarity(lostItem, foundItem);
            if (similarity >= threshold) {
                matches.add(new MatchResult(foundItem, similarity));
            }
        });

        return matches.stream()
                .sorted((a, b) -> Double.compare(b.similarity, a.similarity))
                .collect(Collectors.toList());
    }

    public List<BatchMatchResult> batchMatch(double threshold) {
        List<BatchMatchResult> allMatches = new ArrayList<>();
        
        lostItems.forEach(lostItem -> {
            List<MatchResult> matches = findMatches(lostItem, threshold);
            if (!matches.isEmpty()) {
                allMatches.add(new BatchMatchResult(lostItem, matches));
            }
        });
        
        return allMatches;
    }

    public double calculateSimilarity(LostFound item1, LostFound item2) {
        double score = 0.0;

        if (item1.getCategoryId() != null && item1.getCategoryId().equals(item2.getCategoryId())) {
            score += WEIGHTS.get("category");
        }

        double nameSimilarity = calculateTextSimilarity(item1.getItemName(), item2.getItemName());
        score += nameSimilarity * WEIGHTS.get("name");

        if (item1.getColor() != null && item1.getColor().equals(item2.getColor())) {
            score += WEIGHTS.get("color");
        }

        double locationSimilarity = calculateLocationSimilarity(item1.getLocation(), item2.getLocation());
        score += locationSimilarity * WEIGHTS.get("location");

        double timeSimilarity = calculateTimeSimilarity(item1.getLostTime(), item2.getLostTime());
        score += timeSimilarity * WEIGHTS.get("time");

        double descSimilarity = calculateTextSimilarity(
                item1.getDescription() != null ? item1.getDescription() : "",
                item2.getDescription() != null ? item2.getDescription() : ""
        );
        score += descSimilarity * WEIGHTS.get("description");

        return score;
    }

    private double calculateTextSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null || text1.isEmpty() || text2.isEmpty()) {
            return 0.0;
        }

        Set<String> words1 = new HashSet<>(Arrays.asList(text1.toLowerCase().split("\\s+")));
        Set<String> words2 = new HashSet<>(Arrays.asList(text2.toLowerCase().split("\\s+")));

        Set<String> commonWords = new HashSet<>(words1);
        commonWords.retainAll(words2);

        Set<String> allWords = new HashSet<>(words1);
        allWords.addAll(words2);

        return allWords.isEmpty() ? 0.0 : (double) commonWords.size() / allWords.size();
    }

    private double calculateLocationSimilarity(String loc1, String loc2) {
        if (loc1 == null || loc2 == null || loc1.isEmpty() || loc2.isEmpty()) {
            return 0.0;
        }

        if (loc1.equals(loc2)) {
            return 1.0;
        }

        if (loc1.contains(loc2) || loc2.contains(loc1)) {
            return 0.5;
        }

        return 0.0;
    }

    private double calculateTimeSimilarity(Date time1, Date time2) {
        if (time1 == null || time2 == null) {
            return 0.0;
        }

        long diff = Math.abs(time1.getTime() - time2.getTime());
        long maxDiff = 7 * 24 * 60 * 60 * 1000L;

        return Math.max(0.0, 1.0 - (double) diff / maxDiff);
    }

    public void clear() {
        lostItems.clear();
        foundItems.clear();
    }

    public static class MatchResult {
        private final LostFound item;
        private final double similarity;

        public MatchResult(LostFound item, double similarity) {
            this.item = item;
            this.similarity = similarity;
        }

        public LostFound getItem() {
            return item;
        }

        public double getSimilarity() {
            return similarity;
        }
    }

    public static class BatchMatchResult {
        private final LostFound lostItem;
        private final List<MatchResult> matches;

        public BatchMatchResult(LostFound lostItem, List<MatchResult> matches) {
            this.lostItem = lostItem;
            this.matches = matches;
        }

        public LostFound getLostItem() {
            return lostItem;
        }

        public List<MatchResult> getMatches() {
            return matches;
        }
    }
}
