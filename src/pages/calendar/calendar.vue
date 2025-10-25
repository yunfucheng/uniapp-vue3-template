<template>
  <view class="calendar-container">
    <!-- 顶部导航栏 -->
    <view class="header-section">
      <u-navbar :auto-back="true" title="黄历" placeholder>
      </u-navbar>
    </view>

    <!-- 日期切换控制 -->
    <view class="date-nav-controls">
      <up-button class="date-nav-btn" @click="previousDay">
        <up-icon name="arrow-left"></up-icon>
      </up-button>
      <view class="date-display" @click="showDatePicker = true">
        <text class="date-text">
          公历 {{ currentDateText }}
        </text>
        <text class="lunar-text">
          {{ lunarDateText }}
        </text>
      </view>
      <up-button class="date-nav-btn" @click="nextDay">
        <up-icon name="arrow-right"></up-icon>
      </up-button>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" :scroll-y="true">
      <view class="content-padding">
        <!-- 传统黄历主卡片 -->
        <view class="traditional-calendar-card">
          <!-- 顶部装饰 -->
          <view class="card-decoration-top">
            <view class="decoration-circle"></view>
            <view class="decoration-circle"></view>
            <view class="decoration-circle"></view>
            <view class="decoration-circle"></view>
          </view>

          <!-- 日期主体 - 三栏式布局 -->
          <view class="date-main-section">
            <view class="three-column-layout">
              <!-- 左侧内容 -->
              <view class="left-column">
                <view class="column-item">
                  <text class="item-label">解除</text>
                </view>
                <view class="column-item">
                  <text class="item-label">祭祀</text>
                </view>
                <view class="column-item">
                  <text class="item-label">修饰垣墙治道涂</text>
                </view>
                <view class="column-item">
                  <text class="item-label">造畜稠事宜分取</text>
                </view>
                <view class="column-spacer"></view>
                <view class="column-item">
                  <text class="item-label good-label">吉神宜趋</text>
                </view>
                <view class="column-item">
                  <text class="item-value">天恩　母仓　福生</text>
                </view>
              </view>

              <!-- 中间阳历日期 -->
              <view class="center-column">
                <view class="solar-date-display">
                  <text class="solar-date-number">{{ currentDate.getDate() }}</text>
                  <text class="solar-date-month">{{ currentDate.getMonth() + 1 }}月</text>
                </view>
                <view class="lunar-date-small">
                  <text class="lunar-text">{{ lunarMonth }}{{ lunarDay }}</text>
                </view>
              </view>

              <!-- 右侧内容 -->
              <view class="right-column">
                <view class="column-item">
                  <text class="item-label">嫁娶</text>
                </view>
                <view class="column-item">
                  <text class="item-label">开市</text>
                </view>
                <view class="column-item">
                  <text class="item-label">交易</text>
                </view>
                <view class="column-item">
                  <text class="item-label">入宅　入学　安葬</text>
                </view>
                <view class="column-spacer"></view>
                <view class="column-item">
                  <text class="item-label bad-label">凶煞宜忌</text>
                </view>
                <view class="column-item">
                  <text class="item-value">天恩　死神　月煞</text>
                </view>
                <view class="column-item">
                  <text class="item-value">月虚　元武</text>
                </view>
              </view>
            </view>
            
            <!-- 原有的日期信息保留在底部 -->
            <view class="date-info-section">
              <view class="date-meta-row">
                <text class="meta-text">今日幸运生肖：{{ zodiac }}</text>
                <text class="meta-text">今日星座：{{ constellation }}</text>
              </view>
              <view class="date-meta-row">
                <text class="meta-text">{{ yearInfo }}</text>
                <text class="meta-text">{{ solarTerm }}</text>
              </view>
            </view>
          </view>

          <!-- 宜忌主体 -->
          <view class="fortune-section">
            <!-- 宜 -->
            <view class="fortune-item good-fortune">
              <view class="fortune-header">
                <view class="fortune-icon good-icon">宜</view>
                <text class="fortune-title">宜事</text>
              </view>
              <view class="fortune-content">
                <text class="fortune-items">{{ goodItems }}</text>
              </view>
            </view>

            <!-- 忌 -->
            <view class="fortune-item bad-fortune">
              <view class="fortune-header">
                <view class="fortune-icon bad-icon">忌</view>
                <text class="fortune-title">忌事</text>
              </view>
              <view class="fortune-content">
                <text class="fortune-items">{{ badItems }}</text>
              </view>
            </view>
          </view>

          <!-- 详细信息表格 - 简化版 -->
          <view class="detail-table-simple">
            <view class="table-row">
              <view class="table-cell">
                <text class="cell-label">值神</text>
                <text class="cell-value">勾陈</text>
              </view>
              <view class="table-cell">
                <text class="cell-label">胎神</text>
                <text class="cell-value">{{ solarTerm }}</text>
              </view>
            </view>
            <view class="table-row">
              <view class="table-cell">
                <text class="cell-label">五行</text>
                <text class="cell-value">海中金</text>
              </view>
              <view class="table-cell">
                <text class="cell-label">冲煞</text>
                <text class="cell-value">冲鼠(甲子)煞北</text>
              </view>
            </view>
          </view>

          <!-- 吉日查询按钮 -->
          <view class="query-section">
            <view class="query-button">
              <text class="query-text">吉日查询</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 日期选择器 -->
    <view v-if="showDatePicker" class="date-picker-overlay" @click="showDatePicker = false">
      <view class="date-picker-container" @click.stop>
        <view class="picker-header">
          <text class="picker-title">
            选择日期
          </text>
          <button class="picker-close" @click="showDatePicker = false">
            ×
          </button>
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
          <button class="picker-btn cancel-btn" @click="showDatePicker = false">
            取消
          </button>
          <button class="picker-btn confirm-btn" @click="confirmDateChange">
            确认
          </button>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-overlay">
      <text class="loading-text">
        加载中...
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// 响应式数据
const loading = ref(false);
const showDatePicker = ref(false);
const currentDate = ref(new Date());
const pickerValue = ref([0, 0, 0]);
const years = ref<number[]>([]);
const months = ref<number[]>([]);
const days = ref<number[]>([]);

