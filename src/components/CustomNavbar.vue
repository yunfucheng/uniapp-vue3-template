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
        header-direction="column" :options-cols="1" @change="onCascaderChange" @confirm="onCascaderConfirm"
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
import { RuralApi } from '@/api';
import { useRuralStore } from '@/store';

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
      cascaderValue: [],
      // 当前展示的村屯名称（内部状态）
      currentVillage: this.selectedVillage || '乌翁屯',
      // 级联数据（从服务端懒加载）
      villageCascaderData: [],
      isCascaderLoading: false,
      ruralStore: null,
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
    // 初始化全局村屯选择
    this.ruralStore = useRuralStore();
    if (this.ruralStore?.label) {
      this.currentVillage = this.ruralStore.label;
    }
    if (Array.isArray(this.ruralStore?.path) && this.ruralStore.path.length) {
      this.cascaderValue = [...this.ruralStore.path];
    }
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
    async onVillageSelect() {
      if (!this.villageCascaderData.length) {
        await this.loadRootRegions();
      }
      this.cascaderShow = true;
    },
    async loadRootRegions() {
      try {
        this.isCascaderLoading = true;
        const items = await RuralApi.getChildren();
        this.villageCascaderData = (items || []).map(item => ({
          label: item.name,
          value: item.code,
          hasChildren: item.hasChildren,
        }));
      }
      catch (e) {
        console.error('加载顶层地区失败:', e);
        uni.$u.toast('加载地区失败');
      }
      finally {
        this.isCascaderLoading = false;
      }
    },
    async onCascaderChange(value) {
      const path = Array.isArray(value) ? value : [value];
      const node = this.findNodeByPath(path);
      if (node && node.hasChildren && (!node.children || node.children.length === 0)) {
        try {
          const children = await RuralApi.getChildren({ parentCode: node.value });
          node.children = (children || []).map(item => ({
            label: item.name,
            value: item.code,
            hasChildren: item.hasChildren,
          }));
          this.$forceUpdate();
        }
        catch (e) {
          console.error('加载子地区失败:', e);
          uni.$u.toast('加载子地区失败');
        }
      }
    },
    findNodeByPath(path) {
      let nodes = this.villageCascaderData;
      let found = null;
      for (const code of path) {
        found = nodes && nodes.find(n => n.value === code);
        if (!found) return null;
        nodes = found.children || [];
      }
      return found;
    },
    // 级联选择确认
    onCascaderConfirm(values) {
      // values 为选中路径的值数组，最后一个即为村/屯编码
      const leafCode = Array.isArray(values) && values.length > 0 ? values[values.length - 1] : null;
      const leafNode = leafCode ? this.findNodeByPath(values) : null;
      const leafLabel = leafNode?.label || this.currentVillage;
      this.currentVillage = leafLabel;
      // 更新全局选择
      if (this.ruralStore) {
        this.ruralStore.setSelection({ path: values, leafCode, label: leafLabel });
      }
      // 向父组件通知更改
      this.$emit('villageChange', {
        path: values,
        leaf: leafLabel,
        leafCode,
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
