package com.heikeji.mall.user.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * 学生数据生成器
 * 用于批量生成学生账号的 SQL 插入语句
 *
 * 学号格式：202202xxxx
 * 初始密码：auth123456
 */
public class StudentDataGenerator {

    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private static final String DEFAULT_PASSWORD = "auth123456";
    private static final String ENCRYPTED_PASSWORD = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO";

    private static final List<String> COLLEGES = Arrays.asList(
        "计算机科学与技术学院",
        "经济管理学院",
        "机械工程学院",
        "电气与控制工程学院",
        "材料科学与工程学院",
        "建筑工程学院",
        "外国语学院",
        "理学院",
        "人文社会科学学院",
        "马克思主义学院"
    );

    private static final List<String> MAJORS = Arrays.asList(
        "软件工程", "计算机科学与技术", "网络工程", "信息安全", "物联网工程",
        "工商管理", "会计学", "市场营销", "金融学", "国际经济与贸易",
        "机械设计制造及其自动化", "机械电子工程", "车辆工程",
        "电气工程及其自动化", "自动化", "测控技术与仪器",
        "材料成型及控制工程", "金属材料工程", "无机非金属材料工程",
        "土木工程", "建筑学", "工程管理",
        "英语", "日语", "俄语",
        "数学与应用数学", "信息与计算科学", "应用物理学",
        "法学", "社会工作", "汉语言文学"
    );

    private static final List<String> GRADES = Arrays.asList("2022级", "2023级", "2024级");
    private static final List<String> GENDERS = Arrays.asList("男", "女");

    private static final Random random = new Random();

    /**
     * 生成学生数据 SQL 文件
     *
     * @param startNum 起始学号后缀（如 1 表示 2022020001）
     * @param count    生成数量
     * @param outputFile 输出文件路径
     */
    public static void generateStudentSQL(int startNum, int count, String outputFile) throws IOException {
        try (PrintWriter writer = new PrintWriter(new FileWriter(outputFile))) {
            writer.println("-- 批量插入学生数据");
            writer.println("-- 生成时间: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            writer.println("-- 学号范围: 202202" + String.format("%04d", startNum) + " - 202202" + String.format("%04d", startNum + count - 1));
            writer.println("-- 初始密码: " + DEFAULT_PASSWORD);
            writer.println("-- 密码已使用 BCrypt 加密");
            writer.println();
            writer.println("INSERT INTO `user` (");
            writer.println("    `username`,");
            writer.println("    `password`,");
            writer.println("    `nickname`,");
            writer.println("    `student_id`,");
            writer.println("    `phone`,");
            writer.println("    `email`,");
            writer.println("    `gender`,");
            writer.println("    `status`,");
            writer.println("    `user_type`,");
            writer.println("    `points`,");
            writer.println("    `balance`,");
            writer.println("    `credit_score`,");
            writer.println("    `college`,");
            writer.println("    `major`,");
            writer.println("    `grade`,");
            writer.println("    `create_time`,");
            writer.println("    `update_time`,");
            writer.println("    `deleted`");
            writer.println(") VALUES");

            for (int i = 0; i < count; i++) {
                int studentNum = startNum + i;
                String studentId = String.format("202202%04d", studentNum);
                String username = studentId;
                String nickname = "学生" + String.format("%04d", studentNum);
                String phone = generatePhone(studentNum);
                String email = studentId + "@usth.edu.cn";
                String gender = GENDERS.get(random.nextInt(GENDERS.size()));
                String college = COLLEGES.get(random.nextInt(COLLEGES.size()));
                String major = MAJORS.get(random.nextInt(MAJORS.size()));
                String grade = GRADES.get(random.nextInt(GRADES.size()));

                writer.print("('");
                writer.print(username);
                writer.print("', '");
                writer.print(ENCRYPTED_PASSWORD);
                writer.print("', '");
                writer.print(nickname);
                writer.print("', '");
                writer.print(studentId);
                writer.print("', '");
                writer.print(phone);
                writer.print("', '");
                writer.print(email);
                writer.print("', '");
                writer.print(gender);
                writer.print("', 1, 0, 0, 0.00, 5.00, '");
                writer.print(college);
                writer.print("', '");
                writer.print(major);
                writer.print("', '");
                writer.print(grade);
                writer.print("', NOW(), NOW(), 0)");

                if (i < count - 1) {
                    writer.println(",");
                } else {
                    writer.println(";");
                }
            }

            writer.println();
            writer.println("-- 共生成 " + count + " 条学生记录");
        }

        System.out.println("SQL 文件已生成: " + outputFile);
        System.out.println("学号范围: 202202" + String.format("%04d", startNum) + " - 202202" + String.format("%04d", startNum + count - 1));
        System.out.println("初始密码: " + DEFAULT_PASSWORD);
    }

    /**
     * 生成手机号
     */
    private static String generatePhone(int seed) {
        // 使用 138 开头，后面用学号后缀填充
        return String.format("138%08d", seed % 100000000);
    }

    /**
     * 生成加密密码
     */
    public static String encryptPassword(String password) {
        return passwordEncoder.encode(password);
    }

    /**
     * 主方法 - 生成学生数据
     */
    public static void main(String[] args) throws IOException {
        // 生成 100 个学生，学号从 2022020001 开始
        String outputPath = "src/main/resources/db/migration/V2024__Insert_Students_Batch_Generated.sql";
        generateStudentSQL(1, 100, outputPath);

        System.out.println("\n生成的密码哈希值（用于验证）:");
        System.out.println("auth123456 -> " + encryptPassword("auth123456"));
    }
}
