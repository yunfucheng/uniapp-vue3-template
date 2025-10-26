<template>
  <view class="add-announcement">
    <view>
      <u-navbar :auto-back="true" placeholder fixed>
        <template #right>
          <u-button 
            size="small" 
            color="var(--theme-primary)" 
            shape="circle" 
            :disabled="!canPublish"
            @click="submitForm"
          >
            发布
          </u-button>
        </template>
      </u-navbar>
    </view>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      <view class="form-content">
        <!-- 输入标题 -->
        <view class="section">
          <input 
            v-model="formData.title" 
            class="text-input" 
            placeholder="请输入标题" 
            :maxlength="50"
            :class="{ 'input-error': titleError }"
          >
          <view v-if="titleError" class="error-tip">{{ titleError }}</view>
        </view>
        <view class="divider" />

        <!-- 输入内容 -->
        <view class="section">
          <textarea 
            v-model="formData.content" 
            class="text-area" 
            placeholder="请输入公告内容" 
            :maxlength="1000" 
            auto-height 
            :class="{ 'input-error': contentError }"
          />
          <view class="char-count">
            {{ formData.content.length }}/1000
          </view>
          <view v-if="contentError" class="error-tip">{{ contentError }}</view>
        </view>
        <view class="divider" />

        <!-- 图片上传：使用 QiniuUploader 组件 -->
        <view class="section">
          <view class="upload-section">
            <view class="section-label">添加图片</view>
            <QiniuUploader
              v-model="uploadedUrls"
              :single-mode="false"
              :max-count="9"
              accept="image"
              @success="onUploadSuccess"
              @error="onUploadError"
            />
          </view>
        </view>
        <view class="divider" />

        <!-- 公告类型 -->
        <view class="row-item" @tap="chooseType">
          <text class="row-label">
            公告类型
          </text>
          <view class="row-value">
            <text class="value-text" :class="{ 'value-selected': formData.type }">
              {{ typeText }}
            </text>
            <u-icon name="arrow-right" size="18" color="var(--theme-tips-color)" />
          </view>
        </view>
        <view class="divider" />

        <!-- 级别类型 -->
        <view class="row-item" @tap="chooseLevel">
          <text class="row-label">
            级别类型
          </text>
          <view class="row-value">
            <text class="value-text" :class="{ 'value-selected': formData.level }">
              {{ levelText }}
            </text>
            <u-icon name="arrow-right" size="18" color="var(--theme-tips-color)" />
          </view>
        </view>
        <view class="divider" />

        <!-- 语音输入 -->
        <view class="row-item" @tap="openVoicePopup">
          <text class="row-label">
            语音输入
          </text>
          <view class="row-value">
            <view v-if="audioPath" class="audio-indicator">
              <u-icon name="mic" size="16" color="var(--theme-success)" />
              <text class="audio-duration">{{ audioDuration }}s</text>
            </view>
            <u-icon name="arrow-right" size="18" color="var(--theme-tips-color)" />
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部弹出语音输入 -->
    <u-popup :show="voicePopupShow" mode="bottom" @close="closeVoicePopup">
      <view class="voice-popup">
        <view class="popup-header">
          <text class="popup-title">
            语音输入
          </text>
          <view class="popup-close" @tap="closeVoicePopup">
            <u-icon name="close" size="20" color="#6b7280" />
          </view>
        </view>
        <view class="popup-content">
          <view class="record-area">
            <view class="record-btn" :class="{ recording: isRecording }" @tap="startRecord">
              <text class="record-icon">
                🎤
              </text>
              <text class="record-text">
                {{ isRecording ? '录音中...' : '开始录音' }}
              </text>
            </view>
            <view class="record-tip">
              点击开始，再次点击结束
            </view>
          </view>
          <view v-if="audioPath" class="voice-preview">
            <view class="audio-info">
              <text class="audio-icon">
                🎵
              </text>
              <text class="audio-duration">
                {{ audioDuration }}s
              </text>
            </view>
            <view class="audio-controls">
              <view class="control-btn" @tap="playAudio">
                <text>{{ isPlaying ? '暂停' : '播放' }}</text>
              </view>
              <view class="control-btn delete" @tap="deleteAudio">
                <text>删除</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </u-popup>
    <!-- 公告类型选择：u-action-sheet -->
    <u-action-sheet
      :show="showTypeSheet"
      :actions="typeActions"
      title="选择公告类型"
      @select="onTypeSelect"
      @close="() => showTypeSheet = false"
    />

    <!-- 级别类型选择：u-action-sheet -->
    <u-action-sheet
      :show="showLevelSheet"
      :actions="levelActions"
      title="选择级别类型"
      @select="onLevelSelect"
      @close="() => showLevelSheet = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import QiniuUploader from '@/components/QiniuUploader.vue';

