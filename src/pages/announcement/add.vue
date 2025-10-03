<template>
  <view class="add-announcement">
    <view>
      <u-navbar :auto-back="true" placeholder fixed>
        <template #right>
          <u-button size="small" color="#09BE4F" shape="circle" @click="submitForm">
            发布
          </u-button>
        </template>
      </u-navbar>
    </view>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      <view class="form-content">
        <!-- 输入标题：移除分区标题，仅保留输入框 -->
        <view class="section">
          <input v-model="formData.title" class="text-input" placeholder="请输入标题" maxlength="50">
        </view>
        <view class="divider" />

        <!-- 输入内容：移除分区标题，仅保留输入框 -->
        <view class="section">
          <textarea v-model="formData.content" class="text-area" placeholder="请输入公告内容" maxlength="1000" auto-height />
          <view class="char-count">
            {{ formData.content.length }}/1000
          </view>
        </view>
        <view class="divider" />

        <!-- 图片上传：使用 uview-plus 的 u-upload -->
        <view class="section">
          <u-upload
            v-model:file-list="imageFiles"
            accept="image"
            :max-count="9"
            :auto-upload="false"
            @after-read="onImageRead"
            @delete="onImageDelete"
          />
        </view>
        <view class="divider" />

        <!-- 公告类型 -->
        <view class="row-item" @tap="chooseType">
          <text class="row-label">
            公告类型
          </text>
          <view class="row-value">
            <text class="value-text">
              {{ typeText }}
            </text>
            <u-icon name="arrow-right" size="18" color="#9ca3af" />
          </view>
        </view>
        <view class="divider" />

        <!-- 级别类型 -->
        <view class="row-item" @tap="chooseLevel">
          <text class="row-label">
            级别类型
          </text>
          <view class="row-value">
            <text class="value-text">
              {{ levelText }}
            </text>
            <u-icon name="arrow-right" size="18" color="#9ca3af" />
          </view>
        </view>
        <view class="divider" />

        <!-- 语音输入 -->
        <view class="row-item" @tap="openVoicePopup">
          <text class="row-label">
            语音输入
          </text>
          <view class="row-value">
            <u-icon name="arrow-right" size="18" color="#9ca3af" />
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

<script>
export default {
  name: 'AddAnnouncement',
  data() {
    return {
      formData: {
        title: '',
        type: 'announcement',
        level: 'tun',
        content: '',
        audioPath: '',
        images: [],
      },
      imageFiles: [],
      audioPath: '',
      audioDuration: 0,
      isRecording: false,
      isPlaying: false,
      recordStartTime: 0,
      voicePopupShow: false,
      showTypeSheet: false,
      showLevelSheet: false,
      typeActions: [
        { name: '公告', value: 'announcement' },
        { name: '通知', value: 'notice' },
      ],
      levelActions: [
        { name: '乡级', value: 'township' },
        { name: '村级', value: 'village' },
        { name: '屯级', value: 'tun' },
      ],
    };
  },
  computed: {
    typeText() {
      return this.formData.type === 'notice' ? '通知' : '公告';
    },
    levelText() {
      const map = { tun: '屯级', village: '村级', township: '乡级' };
      return map[this.formData.level] || '屯级';
    },
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    chooseType() {
      this.showTypeSheet = true;
    },
    chooseLevel() {
      this.showLevelSheet = true;
    },
    openVoicePopup() {
      this.voicePopupShow = true;
    },
    closeVoicePopup() {
      this.voicePopupShow = false;
    },
    // 开始录音
    startRecord() {
      if (this.isRecording) {
        this.stopRecord();
        return;
      }
      this.isRecording = true;
      this.recordStartTime = Date.now();
      this.recorderManager = uni.getRecorderManager();
      this.recorderManager.onStart(() => {});
      this.recorderManager.onStop((res) => {
        this.audioPath = res.tempFilePath;
        this.audioDuration = Math.floor((Date.now() - this.recordStartTime) / 1000);
        this.formData.audioPath = res.tempFilePath;
        this.isRecording = false;
      });
      this.recorderManager.start({
        duration: 60000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 96000,
        format: 'mp3',
      });
    },
    stopRecord() {
      if (this.recorderManager) {
        this.recorderManager.stop();
      }
    },
    playAudio() {
      if (!this.audioPath) {
        return;
      }
      if (this.isPlaying) {
        if (this.innerAudioContext) {
          this.innerAudioContext.pause();
        }
        this.isPlaying = false;
        return;
      }
      this.innerAudioContext = uni.createInnerAudioContext();
      this.innerAudioContext.src = this.audioPath;
      this.innerAudioContext.onPlay(() => {
        this.isPlaying = true;
      });
      this.innerAudioContext.onEnded(() => {
        this.isPlaying = false;
      });
      this.innerAudioContext.onError(() => {
        this.isPlaying = false;
      });
      this.innerAudioContext.play();
    },
    deleteAudio() {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这段录音吗？',
        success: (res) => {
          if (res.confirm) {
            this.audioPath = '';
            this.audioDuration = 0;
            this.formData.audioPath = '';
            if (this.innerAudioContext) {
              this.innerAudioContext.destroy();
            }
          }
        },
      });
    },
    onImageRead(e) {
      const files = Array.isArray(e.file) ? e.file : [e.file];
      this.imageFiles = [...this.imageFiles, ...files];
      this.formData.images = this.imageFiles.map(f => f.url || f.path || f.tempFilePath).filter(Boolean);
    },
    onImageDelete(e) {
      const idx = e?.index;
      if (typeof idx === 'number') {
        this.imageFiles.splice(idx, 1);
      }
      this.formData.images = this.imageFiles.map(f => f.url || f.path || f.tempFilePath).filter(Boolean);
    },
    onTypeSelect(action) {
      this.formData.type = action?.value === 'notice' ? 'notice' : 'announcement';
      this.showTypeSheet = false;
    },
    onLevelSelect(action) {
      const v = action?.value;
      this.formData.level = v === 'township' ? 'township' : v === 'village' ? 'village' : 'tun';
      this.showLevelSheet = false;
    },
    saveAnnouncement() {
      if (!this.formData.title.trim()) {
        uni.showToast({ title: '请输入标题', icon: 'none' });
        return;
      }
      if (!this.formData.content.trim() && !this.formData.audioPath) {
        uni.showToast({ title: '请输入内容或录制语音', icon: 'none' });
        return;
      }
      uni.showLoading({ title: '保存中...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '保存成功', icon: 'success' });
        setTimeout(() => {
          uni.navigateBack();
        }, 1200);
      }, 1200);
    },
  },
  onUnload() {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy();
    }
    if (this.recorderManager) {
      this.recorderManager.stop();
    }
  },
};
</script>

