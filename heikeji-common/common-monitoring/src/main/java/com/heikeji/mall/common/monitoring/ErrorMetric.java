package com.heikeji.mall.common.monitoring;

import lombok.Data;

@Data
public class ErrorMetric {
    private String errorType;
    private String errorMessage;
    private long timestamp;
    private int count;
}
