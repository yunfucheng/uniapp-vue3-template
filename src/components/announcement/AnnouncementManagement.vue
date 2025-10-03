<template>
  <view class="announcement-management">

    <!-- 搜索栏 -->
    <view class="filter-section">
      <view class="search-bar">
        <u-icon name="search" size="16" color="#9ca3af"></u-icon>
        <input 
          type="text" 
          placeholder="搜索公告标题或内容" 
          class="search-input"
          v-model="searchKeyword"
          @input="filterAnnouncements" />
      </view>
    </view>

    <!-- 公告列表 -->
    <view class="announcement-list">
      <view v-for="item in filteredAnnouncements" :key="item.id" class="announcement-card" @tap="goToDetail(item)">
        <!-- 第一行：标题 + 语音播放按钮 -->
        <view class="card-header">
          <text class="card-title">{{ item.title }}</text>
          <view v-if="item.audioUrl" class="audio-btn" @tap.stop="playAudio(item)">
            <u-icon name="volume" size="16" color="#22c55e"></u-icon>
          </view>
        </view>
        
        <!-- 第二行：内容 -->
        <view class="card-content">
          <text class="card-text">{{ item.text }}</text>
        </view>
        
        <!-- 第三行：公告类型 + 公告级别 + 操作按钮 + 时间 -->
        <view class="card-footer">
          <view class="footer-left">
            <view class="type-badge" :class="item.type === 0 ? 'notification-badge' : 'announcement-badge'">
              <text class="badge-text">{{ item.type === 0 ? '通知' : '公告' }}</text>
            </view>
            <view class="level-badge" :style="{ backgroundColor: getLevelColor(item.adminLevel) + '15' }">
              <text class="level-text" :style="{ color: getLevelColor(item.adminLevel) }">
                {{ getLevelText(item.adminLevel) }}
              </text>
            </view>
          </view>
          <view class="footer-right">
            <view class="action-btn-small" @tap="editAnnouncement(item)">
              <u-icon name="edit-pen" size="14" color="#3b82f6"></u-icon>
            </view>
            <view class="action-btn-small" @tap="deleteAnnouncement(item.id)">
              <u-icon name="trash" size="14" color="#ef4444"></u-icon>
            </view>
            <text class="item-time">{{ item.createTimeFomat }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="filteredAnnouncements.length === 0" class="empty-state">
      <u-icon name="info" size="48" color="#d1d5db"></u-icon>
      <text class="empty-title">暂无公告</text>
      <text class="empty-subtitle">还没有发布任何公告</text>
    </view>
    
    <view>
      <up-float-button :isMenu="false" backgroundColor="#09BE4F" @click="publishAnnouncement" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'AnnouncementManagement',
  props: {
    announcements: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchKeyword: '',
      filteredAnnouncements: []
    }
  },

  watch: {
    announcements: {
      handler() {
        this.filteredAnnouncements = this.announcements
        this.filterAnnouncements()
      },
      immediate: true
    }
  },
  methods: {
    // 发布公告
    publishAnnouncement() {
      uni.navigateTo({
        url: '/pages/announcement/add'
      })
    },
    
    // 管理公告
    manageAnnouncements() {
      uni.showActionSheet({
        itemList: ['批量删除', '导出数据', '设置权限', '查看统计'],
        success: (res) => {
          const actions = ['批量删除', '导出数据', '设置权限', '查看统计']
          uni.showToast({
            title: `执行: ${actions[res.tapIndex]}`,
            icon: 'none'
          })
        }
      })
    },
    
    // 编辑公告
    editAnnouncement(item) {
      this.$emit('edit-announcement', item)
    },
    
    // 删除公告
    deleteAnnouncement(id) {
      uni.showModal({
        title: '确认删除',
        content: '删除后无法恢复，确定要删除这条公告吗？',
        success: (res) => {
          if (res.confirm) {
            this.$emit('delete-announcement', id)
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            })
          }
        }
      })
    },
    
    // 播放音频
    playAudio(item) {
      this.$emit('play-audio', { audioUrl: item.audioUrl, announcementId: item.id })
    },
    
    // 跳转到公告详情
    goToDetail(item) {
      uni.navigateTo({
        url: `/pages/announcement/detail?id=${item.id}`
      })
    },
    
    // 搜索过滤
    filterAnnouncements() {
      let filtered = this.announcements
      
      // 按关键词搜索
      if (this.searchKeyword) {
        filtered = filtered.filter(item => 
          item.title.includes(this.searchKeyword) || 
          item.text.includes(this.searchKeyword)
        )
      }
      
      this.filteredAnnouncements = filtered
    },
    
    // 获取管理级别文本
    getLevelText(adminLevel) {
      const levelMap = {
        0: '屯',
        1: '村', 
        2: '乡'
      }
      return levelMap[adminLevel] || '村'
    },
    
    // 获取管理级别颜色
    getLevelColor(adminLevel) {
      const colorMap = {
        0: '#F59E0B', // 屯 - 黄色
        1: '#DC2626', // 村 - 红色
        2: '#3B82F6'  // 乡 - 蓝色
      }
      return colorMap[adminLevel] || '#DC2626'
    },
    

  }
}
</script>

