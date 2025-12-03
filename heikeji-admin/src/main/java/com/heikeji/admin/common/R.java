package com.heikeji.admin.common;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * 响应结果封装类
 */
public class R extends HashMap<String, Object> implements Serializable {
    private static final long serialVersionUID = 1L;

    public R() {
        put("code", 0);
        put("msg", "success");
    }

    public static R error() {
        return error(500, "服务器错误");
    }

    public static R error(String msg) {
        return error(500, msg);
    }

    public static R error(int code, String msg) {
        R r = new R();
        r.put("code", code);
        r.put("msg", msg);
        return r;
    }

    public static R ok() {
        return new R();
    }

    public static R ok(String msg) {
        R r = new R();
        r.put("msg", msg);
        return r;
    }

    public static R ok(Map<String, Object> map) {
        R r = new R();
        r.putAll(map);
        return r;
    }

    @Override
    public R put(String key, Object value) {
        super.put(key, value);
        return this;
    }

    public R data(Object data) {
        super.put("data", data);
        return this;
    }

    public R count(Long count) {
        super.put("count", count);
        return this;
    }

    public R rows(Object rows) {
        super.put("rows", rows);
        return this;
    }
}
