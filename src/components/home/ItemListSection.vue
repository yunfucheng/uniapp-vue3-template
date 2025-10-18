<template>
  <view class="home-section">
    <view class="section-header">
      <text class="home-section-title">
        {{ title }}
      </text>
      <text class="more-link" @tap="goToList">
        更多
      </text>
    </view>

    <view class="item-list">
      <view v-for="item in items" :key="item.id" class="item-card" @tap="goToDetail(item)">
        <!-- 顶部主行：图片 + 文本内容（横向） -->
        <view class="item-main">
          <image v-if="item.image && type === 'sale'" class="item-image" :src="item.image" mode="aspectFill" />

          <view class="item-content" :class="{ 'no-image': !item.image || type === 'purchase' }">
            <text class="item-title">
              {{ item.title }}
            </text>
            <view class="item-price-location">
              <text class="item-price" :class="type">
                {{ type === 'sale' ? `￥${item.price}` : `每斤${item.price}元` }}
              </text>
              <!-- 出售保留右侧位置，收购不在此行展示位置 -->
              <text v-if="type === 'sale'" class="item-location">
                {{ item.location }}
              </text>
            </view>
            <view class="item-user-info">
              <image class="user-avatar" :src="item.userAvatar" mode="aspectFill" />
              <text class="user-nickname">
                {{ item.userNickname }}
              </text>
              <!-- 出售保留右侧时间，收购不在此行展示时间 -->
              <text v-if="type === 'sale'" class="item-time">
                {{ item.time }}
              </text>
            </view>
          </view>

          <image v-if="item.image && type === 'purchase'" class="item-image" :src="item.image" mode="aspectFill" />
        </view>

        <!-- 底部单独一行：靠右显示（用于收购信息） -->
        <view v-if="type === 'purchase'" class="item-meta-row">
          <text class="item-location">
            {{ item.location }}
          </text>
          <text class="item-time">
            {{ item.time }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ItemListSection',
  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      required: true, // 'sale' or 'purchase'
      validator: value => ['sale', 'purchase'].includes(value),
    },
  },
  methods: {
    goToList() {
      const url = this.type === 'sale' ? '/pages/sale/sale' : '/pages/purchase/purchase';
      uni.navigateTo({ url });
    },

    goToDetail(item) {
      const url = this.type === 'sale'
        ? `/pages/sale/detail?id=${item.id}`
        : `/pages/purchase/detail?id=${item.id}`;
      uni.navigateTo({ url });
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
  color: var(--theme-main-color);
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
  color: var(--theme-tips-color);
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  background-color: var(--theme-bg-color-secondary);
}

.more-link:active {
  background-color: var(--theme-border-color);
}

.item-list {
  background-color: var(--theme-bg-color);
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.item-card {
  display: flex;
  flex-direction: column;
  padding: 24rpx;
  border-bottom: 1rpx solid var(--theme-border-color);
  transition: background-color 0.2s ease;
}

.item-card:last-child {
  border-bottom: none;
}

.item-card:active {
  background-color: var(--theme-bg-color-secondary);
}

.item-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  background-color: var(--theme-bg-color-secondary);
  flex-shrink: 0;
}

/* 新增：主内容横排容器 */
.item-main {
  display: flex;
  align-items: stretch;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  margin-left: 24rpx;
}

.item-content.no-image {
  margin-left: 0;
  margin-right: 24rpx;
}

.item-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--theme-main-color);
  line-height: 36rpx;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price-location {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.item-price {
  font-size: 32rpx;
  font-weight: 700;
}

.item-price.sale {
  color: var(--theme-error);
}

.item-price.purchase {
  color: var(--theme-success);
}

.item-location {
  font-size: 24rpx;
  color: var(--theme-tips-color);
}

.item-user-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.user-avatar {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background-color: var(--theme-bg-color-secondary);
  flex-shrink: 0;
}

.user-nickname {
  font-size: 24rpx;
  color: var(--theme-content-color);
  font-weight: 500;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-time {
  font-size: 22rpx;
  color: var(--theme-light-color);
  white-space: nowrap;
  flex-shrink: 0;
}

/* 底部元信息行（用于收购信息）：地点靠左，时间靠右 */
.item-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
  margin-top: 12rpx;
}

/* 收购信息底部行：固定“地点”和“时间”的宽度，避免互相影响 */
.item-meta-row .item-location {
  width: 180rpx;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--theme-tips-color);
  font-size: 24rpx;
}

.item-meta-row .item-time {
  width: 100rpx;
  text-align: right;
  white-space: nowrap;
}
</style>
