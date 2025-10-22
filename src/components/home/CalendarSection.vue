<template>
  <view class="calendar-section" @tap="showCalendar">
    <view class="calendar-content">
      <view class="calendar-left">
        <text class="calendar-date">
          农历 · {{ calendarData?.yinLi }}
        </text>
      </view>
      <view class="calendar-right">
        <text class="calendar-good">
          宜：{{ getSuitText() }}
        </text>
        <text class="calendar-bad">
          忌：{{ getAvoidText() }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CalendarApi } from '@/api';
import type { CalendarData } from '@/api/calendar/types';

// 响应式数据
const calendarData = ref<CalendarData | null>(null);
const loading = ref(false);

// 方法
const showCalendar = () => {
  // 跳转到黄历详情页面
  uni.navigateTo({
    url: '/pages/calendar/calendar',
  });
};

// 获取宜事项文本
const getSuitText = () => {
  if (calendarData.value?.yi) {
    const items = calendarData.value.yi.split(' ');
    return items.slice(0, 3).join(' ');
  }
  return '';
};

// 获取忌事项文本
const getAvoidText = () => {
  if (calendarData.value?.ji) {
    const items = calendarData.value.ji.split(' ');
    return items.slice(0, 3).join(' ');
  }
  return '';
};

// 获取今日日历数据
const fetchTodayCalendar = async () => {
  try {
    loading.value = true;
    const today = new Date().toISOString().split('T')[0]; // 格式：YYYY-MM-DD
    
    const response = await CalendarApi.getCalendarByDate({ date: today });
    
    if (response.code === '0' && response.result) {
      calendarData.value = response.result;
    }
  } catch (error) {
    console.error('获取日历数据失败:', error);
  } finally {
    loading.value = false;
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchTodayCalendar();
});
</script>

<style scoped>
.calendar-section {
  background-color: #f7f7f9;
  margin: 0 32rpx 32rpx;
  border-radius: 24rpx;
  padding: 20rpx;
}

.calendar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-date {
  font-size: 28rpx;
  color: var(--theme-primary-color);
}

.calendar-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.calendar-good {
  font-size: 24rpx;
  color: #4caf50;
  margin-bottom: 4rpx;
}

.calendar-bad {
  font-size: 24rpx;
  color: #f44336;
}
</style>
