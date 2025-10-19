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
        :lazy="true" :load-children="loadChildren" has-children-key="hasChildren"
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
import { getChildren, getDefault } from '@/api/rural';

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
      // 使用API后的选中值为代码路径
      cascaderValue: [],
      // 当前展示的村屯名称（内部状态）
      currentVillage: this.selectedVillage || '乌翁屯',
      // 级联数据（API驱动，初始为空）
      villageCascaderData: [],
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
    this.initData();
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
    // 级联选择确认（values为代码路径）
    onCascaderConfirm(values) {
      const leafLabel = this.getLabelByPath(values) || this.currentVillage;
      this.currentVillage = leafLabel;
      this.cascaderValue = Array.isArray(values) ? values : [];
      this.saveVillageSelection(this.cascaderValue, leafLabel);
      this.$emit('villageChange', { path: this.cascaderValue, leaf: leafLabel });
    },
    // 选择变化（auto-close或未点确认的场景）
    onCascaderChange(values) {
      const leafLabel = this.getLabelByPath(values) || this.currentVillage;
      this.currentVillage = leafLabel;
      this.cascaderValue = Array.isArray(values) ? values : [];
      this.saveVillageSelection(this.cascaderValue, leafLabel);
      this.$emit('villageChange', { path: this.cascaderValue, leaf: leafLabel });
    },
    // 使用API加载顶层
    async fetchTopRegions() {
      const list = await getChildren();
      this.villageCascaderData = Array.isArray(list) ? list.map(this.mapRegionToNode) : [];
    },
    // 提供给u-cascader的懒加载函数
    async loadChildren(item) {
      const resp = await getChildren({ parentCode: item.value });
      return Array.isArray(resp) ? resp.map(this.mapRegionToNode) : [];
    },
    mapRegionToNode(region) {
      return {
        label: region.name,
        value: region.code,
        hasChildren: !!region.hasChildren,
        // 不预置 children，改由懒加载时填充，避免空数组误判
      };
    },
    // 默认选中（无本地缓存时调用后端默认）
    async fetchDefaultSelection() {
      try {
        const def = await getDefault();
        const path = Array.isArray(def?.path) ? def.path : [];
        const leafLabel = def?.leafLabel || '';
        if (!path.length) return;
        // 逐级预加载并设置选中
        const ok = await this.warmLoadPath(path);
        if (ok) {
          this.cascaderValue = path;
          const label = this.getLabelByPath(path) || leafLabel || this.currentVillage;
          this.currentVillage = label;
          this.saveVillageSelection(path, label);
          this.$emit('villageChange', { path, leaf: label });
        }
      } catch (e) {
        console.warn('获取默认选中失败:', e);
      }
    },
    // 初始化：加载顶层并尝试恢复用户选择；无缓存则使用默认
    async initData() {
      try {
        await this.cleanupLegacyStorageOnce();
        await this.fetchTopRegions();
        const path = storage.getJSON('user:selectedVillagePath') || [];
        if (Array.isArray(path) && path.length > 0) {
          await this.restoreVillageSelection();
        } else {
          await this.fetchDefaultSelection();
        }
      } catch (e) {
        console.warn('初始化级联数据失败:', e);
      }
    },
    // 一次性清理旧的本地存储键（V2等），后续仅用一个键
    async cleanupLegacyStorageOnce() {
      try {
        const cleaned = storage.get('user:cascaderStorageCleaned');
        if (!cleaned) {
          storage.remove('user:selectedVillagePathV2');
          storage.remove('user:selectedVillagePath');
          storage.set('user:cascaderStorageCleaned', '1');
        }
      } catch (e) {
        console.warn('清理本地存储失败:', e);
      }
    },
    // 保存村屯选择到本地存储（仅用一个键）
    saveVillageSelection(values, leafLabel) {
      try {
        const path = Array.isArray(values) ? values : [];
        const code = path.length ? path[path.length - 1] : '';
        storage.setJSON('user:selectedVillagePath', path);
        storage.set('user:selectedVillageCode', code);
        storage.set('user:selectedVillage', leafLabel || '');
      } catch (e) {
        console.warn('保存村屯选择失败:', e);
      }
    },
    // 恢复本地存储的选择（仅从一个键读取），并按路径预加载层级
    async restoreVillageSelection() {
      try {
        const path = storage.getJSON('user:selectedVillagePath') || [];
        const savedLeaf = storage.get('user:selectedVillage');
        const ok = await this.warmLoadPath(path);
        if (ok) {
          this.cascaderValue = path;
          const leaf = this.getLabelByPath(this.cascaderValue) || savedLeaf || this.currentVillage;
          this.currentVillage = leaf;
          this.$emit('villageChange', { path: this.cascaderValue, leaf });
        } else if (savedLeaf) {
          this.currentVillage = savedLeaf;
          this.$emit('villageChange', { path: [], leaf: savedLeaf });
        }
      } catch (e) {
        console.warn('恢复村屯选择失败:', e);
      }
    },
    // 根据路径依次加载各级子节点，构建树和level数据
    async warmLoadPath(path) {
      if (!Array.isArray(path) || path.length === 0) return false;
      // 确保顶层已加载
      if (!Array.isArray(this.villageCascaderData) || this.villageCascaderData.length === 0) {
        await this.fetchTopRegions();
      }
      let level = this.villageCascaderData;
      for (let i = 0; i < path.length - 1; i++) {
        const val = path[i];
        let node = (level || []).find(item => item.value === val);
        // 兼容旧存储：按label匹配
        if (!node) node = (level || []).find(item => item.label === val);
        if (!node) return false;
        if (node.hasChildren) {
          if (!Array.isArray(node.children) || node.children.length === 0) {
            const children = await this.loadChildren(node);
            node.children = children;
          }
          level = node.children || [];
        } else {
          level = [];
        }
      }
      return true;
    },
    // 根据代码路径获取叶子名称
    getLabelByPath(path) {
      if (!Array.isArray(path) || path.length === 0) return '';
      let level = this.villageCascaderData;
      let label = '';
      for (let i = 0; i < path.length; i++) {
        const val = path[i];
        const node = (level || []).find(item => item.value === val) || (level || []).find(item => item.label === val);
        if (!node) break;
        label = node.label;
        level = node.children || [];
      }
      return label;
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