const formData = ref({
  title: '',
  type: 'announcement',
  level: 'tun',
  content: '',
  audioPath: '',
  images: [] as string[],
});

const uploadedUrls = ref<string[]>([]);
const audioPath = ref('');
const audioDuration = ref(0);
const isRecording = ref(false);
const isPlaying = ref(false);
const recordStartTime = ref(0);
const voicePopupShow = ref(false);
const showTypeSheet = ref(false);
const showLevelSheet = ref(false);

// 错误状态
const titleError = ref('');
const contentError = ref('');

// 录音管理器
let recorderManager: UniApp.RecorderManager | null = null;
let innerAudioContext: UniApp.InnerAudioContext | null = null;

const typeActions = [
  { name: '公告', value: 'announcement' },
  { name: '通知', value: 'notice' },
];

const levelActions = [
  { name: '乡级', value: 'township' },
  { name: '村级', value: 'village' },
  { name: '屯级', value: 'tun' },
];

const typeText = computed(() => {
  return formData.value.type === 'notice' ? '通知' : '公告';
});

const levelText = computed(() => {
  const map = { tun: '屯级', village: '村级', township: '乡级' };
  return map[formData.value.level as keyof typeof map] || '屯级';
});

// 是否可以发布
const canPublish = computed(() => {
  return formData.value.title.trim() && 
         (formData.value.content.trim() || formData.value.audioPath);
});

// 验证表单
const validateForm = () => {
  titleError.value = '';
  contentError.value = '';
  
  if (!formData.value.title.trim()) {
    titleError.value = '请输入标题';
    return false;
  }
  
  if (!formData.value.content.trim() && !formData.value.audioPath) {
    contentError.value = '请输入内容或录制语音';
    return false;
  }
  
  return true;
};

const chooseType = () => {
  showTypeSheet.value = true;
};

const chooseLevel = () => {
  showLevelSheet.value = true;
};

const openVoicePopup = () => {
  voicePopupShow.value = true;
};

const closeVoicePopup = () => {
  voicePopupShow.value = false;
};

// 开始录音
const startRecord = () => {
  if (isRecording.value) {
    stopRecord();
    return;
  }
  
  isRecording.value = true;
  recordStartTime.value = Date.now();
  recorderManager = uni.getRecorderManager();
  
  recorderManager.onStart(() => {});
  recorderManager.onStop((res) => {
    audioPath.value = res.tempFilePath;
    audioDuration.value = Math.floor((Date.now() - recordStartTime.value) / 1000);
    formData.value.audioPath = res.tempFilePath;
    isRecording.value = false;
  });
  
  recorderManager.start({
    duration: 60000,
    sampleRate: 16000,
    numberOfChannels: 1,
    encodeBitRate: 96000,
    format: 'mp3',
  });
};

const stopRecord = () => {
  if (recorderManager) {
    recorderManager.stop();
  }
};

const playAudio = () => {
  if (!audioPath.value) {
    return;
  }
  
  if (isPlaying.value) {
    if (innerAudioContext) {
      innerAudioContext.pause();
    }
    isPlaying.value = false;
    return;
  }
  
  innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.src = audioPath.value;
  innerAudioContext.onPlay(() => {
    isPlaying.value = true;
  });
  innerAudioContext.onEnded(() => {
    isPlaying.value = false;
  });
  innerAudioContext.onError(() => {
    isPlaying.value = false;
  });
  innerAudioContext.play();
};

const deleteAudio = () => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这段录音吗？',
    success: (res) => {
      if (res.confirm) {
        audioPath.value = '';
        audioDuration.value = 0;
        formData.value.audioPath = '';
        if (innerAudioContext) {
          innerAudioContext.destroy();
        }
      }
    },
  });
};

// 上传成功回调
const onUploadSuccess = (urls: string[]) => {
  uploadedUrls.value = urls;
  formData.value.images = urls;
};

// 上传失败回调
const onUploadError = (err: any) => {
  uni.showToast({ title: '上传失败', icon: 'none' });
  console.error(err);
};

