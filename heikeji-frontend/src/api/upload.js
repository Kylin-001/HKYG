import request from '@/utils/request'

// 文件上传相关API - 使用FileController

// 单文件上传
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/api/file/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 批量文件上传
export function batchUploadFiles(files) {
  const formData = new FormData()
  // 将多个文件添加到formData中
  files.forEach(file => {
    formData.append('files', file)
  })

  return request({
    url: '/api/file/batchUpload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 上传头像
export function uploadAvatar(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/api/file/avatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
