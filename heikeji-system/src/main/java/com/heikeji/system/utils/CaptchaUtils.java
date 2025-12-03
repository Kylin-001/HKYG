package com.heikeji.system.utils;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Random;

/**
 * 验证码工具类
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public class CaptchaUtils {

    private static final int WIDTH = 120;
    private static final int HEIGHT = 40;
    private static final int CODE_LENGTH = 4;
    private static final int LINES_COUNT = 5;
    private static final String CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    private static final Random RANDOM = new Random();

    /**
     * 生成验证码
     * @return 验证码对象
     */
    public static Captcha generateCaptcha() {
        String code = generateCode();
        BufferedImage image = generateImage(code);
        String base64Image = encodeImageToBase64(image);
        return new Captcha(code, base64Image);
    }

    /**
     * 生成验证码字符串
     */
    private static String generateCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < CODE_LENGTH; i++) {
            int index = RANDOM.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(index));
        }
        return sb.toString();
    }

    /**
     * 生成验证码图片
     */
    private static BufferedImage generateImage(String code) {
        BufferedImage image = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();

        // 设置背景色
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, WIDTH, HEIGHT);

        // 设置边框
        g.setColor(Color.LIGHT_GRAY);
        g.drawRect(0, 0, WIDTH - 1, HEIGHT - 1);

        // 添加干扰线
        for (int i = 0; i < LINES_COUNT; i++) {
            int x1 = RANDOM.nextInt(WIDTH);
            int y1 = RANDOM.nextInt(HEIGHT);
            int x2 = RANDOM.nextInt(WIDTH);
            int y2 = RANDOM.nextInt(HEIGHT);
            g.setColor(getRandomColor());
            g.drawLine(x1, y1, x2, y2);
        }

        // 添加噪点
        for (int i = 0; i < WIDTH * HEIGHT / 10; i++) {
            int x = RANDOM.nextInt(WIDTH);
            int y = RANDOM.nextInt(HEIGHT);
            g.setColor(getRandomColor());
            g.fillRect(x, y, 1, 1);
        }

        // 绘制验证码
        g.setFont(new Font("Arial", Font.BOLD, 28));
        for (int i = 0; i < code.length(); i++) {
            g.setColor(getRandomColor());
            g.drawString(String.valueOf(code.charAt(i)), 25 * i + 10, 30);
        }

        g.dispose();
        return image;
    }

    /**
     * 获取随机颜色
     */
    private static Color getRandomColor() {
        return new Color(RANDOM.nextInt(150), RANDOM.nextInt(150), RANDOM.nextInt(150));
    }

    /**
     * 将图片转换为Base64
     */
    private static String encodeImageToBase64(BufferedImage image) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            ImageIO.write(image, "png", baos);
            byte[] bytes = baos.toByteArray();
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(bytes);
        } catch (IOException e) {
            throw new RuntimeException("生成验证码图片失败", e);
        }
    }

    /**
     * 验证码实体类
     */
    public static class Captcha {
        private String code;
        private String image;

        public Captcha(String code, String image) {
            this.code = code;
            this.image = image;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }
    }

    /**
     * 验证输入的验证码是否正确
     * @param inputCode 用户输入的验证码
     * @param correctCode 正确的验证码
     * @return 是否正确
     */
    public static boolean validate(String inputCode, String correctCode) {
        if (inputCode == null || correctCode == null) {
            return false;
        }
        return inputCode.equalsIgnoreCase(correctCode);
    }
}
