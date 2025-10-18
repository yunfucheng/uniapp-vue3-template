<template>
  <view class="sale-detail">
    <!-- 顶部：用户信息（仿闲鱼） -->
    <view class="user-row">
      <image class="avatar" :src="item.userAvatar" mode="aspectFill" />
      <view class="user-meta">
        <text class="nickname">
          {{ item.userNickname }}
        </text>
        <view class="meta-line">
          <text class="location">
            {{ item.location || '乌翁屯' }}
          </text>
          <text class="dot">
            ·
          </text>
          <text class="time">
            {{ item.time }}
          </text>
        </view>
      </view>
      <view class="action" />
    </view>

    <!-- 主图（可选） -->
    <image v-if="item.image" class="hero-image" :src="item.image" mode="aspectFill" />

    <!-- 标题与价格（仿闲鱼，价格突出） -->
    <view class="title-price">
      <text class="title">
        {{ item.title }}
      </text>
      <text class="price">
        {{ formattedPrice }}
      </text>
    </view>
    <u-divider />

    <!-- 描述（此处沿用标题作为简述） -->
    <view class="desc">
      <text class="desc-text">
        {{ item.title }}
      </text>
    </view>

    <!-- 底部操作（仿闲鱼：联系 / 收藏） -->
    <view class="bottom-actions">
      <u-button class="fav-btn" type="info" plain shape="circle" @click="onFav">
        收藏
      </u-button>
      <u-button class="contact-btn" color="var(--theme-success)" shape="circle" @click="onContact">
        联系卖家
      </u-button>
    </view>
  </view>
</template>

<script>
import DataManager from '@/utils/dataManager.js';

export default {
  name: 'SaleDetail',
  props: {
    item: { type: Object, required: true },
  },
  computed: {
    formattedPrice() {
      return DataManager.formatPrice(this.item?.price || '', 'sale');
    },
  },
  methods: {
    onFav() {
      uni.showToast({ title: '已收藏（占位）', icon: 'none' });
    },
    onContact() {
      uni.showToast({ title: '联系卖家（占位）', icon: 'none' });
    },
  },
};
</script>

<style scoped>
.sale-detail { margin: 24rpx; background: var(--theme-bg-color); border-radius: 16rpx; overflow:hidden; box-shadow:0 4rpx 12rpx rgba(0,0,0,0.06); }
.user-row { display:flex; align-items:center; gap: 16rpx; padding: 24rpx; }
.avatar { width:64rpx; height:64rpx; border-radius:50%; background: var(--theme-bg-color-secondary); flex-shrink:0; }
.user-meta { flex:1; display:flex; flex-direction:column; }
.nickname { font-size: 28rpx; color: var(--theme-main-color); font-weight:600; }
.meta-line { display:flex; align-items:center; gap: 8rpx; margin-top: 6rpx; }
.location { font-size: 24rpx; color: var(--theme-tips-color); }
.dot { color: var(--theme-light-color); }
.time { font-size: 24rpx; color: var(--theme-light-color); }
.hero-image { width:100%; height: 420rpx; background: var(--theme-bg-color-secondary); }
.title-price { display:flex; align-items:center; justify-content:space-between; padding: 24rpx; }
.title { font-size: 30rpx; color: var(--theme-main-color); font-weight:600; flex:1; padding-right: 16rpx; }
.price { font-size: 36rpx; color: var(--theme-error); font-weight:700; }
.desc { padding: 0 24rpx 24rpx 24rpx; }
.desc-text { font-size: 28rpx; color: var(--theme-main-color); line-height: 1.6; }
.bottom-actions { display:flex; gap: 16rpx; padding: 24rpx; border-top:1px solid var(--theme-border-color); }
.fav-btn { flex: 1; }
.contact-btn { flex: 2; }
</style>