// 静态数据
const staticData = {
  currentDateText: '2025年10月23日 星期四 (阳历)',
  lunarDateText: '今日幸运生肖：蛇鸡鼠　　今日星座：天秤座',
  lunarMonth: '九月',
  lunarDay: '初三',
  zodiac: '蛇鸡鼠',
  constellation: '天秤座',
  yearInfo: '乙巳蛇年',
  solarTerm: '无恩　母仓　福生',
  goodItems: '解除　祭祀　修饰垣墙治道涂　造畜稠事宜分取',
  badItems: '嫁娶　开市　交易　入宅　入学　安葬',
  dutyGod: '玄武',
  conflict: '凶煞宜忌　乙不栽植　丑不冠带',
  fiveElements: '海中金',
  twentyEightStars: '北斗斗宿(吉)',
  twelveBuild: '平',
  fetalGod: '确房床　外东南'
};

// 计算属性
const currentDateText = computed(() => staticData.currentDateText);
const lunarDateText = computed(() => staticData.lunarDateText);
const lunarMonth = computed(() => staticData.lunarMonth);
const lunarDay = computed(() => staticData.lunarDay);
const zodiac = computed(() => staticData.zodiac);
const constellation = computed(() => staticData.constellation);
const yearInfo = computed(() => staticData.yearInfo);
const solarTerm = computed(() => staticData.solarTerm);
const goodItems = computed(() => staticData.goodItems);
const badItems = computed(() => staticData.badItems);
// 注释：移除未使用的详细信息变量，因为已简化为静态显示

// 方法
const previousDay = () => {
  console.log('前一天');
};

const nextDay = () => {
  console.log('后一天');
};

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
  const date = new Date();
  pickerValue.value = [
    years.value.indexOf(date.getFullYear()),
    date.getMonth(),
    date.getDate() - 1,
  ];
};

const updateDays = () => {
  const year = years.value[pickerValue.value[0]] || new Date().getFullYear();
  const month = pickerValue.value[1] + 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  days.value = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.value.push(i);
  }
};

const onPickerChange = (e: any) => {
  pickerValue.value = e.detail.value;
  updateDays();
};

const confirmDateChange = () => {
  const year = years.value[pickerValue.value[0]];
  const month = pickerValue.value[1] + 1;
  const day = days.value[pickerValue.value[2]];

  const newDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  console.log('选择的日期:', newDate);
  showDatePicker.value = false;
};

onMounted(() => {
  initDatePicker();
});
</script>

<style scoped lang="scss">
/* 整体容器 */
.calendar-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f1eb 0%, #ede4d3 100%);
}

/* 顶部导航栏 */
.header-section {
  position: relative;
  z-index: 10;
}

