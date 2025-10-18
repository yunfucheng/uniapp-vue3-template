<template>
  <view class="photo-management">
    <view class="photo-list">
      <view v-for="item in photos" :key="item.id" class="photo-card" @tap="onPreview(item)">
        <image class="photo-image" :src="item.imageUrl" mode="aspectFill" />
        <view class="photo-info">
          <image class="user-avatar" :src="item.userAvatar" mode="aspectFill" />
          <text class="user-nickname">
            {{ item.userNickname }}
          </text>
          <text class="photo-time">
            {{ item.time }}
          </text>
        </view>
      </view>
    </view>
    <view>
      <up-float-button :is-menu="false" bottom="0px" background-color="var(--theme-success)" @click="onAdd" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'PhotoManagement',
  props: {
    photos: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['addPhoto', 'previewPhoto'],
  methods: {
    onAdd() {
      this.$emit('addPhoto');
    },
    onPreview(item) {
      this.$emit('previewPhoto', item);
    },
  },
};
</script>

<style scoped>
.photo-management {
  position: relative;
  min-height: 100%;
}

.photo-list {
  margin: 0 32rpx 24rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.photo-card {
  background-color: var(--theme-bg-color);
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.photo-image {
  width: 100%;
  height: 380rpx;
  background-color: var(--theme-bg-color-secondary);
}

.photo-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx;
}

.user-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.user-nickname {
  font-size: 26rpx;
  color: var(--theme-main-color);
  font-weight: 600;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photo-time {
  font-size: 22rpx;
  color: var(--theme-light-color);
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
