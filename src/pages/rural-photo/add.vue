<template>
  <view class="add-rural-photo">
    <view>
      <u-navbar :auto-back="true" placeholder fixed>
        <template #right>
          <u-button 
            size="small" 
            color="var(--theme-primary)" 
            shape="circle" 
            :disabled="!canPublish"
            @click="handlePublish"
          >
            发布
          </u-button>
        </template>
      </u-navbar>
    </view>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      <view class="form-content">

       <!-- 图片上传区域 -->
        <view class="section">
          <view class="upload-section">
            <view class="section-label">上传照片</view>
            <QiniuUploader
              v-model="uploadedUrl"
              :single-mode="true"
              :max-count="1"
              accept="image"
              @success="onUploadSuccess"
              @error="onUploadError"
              @progress="onUploadProgress"
            />
          </view>
        </view>

        <!-- 标题输入区域 -->
        <view class="section">
          <input 
            v-model="titleText" 
            class="text-input" 
            placeholder="可以为照片添加标题" 
            :maxlength="20"
          >
          <view class="char-count">
            {{ titleText.length }}/20
          </view>
        </view>
        <view class="divider" />

        <!-- 描述输入区域 --> 
        <view class="section">
          <input 
            v-model="contentText" 
            class="text-input" 
            placeholder="可以为照片添加描述" 
            :maxlength="50"
          >
          <view class="char-count">
            {{ contentText.length }}/30
          </view>
        </view>
        <view class="divider" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import QiniuUploader from '@/components/QiniuUploader.vue'
import { createRuralPhoto } from '@/api/rural'
import storage from '@/utils/storage'

const uploadedUrl = ref<string>('')
const titleText = ref('')
const contentText = ref('')

// 修改发布条件，只需要有图片即可
const canPublish = computed(() => {
  return uploadedUrl.value.trim().length > 0
})

// 获取当前选择的乡村代码
const getCurrentRuralCode = (): string => {
  return storage.get('user:selectedVillageCode') || ''
}

const onUploadSuccess = (urls: string[]) => {
  if (urls.length > 0) {
    uploadedUrl.value = urls[0]
  }
}

const onUploadError = (err: any) => {
  uni.showToast({ title: '上传失败', icon: 'none' })
  console.error(err)
}

const onUploadProgress = (payload: any) => {
  // 可根据需要显示进度
}

// 处理发布按钮点击事件
const handlePublish = () => {
  console.log('按钮点击事件触发')
  publish()
}

const publish = async () => {
  console.log('=== 开始发布函数 ===')
  console.log('开始发布，当前状态:', {
    canPublish: canPublish.value,
    uploadedUrl: uploadedUrl.value,
    titleText: titleText.value,
    contentText: contentText.value
  })
  
  // 获取缓存的乡村代码
  const ruralCode = getCurrentRuralCode()
  console.log('获取到的乡村代码:', ruralCode)
  
  if (!ruralCode) {
    console.log('乡村代码为空，使用默认测试代码')
    // uni.showToast({ title: '请选择乡村', icon: 'none' })
    // return
  }
  
  if (!canPublish.value) {
    uni.showToast({ title: '请先上传照片', icon: 'none' })
    return
  }
  
  // 如果没有上传图片，使用测试图片URL
  let imageUrl = uploadedUrl.value.trim()
  if (!imageUrl) {
    imageUrl = 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Test+Rural+Photo'
    console.log('使用测试图片URL:', imageUrl)
  }
  
  console.log('准备发送请求...')
  uni.showLoading({ title: '正在发表...' })
  
  try {
    const requestData = {
      title: titleText.value.trim(),
      description: contentText.value.trim(),
      imageUrl: imageUrl,
      ruralCode: ruralCode || 'default_test_code' // 使用默认代码进行测试
    }
    console.log('发送请求数据:', requestData)
    
    const result = await createRuralPhoto(requestData)
    console.log('请求成功，返回结果:', result)
    
    uni.hideLoading()
    uni.showToast({ title: '发表成功', icon: 'success' })
    
    setTimeout(() => {
      uni.navigateBack()
    }, 600)
  } catch (error) {
    console.error('发布乡村照片失败:', error)
    uni.hideLoading()
    uni.showToast({ title: '发表失败，请重试', icon: 'none' })
  }
}
</script>

<style scoped lang="scss">
.add-rural-photo { 
  min-height: 100vh; 
  background-color: var(--theme-bg-color); 
}

.content-scroll { 
  height: 100vh; 
  padding-top: calc(88rpx + var(--status-bar-height)); 
}

.form-content { 
  padding: 24rpx; 
}

.section { 
  margin-bottom: 16rpx; 
}

.section-label {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--theme-main-color);
  margin-bottom: 12rpx;
}

.upload-section {
  padding: 32rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  min-height: 300rpx;
  
  .section-label {
    margin-bottom: 16rpx;
  }
}

.text-input, .text-area { 
  width: 100%; 
  border: none; 
  border-radius: 12rpx; 
  padding: 20rpx; 
  font-size: 32rpx; 
  color: var(--theme-main-color); 
  background-color: #ffffff; 
  line-height: 1.6;
  transition: all 0.3s ease;
  
  &:focus { 
    outline: none; 
    background-color: #ffffff;
    box-shadow: 0 0 0 2rpx var(--theme-primary);
  }
}

.text-input { 
  height: 80rpx; 
}

.text-area { 
  min-height: 200rpx; 
}

.char-count { 
  text-align: right; 
  font-size: 24rpx; 
  color: var(--theme-tips-color); 
  margin-top: 8rpx; 
}

.divider { 
  height: 1rpx; 
  background-color: var(--theme-border-color); 
  margin: 16rpx 0; 
}
</style>