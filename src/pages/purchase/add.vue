<template>
  <view class="add-purchase-page">
    <view>
      <u-navbar :auto-back="true" placeholder fixed>
        <template #right>
          <u-button size="small" color="#09BE4F" shape="circle" @click="publish">
            发布
          </u-button>
        </template>
      </u-navbar>
    </view>

    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      <view>
        <!-- 简洁输入：仅占位提示，无标签 -->
        <view>
          <u-input v-model="title" placeholder="描述收购信息" border="bottom" />
          <u-divider />
        </view>

        <view>
          <u-input v-model="priceDesc" placeholder="价格描述（如 每斤30元）" border="bottom" />
          <u-divider />
        </view>

        <!-- 选择项：可见范围、结束时间 -->
        <view class="selector-row" @tap="showScopeSelector">
          <text class="selector-label">
            可见范围
          </text>
          <view class="selector-right">
            <text class="selector-value">
              {{ visibleScope }}
            </text>
            <u-icon name="arrow-right" size="16" color="#9ca3af" />
          </view>
        </view>
        <u-divider />

        <view class="selector-row" @tap="showEndSelector">
          <text class="selector-label">
            结束时间
          </text>
          <view class="selector-right">
            <text class="selector-value">
              {{ endTimeText }}
            </text>
            <u-icon name="arrow-right" size="16" color="#9ca3af" />
          </view>
        </view>
        <u-divider />
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'AddPurchasePage',
  data() {
    return {
      title: '',
      priceDesc: '',
      visibleScope: '乡',
      endTimeText: '长期',
    };
  },
  methods: {
    showScopeSelector() {
      uni.showActionSheet({
        itemList: ['乡', '村', '屯'],
        success: (res) => {
          const scopes = ['乡', '村', '屯'];
          this.visibleScope = scopes[res.tapIndex];
        },
      });
    },
    showEndSelector() {
      uni.showActionSheet({
        itemList: ['长期', '1天', '3天', '7天'],
        success: (res) => {
          const ends = ['长期', '1天', '3天', '7天'];
          this.endTimeText = ends[res.tapIndex];
        },
      });
    },
    publish() {
      if (!this.title.trim()) {
        uni.showToast({ title: '请填写收购信息描述', icon: 'none' });
        return;
      }
      if (!this.priceDesc.trim()) {
        uni.showToast({ title: '请填写价格描述', icon: 'none' });
        return;
      }
      uni.showLoading({ title: '正在发布...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '已发布', icon: 'success' });
        setTimeout(() => uni.navigateBack(), 600);
      }, 800);
    },
  },
};
</script>

<style scoped>
.add-purchase-page { background-color: #f8fafc; height: 100vh; display:flex; flex-direction:column; }
.content-scroll { height: 100vh; padding-top: calc(88rpx + var(--status-bar-height)); }

.selector-row { padding: 24rpx; display:flex; align-items:center; justify-content:space-between; }
.selector-label { font-size: 28rpx; color: #4b5563; }
.selector-right { display:flex; align-items:center; gap: 12rpx; }
.selector-value { font-size: 28rpx; color: #1f2937; }
</style>
