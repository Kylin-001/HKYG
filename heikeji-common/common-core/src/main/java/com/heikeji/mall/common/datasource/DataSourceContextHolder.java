package com.heikeji.mall.common.datasource;

/**
 * 数据源上下文持有者
 *
 * 管理当前线程的数据源类型，
 * 配合@Transactional的readOnly属性自动切换。
 *
 * 使用示例：
 * <pre>
 * // 写操作 - 自动使用主库
 * @Transactional
 * public void insertUser(User user) { ... }
 *
 * // 读操作 - 自动使用从库
 * @Transactional(readOnly = true)
 * public User getUser(Long id) { ... }
 *
 * // 手动控制
 * DataSourceContextHolder.forceMaster(); // 强制主库
 * User user = userRepository.findById(id);
 * DataSourceContextHolder.clear(); // 清除上下文
 * </pre>
 */
public class DataSourceContextHolder {

    private static final ThreadLocal<ReadWriteSplitRoutingDataSource.DataSourceType> contextHolder =
            new ThreadLocal<>();

    public static void setMaster() {
        contextHolder.set(ReadWriteSplitRoutingDataSource.DataSourceType.MASTER);
    }

    public static void setSlave() {
        contextHolder.set(ReadWriteSplitRoutingDataSource.DataSourceType.SLAVE);
    }

    public static void forceMaster() {
        setMaster();
    }

    public static void clear() {
        contextHolder.remove();
    }

    public static ReadWriteSplitRoutingDataSource.DataSourceType get() {
        return contextHolder.get();
    }

    public static boolean isMaster() {
        return get() == ReadWriteSplitRoutingDataSource.DataSourceType.MASTER;
    }

    public static boolean isSlave() {
        return get() == ReadWriteSplitRoutingDataSource.DataSourceType.SLAVE;
    }
}
