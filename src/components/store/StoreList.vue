<template>
  <view class="store-list">
    <!-- 筛选标签 -->
    <view class="filter-bar">
      <text class="filter-title">筛选标签</text>
      <view class="tag-list">
        <u-tag
          v-for="tag in tagOptions"
          :key="tag"
          :text="tag"
          :type="selectedTag === tag ? 'success' : 'info'"
          :plain="selectedTag !== tag"
          shape="circle"
          class="filter-tag"
          @click="toggleTag(tag)"
        />
        <u-tag
          text="重置"
          type="warning"
          plain
          shape="circle"
          class="filter-tag"
          @click="resetTag"
        />
      </view>
    </view>

    <!-- 列表卡片 -->
    <view class="cards">
      <view v-for="item in filteredItems" :key="item.id" class="card">
        <image v-if="item.image" class="card-image" :src="item.image" mode="aspectFill" />
        <view class="card-body">
          <view class="row top-row">
            <text class="name">{{ item.name }}</text>
            <u-tag :text="item.status" :type="item.status === '营业中' ? 'success' : 'default'" size="mini" />
          </view>
          <view class="row location">
            <u-icon name="map" size="16" color="#64748b" />
            <text class="loc-text">{{ item.location }}</text>
          </view>
          <view class="desc">{{ item.desc }}</view>
          <view class="row tags">
            <u-tag
              v-for="t in item.tags"
              :key="t"
              :text="t"
              type="primary"
              plain
              size="mini"
              class="item-tag"
            />
          </view>
          <view class="actions">
            <u-button
              v-if="item.supportPhone && item.phone"
              color="#09BE4F"
              shape="circle"
              @click="call(item.phone)"
            >电话联系</u-button>
            <u-button v-else type="info" plain shape="circle" disabled>暂无电话</u-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'StoreList',
  props: {
    items: { type: Array, default: () => [] }
  },
  data() {
    return {
      tagOptions: ['日常用品', '粉店', '饭店', '住宿', '快递', '便车'],
      selectedTag: ''
    }
  },
  computed: {
    filteredItems() {
      if (!this.selectedTag) return this.items
      return this.items.filter(i => Array.isArray(i.tags) && i.tags.includes(this.selectedTag))
    }
  },
  methods: {
    toggleTag(tag) {
      this.selectedTag = this.selectedTag === tag ? '' : tag
    },
    resetTag() {
      this.selectedTag = ''
    },
    call(phone) {
      if (!phone) return
      uni.makePhoneCall({ phoneNumber: phone })
    }
  }
}
</script>

<style scoped>
.store-list { padding: 0 32rpx 32rpx 32rpx; }
.filter-bar { margin-bottom: 16rpx; }
.filter-title { font-size: 26rpx; color: #334155; }
.tag-list { margin-top: 12rpx; display: flex; flex-wrap: wrap; gap: 12rpx; }
.filter-tag { margin-right: 8rpx; }
.cards { display: flex; flex-direction: column; gap: 24rpx; }
.card { background-color: #fff; border-radius: 16rpx; box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.06); overflow: hidden; }
.card-image { width: 100%; height: 280rpx; background-color: #f1f5f9; }
.card-body { padding: 16rpx; }
.row { display: flex; align-items: center; gap: 8rpx; }
.top-row { justify-content: space-between; margin-bottom: 8rpx; }
.name { font-size: 30rpx; font-weight: 600; color: #111827; }
.location { color: #64748b; font-size: 24rpx; }
.loc-text { margin-left: 6rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.desc { margin: 8rpx 0 12rpx; color: #334155; font-size: 26rpx; line-height: 1.6; }
.tags { flex-wrap: wrap; gap: 8rpx; margin-bottom: 12rpx; }
.item-tag { margin-right: 8rpx; }
.actions { display: flex; justify-content: flex-end; }
</style>