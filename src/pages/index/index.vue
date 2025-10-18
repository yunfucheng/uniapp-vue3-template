<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <CustomNavbar
      title="首页"
      :selected-village="selectedVillage"
      :selected-section="selectedSection"
      :sections="sections"
      :scroll-left="scrollLeft"
      @avatar-click="onAvatarClick"
      @village-change="onVillageChanged"
      @section-select="setSelectedSection"
    />

    <!-- 动态内容区域 - 使用swiper支持滑动切换 -->
    <view class="swiper-container">
      <swiper
        class="content-swiper"
        :current="currentSectionIndex"
        :duration="300"
        :circular="false"
        @change="onSwiperChange"
      >
        <!-- 首页内容 -->
        <swiper-item class="swiper-item">
          <scroll-view
            scroll-y="true"
            class="scroll-content"
            :show-scrollbar="false"
            :enable-back-to-top="false"
            :scroll-with-animation="true"
          >
            <view class="section-content">
              <!-- Banner轮播图区域 -->
              <BannerSection :banners="banners" />

              <!-- 黄历显示 -->
              <CalendarSection :calendar-data="calendarData" />

              <!-- 公告栏 -->
              <NotificationSection
                :notifications="notifications"
                :public-announcements="publicAnnouncements"
                :current-playing-id="currentPlayingId"
                @go-to-announcements="goToAnnouncements"
                @play-audio="handlePlayAudio"
              />

              <!-- 照片墙 -->
              <PhotoWallSection
                :photo-wall-items="photoWallItems"
                @go-to-photo="goToPhotoTab"
              />

              <!-- 出售信息 -->
              <ItemListSection
                title="出售信息"
                :items="saleItems"
                type="sale"
              />

              <!-- 收购信息 -->
              <ItemListSection
                title="收购信息"
                :items="purchaseItems"
                type="purchase"
              />
            </view>
          </scroll-view>
        </swiper-item>

        <!-- 公告内容 -->
        <swiper-item class="swiper-item">
          <scroll-view
            scroll-y="true"
            class="scroll-content"
            :show-scrollbar="false"
            :enable-back-to-top="false"
            :scroll-with-animation="true"
          >
            <view class="section-content">
              <AnnouncementManagement
                :announcements="announcements"
                @edit-announcement="editAnnouncement"
                @delete-announcement="deleteAnnouncement"
              />
            </view>
          </scroll-view>
        </swiper-item>

        <!-- 照片内容（改为与公告内容一致的管理组件） -->
        <swiper-item class="swiper-item">
          <scroll-view
            scroll-y="true"
            class="scroll-content"
            :show-scrollbar="false"
            :enable-back-to-top="false"
            :scroll-with-animation="true"
          >
            <view class="section-content">
              <PhotoManagement
                :photos="photoWallItems"
                @preview-photo="previewPhoto"
                @add-photo="goToAddPhoto"
              />
            </view>
          </scroll-view>
        </swiper-item>

        <!-- 收购内容（管理组件） -->
        <swiper-item class="swiper-item">
          <scroll-view
            scroll-y="true"
            class="scroll-content"
            :show-scrollbar="false"
            :enable-back-to-top="false"
            :scroll-with-animation="true"
          >
            <view class="section-content">
              <PurchaseManagement
                :items="purchaseItems"
                @view-item="viewPurchaseItem"
                @add-item="addPurchaseItem"
              />
            </view>
          </scroll-view>
        </swiper-item>

        <!-- 出售内容（管理组件） -->
        <swiper-item class="swiper-item">
          <scroll-view
            scroll-y="true"
            class="scroll-content"
            :show-scrollbar="false"
            :enable-back-to-top="false"
            :scroll-with-animation="true"
          >
            <view class="section-content">
              <SaleManagement
                :items="saleItems"
                @view-item="viewSaleItem"
                @add-item="addSaleItem"
              />
            </view>
          </scroll-view>
        </swiper-item>
        <!-- 商店内容（列表组件） -->
        <swiper-item class="swiper-item">
          <scroll-view
            scroll-y="true"
            class="scroll-content"
            :show-scrollbar="false"
            :enable-back-to-top="false"
            :scroll-with-animation="true"
          >
            <view class="section-content">
              <StoreList :items="storeItems" />
            </view>
          </scroll-view>
        </swiper-item>

        <!-- 其他内容页面 -->
        <swiper-item v-for="(section, index) in otherSections" :key="index" class="swiper-item">
          <scroll-view
            scroll-y="true"
            class="scroll-content"
            :show-scrollbar="false"
            :enable-back-to-top="false"
            :scroll-with-animation="true"
          >
            <view class="section-content">
              <view class="other-content">
                <text class="placeholder">
                  {{ section }}页面开发中...
                </text>
              </view>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>

    <CustomTabbar />
  </view>
</template>

