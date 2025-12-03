package com.heikeji.system.websocket;

import com.heikeji.system.utils.LogUtils;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * WebSocket服务端
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@ServerEndpoint("/websocket/{userId}")
@Component
public class WebSocketServer {

    private static final Logger logger = LogUtils.getLogger(WebSocketServer.class);
    
    // 静态变量，用来记录当前在线连接数
    private static final AtomicInteger ONLINE_COUNT = new AtomicInteger(0);
    
    // concurrent包的线程安全Set，用来存放每个客户端对应的WebSocket对象
    private static final Map<String, WebSocketServer> WEB_SOCKET_MAP = new ConcurrentHashMap<>();
    
    // 与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;
    
    // 接收userId
    private String userId = "";

    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("userId") String userId) {
        this.session = session;
        this.userId = userId;
        
        // 加入map中
        WEB_SOCKET_MAP.put(userId, this);
        
        // 在线数加1
        ONLINE_COUNT.incrementAndGet();
        
        LogUtils.info(logger, "用户连接: {}, 当前在线人数为 {}", userId, ONLINE_COUNT.get());
        
        try {
            sendMessage("连接成功");
        } catch (IOException e) {
            LogUtils.error(logger, "用户: {}, 网络异常", userId);
        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        // 从map中删除
        WEB_SOCKET_MAP.remove(userId);
        
        // 在线数减1
        ONLINE_COUNT.decrementAndGet();
        
        LogUtils.info(logger, "用户退出: {}, 当前在线人数为 {}", userId, ONLINE_COUNT.get());
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     */
    @OnMessage
    public void onMessage(String message, Session session) {
        LogUtils.info(logger, "收到用户消息: {}, 消息内容: {}", userId, message);
        
        // 群发消息
        if (message.startsWith("broadcast:")) {
            String broadcastMessage = message.substring(10);
            sendToAll(broadcastMessage);
        } else {
            // 单聊消息
            try {
                this.sendMessage("收到消息: " + message);
            } catch (IOException e) {
                LogUtils.error(logger, "发送消息失败 {}", e.getMessage());
            }
        }
    }

    /**
     * 发生错误时调用
     */
    @OnError
    public void onError(Session session, Throwable error) {
        LogUtils.error(logger, "用户错误: {}, 错误信息: {}", userId, error.getMessage(), error);
    }

    /**
     * 发送消息
     */
    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    /**
     * 发送消息给指定用户
     */
    public static boolean sendToUser(String userId, String message) {
        LogUtils.info(logger, "发送消息到用户: {}, 消息内容: {}", userId, message);
        WebSocketServer webSocket = WEB_SOCKET_MAP.get(userId);
        if (webSocket != null) {
            try {
                webSocket.sendMessage(message);
                return true;
            } catch (IOException e) {
                LogUtils.error(logger, "发送消息到用户: {} 失败: {}", userId, e.getMessage());
                return false;
            }
        }
        LogUtils.warn(logger, "用户: {} 不在线", userId);
        return false;
    }

    /**
     * 发送消息给所有用户
     */
    public static void sendToAll(String message) {
        LogUtils.info(logger, "广播消息: {}", message);
        for (WebSocketServer webSocket : WEB_SOCKET_MAP.values()) {
            try {
                webSocket.sendMessage(message);
            } catch (IOException e) {
                LogUtils.error(logger, "广播消息失败: {}", e.getMessage());
            }
        }
    }

    /**
     * 获取在线人数
     */
    public static int getOnlineCount() {
        return ONLINE_COUNT.get();
    }

    /**
     * 获取在线用户列表
     */
    public static Set<String> getOnlineUsers() {
        return WEB_SOCKET_MAP.keySet();
    }

    /**
     * 判断用户是否在线
     */
    public static boolean isUserOnline(String userId) {
        return WEB_SOCKET_MAP.containsKey(userId);
    }
}
