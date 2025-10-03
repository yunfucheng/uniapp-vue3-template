<template>
  <view class="sale-management">
    <!-- 列表区域 -->
    <view class="item-list">
      <view v-for="item in items" :key="item.id" class="item-card" @tap="onView(item)">
        <view class="item-main">
          <image v-if="item.image" class="item-image" :src="item.image" mode="aspectFill" />
          <view class="item-content" :class="{ 'no-image': !item.image }">
            <text class="item-title">
              {{ item.title }}
            </text>
            <view class="item-price-location">
              <text class="item-price sale">
                ￥{{ item.price }}
              </text>
              <text class="item-location">
                {{ item.location }}
              </text>
            </view>
            <view class="item-user-info">
              <image class="user-avatar" :src="item.userAvatar" mode="aspectFill" />
              <text class="user-nickname">
                {{ item.userNickname }}
              </text>
              <text class="item-time">
                {{ item.time }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 发布按钮 -->
    <view>
      <up-float-button :is-menu="false" bottom="0px" background-color="#09BE4F" @click="onAdd" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'SaleManagement',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['addItem', 'viewItem'],
  methods: {
    onAdd() {
      this.$emit('addItem');
    },
    onView(item) {
      this.$emit('viewItem', item);
    },
  },
};
</script>

<style scoped>
.sale-management { position: relative; min-height: 100%; padding: 32rpx; padding-top: 0; }

.item-list { display: flex; flex-direction: column; gap: 24rpx; }

.item-card { background-color: #ffffff; border-radius: 16rpx; overflow: hidden; box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06); }

.item-main { display: flex; gap: 24rpx; align-items: stretch; }

.item-image { width: 220rpx; height: 180rpx; background-color: #f3f4f6; flex-shrink: 0; }

.item-content { flex: 1; padding: 16rpx; display: flex; flex-direction: column; }
.item-content.no-image { padding-left: 0; }

.item-title { font-size: 28rpx; color: #1f2937; font-weight: 600; line-height: 1.5; margin-bottom: 12rpx; }

.item-price-location { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.item-price.sale { font-size: 32rpx; font-weight: 700; color: #ef4444; }
.item-location { font-size: 24rpx; color: #6b7280; }

.item-user-info { display: flex; align-items: center; gap: 12rpx; }
.user-avatar { width: 32rpx; height: 32rpx; border-radius: 50%; background-color: #f3f4f6; flex-shrink: 0; }
.user-nickname { font-size: 24rpx; color: #374151; font-weight: 500; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-time { font-size: 22rpx; color: #9ca3af; white-space: nowrap; flex-shrink: 0; }
</style>
