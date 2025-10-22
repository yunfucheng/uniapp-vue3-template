<template>
  <view class="banner-section">
    <swiper
      class="banner-swiper"
      :autoplay="true"
      :interval="5000"
      :duration="800"
      :circular="true"
      :indicator-dots="true"
      indicator-color="rgba(255, 255, 255, 0.4)"
      indicator-active-color="#22c55e"
    >
      <swiper-item v-for="(banner, index) in banners" :key="index" class="banner-item">
        <image
          class="banner-image"
          :src="banner.imageUrl"
          mode="aspectFill"
          @tap="onBannerTap(banner)"
        />
        <view class="banner-overlay">
          <text class="banner-title">
            {{ banner.title }}
          </text>
          <text v-if="banner.description" class="banner-describe">
            {{ banner.description }}
          </text>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getRecommendedPhotos } from '@/api/rural';
import type { RuralPhoto } from '@/api/rural/types';
import storage from '@/utils/storage';

// 获取当前乡村代码
const getCurrentRuralCode = (): string => {
  return storage.get('user:selectedVillageCode') || '';
};

// 响应式数据
const banners = ref<RuralPhoto[]>([]);

// 获取推荐照片数据
const fetchRecommendedPhotos = async () => {
  try {
    const ruralCode = getCurrentRuralCode();
    if (!ruralCode) {
      console.warn('未获取到乡村代码，使用默认数据');
      return;
    }

    const result = await getRecommendedPhotos({ ruralCode });
    if (Array.isArray(result) && result.length > 0) {
      banners.value = result;
    }
  } catch (error) {
    console.error('获取推荐照片失败:', error);
    // 可以在这里设置默认数据或显示错误提示
  }
};

// 点击轮播图事件
const onBannerTap = (banner: RuralPhoto) => {
  // 跳转到家乡照片墙页面
  uni.navigateTo({ url: '/pages/rural-photo/wall' });
};

// 组件挂载时获取数据
onMounted(() => {
  fetchRecommendedPhotos();
});
</script>

<style scoped>
.banner-section {
  margin-bottom: 32rpx;
  position: relative;
}

.banner-swiper {
  height: 360rpx;
  margin: 0 32rpx 32rpx;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.banner-item {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  border-radius: 24rpx;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 40rpx 32rpx 24rpx;
  border-radius: 0 0 24rpx 24rpx;
}

.banner-title {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 700;
  display: block;
  margin-bottom: 8rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.banner-describe {
  color: #e5e7eb;
  font-size: 24rpx;
  line-height: 32rpx;
  display: block;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
}
</style>
