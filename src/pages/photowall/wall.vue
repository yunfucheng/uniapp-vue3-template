<template>
  <view>
      <u-navbar :auto-back="true" title="相片" placeholder>
        <template #right>
          <u-icon name="plus" size="20" color="#09BE4F" />
        </template>
      </u-navbar>
    </view>
  <view class="photowall-container">
    <view class="header">
      <text class="title">家乡照片墙</text>
      <text class="subtitle">记录家乡面貌</text>
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
            { url: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Banner/ww04.jpg' },
            { url: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Banner/ww01.jpg' },
            { url: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Banner/ww02.jpg' },
            { url: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Banner/ww03.jpg' },
            { url: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Banner/ww04.jpg' },
            { url: 'http://t2k8c3tkq.hn-bkt.clouddn.com/PhotoWall/wall001.jpg' },
            { url: 'http://t2k8c3tkq.hn-bkt.clouddn.com/PhotoWall/wall002.jpg' },
            { url: 'http://t2k8c3tkq.hn-bkt.clouddn.com/PhotoWall/wall003.jpg' },
            { url: 'http://t2k8c3tkq.hn-bkt.clouddn.com/PhotoWall/wall004.jpg' },
            { url: 'http://t2k8c3tkq.hn-bkt.clouddn.com/PhotoWall/wall005.jpg' },
          ],
        },
      ],
    };
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

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1f2937;
}

.subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #6b7280;
}
</style>