/* 日期切换控制 */
.date-nav-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(218, 165, 32, 0.2);
}

.date-nav-btn {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: linear-gradient(135deg, #daa520 0%, #b8860b 100%);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(218, 165, 32, 0.3);
  transition: all 0.3s ease;
}

.date-nav-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(218, 165, 32, 0.4);
}

.date-display {
  text-align: center;
  flex: 1;
  margin: 0 20px;
}

.date-text {
  font-size: 18px;
  font-weight: 600;
  color: #8b4513;
  display: block;
  margin-bottom: 4px;
}

.lunar-text {
  font-size: 14px;
  color: #a0522d;
  display: block;
}

/* 滚动内容 */
.content-scroll {
  height: calc(100vh - 180px);
}

.content-padding {
  padding: 20px 16px 40px 16px;
}

/* 传统黄历主卡片 */
.traditional-calendar-card {
  background: #faf8f3;
  border-radius: 20px;
  margin: 0 auto;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(139, 69, 19, 0.15);
  border: 2px solid #daa520;
  position: relative;
  overflow: hidden;
}

/* 顶部装饰 */
.card-decoration-top {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 16px 0 8px 0;
  background: linear-gradient(135deg, #daa520 0%, #b8860b 100%);
}

.decoration-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #faf8f3;
  box-shadow: inset 0 2px 4px rgba(139, 69, 19, 0.3);
}

/* 日期主体区域 */
.date-main-section {
  background: linear-gradient(135deg, #f5f5dc 0%, #faf0e6 100%);
  border: 3rpx solid #d4af37;
  border-radius: 20rpx;
  margin: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(212, 175, 55, 0.2);
  position: relative;
  overflow: hidden;
}

.date-main-section::before {
  content: '';
  position: absolute;
  top: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 20rpx;
  background: repeating-linear-gradient(
    90deg,
    #d4af37 0rpx,
    #d4af37 20rpx,
    transparent 20rpx,
    transparent 40rpx
  );
  border-radius: 10rpx;
}

/* 三栏式布局样式 */
.three-column-layout {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  min-height: 240rpx;
  padding: 15rpx 0;
}

.left-column,
.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 10rpx;
  min-height: 220rpx;
}

.left-column {
  border-right: 2rpx solid rgba(212, 175, 55, 0.3);
  padding-right: 15rpx;
}

.right-column {
  border-left: 2rpx solid rgba(212, 175, 55, 0.3);
  padding-left: 15rpx;
}

.center-column {
  flex: 0 0 160rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.column-item {
  margin-bottom: 12rpx;
  line-height: 1.5;
  padding: 6rpx 0;
}

.column-spacer {
  height: 25rpx;
  border-bottom: 1rpx dashed rgba(139, 69, 19, 0.3);
  width: 100%;
  margin: 10rpx 0;
}

.item-label {
  font-size: 26rpx;
  color: var(--theme-content-color);
  line-height: 1.5;
  font-weight: 400;
}

.item-value {
  font-size: 24rpx;
  color: var(--theme-tips-color);
  line-height: 1.5;
  font-weight: 300;
}

.good-label {
  color: #d32f2f;
  font-weight: 600;
  font-size: 28rpx;
  margin-bottom: 8rpx;
}

.bad-label {
  color: #388e3c;
  font-weight: 600;
  font-size: 28rpx;
  margin-bottom: 8rpx;
}

/* 中间阳历日期显示 */
.solar-date-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  border: 4rpx solid #d32f2f;
  border-radius: 16rpx;
  padding: 20rpx 15rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 6rpx 18rpx rgba(211, 47, 47, 0.4);
  min-height: 120rpx;
  width: 120rpx;
  position: relative;
}

.solar-date-number {
  font-size: 48rpx;
  font-weight: bold;
  color: white;
  text-shadow: 2rpx 2rpx 4rpx rgba(0, 0, 0, 0.3);
  line-height: 1;
}

.solar-date-month {
  font-size: 20rpx;
  color: white;
  font-weight: 500;
  margin-top: 4rpx;
  text-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.3);
}

.lunar-date-small {
  background: rgba(139, 69, 19, 0.1);
  border: 1rpx solid #8b4513;
  border-radius: 10rpx;
  padding: 6rpx 12rpx;
  margin-bottom: 0;
}

.lunar-text {
  font-size: 18rpx;
  color: #8b4513;
  font-weight: 500;
}