<style scoped>
.announcement-management {
  padding: 32rpx;
  padding-top: 0;
}

/* 公告管理页面样式 */
.announcement-header {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  margin: 0 -32rpx 32rpx -32rpx;
  padding: 32rpx;
  color: white;
}

.announcement-title-section {
  margin-bottom: 24rpx;
}

.page-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #ffffff;
  display: block;
  margin-bottom: 8rpx;
}

.page-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}

.header-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 20rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background-color: #ffffff;
  color: #3b82f6;
}

.action-btn.primary:active {
  background-color: #f1f5f9;
}

.action-btn.secondary {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
}

.action-btn.secondary:active {
  background-color: rgba(255, 255, 255, 0.3);
}

.action-text {
  font-size: 26rpx;
}

/* 统计卡片 */
.stats-section {
  display: flex;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.stat-card {
  flex: 1;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.stat-number {
  font-size: 48rpx;
  font-weight: 700;
  color: #1f2937;
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #6b7280;
  display: block;
}

/* 筛选和搜索 */
.filter-section {
  margin-bottom: 32rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  gap: 16rpx;
  margin: 0 -32rpx;
  margin-left: 0;
  margin-right: 0;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #374151;
  border: none;
  outline: none;
}

/* 公告列表 */
.announcement-list {
  padding: 0;
}

.announcement-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.announcement-card:active {
  transform: translateY(2rpx);
  box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.1);
}

/* 第一行：标题 + 语音按钮 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
  margin-right: 16rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  word-break: break-all;
  min-width: 0;
}

.audio-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background-color: rgba(34, 197, 94, 0.1);
  transition: all 0.2s ease;
}

.audio-btn:active {
  transform: scale(0.9);
  background-color: rgba(34, 197, 94, 0.2);
}

/* 第二行：内容 */
.card-content {
  margin-bottom: 16rpx;
  overflow: hidden;
  width: 100%;
}

.card-text {
  font-size: 26rpx;
  color: #6b7280;
  line-height: 36rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
  width: 100%;
  display: block;
  word-break: break-all;
}

/* 第三行：底部信息 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.type-badge {
  display: flex;
  align-items: center;
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  font-weight: 500;
  height: 28rpx;
  justify-content: center;
}

.notification-badge {
  background-color: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.announcement-badge {
  background-color: rgba(5, 150, 105, 0.1);
  color: #059669;
}

.badge-text {
  font-size: 20rpx;
}

.level-badge {
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  margin-right: 8rpx;
  height: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level-text {
  font-size: 20rpx;
  font-weight: 600;
}

.action-btn-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
  border-radius: 6rpx;
  background-color: #f3f4f6;
  transition: all 0.2s ease;
  margin-right: 8rpx;
}

.action-btn-small:active {
  transform: scale(0.9);
}

.item-time {
  font-size: 22rpx;
  color: #9ca3af;
  white-space: nowrap;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
  text-align: center;
}

.empty-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #9ca3af;
  margin: 24rpx 0 12rpx;
  display: block;
}

.empty-subtitle {
  font-size: 26rpx;
  color: #d1d5db;
  margin-bottom: 40rpx;
  display: block;
}
</style>