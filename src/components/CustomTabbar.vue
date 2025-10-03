<template>
  <view>
    <up-tabbar
      :value="value1"
      :fixed="true"
      :placeholder="false"
      :safe-area-inset-bottom="false"
      @change="change1"
    >
      <up-tabbar-item
        v-for="item in tabList"
        :key="item.pagePath"
        :text="item.text"
        :icon="item.iconType"
      />
    </up-tabbar>
  </view>
</template>

<script>
export default {
  name: 'CustomTabbar',
  data() {
    return {
      // uview-plus Tabbar 当前选中索引
      value1: 0,
      tabList: [
        {
          pagePath: '/pages/index/index',
          text: '首页',
          iconType: 'home',
        },
        {
          pagePath: '/pages/messages/messages',
          text: '消息',
          iconType: 'chat',
        },
        {
          pagePath: '/pages/profile/profile',
          text: '我的',
          iconType: 'account',
        },
      ],
    };
  },
  mounted() {
    // 根据当前路由设置默认选中项
    this.initCurrentIndex();
  },
  methods: {
    // Tabbar 变更时切换页面
    change1(e) {
      // e 可能是索引或对象，做兼容处理
      const index = typeof e === 'number' ? e : (e && typeof e === 'object' && e.index != null ? e.index : this.value1);
      this.value1 = index;
      const target = this.tabList[index];
      if (!target) return;
      this.navigateTo(target.pagePath);
    },
    // 初始化当前选中索引
    initCurrentIndex() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const currentRoute = `/${currentPage?.route || ''}`;
      const idx = this.tabList.findIndex(item => item.pagePath === currentRoute);
      this.value1 = idx === -1 ? 0 : idx;
    },
    // 通用跳转封装
    navigateTo(pagePath) {
      uni.reLaunch({
        url: pagePath,
        success: () => {
          console.log('页面跳转成功:', pagePath);
        },
        fail: (err) => {
          console.error('页面跳转失败:', err);
          uni.navigateTo({ url: pagePath });
        },
      });
    },
  },
};
</script>

<style scoped>
</style>
