<template>
  <view class="calendar-container">
    <!-- 顶部导航栏 -->
    <view class="header-section">
      <u-navbar :auto-back="true" title="黄历" placeholder>
      </u-navbar>
    </view>

    <!-- 日期切换控制 -->
    <view class="date-nav-controls">
      <up-button 
        class="date-nav-btn" 
        @click="previousDay"
        :loading="loading"
      >
        <up-icon name="arrow-left" color="#6b7280" size="18"></up-icon>
      </up-button>
      
      <view class="date-center" @click="showDatePicker = true">
        <text class="date-text">{{ formatDisplayDate(currentDate) }}</text>
      </view>
      
      <up-button 
        class="date-nav-btn" 
        @click="nextDay"
        :loading="loading"
      >
        <up-icon name="arrow-right" color="#6b7280" size="18"></up-icon>
      </up-button>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" :scroll-y="true">
      <view class="content-padding" v-if="calendarData">
        <!-- 日期信息卡片 -->
        <view class="date-info-card">
          <view class="date-info-content">
            <view class="date-display">
              <text class="date-number">{{ new Date(currentDate).getDate() }}</text>
              <text class="date-month">{{ new Date(currentDate).getMonth() + 1 }}月</text>
            </view>
            <view class="date-details">
              <text class="lunar-info">{{ calendarData.yinLi }}</text>
              <view class="additional-info">
                <view class="info-item">
                  <text class="info-label">五行:</text>
                  <text>{{ calendarData.wuXing }}</text>
                </view>
                <view class="info-item">
                  <text class="info-label">冲煞:</text>
                  <text>{{ calendarData.chongSha }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 宜忌卡片 -->
        <view class="yi-ji-card">
          <view class="yi-section">
            <view class="section-header">
              <text class="section-title">宜事</text>
            </view>
            <text class="section-content">{{ calendarData.yi || '无特别宜事' }}</text>
          </view>
          <view class="ji-section">
            <view class="section-header">
              <text class="section-title">忌事</text>
            </view>
            <text class="section-content">{{ calendarData.ji || '无特别忌事' }}</text>
          </view>
        </view>

        <!-- 传统信息卡片 -->
        <view class="traditional-info-cards">
          <view class="info-card">
            <text class="info-title">吉神宜趋</text>
            <text class="info-content">{{ calendarData.jiShen || '无' }}</text>
          </view>
          
          <view class="info-card">
            <text class="info-title">凶神宜忌</text>
            <text class="info-content">{{ calendarData.xiongShen || '无' }}</text>
          </view>
          
          <view class="info-card">
            <text class="info-title">彭祖百忌</text>
            <text class="info-content">{{ calendarData.baiJi || '无' }}</text>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-container">
        <u-loading-icon mode="spinner" color="#daa520" size="40"></u-loading-icon>
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 错误状态 -->
      <view v-if="error && !loading" class="error-container">
        <text class="error-text">{{ error }}</text>
        <up-button class="retry-btn" @click="loadCalendarData">重试</up-button>
      </view>
    </scroll-view>

    <!-- 日期选择器 -->
    <view v-if="showDatePicker" class="date-picker-overlay" @click="showDatePicker = false">
      <view class="date-picker-container" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择日期</text>
          <button class="picker-close" @click="showDatePicker = false">×</button>
        </view>
        <picker-view class="picker-view" :value="pickerValue" @change="onPickerChange">
          <picker-view-column>
            <view v-for="(year, index) in years" :key="index" class="picker-item">
              {{ year }}年
            </view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="(month, index) in months" :key="index" class="picker-item">
              {{ month }}月
            </view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="(day, index) in days" :key="index" class="picker-item">
              {{ day }}日
            </view>
          </picker-view-column>
        </picker-view>
        <view class="picker-actions">
          <button class="picker-btn cancel-btn" @click="showDatePicker = false">取消</button>
          <button class="picker-btn confirm-btn" @click="confirmDateChange">确认</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getCalendarByDate } from '@/api/calendar';
import type { CalendarData } from '@/api/calendar/types';

// 响应式数据
const loading = ref(false);
const error = ref('');
const showDatePicker = ref(false);
const currentDate = ref(new Date());
const calendarData = ref<CalendarData | null>(null);
const pickerValue = ref([0, 0, 0]);
const years = ref<number[]>([]);
const months = ref<number[]>([]);
const days = ref<number[]>([]);

