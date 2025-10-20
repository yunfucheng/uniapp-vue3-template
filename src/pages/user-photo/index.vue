<template>
  <view class="user-photowall">
    <view>
      <u-navbar :auto-back="true" title="用户照片" placeholder>
        <template #right>
          <view @tap="goToAddPhoto">
            <u-icon name="plus" size="20" color="#09BE4F" />
          </view>
        </template>
      </u-navbar>
    </view>

    <view class="photowall-container">
      <view class="header">
        <text class="title">用户照片墙</text>
        <text class="subtitle">记录我的家乡瞬间</text>
      </view>

      <LsjAlbum
        background="#fff"
        round="16rpx"
        field="url"
        :foldNum="0"
        :bigPicture="true"
        :preview="true"
        :list="albumList"
      />
    </view>
  </view>
</template>

<script>
import LsjAlbum from '@/components/photowall/lsj-album.vue';
import DataManager from '@/utils/dataManager.js';

export default {
  name: 'UserPhotoWall',
  components: { LsjAlbum },
  data() {
    return {
      albumList: [
        {
          title: '',
          value: [],
        },
      ],
    };
  },
  created() {
    const items = DataManager.getDefaultPhotoWallItems();
    const urls = (Array.isArray(items) ? items : []).map(item => ({ url: item.imageUrl }));
    this.albumList = [
      {
        title: '',
        value: urls,
      },
    ];
  },
  methods: {
    goToAddPhoto() {
      uni.navigateTo({ url: '/pages/user-photo/add' });
    },
  },
};
</script>

<style scoped>
.user-photowall {
  padding: 24rpx 32rpx 40rpx;
}

.photowall-container {
  padding: 24rpx 0 40rpx;
}

.header {
  margin-bottom: 16rpx;
}

.title { font-size: 36rpx; font-weight: 700; color: var(--theme-main-color); }

.subtitle { display: block; margin-top: 8rpx; font-size: 24rpx; color: var(--theme-tips-color); }
</style>