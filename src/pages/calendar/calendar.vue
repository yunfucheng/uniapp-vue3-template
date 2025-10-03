<template>
  <view class="calendar-detail-container">
    <!-- 顶部导航栏 -->
    <view class="navigation-header">
      <u-icon name="arrow-left" size="20" color="#333333" @click="goBack" class="nav-back-icon"></u-icon>
      <text class="nav-title">黄历</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 日期切换控制 -->
    <view class="date-nav-controls">
      <button class="date-nav-btn" @click="previousDay">
        <text class="nav-icon">‹</text>
      </button>
      <view class="date-display" @click="showDatePicker = true">
        <text class="date-text">{{ calendarData.date }}</text>
        <text class="lunar-text">{{ calendarData.lunarCalendar }}</text>
      </view>
      <button class="date-nav-btn" @click="nextDay">
        <text class="nav-icon">›</text>
      </button>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y="true" v-if="calendarData">
      <view class="content-padding">
      <!-- 日期信息卡片 -->
      <view class="date-card">
        <view class="date-main">
          <text class="date-number">{{ formatDateNumber(calendarData.date) }}</text>
          <view class="date-info">
            <text class="date-detail">{{ formatDateDetail(calendarData.date) }}</text>
            <text class="lunar-date">{{ calendarData.lunarCalendar }}</text>
            <text class="year-tips">{{ calendarData.yearTips }}年</text>
          </view>
        </view>
        <view class="date-meta">
          <view class="meta-item">
            <text class="meta-label">生肖</text>
            <text class="meta-value">{{ calendarData.chineseZodiac }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-label">星座</text>
            <text class="meta-value">{{ calendarData.constellation }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-label">节气</text>
            <text class="meta-value">{{ calendarData.solarTerms }}</text>
          </view>
        </view>
        
        <!-- 分割线 -->
        <view class="divider-line"></view>
        
        <!-- 日期信息一行 -->
        <view class="date-info-row">
          <text class="info-item" :class="getWorkTypeClass(calendarData.type)">
            {{ calendarData.typeDes }}
          </text>
          <text class="info-item">
            今年第{{ calendarData.weekOfYear }}周
          </text>
          <text class="info-item">
            今年第{{ calendarData.dayOfYear }}天
          </text>
          <text class="info-item" v-if="calendarData.indexWorkDayOfMonth > 0">
            本月第{{ calendarData.indexWorkDayOfMonth }}个工作日
          </text>
        </view>
      </view>

      <!-- 宜事项 -->
      <view class="suit-card">
        <view class="card-header">
          <text class="card-title good-title">宜</text>
        </view>
        <view class="items-grid">
          <view 
            class="item-tag good-tag" 
            v-for="(item, index) in getSuitItems()" 
            :key="'suit-' + index"
          >
            <text class="item-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 忌事项 -->
      <view class="avoid-card">
        <view class="card-header">
          <text class="card-title bad-title">忌</text>
        </view>
        <view class="items-grid">
          <view 
            class="item-tag bad-tag" 
            v-for="(item, index) in getAvoidItems()" 
            :key="'avoid-' + index"
          >
            <text class="item-text">{{ item }}</text>
          </view>
        </view>
      </view>
      </view>
    </scroll-view>

    <!-- 日期选择器 -->
    <view class="date-picker-overlay" v-if="showDatePicker" @click="showDatePicker = false">
      <view class="date-picker-container" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择日期</text>
          <button class="picker-close" @click="showDatePicker = false">×</button>
        </view>
        <picker-view class="picker-view" :value="pickerValue" @change="onPickerChange">
          <picker-view-column>
            <view v-for="(year, index) in years" :key="index" class="picker-item">{{ year }}年</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="(month, index) in months" :key="index" class="picker-item">{{ month }}月</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="(day, index) in days" :key="index" class="picker-item">{{ day }}日</view>
          </picker-view-column>
        </picker-view>
        <view class="picker-actions">
          <button class="picker-btn cancel-btn" @click="showDatePicker = false">取消</button>
          <button class="picker-btn confirm-btn" @click="confirmDateChange">确认</button>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-overlay" v-if="loading">
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<script>
import { api } from '@/mock/api.js'

export default {
  data() {
    return {
      calendarData: {},
      loading: false,
      showDatePicker: false,
      currentDate: '',
      pickerValue: [0, 0, 0],
      years: [],
      months: [],
      days: []
    }
  },
  computed: {
    
  },
  onLoad(options) {
    // 从路由参数获取日期，如果没有则使用今天
    const date = options.date || new Date().toISOString().split('T')[0]
    this.currentDate = date
    this.loadCalendarData(date)
    this.initDatePicker()
  },
  methods: {
    // 加载黄历数据
    async loadCalendarData(date) {
      this.loading = true
      try {
        const res = await api.getCalendarInfo(date)
        if (res.code === 200) {
          this.calendarData = res.data
          this.currentDate = date
        } else {
          uni.showToast({
            title: '获取黄历数据失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('获取黄历数据失败:', error)
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1
      })
    },

    // 前一天
    previousDay() {
      const date = new Date(this.currentDate)
      date.setDate(date.getDate() - 1)
      const newDate = date.toISOString().split('T')[0]
      this.loadCalendarData(newDate)
    },

    // 后一天
    nextDay() {
      const date = new Date(this.currentDate)
      date.setDate(date.getDate() + 1)
      const newDate = date.toISOString().split('T')[0]
      this.loadCalendarData(newDate)
    },

    // 格式化日期数字
    formatDateNumber(dateStr) {
      return new Date(dateStr).getDate()
    },

    // 格式化日期详情
    formatDateDetail(dateStr) {
      const date = new Date(dateStr)
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekDays[date.getDay()]}`
    },

    // 获取工作类型样式类
    getWorkTypeClass(type) {
      return {
        'work-type-work': type === 0,
        'work-type-rest': type === 1,
        'work-type-holiday': type === 2
      }
    },

    // 获取宜事项数组
    getSuitItems() {
      return this.calendarData.suit ? this.calendarData.suit.split('.') : []
    },

    // 获取忌事项数组
    getAvoidItems() {
      return this.calendarData.avoid ? this.calendarData.avoid.split('.') : []
    },

    // 初始化日期选择器
    initDatePicker() {
      const currentYear = new Date().getFullYear()
      
      // 生成年份数组 (当前年份前后5年)
      this.years = []
      for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        this.years.push(i)
      }
      
      // 生成月份数组
      this.months = []
      for (let i = 1; i <= 12; i++) {
        this.months.push(i)
      }
      
      // 生成日期数组
      this.updateDays()
      
      // 设置当前选中的日期
      const date = new Date(this.currentDate)
      this.pickerValue = [
        this.years.indexOf(date.getFullYear()),
        date.getMonth(),
        date.getDate() - 1
      ]
    },

    // 更新日期数组
    updateDays() {
      const year = this.years[this.pickerValue[0]] || new Date().getFullYear()
      const month = this.pickerValue[1] + 1
      const daysInMonth = new Date(year, month, 0).getDate()
      
      this.days = []
      for (let i = 1; i <= daysInMonth; i++) {
        this.days.push(i)
      }
    },

    // 日期选择器变化
    onPickerChange(e) {
      this.pickerValue = e.detail.value
      this.updateDays()
    },

    // 确认日期更改
    confirmDateChange() {
      const year = this.years[this.pickerValue[0]]
      const month = this.pickerValue[1] + 1
      const day = this.days[this.pickerValue[2]]
      
      const newDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      this.loadCalendarData(newDate)
      this.showDatePicker = false
    }
  }
}
</script>

<style scoped>
.calendar-detail-container {
  min-height: 100vh;
  background-color: #f6f3ec;
}

/* 顶部导航栏 */
.navigation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 44px 16px 16px 16px; /* 适配状态栏 */
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-back-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-placeholder {
  width: 40px;
  height: 40px;
}

/* 日期切换控制 */
.date-nav-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.date-nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0;
  padding: 0;
}

.nav-icon {
  font-size: 24px;
  color: #333;
  font-weight: bold;
  line-height: 1;
}

.date-display {
  text-align: center;
  color: #333;
}

.date-text {
  font-size: 18px;
  font-weight: bold;
  display: block;
}

.lunar-text {
  font-size: 14px;
  opacity: 0.8;
  margin-top: 4px;
  display: block;
}

/* 滚动内容 */
.content-scroll {
  height: calc(100vh - 160px); /* 适配新的导航栏高度 */
}

.content-padding {
  padding: 0 16px 20px 16px;
}

/* 日期信息卡片 */
.date-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin: 16px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.date-main {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.date-number {
  font-size: 56px;
  font-weight: bold;
  color: #667eea;
  margin-right: 24px;
  width: 90px;
  text-align: center;
  flex-shrink: 0;
}

.date-info {
  flex: 1;
  min-width: 0; /* 允许文本截断 */
}

.date-detail {
  font-size: 20px;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 6px;
}

.lunar-date {
  font-size: 16px;
  color: #666;
  display: block;
  margin-bottom: 6px;
}

.year-tips {
  font-size: 16px;
  color: #999;
  display: block;
}

.date-meta {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
  margin-bottom: 20px;
}

.meta-item {
  text-align: center;
  flex: 1;
}

.meta-label {
  font-size: 14px;
  color: #999;
  display: block;
  margin-bottom: 6px;
}

.meta-value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  display: block;
}

/* 分割线 */
.divider-line {
  height: 1px;
  background-color: #e0e0e0;
  margin: 20px 0;
}

/* 日期信息一行 */
.date-info-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.info-item {
  font-size: 15px;
  color: #333;
  font-weight: 500;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 20px;
  text-align: center;
  flex: 1;
  min-width: 80px;
}

/* 通用卡片样式 */
.suit-card, .avoid-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin: 16px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 20px;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.good-title {
  color: #4CAF50;
}

.bad-title {
  color: #f44336;
}

/* 宜忌事项 */
.items-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.item-tag {
  padding: 10px 16px;
  border-radius: 24px;
  font-size: 16px;
}

.good-tag {
  background: #e8f5e8;
  color: #4CAF50;
  border: 1px solid #c8e6c9;
}

.bad-tag {
  background: #ffeaea;
  color: #f44336;
  border: 1px solid #ffcdd2;
}

.item-text {
  font-size: 16px;
}

/* 日期选择器 */
.date-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.date-picker-container {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.picker-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.picker-close {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: #f0f0f0;
  border: none;
  font-size: 20px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker-view {
  height: 200px;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 16px;
}

.picker-actions {
  display: flex;
  padding: 16px 20px;
  gap: 12px;
}

.picker-btn {
  flex: 1;
  height: 44px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 500;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
}

.confirm-btn {
  background: #667eea;
  color: white;
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-text {
  color: white;
  font-size: 16px;
}
</style>