// 格式化显示日期
const formatDisplayDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 格式化API请求日期
const formatApiDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 加载日历数据
const loadCalendarData = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const dateStr = formatApiDate(currentDate.value);
    const response = await getCalendarByDate({ date: dateStr });
    
    if (response.code === '0' && response.result) {
      calendarData.value = response.result;
    } else {
      error.value = response.message || '获取数据失败';
    }
  } catch (err: any) {
    console.error('获取日历数据失败:', err);
    error.value = '网络错误，请检查网络连接';
  } finally {
    loading.value = false;
  }
};

// 前一天
const previousDay = () => {
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() - 1);
  currentDate.value = newDate;
};

// 后一天
const nextDay = () => {
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() + 1);
  currentDate.value = newDate;
};

// 初始化日期选择器
const initDatePicker = () => {
  const currentYear = new Date().getFullYear();
  
  // 生成年份数组 (当前年份前后5年)
  years.value = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.value.push(i);
  }

  // 生成月份数组
  months.value = [];
  for (let i = 1; i <= 12; i++) {
    months.value.push(i);
  }

  // 生成日期数组
  updateDays();

  // 设置当前选中的日期
  const date = currentDate.value;
  pickerValue.value = [
    years.value.indexOf(date.getFullYear()),
    date.getMonth(),
    date.getDate() - 1,
  ];
};

// 更新日期数组
const updateDays = () => {
  const year = years.value[pickerValue.value[0]] || new Date().getFullYear();
  const month = pickerValue.value[1] + 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  days.value = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.value.push(i);
  }
};

// 日期选择器变化
const onPickerChange = (e: any) => {
  pickerValue.value = e.detail.value;
  updateDays();
};

// 确认日期变更
const confirmDateChange = () => {
  const year = years.value[pickerValue.value[0]];
  const month = pickerValue.value[1] + 1;
  const day = days.value[pickerValue.value[2]];

  const newDate = new Date(year, month - 1, day);
  currentDate.value = newDate;
  showDatePicker.value = false;
};

// 监听日期变化，重新加载数据
watch(currentDate, () => {
  loadCalendarData();
}, { immediate: false });

onMounted(() => {
  initDatePicker();
  loadCalendarData();
});
</script>

<style scoped lang="scss">
/* 整体容器 */
.calendar-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
}

/* 顶部导航栏 */
.header-section {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
}

/* 日期切换控制 */
.date-nav-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 40rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.3);
  box-shadow: 0 2rpx 8rpx rgba(148, 163, 184, 0.08);
}

.date-nav-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(148, 163, 184, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.date-nav-btn:active {
  transform: scale(0.95);
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  box-shadow: 0 1rpx 4rpx rgba(148, 163, 184, 0.15);
}

.date-center {
  flex: 1;
  text-align: center;
  padding: 0 32rpx;
  cursor: pointer;
}

.date-text {
  font-size: 40rpx;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: 1rpx;
}

/* 滚动内容 */
.content-scroll {
  height: calc(100vh - 160px);
}

.content-padding {
  padding: 40rpx 0 80rpx 0;
}

/* 日期信息卡片 */
.date-info-card {
  margin: 0 32rpx 40rpx 32rpx;
  padding: 40rpx 32rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(148, 163, 184, 0.12);
  border: 1px solid rgba(226, 232, 240, 0.5);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4rpx;
    background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  }
}

.date-info-content {
  display: flex;
  align-items: center;
  gap: 48rpx;
}

.date-display {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 12rpx 32rpx rgba(6, 182, 212, 0.25);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  }
}

.date-number {
  font-size: 72rpx;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.date-month {
  font-size: 32rpx;
  font-weight: 500;
  margin-top: 8rpx;
  opacity: 0.95;
  text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.1);
}

.date-details {
  flex: 1;
}

.lunar-info {
  font-size: 40rpx;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 24rpx;
  letter-spacing: 1rpx;
}

.additional-info {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-item {
  font-size: 32rpx;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 12rpx 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.3);

  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-weight: 500;
  color: #4b5563;
  min-width: 120rpx;
}

