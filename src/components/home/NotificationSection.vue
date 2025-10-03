<template>
  <view class="home-section">
    <view class="section-header">
      <text class="home-section-title">
        公告栏
      </text>
      <text class="more-link" @tap="goToAnnouncements">
        更多
      </text>
    </view>

    <!-- 通知区域（竖向滚动） -->
    <view v-if="notifications.length > 0" class="notification-section">
      <swiper
        class="notification-swiper"
        :vertical="true"
        :autoplay="true"
        :interval="10000"
        :circular="true"
        :display-multiple-items="1"
      >
        <swiper-item v-for="notification in notifications" :key="notification.id" class="notification-item">
          <view class="notification-content">
            <view class="notification-left">
              <u-icon name="bell" size="20" color="#DC2626" />
              <text class="notification-text">
                {{ notification.title }}
              </text>
            </view>
            <view class="notification-right">
              <view
                v-if="notification.audioUrl"
                class="audio-icon-notification"
                @tap="playAudio(notification.audioUrl, notification.id)"
              >
                <u-icon
                  :name="currentPlayingId === notification.id ? 'volume-fill' : 'volume'"
                  size="20"
                  color="#dc2626"
                />
              </view>
              <text class="notification-time">
                {{ notification.createTimeFomat }}
              </text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 公告区域（横向滚动） -->
    <view v-if="publicAnnouncements.length > 0" class="announcement-section">
      <swiper
        class="announcement-swiper"
        :autoplay="true"
        :interval="10000"
        :circular="true"
        indicator-active-color="#22c55e"
      >
        <swiper-item v-for="announcement in publicAnnouncements" :key="announcement.id" class="announcement-swiper-item">
          <view class="announcement-card-banner">
            <view class="announcement-header-banner">
              <view class="level-badge" :style="{ backgroundColor: `${getLevelColor(announcement.adminLevel)}15` }">
                <text class="level-text" :style="{ color: getLevelColor(announcement.adminLevel) }">
                  {{ getLevelText(announcement.adminLevel) }}
                </text>
              </view>
              <text class="announcement-title-banner">
                {{ announcement.title }}
              </text>
              <view
                v-if="announcement.audioUrl"
                class="audio-icon-banner"
                @tap="playAudio(announcement.audioUrl, announcement.id)"
              >
                <u-icon
                  :name="currentPlayingId === announcement.id ? 'volume-fill' : 'volume'"
                  size="24"
                  color="#22c55e"
                />
              </view>
            </view>
            <view class="announcement-footer-banner">
              <text class="announcement-text-banner">
                {{ announcement.text }}
              </text>
              <text class="announcement-time-banner">
                {{ announcement.createTimeFomat }}
              </text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
export default {
  name: 'NotificationSection',
  props: {
    notifications: {
      type: Array,
      default: () => [],
    },
    publicAnnouncements: {
      type: Array,
      default: () => [],
    },
    currentPlayingId: {
      type: [String, Number],
      default: null,
    },
  },
  emits: ['goToAnnouncements', 'playAudio'],
  methods: {
    goToAnnouncements() {
      this.$emit('goToAnnouncements');
    },

    playAudio(audioUrl, announcementId) {
      this.$emit('playAudio', { audioUrl, announcementId });
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
  },
};
</script>

<style scoped>
.home-section {
  margin-bottom: 48rpx;
  margin-left: 32rpx;
  margin-right: 32rpx;
}

.home-section-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1f2937;
  display: block;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.more-link {
  font-size: 26rpx;
  color: #6b7280;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  background-color: #f3f4f6;
}

.more-link:active {
  background-color: #e5e7eb;
}

/* 通知区域 - 优化显示重要性 */
.notification-section {
  margin-bottom: 24rpx;
}

.notification-swiper {
  height: 80rpx;
  background: linear-gradient(135deg, #fef7cd 0%, #fed7aa 100%);
  border-radius: 16rpx;
  border: 2rpx solid #f59e0b;
  box-shadow: 0 4rpx 12rpx rgba(245, 158, 11, 0.2);
  position: relative;
  overflow: hidden;
}

.notification-swiper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2rpx;
  background: linear-gradient(90deg, #f59e0b, #eab308, #f59e0b);
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.notification-item {
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
}

.notification-content {
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  width: 100%;
  justify-content: space-between;
  height: 100%;
}

.notification-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.notification-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-shrink: 0;
}

.notification-text {
  font-size: 28rpx;
  color: #92400e;
  font-weight: 600;
  margin-left: 16rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
}

.audio-icon-notification {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: transparent;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.audio-icon-notification:active {
  transform: scale(0.9);
  background: rgba(220, 38, 38, 0.1);
}

.notification-time {
  font-size: 22rpx;
  color: #a16207;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  background: transparent;
  padding: 0;
  border-radius: 0;
}

/* 公告区域 - 新的轮播样式 */
.announcement-section {
  margin-top: 16rpx;
}

.announcement-swiper {
  height: 160rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.announcement-swiper-item {
  width: 100%;
  height: 100%;
}

.announcement-card-banner {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.announcement-header-banner {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.level-badge {
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.level-text {
  font-size: 20rpx;
  font-weight: 600;
}

.announcement-title-banner {
  font-size: 28rpx;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
  line-height: 36rpx;
  margin-right: 8rpx;
}

.audio-icon-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background-color: rgba(34, 197, 94, 0.1);
  flex-shrink: 0;
}

.audio-icon-banner:active {
  transform: scale(0.9);
  background-color: rgba(34, 197, 94, 0.2);
}

.announcement-footer-banner {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16rpx;
}

.announcement-text-banner {
  font-size: 24rpx;
  color: #6b7280;
  line-height: 32rpx;
  flex: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.announcement-time-banner {
  font-size: 20rpx;
  color: #9ca3af;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
