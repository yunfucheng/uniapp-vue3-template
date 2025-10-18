<template>
  <view class="custom-navbar-container">
    <view>
      <view>
        <u-navbar :title="title" placeholder>
          <template #left>
            <view>
              <view class="village-selector" @click="onVillageSelect">
                <text class="village-text">
                  {{ currentVillage }}
                </text>
                <u-icon name="arrow-down" size="12" color="var(--theme-tips-color)" />
              </view>
            </view>
          </template>
          <template #right />
        </u-navbar>
      </view>

      <!-- 乡村级联选择器 -->
      <u-cascader
        v-model:show="cascaderShow" v-model="cascaderValue" :data="villageCascaderData"
        header-direction="column" :options-cols="1" @confirm="onCascaderConfirm"
      />
    </view>

    <!-- 功能导航栏 -->
    <view class="function-nav">
      <scroll-view
        scroll-x="true" class="function-nav-scroll" :scroll-left="scrollLeft" :show-scrollbar="false"
        :enable-back-to-top="false" :scroll-with-animation="true"
      >
        <view class="function-nav-content">
          <view
            v-for="(section, index) in sections" :key="index"
            class="function-nav-item" :class="[selectedSection === section.title ? 'function-nav-item-active' : '']"
            @tap="onSectionSelect(section.title)"
          >
            <text class="function-nav-text" :class="[selectedSection === section.title ? 'function-nav-text-active' : '']">
              {{ section.title }}
            </text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import DataManager from '@/utils/dataManager.js';

export default {
  name: 'CustomNavbar',
  props: {
    title: {
      type: String,
      default: '首页',
    },
    selectedVillage: {
      type: String,
      default: '乌翁屯',
    },
    selectedSection: {
      type: String,
      default: '首页',
    },
    sections: {
      type: Array,
      default: () => DataManager.getNavigationSections(),
    },
    scrollLeft: {
      type: Number,
      default: 0,
    },
  },
  emits: ['villageChange', 'sectionSelect', 'avatarClick'],
  data() {
    return {
      statusBarHeight: 0,
      // 级联选择器显示与选中值
      cascaderShow: false,
      cascaderValue: ['广西省', '柳州市', '融水县', '安陲乡', '乌吉村', '乌翁屯'],
      // 当前展示的村屯名称（内部状态）
      currentVillage: this.selectedVillage || '乌翁屯',
      // 级联数据
      villageCascaderData: [
        {
          label: '广西省',
          value: '广西省',
          children: [
            {
              label: '柳州市',
              value: '柳州市',
              children: [
                {
                  label: '融水县',
                  value: '融水县',
                  children: [
                    {
                      label: '安陲乡',
                      value: '安陲乡',
                      children: [
                        {
                          label: '乌吉村',
                          value: '乌吉村',
                          children: [
                            { label: '乌翁屯', value: '乌翁屯' },
                            { label: '乌吉村', value: '乌吉村' },
                            { label: '黄泥屯', value: '黄泥屯' },
                          ],
                        },
                      ],
                    },
                    {
                      label: '香粉乡',
                      value: '香粉乡',
                      children: [
                        {
                          label: '九同村',
                          value: '九同村',
                          children: [
                            { label: '九同屯', value: '九同屯' },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  },
  watch: {
    // 同步父组件传入的选中村屯到内部展示
    selectedVillage(newVal) {
      if (newVal && newVal !== this.currentVillage) {
        this.currentVillage = newVal;
      }
    },
  },
  mounted() {
    this.getStatusBarHeight();
  },
  methods: {
    getStatusBarHeight() {
      uni.getSystemInfo({
        success: (res) => {
          this.statusBarHeight = res.statusBarHeight || 20;
        },
      });
    },
    // 打开级联选择器
    onVillageSelect() {
      this.cascaderShow = true;
    },
    // 级联选择确认
    onCascaderConfirm(values) {
      // values 为选中路径的值数组，最后一个即为村/屯名称
      const leaf = Array.isArray(values) && values.length > 0 ? values[values.length - 1] : this.currentVillage;
      this.currentVillage = leaf;
      // 向父组件通知更改
      this.$emit('villageChange', {
        path: values,
        leaf,
      });
    },
    onSectionSelect(section) {
      this.$emit('sectionSelect', section);
    },
  },
};
</script>

<style scoped>
.custom-navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: var(--theme-bg-color);
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.status-bar {
  background-color: var(--theme-bg-color);
}

.function-nav {
  background-color: var(--theme-bg-color);
  border-top: 1rpx solid var(--theme-border-color);
}

.function-nav-scroll {
  white-space: nowrap;
  width: 100%;
  height: auto;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.function-nav-scroll::-webkit-scrollbar {
  display: none;
}

.function-nav-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16rpx 24rpx;
  width: max-content;
  min-width: 100%;
  box-sizing: border-box;
  height: 84rpx;
}

.function-nav-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 24rpx;
  margin-right: 16rpx;
  border-radius: 40rpx;
  background-color: var(--theme-bg-color-secondary);
  white-space: nowrap;
  flex-shrink: 0;
  min-width: fit-content;
  height: 52rpx;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.function-nav-item:last-child {
  margin-right: 24rpx;
}

.function-nav-item-active {
  background-color: var(--theme-primary-15);
  transform: scale(1.05);
}

.function-nav-text {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--theme-tips-color);
  white-space: nowrap;
  text-align: center;
  display: inline-block;
  line-height: 1;
}

.function-nav-text-active {
  color: var(--theme-success);
  font-weight: 600;
}

/* 重新设计的村屯选择器样式 */
.village-selector {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background-color: var(--theme-primary-08);
  border: 1rpx solid var(--theme-border-color);
}

.village-text {
  font-size: 26rpx;
  color: var(--theme-main-color);
}
</style>
