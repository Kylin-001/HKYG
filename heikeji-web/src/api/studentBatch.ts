import { post } from '@/utils/request'

/**
 * 批量添加学生
 */
export interface StudentBatchInsertDTO {
  username: string
  password: string
  studentNo: string
  nickname: string
  phone?: string
  email?: string
  sex?: number
  college?: string
  major?: string
  grade?: string
  status?: number
}

/**
 * 批量插入学生
 * @param students 学生列表
 */
export function batchInsertStudents(students: StudentBatchInsertDTO[]): Promise<{
  success: boolean
  message: string
  totalCount: number
  successCount: number
  failCount: number
  data: any[]
}> {
  return post('/admin/user/insert/batch', students)
}

/**
 * 单条插入学生
 * @param student 学生信息
 */
export function insertSingleStudent(student: StudentBatchInsertDTO): Promise<any> {
  return post('/admin/user/insert', student)
}

/**
 * 生成学生数据
 * @param startNum 起始学号后缀
 * @param count 数量
 * @param defaultPassword 默认密码
 */
export function generateStudents(
  startNum: number = 1,
  count: number = 100,
  defaultPassword: string = 'auth123456'
): StudentBatchInsertDTO[] {
  const colleges = [
    '计算机科学与技术学院',
    '经济管理学院',
    '机械工程学院',
    '电气与控制工程学院',
    '材料科学与工程学院',
    '建筑工程学院',
    '外国语学院',
    '理学院',
    '人文社会科学学院',
  ]

  const majors = [
    '软件工程',
    '计算机科学与技术',
    '网络工程',
    '信息安全',
    '物联网工程',
    '工商管理',
    '会计学',
    '市场营销',
    '金融学',
    '国际经济与贸易',
    '机械设计制造及其自动化',
    '机械电子工程',
    '车辆工程',
    '电气工程及其自动化',
    '自动化',
    '土木工程',
    '建筑学',
    '英语',
    '日语',
    '数学与应用数学',
  ]

  const grades = ['2022级', '2023级', '2024级']

  const students: StudentBatchInsertDTO[] = []

  for (let i = 0; i < count; i++) {
    const studentNum = startNum + i
    const studentId = `202202${String(studentNum).padStart(4, '0')}`
    const college = colleges[Math.floor(Math.random() * colleges.length)]
    const major = majors[Math.floor(Math.random() * majors.length)]
    const grade = grades[Math.floor(Math.random() * grades.length)]
    const sex = Math.random() > 0.5 ? 1 : 2

    students.push({
      username: studentId,
      password: defaultPassword,
      studentNo: studentId,
      nickname: `学生${String(studentNum).padStart(4, '0')}`,
      phone: `138${String(studentNum).padStart(8, '0')}`,
      email: `${studentId}@usth.edu.cn`,
      sex,
      college,
      major,
      grade,
      status: 0,
    })
  }

  return students
}
