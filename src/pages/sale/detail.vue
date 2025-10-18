<template>
  <view class="sale-detail-page">
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
      <SaleDetail v-if="item" :item="item" />
      <view v-else class="empty">
        <text>暂无详情</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import SaleDetail from '@/components/sale/SaleDetail.vue';
import DataManager from '@/utils/dataManager.js';

export default {
  name: 'SaleDetailPage',
  components: { SaleDetail },
  data() {
    return { item: null };
  },
  onLoad(query) {
    const id = Number(query?.id);
    const list = DataManager.getDefaultSaleItems();
    this.item = list.find(i => i.id === id) || list[0];
  },
  methods: {
    contact() {
      uni.showToast({ title: '联系卖家（占位）', icon: 'none' });
    },
  },
};
</script>

<style scoped>
.sale-detail-page { background-color: var(--theme-bg-color-secondary); height: 100vh; display:flex; flex-direction:column; }
.content-scroll { height: 100vh; padding-top: calc(88rpx + var(--status-bar-height)); }
.empty { margin: 40rpx; text-align:center; color: var(--theme-tips-color); }
</style>