/* 宜忌卡片 - 新风格设计 */
.yi-ji-card {
  margin: 0 32rpx 32rpx 32rpx;
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
  border: 2rpx solid #f1f5f9;
  position: relative;
}

.yi-ji-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6rpx;
  background: linear-gradient(90deg, #10b981 0%, #ef4444 100%);
}

.yi-section, .ji-section {
  padding: 32rpx 24rpx;
  position: relative;
  min-height: 120rpx;
}

.yi-section {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%);
  border-left: 6rpx solid #10b981;
}

.ji-section {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.05) 100%);
  border-left: 6rpx solid #ef4444;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.section-icon {
  width: 48rpx;
  height: 48rpx;
  padding: 8rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yi-section .section-icon {
  background: #10b981;
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.3);
}

.ji-section .section-icon {
  background: #ef4444;
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(239, 68, 68, 0.3);
}

.section-title {
  font-size: 36rpx;
  font-weight: 700;
  position: relative;
}

.yi-section .section-title {
  color: #065f46;
}

.ji-section .section-title {
  color: #991b1b;
}

.section-content {
  font-size: 30rpx;
  line-height: 1.8;
  letter-spacing: 1rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  position: relative;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  min-height: 60rpx;
  display: block;
}

.section-content::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  opacity: 0.1;
  pointer-events: none;
}

.yi-section .section-content {
  background: rgba(16, 185, 129, 0.1);
  color: #064e3b;
  border: 1rpx solid rgba(16, 185, 129, 0.2);
}

.yi-section .section-content::before {
  background: radial-gradient(circle, #10b981 0%, transparent 70%);
}

.ji-section .section-content {
  background: rgba(239, 68, 68, 0.1);
  color: #7f1d1d;
  border: 1rpx solid rgba(239, 68, 68, 0.2);
}

.ji-section .section-content::before {
  background: radial-gradient(circle, #ef4444 0%, transparent 70%);
}

/* 添加悬浮动画效果 */
.yi-ji-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.yi-ji-card:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
}

/* 传统信息卡片 */
.traditional-info-cards {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin: 0 32rpx 40rpx 32rpx;
}

.info-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 20rpx;
  padding: 32rpx;
  box-shadow: 0 6rpx 24rpx rgba(148, 163, 184, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2rpx);
    box-shadow: 0 8rpx 32rpx rgba(148, 163, 184, 0.15);
  }
}

.info-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: 1rpx;
  margin-bottom: 20rpx;
  display: block;
}

.info-content {
  font-size: 30rpx;
  color: #475569;
  line-height: 1.6;
  letter-spacing: 0.5rpx;
  display: block;
}

/* 加载和错误状态 */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
  text-align: center;
}

.loading-text {
  font-size: 28rpx;
  color: #666;
  margin-top: 24rpx;
}

.error-text {
  font-size: 28rpx;
  color: #dc143c;
  margin-bottom: 32rpx;
}

.retry-btn {
  background: linear-gradient(135deg, #daa520 0%, #b8860b 100%);
  color: white;
  border: none;
  padding: 20rpx 40rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
}

/* 日期选择器样式 */
.date-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.date-picker-container {
  background: white;
  border-radius: 32rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 32rpx 96rpx rgba(0, 0, 0, 0.3);
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 40rpx;
  background: linear-gradient(135deg, #daa520 0%, #b8860b 100%);
}

.picker-title {
  font-size: 36rpx;
  font-weight: bold;
  color: white;
}

.picker-close {
  width: 64rpx;
  height: 64rpx;
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 36rpx;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker-view {
  height: 400rpx;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  font-size: 32rpx;
  color: #333;
}

.picker-actions {
  display: flex;
  padding: 32rpx 40rpx;
  gap: 24rpx;
  background: #f8f8f8;
}

.picker-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 16rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 600;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
}

.confirm-btn {
  background: linear-gradient(135deg, #daa520 0%, #b8860b 100%);
  color: white;
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
  .date-info-content {
    flex-direction: column;
    text-align: center;
    gap: 24rpx;
  }
  
  .date-display {
    min-width: 120rpx;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 16rpx;
  }
  
  .detail-item {
    text-align: center;
    gap: 8rpx;
  }
  
  .detail-value {
    text-align: center;
  }
}
</style>
