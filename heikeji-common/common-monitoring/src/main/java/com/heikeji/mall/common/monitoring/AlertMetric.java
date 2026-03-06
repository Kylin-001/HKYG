package com.heikeji.mall.common.monitoring;

import lombok.Data;

@Data
public class AlertMetric {
    private String type;
    private String message;
    private String level;
    private long timestamp;
    private boolean resolved;
}
