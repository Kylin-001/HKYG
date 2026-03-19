package com.heikeji.common.core.fallback;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

@Slf4j
@Component
public class ServiceFallbackFactory {

    private final FallbackCache fallbackCache;

    public ServiceFallbackFactory(FallbackCache fallbackCache) {
        this.fallbackCache = fallbackCache;
    }

    public <T> T executeWithFallback(String serviceName, Supplier<T> action, Supplier<T> fallback) {
        return executeWithFallback(serviceName, "default", action, fallback);
    }

    public <T> T executeWithFallback(String serviceName, String methodName,
                                     Supplier<T> action, Supplier<T> fallback) {
        long startTime = System.currentTimeMillis();
        String fallbackKey = serviceName + ":" + methodName;

        try {
            T result = action.get();
            log.debug("Service call succeeded: {}", fallbackKey);
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.warn("Service call failed: {}, duration: {}ms, error: {}",
                fallbackKey, duration, e.getMessage());

            T cachedFallback = fallbackCache.get(fallbackKey);
            if (cachedFallback != null) {
                log.info("Returning cached fallback for: {}", fallbackKey);
                return cachedFallback;
            }

            if (fallback != null) {
                try {
                    T fallbackResult = fallback.get();
                    fallbackCache.put(fallbackKey, fallbackResult);
                    return fallbackResult;
                } catch (Exception fallbackError) {
                    log.error("Fallback execution failed: {}", fallbackKey, fallbackError);
                }
            }

            throw new ServiceUnavailableException(
                "Service unavailable: " + serviceName, serviceName, e);
        }
    }

    public <T> T executeWithDefaultValue(String serviceName, Supplier<T> action, T defaultValue) {
        return executeWithFallback(serviceName, action, () -> defaultValue);
    }

    public void executeWithFallbackVoid(String serviceName, Runnable action, Runnable fallback) {
        try {
            action.run();
        } catch (Exception e) {
            log.warn("Service call failed (void): {}, error: {}", serviceName, e.getMessage());
            if (fallback != null) {
                try {
                    fallback.run();
                } catch (Exception fallbackError) {
                    log.error("Fallback execution failed (void): {}", serviceName, fallbackError);
                }
            }
        }
    }

    public static class ServiceUnavailableException extends RuntimeException {
        private final String serviceName;

        public ServiceUnavailableException(String message, String serviceName, Throwable cause) {
            super(message, cause);
            this.serviceName = serviceName;
        }

        public String getServiceName() {
            return serviceName;
        }
    }

    @Component
    public static class FallbackCache {
        private final Map<String, CachedValue> cache = new HashMap<>();
        private static final long CACHE_TTL_MS = 30000;

        public <T> void put(String key, T value) {
            cache.put(key, new CachedValue(value, System.currentTimeMillis() + CACHE_TTL_MS));
        }

        @SuppressWarnings("unchecked")
        public <T> T get(String key) {
            CachedValue cached = cache.get(key);
            if (cached == null) {
                return null;
            }
            if (System.currentTimeMillis() > cached.expireTime) {
                cache.remove(key);
                return null;
            }
            return (T) cached.value;
        }

        public void invalidate(String key) {
            cache.remove(key);
        }

        public void invalidateAll() {
            cache.clear();
        }

        private static class CachedValue {
            final Object value;
            final long expireTime;

            CachedValue(Object value, long expireTime) {
                this.value = value;
                this.expireTime = expireTime;
            }
        }
    }
}