.query-button-center {
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  color: white;
  padding: 16rpx 32rpx;
  border-radius: 50rpx;
  font-size: 24rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 12rpx rgba(211, 47, 47, 0.3);
  border: 2rpx solid #b71c1c;
}

.query-text {
  color: white;
  font-size: 24rpx;
  font-weight: 500;
/* 响应式优化 */
@media screen and (max-width: 750rpx) {
  .three-column-layout {
    flex-direction: column;
    align-items: center;
    min-height: auto;
  }
  
  .left-column,
  .right-column {
    width: 100%;
    border: none;
    padding: 20rpx 0;
    min-height: auto;
  }
  
  .center-column {
    order: -1;
    margin-bottom: 30rpx;
  }
  
  .solar-date-display {
    width: 180rpx;
    min-height: 160rpx;
  }
  
  .solar-date-number {
    font-size: 64rpx;
  }
}

/* 小屏幕进一步优化 */
@media screen and (max-width: 600rpx) {
  .date-main-section {
    margin: 15rpx;
    padding: 20rpx;
  }
  
  .item-label {
    font-size: 24rpx;
  }
  
  .item-value {
    font-size: 22rpx;
  }
  
  .good-label,
  .bad-label {
    font-size: 26rpx;
  }
}
  font-size: 48px;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(139, 69, 19, 0.1);
}

.date-info-section {
  margin-top: 16px;
}

.date-meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.meta-text {
  font-size: 14px;
  color: #a0522d;
  flex: 1;
  text-align: center;
}

/* 宜忌主体 */
.fortune-section {
  padding: 0 24px 24px 24px;
}

.fortune-item {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.good-fortune {
  border: 2px solid #dc143c;
}

.bad-fortune {
  border: 2px solid #228b22;
}

.fortune-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.good-fortune .fortune-header {
  background: linear-gradient(135deg, #dc143c 0%, #b91c3c 100%);
}

.bad-fortune .fortune-header {
  background: linear-gradient(135deg, #228b22 0%, #1e7b1e 100%);
}

.fortune-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  margin-right: 12px;
}

.good-icon {
  color: #dc143c;
}

.bad-icon {
  color: #228b22;
}

.fortune-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.fortune-content {
  padding: 16px;
  background: white;
}

.fortune-items {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
}

/* 简化版详细信息表格 */
.detail-table-simple {
  margin-top: 20rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12rpx;
  padding: 15rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.table-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.table-row:last-child {
  margin-bottom: 0;
}

.table-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rpx;
}

.cell-label {
  font-size: 22rpx;
  color: #8b4513;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.cell-value {
  font-size: 24rpx;
  color: #333;
  font-weight: 600;
}

/* 吉日查询按钮 */
.query-section {
  padding: 24px;
  text-align: center;
}

.query-button {
  background: linear-gradient(135deg, #daa520 0%, #b8860b 100%);
  color: white;
  padding: 14px 32px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 6px 20px rgba(218, 165, 32, 0.3);
  transition: all 0.3s ease;
  display: inline-block;
}

.query-button:active {
  transform: translateY(2px);
  box-shadow: 0 4px 15px rgba(218, 165, 32, 0.4);
}

.query-text {
  color: white;
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
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, #daa520 0%, #b8860b 100%);
}

.picker-title {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.picker-close {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 20px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker-view {
  height: 220px;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  font-size: 16px;
  color: #333;
}

.picker-actions {
  display: flex;
  padding: 20px 24px;
  gap: 16px;
  background: #f8f8f8;
}

.picker-btn {
  flex: 1;
  height: 48px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #e0e0e0;
  color: #666;
}

.confirm-btn {
  background: linear-gradient(135deg, #daa520 0%, #b8860b 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(218, 165, 32, 0.3);
}

.confirm-btn:active {
  transform: translateY(1px);
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-text {
  color: white;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.7);
  padding: 12px 24px;
  border-radius: 20px;
}

/* 手机竖屏优化 */
@media (max-width: 480px) {
  .traditional-calendar-card {
    margin: 0;
    border-radius: 16px;
  }
  
  .lunar-month-day {
    font-size: 42px;
  }
  
  .content-padding {
    padding: 16px 12px 40px 12px;
  }
  
  .date-nav-controls {
    padding: 16px 20px;
  }
}

/* 适当拉长页面内容 */
.fortune-section {
  min-height: 300px;
}

.detail-section {
  min-height: 200px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.query-section {
  padding: 32px 24px;
}
</style>
