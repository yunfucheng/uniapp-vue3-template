<template>
  <view class="purchase-page">
    <!-- 顶部导航，与照片管理一致风格 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <view class="navbar-left" @tap="goBack">
          <u-icon name="arrow-left" size="20" color="#1f2937"></u-icon>
        </view>
        <view class="navbar-title">
          <text class="title-text">收购信息</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      <view class="section-content">
        <PurchaseManagement :items="items" @add-item="addItem" @view-item="viewItem" />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import PurchaseManagement from '@/components/purchase/PurchaseManagement.vue'
import DataManager from '@/utils/dataManager.js'

export default {
  name: 'PurchasePage',
  components: { PurchaseManagement },
  data() {
    return {
      items: DataManager.getDefaultPurchaseItems()
    }
  },
  methods: {
    goBack() { uni.navigateBack() },
    addItem() {
      uni.navigateTo({ url: '/pages/purchase/add' })
    },
    viewItem(item) {
      const id = item?.id || 1
      uni.navigateTo({ url: `/pages/purchase/detail?id=${id}` })
    }
  }
}
</script>

<style scoped>
.purchase-page { height: 100vh; background-color: #f9fafb; }
.custom-navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background-color: #ffffff; }
.navbar-content { display: flex; align-items: center; justify-content: space-between; padding: 16rpx 24rpx; }
.navbar-left, .navbar-right { width: 80rpx; display:flex; align-items:center; justify-content:center; }
.navbar-title { flex: 1; display:flex; align-items:center; justify-content:center; }
.title-text { font-size: 32rpx; font-weight: 600; color: #1f2937; }

.content-scroll { height: 100vh; padding-top: 100rpx; }
.section-content { min-height: 100%; padding-bottom: 40rpx; }
</style>