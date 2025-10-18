<template>
  <view class="photo-manage-page">
    <!-- 顶部导航，与公告保持一致风格 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <view class="navbar-left" @tap="goBack">
          <u-icon name="arrow-left" size="20" color="var(--theme-main-color)" />
        </view>
        <view class="navbar-title">
          <text class="title-text">
            照片管理
          </text>
        </view>
        <view class="navbar-right" />
      </view>
    </view>

    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      <view class="section-content">
        <PhotoManagement
          :photos="photos"
          @add-photo="goToAddPhoto"
          @preview-photo="previewPhoto"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import PhotoManagement from '@/components/photowall/PhotoManagement.vue';
import DataManager from '@/utils/dataManager.js';

export default {
  name: 'PhotoManagePage',
  components: { PhotoManagement },
  data() {
    return {
      photos: DataManager.getDefaultPhotoWallItems(),
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    previewPhoto(item) {
      uni.previewImage({
        current: item.imageUrl,
        urls: this.photos.map(p => p.imageUrl),
        indicator: 'number',
        loop: true,
      });
    },
    goToAddPhoto() {
      uni.navigateTo({ url: '/pages/photowall/add' });
    },
  },
};
</script>

<style scoped>
.photo-manage-page { height: 100vh; background-color: var(--theme-bg-color-secondary); }
.custom-navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background-color: #ffffff; }
.navbar-content { display: flex; align-items: center; justify-content: space-between; padding: 16rpx 24rpx; }
.navbar-left, .navbar-right { width: 80rpx; display:flex; align-items:center; justify-content:center; }
.navbar-title { flex: 1; display:flex; align-items:center; justify-content:center; }
.title-text { font-size: 32rpx; font-weight: 600; color: var(--theme-main-color); }

.content-scroll { height: 100vh; padding-top: 100rpx; }
.section-content { min-height: 100%; padding-bottom: 40rpx; }
</style>