const onTypeSelect = (action: any) => {
  formData.value.type = action?.value === 'notice' ? 'notice' : 'announcement';
  showTypeSheet.value = false;
};

const onLevelSelect = (action: any) => {
  const v = action?.value;
  formData.value.level = v === 'township' ? 'township' : v === 'village' ? 'village' : 'tun';
  showLevelSheet.value = false;
};

const submitForm = () => {
  if (!validateForm()) {
    return;
  }
  
  uni.showLoading({ title: '发布中...' });
  
  // 模拟发布请求
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '发布成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1200);
  }, 1200);
};

// 页面卸载时清理资源
onUnmounted(() => {
  if (innerAudioContext) {
    innerAudioContext.destroy();
  }
  if (recorderManager) {
    recorderManager.stop();
  }
});
</script>

<style scoped lang="scss">
.add-announcement { 
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
  
  &.input-error {
    border: 2rpx solid var(--theme-error);
    background-color: rgba(239, 68, 68, 0.05);
  }
}

.text-input { 
  height: 80rpx; 
}

.text-area { 
  min-height: 200rpx; 
}

.error-tip {
  font-size: 24rpx;
  color: var(--theme-error);
  margin-top: 8rpx;
  padding-left: 8rpx;
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

.row-item { 
  height: 72rpx; 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 0 8rpx;
  transition: background-color 0.2s ease;
  
  &:active {
    background-color: var(--theme-bg-color-secondary);
    border-radius: 8rpx;
  }
}

.row-label { 
  font-size: 28rpx; 
  color: var(--theme-main-color); 
}

.row-value { 
  display: flex; 
  align-items: center; 
  gap: 8rpx; 
}

.value-text { 
  font-size: 28rpx; 
  color: var(--theme-tips-color);
  transition: color 0.2s ease;
  
  &.value-selected {
    color: var(--theme-main-color);
    font-weight: 500;
  }
}

.audio-indicator {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 4rpx 8rpx;
  background-color: var(--theme-success-12);
  border-radius: 12rpx;
  margin-right: 8rpx;
}

.audio-duration {
  font-size: 24rpx;
  color: var(--theme-success);
  font-weight: 500;
}

.voice-popup { 
  background-color: var(--theme-bg-color); 
  border-top-left-radius: 16rpx; 
  border-top-right-radius: 16rpx; 
  padding: 16rpx; 
}

.popup-header { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  margin-bottom: 8rpx; 
}

.popup-title { 
  font-size: 28rpx; 
  font-weight: 600; 
  color: var(--theme-main-color); 
}

.record-area { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  padding: 24rpx 0; 
}

.record-btn { 
  width: 160rpx; 
  height: 160rpx; 
  border-radius: 50%; 
  background-color: var(--theme-success); 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  box-shadow: 0 4rpx 20rpx rgba(16, 185, 129, 0.3); 
  transition: all 0.3s ease;
  
  &.recording { 
    background-color: var(--theme-error);
    box-shadow: 0 4rpx 20rpx rgba(239, 68, 68, 0.3);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.record-icon { 
  font-size: 48rpx; 
  color: #ffffff; 
  margin-bottom: 8rpx; 
}

.record-text { 
  font-size: 24rpx; 
  color: #ffffff; 
}

.record-tip { 
  font-size: 24rpx; 
  color: var(--theme-tips-color); 
  margin-top: 8rpx; 
}

.voice-preview { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 16rpx; 
  background-color: var(--theme-success-12); 
  border-radius: 12rpx; 
}

.audio-info { 
  display: flex; 
  align-items: center; 
  gap: 12rpx; 
}

.audio-icon { 
  font-size: 32rpx; 
}

.audio-controls { 
  display: flex; 
  gap: 16rpx; 
}

.control-btn { 
  padding: 12rpx 24rpx; 
  border-radius: 8rpx; 
  font-size: 24rpx; 
  color: var(--theme-success); 
  border: 1rpx solid var(--theme-success); 
  background-color: var(--theme-bg-color);
  transition: all 0.2s ease;
  
  &:active {
    background-color: var(--theme-success);
    color: #ffffff;
  }
  
  &.delete { 
    color: var(--theme-error); 
    border-color: var(--theme-error);
    
    &:active {
      background-color: var(--theme-error);
      color: #ffffff;
    }
  }
}
</style>
