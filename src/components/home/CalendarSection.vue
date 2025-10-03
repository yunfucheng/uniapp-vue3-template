<template>
  <view class="calendar-section" @tap="showCalendar">
    <view class="calendar-content">
      <view class="calendar-left">
        <text class="calendar-title">
          今日黄历
        </text>
        <text class="calendar-date">
          农历 {{ calendarData.lunarCalendar || '七月十二' }} · {{ calendarData.yearTips || '乙巳' }}年
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

<script>
export default {
  name: 'CalendarSection',
  props: {
    calendarData: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    showCalendar() {
      // 跳转到黄历详情页面
      uni.navigateTo({
        url: '/pages/calendar/calendar',
      });
    },

    // 获取宜事项文本
    getSuitText() {
      if (this.calendarData.suit) {
        const items = this.calendarData.suit.split('.');
        return items.slice(0, 3).join(' ');
      }
      return '祭祀 理发 作灶';
    },

    // 获取忌事项文本
    getAvoidText() {
      if (this.calendarData.avoid) {
        const items = this.calendarData.avoid.split('.');
        return items.slice(0, 3).join(' ');
      }
      return '嫁娶 栽种 祈福';
    },
  },
};
</script>

<style scoped>
.calendar-section {
  background-color: #fff8e1;
  margin: 0 32rpx 32rpx;
  border-radius: 24rpx;
  padding: 20rpx;
  border: 2rpx solid #ffe082;
}

.calendar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #f57f17;
  margin-bottom: 8rpx;
  display: block;
}

.calendar-date {
  font-size: 28rpx;
  color: #f9a825;
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
