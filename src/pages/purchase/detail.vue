<template>
  <view class="purchase-detail-page">
    <view>
      <u-navbar :auto-back="true" placeholder fixed>
        <template #right>
          <u-button size="small" color="#09BE4F" shape="circle" @click="contact">
            联系
          </u-button>
        </template>
      </u-navbar>
    </view>

    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      <PurchaseDetail v-if="item" :item="item" />
      <view v-else class="empty">
        <text>暂无详情</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import PurchaseDetail from '@/components/purchase/PurchaseDetail.vue';
import DataManager from '@/utils/dataManager.js';

export default {
  name: 'PurchaseDetailPage',
  components: { PurchaseDetail },
  data() {
    return { item: null };
  },
  onLoad(query) {
    const id = Number(query?.id);
    const list = DataManager.getDefaultPurchaseItems();
    this.item = list.find(i => i.id === id) || list[0];
  },
  methods: {
    contact() {
      uni.showToast({ title: '联系收购方（占位）', icon: 'none' });
    },
  },
};
</script>

<style scoped>
.purchase-detail-page { background-color: #f8fafc; height: 100vh; display:flex; flex-direction:column; }
.content-scroll { height: 100vh; padding-top: calc(88rpx + var(--status-bar-height)); }
.empty { margin: 40rpx; text-align:center; color:#6b7280; }
</style>
