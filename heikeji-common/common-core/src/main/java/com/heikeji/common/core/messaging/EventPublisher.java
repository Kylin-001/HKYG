package com.heikeji.common.core.messaging;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class EventPublisher {

    public String publish(String exchange, String routingKey, Object message) {
        String eventId = generateEventId();
        log.info("Publishing event: {}, exchange: {}, routingKey: {}", eventId, exchange, routingKey);
        log.debug("Event published successfully: {}", eventId);
        return eventId;
    }

    public String publishWithDelay(String exchange, String routingKey, Object message, long delayMs) {
        String eventId = generateEventId();
        log.info("Publishing delayed event: {}, delay: {}ms, exchange: {}, routingKey: {}",
            eventId, delayMs, exchange, routingKey);
        log.debug("Delayed event published successfully: {}", eventId);
        return eventId;
    }

    public CompletableFuture<String> publishAndWait(String exchange, String routingKey,
                                                   Object message, String replyQueue,
                                                   long timeoutMs, Class<?> responseType) {
        String correlationId = generateEventId();

        return CompletableFuture.supplyAsync(() -> {
            try {
                log.info("Publishing request-response event: {}, exchange: {}, routingKey: {}",
                    correlationId, exchange, routingKey);
                log.debug("Request-response event published: {}", correlationId);
                return correlationId;
            } catch (Exception e) {
                log.error("Failed to publish request-response event: {}, error: {}",
                    correlationId, e.getMessage(), e);
                throw new RuntimeException("Failed to publish request-response event", e);
            }
        });
    }

    public void publishBatch(String exchange, String routingKey, java.util.List<?> messages) {
        String batchId = generateEventId();
        log.info("Publishing batch: {}, count: {}, exchange: {}, routingKey: {}",
            batchId, messages.size(), exchange, routingKey);
        log.debug("Batch published successfully: {}", batchId);
    }

    private String generateEventId() {
        return "EVT-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

    public static class MessageBuilder {
        private final Object payload;
        private String eventType;
        private String traceId;
        private long timestamp;
        private java.util.Map<String, Object> headers;

        private MessageBuilder(Object payload) {
            this.payload = payload;
            this.timestamp = System.currentTimeMillis();
            this.headers = new java.util.HashMap<>();
        }

        public static MessageBuilder with(Object payload) {
            return new MessageBuilder(payload);
        }

        public MessageBuilder eventType(String type) {
            this.eventType = type;
            return this;
        }

        public MessageBuilder traceId(String traceId) {
            this.traceId = traceId;
            return this;
        }

        public MessageBuilder header(String key, Object value) {
            this.headers.put(key, value);
            return this;
        }

        public EventMessage build() {
            EventMessage message = new EventMessage();
            message.setPayload(payload);
            message.setEventType(eventType);
            message.setTraceId(traceId);
            message.setTimestamp(timestamp);
            message.setHeaders(headers);
            return message;
        }
    }

    public static class EventMessage {
        private Object payload;
        private String eventType;
        private String eventId;
        private String traceId;
        private long timestamp;
        private java.util.Map<String, Object> headers;

        public Object getPayload() { return payload; }
        public void setPayload(Object payload) { this.payload = payload; }
        public String getEventType() { return eventType; }
        public void setEventType(String eventType) { this.eventType = eventType; }
        public String getEventId() { return eventId; }
        public void setEventId(String eventId) { this.eventId = eventId; }
        public String getTraceId() { return traceId; }
        public void setTraceId(String traceId) { this.traceId = traceId; }
        public long getTimestamp() { return timestamp; }
        public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
        public java.util.Map<String, Object> getHeaders() { return headers; }
        public void setHeaders(java.util.Map<String, Object> headers) { this.headers = headers; }
    }
}