<script>
import AnnouncementManagement from '@/components/announcement/AnnouncementManagement.vue';
import CustomNavbar from '@/components/CustomNavbar.vue';
import CustomTabbar from '@/components/CustomTabbar.vue';
import BannerSection from '@/components/home/BannerSection.vue';
import CalendarSection from '@/components/home/CalendarSection.vue';
import ItemListSection from '@/components/home/ItemListSection.vue';
import NotificationSection from '@/components/home/NotificationSection.vue';
import PhotoWallSection from '@/components/home/PhotoWallSection.vue';
import PhotoManagement from '@/components/photowall/PhotoManagement.vue';
import PurchaseManagement from '@/components/purchase/PurchaseManagement.vue';
import SaleManagement from '@/components/sale/SaleManagement.vue';
import StoreList from '@/components/store/StoreList.vue';
import { api } from '@/mock/api.js';
import audioManager from '@/utils/audioManager.js';
import DataManager from '@/utils/dataManager.js';

export default {
  components: {
    CustomTabbar,
    CustomNavbar,
    BannerSection,
    CalendarSection,
    NotificationSection,
    PhotoWallSection,
    ItemListSection,
    AnnouncementManagement,
    PhotoManagement,
    PurchaseManagement,
    SaleManagement,
    StoreList,
  },
  data() {
    return {
      // 基础配置数据
      selectedVillage: '乌翁屯',
      selectedSection: '首页',
      scrollLeft: 0,
      sections: DataManager.getNavigationSections(),

      // 组件数据
      banners: [],
      calendarData: {},
      announcements: [],

      // 业务数据
      saleItems: DataManager.getDefaultSaleItems(),
      purchaseItems: DataManager.getDefaultPurchaseItems(),
      photoWallItems: DataManager.getDefaultPhotoWallItems(),
      storeItems: DataManager.getDefaultStoreItems(),
    };
  },
  computed: {
    currentSectionIndex() {
      return this.sections.findIndex(section => section.title === this.selectedSection);
    },
    currentPlayingId() {
      return audioManager.getCurrentPlayingId();
    },
    notifications() {
      return this.announcements.filter(item => item.type === 0);
    },
    publicAnnouncements() {
      return this.announcements.filter(item => item.type === 1);
    },
    otherSections() {
      return this.sections
        .slice(2)
        .map(section => section.title)
        .filter(title => title !== '照片' && title !== '收购' && title !== '出售' && title !== '商店');
    },
  },
  async mounted() {
    await this.initializeData();
    this.initializeAudio();
  },
  beforeUnmount() {
    audioManager.destroy();
  },
  methods: {
    // 初始化相关方法
    async initializeData() {
      try {
        await Promise.all([
          this.loadBannerData(),
          this.loadCalendarData(),
          this.loadAnnouncementData(),
        ]);
      }
      catch (error) {
        console.error('数据初始化失败:', error);
      }
    },

    initializeAudio() {
      audioManager.initialize();
      audioManager.setCallbacks({
        onPlayEnd: () => {
          this.$forceUpdate(); // 强制更新视图以反映播放状态变化
        },
        onPlayError: (err) => {
          console.error('音频播放错误:', err);
        },
      });
    },

    // 数据加载方法
    async loadBannerData() {
      try {
        const res = await api.getBannerList();
        if (res.code === 200) {
          this.banners = res.data.banners;
        }
      }
      catch (error) {
        console.error('加载 Banner 数据失败:', error);
        this.banners = [
          {
            imageUrl: 'http://src.wwen.cc/Banner/ww01.jpg',
            title: '乌翁正面',
            describe: '乌翁是一个美丽的乡村',
          },
          {
            imageUrl: 'http://src.wwen.cc/Banner/ww02.jpg',
            title: '乌翁角落',
            describe: '',
          },
        ];
      }
    },

    async loadCalendarData() {
      try {
        const res = await api.getCalendarInfo();
        if (res.code === 200) {
          this.calendarData = res.data;
        }
      }
      catch (error) {
        console.error('加载黄历数据失败:', error);
        this.calendarData = {
          lunarCalendar: '七月十二',
          yearTips: '乙巳',
          suit: '祭祀.理发.作灶',
          avoid: '嫁娶.栽种.祈福',
        };
      }
    },

    async loadAnnouncementData() {
      try {
        const res = await api.getAnnouncementList();
        if (res.code === 200) {
          this.announcements = res.data.announcements;
        }
      }
      catch (error) {
        console.error('加载公告数据失败:', error);
        this.announcements = [
          {
            id: 1,
            type: 0,
            audioUrl: 'https://res.gsmba.net/ETraining/Files/Audio/8e08930b-6b5b-4a8e-bf86-47decd39c967.mp3',
            title: '道路维修通知',
            text: '明天（20号），一、二组村民组织去东环路段修路，请各位村民注意出行安全。',
            createTimeFomat: '2小时前',
            adminLevel: 0,
          },
          {
            id: 2,
            type: 0,
            audioUrl: 'https://res.gsmba.net/ETraining/Files/Audio/8e08930b-6b5b-4a8e-bf86-47decd39c967.mp3',
            title: '8月20日停电通知',
            text: '本周三上午8-12点停水检修，请提前储水。',
            createTimeFomat: '1天前',
            adminLevel: 1,
          },
          {
            id: 3,
            type: 1,
            audioUrl: 'https://res.gsmba.net/ETraining/Files/Audio/8e08930b-6b5b-4a8e-bf86-47decd39c967.mp3',
            title: '2024年农业补贴申报开始',
            text: '各位村民请注意，2024年农业种植补贴开始申报，截止时间为3月31日，请到村委会办理相关手续。',
            createTimeFomat: '1天前',
            adminLevel: 2,
          },
          {
            id: 4,
            type: 1,
            audioUrl: '',
            title: '春季农技培训会通知',
            text: '定于3月25日上午9:00在村委会大厅举办春季农技培训会，欢迎大家踊跃参加。',
            createTimeFomat: '2天前',
            adminLevel: 1,
          },
        ];
      }
    },

    // 事件处理方法
    handlePlayAudio({ audioUrl, announcementId }) {
      const isPlaying = audioManager.play(audioUrl, announcementId);
      if (isPlaying) {
        this.$forceUpdate(); // 强制更新以反映播放状态
      }
    },

    goToAnnouncements() {
      this.setSelectedSection('公告');
    },

    // 从首页照片墙“更多”切换到 tabs 的“照片”页
    goToPhotoTab() {
      this.setSelectedSection('照片');
    },

    editAnnouncement(item) {
      uni.showToast({ title: `编辑: ${item.title}`, icon: 'none' });
    },

    deleteAnnouncement(id) {
      this.announcements = this.announcements.filter(item => item.id !== id);
    },

    // 照片预览
    previewPhoto(item) {
      uni.previewImage({
        current: item.imageUrl,
        urls: this.photoWallItems.map(p => p.imageUrl),
        indicator: 'number',
        loop: true,
      });
    },

    // 跳转到添加照片页
    goToAddPhoto() {
      uni.navigateTo({ url: '/pages/photowall/add' });
    },

    // 收购管理交互
    viewPurchaseItem(item) {
      const id = item?.id || 1;
      uni.navigateTo({ url: `/pages/purchase/detail?id=${id}` });
    },
    addPurchaseItem() {
      uni.navigateTo({ url: '/pages/purchase/add' });
    },

    // 出售管理交互
    viewSaleItem(item) {
      const id = item?.id || 1;
      uni.navigateTo({ url: `/pages/sale/detail?id=${id}` });
    },
    addSaleItem() {
      uni.navigateTo({ url: '/pages/sale/add' });
    },

    // 导航相关方法
    // 处理来自级联选择器的乡村更改
    onVillageChanged(payload) {
      const { path, leaf } = payload || {};
      this.selectedVillage = leaf || this.selectedVillage;
      // 可按需使用完整路径进行过滤或请求
      console.log('选择路径:', path);
      uni.showToast({ title: `切换到: ${this.selectedVillage}`, icon: 'none' });
    },

    onAvatarClick() {
      uni.showToast({ title: '跳转到个人中心', icon: 'none' });
    },

    setSelectedSection(section) {
      this.selectedSection = section;
      this.$nextTick(() => this.scrollToActiveTab());
    },

    onSwiperChange(e) {
      const currentIndex = e.detail.current;
      if (currentIndex >= 0 && currentIndex < this.sections.length) {
        this.selectedSection = this.sections[currentIndex].title;
        uni.vibrateShort({ type: 'light', success: () => {} });
        this.scrollToActiveTab();
      }
    },

    scrollToActiveTab() {
      const activeIndex = this.sections.findIndex(section => section.title === this.selectedSection);
      if (activeIndex > 2) {
        this.scrollLeft = (activeIndex - 2) * 60;
      }
      else {
        this.scrollLeft = 0;
      }
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #f9fafb;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.swiper-container {
  position: relative;
  flex: 1;
  overflow: hidden;
  margin-bottom: 60px;
  margin-top: 130px;
}

.content-swiper {
  height: 100%;
  width: 100%;
}

.swiper-item {
  height: 100%;
  box-sizing: border-box;
}

.scroll-content {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.scroll-content ::-webkit-scrollbar {
  display: none;
}

.section-content {
  margin: 0;
  min-height: 100%;
  box-sizing: border-box;
  padding-top: 16rpx;
  padding-bottom: 40rpx;
}

.other-content {
  margin: 32rpx;
  min-height: calc(100vh - 200rpx);
}

.placeholder {
  font-size: 32rpx;
  color: #6b7280;
  text-align: center;
  padding: 80rpx 0;
  display: block;
}

.photo-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx;
}

.photo-info .user-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.photo-info .user-nickname {
  font-size: 26rpx;
  color: #1f2937;
  font-weight: 600;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photo-info .photo-time {
  font-size: 22rpx;
  color: #9ca3af;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
