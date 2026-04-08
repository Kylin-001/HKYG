<template>
  <div class="publish-page" v-loading="submitting">
    <div class="max-w-screen-lg mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-text-primary">发布新帖子</h1>
        <el-button round @click="$router.back()">
          <el-icon><ArrowLeft /></el-icon>返回
        </el-button>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <el-form :model="form" label-position="top" ref="formRef" :rules="rules">
          <el-form-item label="选择版块" prop="boardId">
            <el-select v-model="form.boardId" placeholder="选择发布的版块" class="w-full" size="large">
              <el-option v-for="board in communityStore.boards" :key="board.id" :label="`${board.icon} ${board.name}`" :value="board.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入帖子标题（5-50字）" maxlength="50" show-word-limit size="large" />
          </el-form-item>

          <el-form-item label="内容" prop="content">
            <el-input v-model="form.content" type="textarea" :rows="10" placeholder="分享你的想法..." maxlength="5000" show-word-limit />
          </el-form-item>

          <el-form-item label="图片（可选）">
            <div class="image-upload-area border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition-colors" @click="triggerUpload">
              <div v-if="form.images.length === 0" class="py-8">
                <el-icon class="text-4xl text-gray-300"><Plus /></el-icon>
                <p class="mt-2 text-gray-400">点击上传图片</p>
                <p class="text-xs text-gray-300">支持 JPG/PNG，最多 9 张</p>
              </div>
              <div v-else class="grid grid-cols-3 gap-3">
                <div v-for="(img, idx) in form.images" :key="idx" class="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img :src="img" class="w-full h-full object-cover" />
                  <button class="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" @click.stop="removeImage(idx)">
                    <el-icon><Close /></el-icon>
                  </button>
                </div>
                <div v-if="form.images.length < 9" class="aspect-square rounded-lg border border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-400" @click="triggerUpload">
                  <el-icon class="text-2xl text-gray-300"><Plus /></el-icon>
                </div>
              </div>
            </div>
            <input ref="fileInput" type="file" accept="image/*" multiple hidden @change="handleFileChange" />
          </el-form-item>

          <el-form-item label="标签（可选）">
            <div class="flex gap-2 flex-wrap">
              <el-tag v-for="tag in form.tags" :key="tag" closable @close="removeTag(tag)" effect="plain" round>{{ tag }}</el-tag>
              <el-input
                v-if="tagInputVisible"
                ref="tagInputRef"
                v-model="tagInputValue"
                size="small"
                style="width: 100px"
                @keyup.enter="addTag"
                @blur="addTag"
              />
              <el-button v-else size="small" round @click="showTagInput">+ 添加标签</el-button>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="flex items-center gap-4">
              <el-checkbox v-model="form.isAnonymous">匿名发布</el-checkbox>
              <el-checkbox v-model="form.allowComment">允许评论</el-checkbox>
            </div>
          </el-form-item>
        </el-form>

        <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
          <el-button round size="large" @click="$router.back()">取消</el-button>
          <el-button type="primary" round size="large" :loading="submitting" @click="handleSubmit">
            发布帖子
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Plus, Close } from '@element-plus/icons-vue'
import { useCommunityStore } from '@/stores/community'

const router = useRouter()
const communityStore = useCommunityStore()
const submitting = ref(false)
const formRef = ref()
const fileInput = ref()
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref()

const form = reactive({
  boardId: '',
  title: '',
  content: '',
  images: [] as string[],
  tags: [] as string[],
  isAnonymous: false,
  allowComment: true,
})

const rules = {
  boardId: [{ required: true, message: '请选择版块', trigger: 'change' }],
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 5, max: 50, message: '标题长度在5-50个字符', trigger: 'blur' },
  ],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
}

onMounted(async () => {
  await communityStore.fetchBoards()
  const boardId = (router.currentRoute.value.query.board as string)
  if (boardId) form.boardId = boardId
})

function triggerUpload() { fileInput.value?.click() }

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  Array.from(input.files).forEach(file => {
    if (form.images.length >= 9) return
    const reader = new FileReader()
    reader.onload = () => { form.images.push(reader.result as string) }
    reader.readAsDataURL(file)
  })
  input.value = ''
}

function removeImage(idx: number) { form.images.splice(idx, 1) }

function showTagInput() { tagInputVisible.value = true; nextTick(() => tagInputRef.value?.focus()) }

function addTag() {
  const val = tagInputValue.value.trim()
  if (val && !form.tags.includes(val)) { form.tags.push(val) }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

function removeTag(tag: string) { form.tags = form.tags.filter(t => t !== tag) }

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch { return }

  submitting.value = true
  try {
    await communityStore.createPost({
      title: form.title,
      content: form.content,
      boardId: form.boardId,
      images: form.images,
      tags: form.tags,
      isAnonymous: form.isAnonymous,
    })
    ElMessage.success('发布成功！')
    router.push('/community')
  } catch (err: any) {
    ElMessage.error(err.message || '发布失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.publish-page { min-height: 100vh; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); }
.image-upload-area:hover { border-color: #60a5fa; }
</style>