<style scoped>
.add-announcement { min-height: 100vh; background-color: #f8fafc; }
.title-text { font-size:32rpx; font-weight:600; color:#1f2937; }
.content-scroll { height:100vh; padding-top: calc(88rpx + var(--status-bar-height)); }
.form-content { padding: 24rpx; }
.section { margin-bottom: 16rpx; }
.section-title { font-size: 28rpx; font-weight: 500; color: #374151; margin-bottom: 12rpx; }
.text-input { width:100%; height:80rpx; border:none; border-radius: 12rpx; padding: 0 20rpx; font-size: 32rpx; color:#2c3e50; background-color:#f8fafc; }
.text-area { width:100%; min-height: 200rpx; border:none; border-radius: 12rpx; padding: 20rpx; font-size: 32rpx; color:#2c3e50; background-color:#f8fafc; line-height:1.6; }
.text-input:focus, .text-area:focus { outline:none; }
.upload-placeholder { width: 200rpx; height: 200rpx; border: none; border-radius: 12rpx; display:flex; flex-direction:column; align-items:center; justify-content:center; background-color:transparent; }
.char-count { text-align:right; font-size: 24rpx; color:#94a3b8; margin-top: 8rpx; }
.divider { height: 1rpx; background-color: #e5e7eb; margin: 16rpx 0; }
.upload-placeholder { width: 200rpx; height: 200rpx; border: 2rpx dashed #cbd5e1; border-radius: 12rpx; display:flex; flex-direction:column; align-items:center; justify-content:center; background-color:#f8fafc; }
.upload-icon { font-size: 48rpx; color:#94a3b8; margin-bottom: 12rpx; }
.upload-text { font-size: 24rpx; color:#94a3b8; }
.row-item { height: 72rpx; display:flex; align-items:center; justify-content:space-between; padding: 0 8rpx; }
.row-label { font-size: 28rpx; color:#374151; }
.row-value { display:flex; align-items:center; gap: 8rpx; }
.value-text { font-size: 28rpx; color:#6b7280; }
.bottom-actions { padding: 24rpx 0; }
.voice-popup { background-color:#ffffff; border-top-left-radius: 16rpx; border-top-right-radius: 16rpx; padding: 16rpx; }
.popup-header { display:flex; align-items:center; justify-content:space-between; margin-bottom: 8rpx; }
.popup-title { font-size: 28rpx; font-weight: 600; color:#1f2937; }
.record-area { display:flex; flex-direction:column; align-items:center; padding: 24rpx 0; }
.record-btn { width: 160rpx; height: 160rpx; border-radius: 50%; background-color:#4CAF50; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 4rpx 20rpx rgba(76,175,80,0.3); transition: all .3s ease; }
.record-btn.recording { background-color:#F44336; }
.record-icon { font-size: 48rpx; color:#ffffff; margin-bottom: 8rpx; }
.record-text { font-size: 24rpx; color:#ffffff; }
.record-tip { font-size: 24rpx; color:#94a3b8; margin-top: 8rpx; }
.voice-preview { display:flex; align-items:center; justify-content:space-between; padding: 16rpx; background-color:#E8F5E9; border-radius: 12rpx; }
.audio-info { display:flex; align-items:center; gap: 12rpx; }
.audio-icon { font-size: 32rpx; }
.audio-duration { font-size: 28rpx; color:#4CAF50; font-weight: 600; }
.audio-controls { display:flex; gap: 16rpx; }
.control-btn { padding: 12rpx 24rpx; border-radius: 8rpx; font-size: 24rpx; color:#4CAF50; border: 1rpx solid #4CAF50; background-color:#ffffff; }
.control-btn.delete { color:#F44336; border-color:#F44336; }
</style>
