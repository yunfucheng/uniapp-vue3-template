<template>
  <view class="add-rural-photo">
    <view>
      <u-navbar :auto-back="true" placeholder fixed title="发布乡村照片">
        <template #right>
          <u-button 
            size="small" 
            color="var(--theme-primary)" 
            shape="circle" 
            @click="publish"
            :disabled="!canPublish"
          >
            发布
          </u-button>
        </template>
      </u-navbar>
    </view>

    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      <view class="form-content">
        <!-- 图片上传区域 -->
        <view class="upload-card">
          <view class="card-title">
            <text class="title-text">上传照片</text>
            <text class="required-mark">*</text>
          </view>
          <QiniuUploader
            v-model="uploadedUrls"
            :max-count="9"
            accept="image"
            @success="onUploadSuccess"
            @error="onUploadError"
            @progress="onUploadProgress"
          />
          <view class="upload-hint">
            <u-icon name="info-circle" color="var(--theme-tips-color)" size="14"></u-icon>
            <text class="hint-text">最多选择 9 张图片，支持预览大图</text>
          </view>
        </view>

        <!-- 标题输入区域 -->
        <view class="input-card">
          <view class="card-title">
            <text class="title-text">照片标题</text>
            <text class="required-mark">*</text>
          </view>
          <u-input 
            v-model="titleText" 
            placeholder="为你的照片起一个吸引人的标题..."
            :maxlength="50"
            border="none"
            bg-color="transparent"
            clearable
          />
          <view class="char-count">{{ titleText.length }}/50</view>
        </view>

        <!-- 描述输入区域 -->
        <view class="input-card">
          <view class="card-title">
            <text class="title-text">照片描述</text>
            <text class="required-mark">*</text>
          </view>
          <u-textarea 
            v-model="contentText" 
            placeholder="分享你眼中的乡村美景，记录生活中的美好瞬间..."
            :maxlength="200"
            count
            height="120"
            border="none"
            bg-color="transparent"
          />
        </view>

        <!-- 发布须知 -->
        <view class="notice-card">
          <view class="notice-title">
            <u-icon name="warning" color="var(--theme-warning)" size="16"></u-icon>
            <text class="notice-text">发布须知</text>
          </view>
          <view class="notice-content">
            <text class="notice-item">• 请确保照片内容真实，展现乡村风貌</text>
            <text class="notice-item">• 不得发布违法违规内容</text>
            <text class="notice-item">• 尊重他人隐私，避免拍摄他人肖像</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import QiniuUploader from '@/components/QiniuUploader.vue'

const uploadedUrls = ref<string[]>([])
const titleText = ref('')
const contentText = ref('')

// 计算是否可以发布
const canPublish = computed(() => {
  return uploadedUrls.value.length > 0 && 
         titleText.value.trim().length > 0 && 
         contentText.value.trim().length > 0
})

const onUploadSuccess = (urls: string[]) => {
  uploadedUrls.value = [...uploadedUrls.value, ...urls]
}

const onUploadError = (err: any) => {
  uni.showToast({ title: '上传失败', icon: 'none' })
  console.error(err)
}

const onUploadProgress = (payload: any) => {
  // 可根据需要显示进度
}

const publish = async () => {
  if (!canPublish.value) {
    if (!uploadedUrls.value.length) {
      uni.showToast({ title: '请先选择图片', icon: 'none' })
    } else if (!titleText.value.trim()) {
      uni.showToast({ title: '请填写照片标题', icon: 'none' })
    } else if (!contentText.value.trim()) {
      uni.showToast({ title: '请填写照片描述', icon: 'none' })
    }
    return
  }
  
  uni.showLoading({ title: '正在发表...' })
  
  try {
    // 这里应该调用实际的API
    await new Promise(resolve => setTimeout(resolve, 800))
    
    uni.hideLoading()
    uni.showToast({ title: '发表成功', icon: 'success' })
    
    setTimeout(() => {
      uni.navigateBack()
    }, 600)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '发表失败，请重试', icon: 'none' })
  }
}
</script>

<style scoped lang="scss">
.add-rural-photo {
  background: linear-gradient(135deg, var(--theme-bg-color) 0%, var(--theme-bg-color-secondary) 100%);
  min-height: 100vh;
}

.content-scroll {
  height: 100vh;
  padding-top: calc(88rpx + var(--status-bar-height));
}

.form-content {
  padding: 32rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

// 字符计数样式
.char-count {
  text-align: right;
  font-size: 24rpx;
  color: var(--theme-tips-color);
  margin-top: 8rpx;
}

// 卡片通用样式
.input-card,
.upload-card,
.notice-card {
  background-color: var(--theme-bg-color);
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  border: 1rpx solid var(--theme-border-color);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  }
}

.card-title {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  gap: 8rpx;

  .title-text {
    font-size: 32rpx;
    font-weight: 600;
    color: var(--theme-main-color);
  }

  .required-mark {
    color: var(--theme-error);
    font-size: 32rpx;
    font-weight: 600;
  }
}

// 上传提示样式
.upload-hint {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 16rpx;
  padding: 12rpx 16rpx;
  background-color: var(--theme-bg-color-secondary);
  border-radius: 8rpx;

  .hint-text {
    font-size: 24rpx;
    color: var(--theme-tips-color);
    line-height: 1.4;
  }
}

// 发布须知样式
.notice-card {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%);
  border-color: rgba(245, 158, 11, 0.2);
}

.notice-title {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 16rpx;

  .notice-text {
    font-size: 28rpx;
    font-weight: 600;
    color: var(--theme-warning);
  }
}

.notice-content {
  display: flex;
  flex-direction: column;
  gap: 8rpx;

  .notice-item {
    font-size: 24rpx;
    color: var(--theme-content-color);
    line-height: 1.5;
    padding-left: 8rpx;
  }
}

// 响应式设计
@media (max-width: 750rpx) {
  .form-content {
    padding: 24rpx 16rpx;
  }
  
  .input-card,
  .upload-card,
  .notice-card {
    padding: 20rpx;
  }
}

// 暗色主题适配
.theme-dark {
  .input-card,
  .upload-card,
  .notice-card {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .upload-hint {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .notice-card {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  }
}
</style>