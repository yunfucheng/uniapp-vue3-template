<template>
  <view class="announcement-detail">
    <!-- 顶部导航 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <view class="navbar-left" @tap="goBack">
          <u-icon name="arrow-left" size="20" color="var(--theme-main-color)" />
        </view>
        <view class="navbar-title">
          <text class="title-text">
            公告详情
          </text>
        </view>
        <view class="navbar-right">
          <!-- 占位，保持居中 -->
        </view>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view scroll-y="true" class="content-scroll" :show-scrollbar="false">
      <view class="detail-content">
        <!-- 标题区域 -->
        <view class="title-section">
          <text class="announcement-title">
            {{ announcementData.title }}
          </text>
        </view>

        <!-- 信息栏 -->
        <view class="info-section">
          <view class="info-row">
            <!-- 公告类型图标 -->
            <view class="type-badge" :class="announcementData.type === 0 ? 'notification-badge' : 'announcement-badge'">
              <u-icon
                :name="announcementData.type === 0 ? 'bell' : 'volume'"
                size="14"
                :color="announcementData.type === 0 ? 'var(--theme-error)' : 'var(--theme-success)'"
              />
              <text class="badge-text">
                {{ announcementData.type === 0 ? '通知' : '公告' }}
              </text>
            </view>

            <!-- 级别图标 -->
            <view class="level-badge" :style="{ backgroundColor: `${getLevelColor(announcementData.adminLevel)}15` }">
              <text class="level-text" :style="{ color: getLevelColor(announcementData.adminLevel) }">
                {{ getLevelText(announcementData.adminLevel) }}
              </text>
            </view>

            <!-- 时间 -->
            <text class="publish-time">
              {{ announcementData.createTimeFomat }}
            </text>
          </view>
        </view>

        <!-- 分割线 -->
        <view class="divider" />

        <!-- 语音播放区域 -->
        <view v-if="announcementData.audioUrl" class="audio-section">
          <view class="audio-player">
            <view class="audio-controls">
              <view class="play-button" :class="{ playing: isPlaying }" @tap="toggleAudio">
                <u-icon
                  :name="isPlaying ? 'pause' : 'play-right'"
                  size="24"
                  color="#ffffff"
                />
              </view>
              <view class="audio-info">
                <text class="audio-label">
                  语音播报
                </text>
                <view class="progress-container">
                  <view class="progress-bar">
                    <view class="progress-fill" :style="{ width: `${progressPercent}%` }" />
                  </view>
                  <text class="time-text">
                    {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 分割线 -->
        <view v-if="announcementData.audioUrl" class="divider" />

        <!-- 内容区域 -->
        <view class="content-section">
          <text class="content-text">
            {{ announcementData.text }}
          </text>
        </view>

        <!-- 图片区域 -->
        <view v-if="announcementData.images && announcementData.images.length > 0" class="images-section">
          <view class="image-grid">
            <view
              v-for="(image, index) in announcementData.images"
              :key="index"
              class="image-item"
              @tap="previewImage(index)"
            >
              <image
                :src="image"
                mode="aspectFill"
                class="content-image"
                :lazy-load="true"
              />
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'AnnouncementDetail',
  data() {
    return {
      announcementId: '',
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      audioContext: null,
      // 固定数据展示
      announcementData: {
        id: 1,
        title: '乡村善治有道 文明乡风遍野',
        type: 1, // 0: 通知, 1: 公告
        adminLevel: 2, // 0: 屯, 1: 村, 2: 乡
        text: '乡村治理是国家治理的基石。推动乡村治理效能稳步提升，是实施乡村振兴战略的关键环节。近年来，我国在推进乡村治理体系方面成效显著，现代乡村治理的制度框架和政策体系基本形成。以党组织为领导的农村基层组织建设明显加强，党组织带头人队伍建设取得成效，村规民约实现全覆盖。自治法治德治有机结合，移风易俗持续推进。基层管理体制机制不断创新，农民精气神越来越足。',
        createTimeFomat: '2小时前',
        audioUrl: 'https://res.gsmba.net/ETraining/Files/Audio/8e08930b-6b5b-4a8e-bf86-47decd39c967.mp3',
        images: [
          'http://src.wwen.cc/Banner/ww01.jpg',
          'http://src.wwen.cc/Banner/ww02.jpg',
        ],
      },
    };
  },
  computed: {
    progressPercent() {
      if (this.duration === 0) return 0;
      return (this.currentTime / this.duration) * 100;
    },
  },
  onLoad(options) {
    if (options.id) {
      this.announcementId = options.id;
      // TODO: 根据ID获取公告详情数据
      // this.loadAnnouncementDetail(options.id)
    }
  },
  onUnload() {
    // 页面卸载时停止音频播放
    if (this.audioContext) {
      this.audioContext.stop();
      this.audioContext.destroy();
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },

    // 获取管理级别文本
    getLevelText(adminLevel) {
      const levelMap = {
        0: '屯',
        1: '村',
        2: '乡',
      };
      return levelMap[adminLevel] || '村';
    },

    // 获取管理级别颜色
    getLevelColor(adminLevel) {
      const colorMap = {
        0: '#F59E0B', // 屯 - 黄色
        1: '#DC2626', // 村 - 红色
        2: '#3B82F6', // 乡 - 蓝色
      };
      return colorMap[adminLevel] || '#DC2626';
    },

    // 切换音频播放状态
    toggleAudio() {
      if (!this.announcementData.audioUrl) return;

      if (this.isPlaying) {
        this.pauseAudio();
      }
      else {
        this.playAudio();
      }
    },

    // 播放音频
    playAudio() {
      if (!this.audioContext) {
        this.audioContext = uni.createInnerAudioContext();
        this.audioContext.src = this.announcementData.audioUrl;

        this.audioContext.onPlay(() => {
          this.isPlaying = true;
        });

        this.audioContext.onPause(() => {
          this.isPlaying = false;
        });

        this.audioContext.onStop(() => {
          this.isPlaying = false;
          this.currentTime = 0;
        });

        this.audioContext.onEnded(() => {
          this.isPlaying = false;
          this.currentTime = 0;
        });

        this.audioContext.onTimeUpdate(() => {
          this.currentTime = this.audioContext.currentTime;
          this.duration = this.audioContext.duration;
        });

        this.audioContext.onError((error) => {
          console.error('音频播放错误:', error);
          uni.showToast({
            title: '音频播放失败',
            icon: 'none',
          });
        });
      }

      this.audioContext.play();
    },

    // 暂停音频
    pauseAudio() {
      if (this.audioContext) {
        this.audioContext.pause();
      }
    },

    // 格式化时间
    formatTime(seconds) {
      if (!seconds || Number.isNaN(seconds)) return '00:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    // 预览图片
    previewImage(index) {
      uni.previewImage({
        urls: this.announcementData.images,
        current: index,
      });
    },
  },
};
</script>

<style scoped>
.announcement-detail {
  min-height: 100vh;
  background-color: var(--theme-bg-color-secondary);
}

/* 自定义导航栏 */
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #ffffff;
  border-bottom: 1px solid var(--theme-divider-color);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 32rpx;
  padding-top: var(--status-bar-height);
}

