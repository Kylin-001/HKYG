package com.heikeji.mall.common.monitoring;

import lombok.Data;

@Data
public class PerformanceMetric {
    private String endpoint;
    private long duration;
    private boolean success;
    private long timestamp;
    private int count;
}
