<template>
  <view>
      <u-navbar :auto-back="true" title="家乡照片墙" placeholder>
        <template #right>
          <view @tap="goToAddPhoto">
            <u-icon name="plus" size="20" color="#09BE4F" />
          </view>
        </template>
      </u-navbar>
    </view>
  <view class="photowall-container">
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
</template>

<script>
import LsjAlbum from '@/components/photowall/lsj-album.vue';

export default {
  name: 'HometownPhotoWall',
  components: { LsjAlbum },
  data() {
    return {
      albumList: [
        {
          title: '',
          value: [
            { url: 'http://src.wwen.cc/Banner/ww04.jpg' },
            { url: 'http://src.wwen.cc/Banner/ww01.jpg' },
            { url: 'http://src.wwen.cc/Banner/ww02.jpg' },
            { url: 'http://src.wwen.cc/Banner/ww03.jpg' },
            { url: 'http://src.wwen.cc/Banner/ww04.jpg' },
            { url: 'http://src.wwen.cc/PhotoWall/wall001.jpg' },
            { url: 'http://src.wwen.cc/PhotoWall/wall002.jpg' },
            { url: 'http://src.wwen.cc/PhotoWall/wall003.jpg' },
            { url: 'http://src.wwen.cc/PhotoWall/wall004.jpg' },
            { url: 'http://src.wwen.cc/PhotoWall/wall005.jpg' },
          ],
        },
      ],
    };
  },
  methods: {
    goToAddPhoto() {
      uni.navigateTo({ url: '/pages/rural-photo/add' });
    },
  },
};
</script>

<style scoped>
.photowall-container {
  padding: 24rpx 32rpx 40rpx;
}

.header {
  margin-bottom: 16rpx;
}

.title { font-size: 36rpx; font-weight: 700; color: var(--theme-main-color); }

.subtitle { display: block; margin-top: 8rpx; font-size: 24rpx; color: var(--theme-tips-color); }
</style>