.navbar-left,
.navbar-right {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-left:active {
  background-color: var(--theme-primary-08);
  border-radius: 50%;
}
}

.navbar-title {
  flex: 1;
  text-align: center;
}

.title-text { font-size: 32rpx; font-weight: 600; color: var(--theme-main-color); }

/* 内容滚动区域 */
.content-scroll {
  height: 100vh;
  padding-top: calc(88rpx + var(--status-bar-height));
}

.detail-content {
  padding: 32rpx;
}

/* 标题区域 */
.title-section {
  margin-bottom: 24rpx;
}

.announcement-title { font-size: 40rpx; font-weight: 700; color: var(--theme-main-color); line-height: 56rpx; display: block; }

/* 信息栏 */
.info-section {
  margin-bottom: 24rpx;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-wrap: wrap;
}

.type-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 500;
}

.notification-badge {
  background-color: var(--theme-error-12);
  color: var(--theme-error);
}

.announcement-badge {
  background-color: var(--theme-success-12);
  color: var(--theme-success);
}

.badge-text {
  font-size: 24rpx;
  font-weight: 600;
}

.level-badge {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.level-text {
  font-size: 24rpx;
  font-weight: 600;
}

.publish-time {
  font-size: 24rpx;
  color: var(--theme-tips-color);
  margin-left: auto;
}

/* 分割线 */
.divider {
  height: 1rpx;
  background-color: var(--theme-divider-color);
  margin: 32rpx 0;
}

/* 语音播放区域 */
.audio-section {
  margin-bottom: 24rpx;
}

.audio-player {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.play-button {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.play-button:active {
  transform: scale(0.95);
}

.play-button.playing {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.audio-info {
  flex: 1;
  min-width: 0;
}

.audio-label {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--theme-main-color);
  display: block;
  margin-bottom: 12rpx;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.progress-bar {
  flex: 1;
  height: 6rpx;
  background-color: var(--theme-divider-color);
  border-radius: 3rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #22c55e);
  border-radius: 3rpx;
  transition: width 0.1s ease;
}

.time-text {
  font-size: 22rpx;
  color: var(--theme-light-color);
  white-space: nowrap;
  min-width: 80rpx;
}

/* 内容区域 */
.content-section {
  margin-bottom: 32rpx;
}

.content-text {
  font-size: 30rpx;
  line-height: 48rpx;
  color: var(--theme-main-color);
  display: block;
  text-align: justify;
}

/* 图片区域 */
.images-section {
  margin-top: 32rpx;
}

.image-grid {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.image-item {
  border-radius: 12rpx;
  overflow: hidden;
  background-color: var(--theme-bg-color-secondary);
}

.content-image {
  width: 100%;
  height: 400rpx;
  display: block;
  border-radius: 12rpx;
}
</style>
