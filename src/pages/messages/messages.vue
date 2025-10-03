<template>
  <view class="messages-page bg-gray-50 min-h-full pb-16">
    <!-- 顶部自定义导航栏 -->
     <view>
      <u-navbar title="消息中心" fixed placeholder>
        <template #left>
        </template>
        <template #right>
          <u-icon name="trash" size="20" color="#64748b" />
        </template>
      </u-navbar>      
     </view>

    <!-- 消息列表 -->
    <view class="px-3 py-3">
      <view v-for="(item, idx) in messages" :key="item.id" class="py-3">
        <view class="flex items-start">
          <!-- 用户头像 -->
          <up-image :src="item.avatar" mode="aspectFill" width="44px" height="44px" shape="circle" />

          <!-- 右侧内容：昵称 | 时间（靠右） + 消息正文 + 行分隔线（不占头像区域） -->
          <view class="flex-1 ml-3">
            <view class="flex items-center justify-between">
              <text class="text-base font-600 text-gray-800">{{ item.nickname }}</text>
              <text class="text-xs text-gray-400">{{ item.date }}</text>
            </view>
            <text class="mt-1 block text-sm text-gray-700">{{ item.content }}</text>
            <view v-if="idx !== messages.length - 1" class="row-sep"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部 Tabbar -->
    <CustomTabbar />
  </view>

</template>

<script>
import CustomTabbar from '@/components/CustomTabbar.vue'

export default {
  components: {
    CustomTabbar
  },
  data() {
    return {
      messages: [
        {
          id: 1,
          avatar: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar005.jpg',
          nickname: '幸福一生',
          date: '9月23日',
          content: '你干嘛?'
        },
        {
          id: 2,
          avatar: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar006.jpg',
          nickname: '爱江山更爱美人',
          date: '8月20日',
          content: '不要这样子'
        },
        {
          id: 3,
          avatar: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar007.jpg',
          nickname: 'Aser0327',
          date: '2025年8月1日',
          content: '感觉你的好意！'
        },
        {
          id: 4,
          avatar: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar008.jpg',
          nickname: '俗了月.',
          date: '2025年3月12日',
          content: '好像是这样子吧'
        },
        {
          id: 5,
          avatar: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar009.jpg',
          nickname: '🌸豌豆糕🎀',
          date: '2025年2月12日',
          content: '不要。'
        }
      ]
    }
  }
}
</script>

<style scoped>
.messages-page {
  height: 100vh;
  background-color: #f9fafb;
  padding-top: 100rpx;
}

.min-h-full {
  min-height: 100vh;
}

.font-700 {
  font-weight: 700;
}

.font-600 {
  font-weight: 600;
}

.pb-16 {
  padding-bottom: 64rpx;
}

.text-2xl {
  font-size: 48rpx;
}

.text-base {
  font-size: 32rpx;
}

.text-sm {
  font-size: 28rpx;
}

.text-xs {
  font-size: 24rpx;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-400 {
  color: #9ca3af;
}

.bg-white {
  background-color: #ffffff;
}

.border-b {
  border-bottom-width: 2rpx;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.rounded-lg {
  border-radius: 16rpx;
}

.shadow-sm {
  /* 去除卡片阴影以使用扁平样式 */
  box-shadow: none;
}

.px-3 {
  padding-left: 24rpx;
  padding-right: 24rpx;
}

.px-4 {
  padding-left: 32rpx;
  padding-right: 32rpx;
}

.py-3 {
  padding-top: 24rpx;
  padding-bottom: 24rpx;
}

.p-3 {
  padding: 24rpx;
}

.mb-3 {
  margin-bottom: 0;
}

.mt-3 {
  margin-top: 24rpx;
}

.ml-3 {
  margin-left: 24rpx;
}

.min-h-full {
  min-height: 100vh;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.block {
  display: block;
}

.divider {
  border-top: 2rpx solid #e5e7eb;
  margin: 8rpx 0 12rpx;
}

.row-sep {
  border-top: 2rpx solid #e5e7eb;
  margin-top: 12rpx;
  margin-left: 0;
}
</style>