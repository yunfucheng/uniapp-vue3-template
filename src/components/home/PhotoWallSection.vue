<template>
  <view class="home-section">
    <view class="section-header">
      <text class="home-section-title">照片墙</text>
      <text class="more-link" @tap="goToPhotoWall">更多</text>
    </view>
    
    <view class="photo-wall-section">
      <scroll-view 
        scroll-x="true" 
        class="photo-wall-scroll"
        :show-scrollbar="false"
        :enable-back-to-top="false"
        :scroll-with-animation="true">
        <view class="photo-wall-content">
          <view v-for="photo in photoWallItems" :key="photo.id" 
                class="photo-wall-item" 
                @tap="onPhotoTap(photo)">
            <image class="photo-wall-bg" :src="photo.imageUrl" mode="aspectFill" />
            <view class="photo-wall-overlay">
              <view class="photo-wall-user-info">
                <image class="photo-wall-avatar" :src="photo.userAvatar" mode="aspectFill" />
                <view class="photo-wall-text">
                  <text class="photo-wall-nickname">{{ photo.userNickname }}</text>
                  <text class="photo-wall-time">{{ photo.time }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PhotoWallSection',
  props: {
    photoWallItems: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    goToPhotoWall() {
      // 改为通知父组件切换到首页的“照片”标签页
      this.$emit('go-to-photo')
    },
    
    onPhotoTap(photo) {
      // 点击照片展示大图或跳转到详情
      uni.previewImage({
        current: photo.imageUrl,
        urls: this.photoWallItems.map(item => item.imageUrl),
        indicator: 'number',
        loop: true,
        success: () => {
          console.log('照片预览成功')
        },
        fail: (err) => {
          console.error('照片预览失败:', err)
          uni.showToast({
            title: '照片加载失败',
            icon: 'none'
          })
        }
      })
    }
  }
}
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

.photo-wall-section {
  margin-top: 16rpx;
}

.photo-wall-scroll {
  white-space: nowrap;
  width: 100%;
  height: auto;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.photo-wall-scroll::-webkit-scrollbar {
  display: none;
}

.photo-wall-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-left: 0rpx;
  padding-right: 0rpx;
  gap: 16rpx;
  width: max-content;
}

.photo-wall-item {
  position: relative;
  width: 280rpx;
  height: 360rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.photo-wall-item:active {
  transform: scale(0.95);
}

.photo-wall-bg {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
}

.photo-wall-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 16rpx;
  border-radius: 0 0 16rpx 16rpx;
}

.photo-wall-user-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.photo-wall-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.photo-wall-text {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  flex: 1;
}

.photo-wall-nickname {
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 600;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photo-wall-time {
  color: rgba(255, 255, 255, 0.8);
  font-size: 22rpx;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.5);
}
</style>