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
        header-direction="column" :options-cols="1" :auto-close="true"
        @change="onCascaderChange" @confirm="onCascaderConfirm"
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
import storage from '@/utils/storage';

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
                            { label: '乌吉村', value: '乌吉屯' },
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
    this.restoreVillageSelection();
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
      // 保存用户选择
      this.saveVillageSelection(values, leaf);
      // 向父组件通知更改
      this.$emit('villageChange', {
        path: values,
        leaf,
      });
    },
    // 新增：级联选择变化（支持 auto-close 或未点确认的场景）
    onCascaderChange(values) {
      const leaf = Array.isArray(values) && values.length > 0 ? values[values.length - 1] : this.currentVillage;
      this.currentVillage = leaf;
      this.cascaderValue = Array.isArray(values) ? values : [];
      this.saveVillageSelection(values, leaf);
      this.$emit('villageChange', { path: this.cascaderValue, leaf });
    },
    // 校验路径是否存在于级联数据中
    isValidPath(values) {
      if (!Array.isArray(values) || values.length === 0) return false;
      let level = this.villageCascaderData;
      for (let i = 0; i < values.length; i++) {
        const val = values[i];
        const node = (level || []).find(item => item.value === val);
        if (!node) return false;
        level = node.children || [];
      }
      return true;
    },
    // 保存村屯选择到本地存储
    saveVillageSelection(values, leaf) {
      try {
        storage.setJSON('user:selectedVillagePath', values || []);
        storage.set('user:selectedVillage', leaf || '');
      } catch (e) {
        console.warn('保存村屯选择失败:', e);
      }
    },
    // 恢复本地存储的选择
    restoreVillageSelection() {
      try {
        const path = storage.getJSON('user:selectedVillagePath') || [];
        const savedLeaf = storage.get('user:selectedVillage');
        if (this.isValidPath(path)) {
          this.cascaderValue = path;
          const leaf = savedLeaf || (path.length ? path[path.length - 1] : this.currentVillage);
          this.currentVillage = leaf;
          // 通知父组件，以便页面状态同步
          this.$emit('villageChange', { path, leaf });
        } else if (savedLeaf) {
          this.currentVillage = savedLeaf;
          this.$emit('villageChange', { path: [], leaf: savedLeaf });
        }
      } catch (e) {
        console.warn('恢复村屯选择失败:', e);
      }
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
  border-radius: 20rpx;
  background-color: var(--theme-bg-color);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
  white-space: nowrap;
  flex-shrink: 0;
  min-width: fit-content;
  height: 56rpx;
  box-sizing: border-box;
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.function-nav-item:last-child {
  margin-right: 24rpx;
}

.function-nav-item-active {
  background-color: var(--theme-primary);
  border-color: transparent;
  box-shadow: 0 6rpx 12rpx rgba(17, 24, 39, 0.15);
  transform: none;
}

.function-nav-text {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--theme-content-color);
  white-space: nowrap;
  text-align: center;
  display: inline-block;
  line-height: 1;
}

.function-nav-text-active {
  color: #ffffff;
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
