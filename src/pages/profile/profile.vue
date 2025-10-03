
          
<template>
    <view class="profile-page flex flex-col px-4">
      <!-- 顶部导航（仿微信：纯色/透明） -->
      <up-navbar :autoBack="true" bgColor="#222222" :fixed="true" :placeholder="true" title="我的" titleColor="#FFFFFF" leftIconColor="#FFFFFF" />

      <!-- 个人信息块 -->
      <view class="card mt-2 p-3 flex items-center gap-3">
        <up-image
          class="avatar"
          src="http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar004.jpg"
          mode="aspectFill"
          width="72px"
          height="72px"
          shape="square"
          radius="20px"
        />
        <view class="flex-1 flex flex-col">
          <view class="flex items-center gap-2">
            <up-text :text="nickname" size="18px" color="#111827" />
          </view>
          <view class="mt-1 flex items-center gap-2">
            <up-icon name="account" color="#6b7280" size="16px" />
            <up-text :text="role" size="14px" color="#6b7280" />
          </view>
          <view class="mt-1 flex items-center gap-2">
            <up-tag text="认证" type="primary" size="mini" plain />
            <up-text text="乌翁屯" size="14px" color="#6b7280" />
          </view>
        </view>
      </view>

      <!-- 功能列表 -->
      <up-cell-group class="mt-3">
        <up-cell title="我的照片" :isLink="true" @click="goMyPhotos">
          <template #icon>
            <up-icon name="photo" color="#2563eb" size="22px" class="mr-2" />
          </template>
        </up-cell>

        <up-cell title="我的动态" :isLink="true" @click="goMyMoments">
          <template #icon>
            <up-icon name="grid" color="#f59e0b" size="22px" class="mr-2" />
          </template>
        </up-cell>

        <up-cell title="我的出售" :isLink="true" @click="goMySale">
          <template #icon>
            <up-icon name="order" color="#10b981" size="22px" class="mr-2" />
          </template>
        </up-cell>

        <up-cell title="我的收购" :isLink="true" @click="goMyPurchase">
          <template #icon>
            <up-icon name="star-fill" color="#ef4444" size="22px" class="mr-2" />
          </template>
        </up-cell>

        <up-cell title="我的商店" :isLink="true" @click="goMyStore">
          <template #icon>
            <up-icon name="home" color="#8b5cf6" size="22px" class="mr-2" />
          </template>
        </up-cell>

        <up-cell title="设置" :isLink="true" @click="goSettings">
          <template #icon>
            <up-icon name="setting" color="#374151" size="22px" class="mr-2" />
          </template>
        </up-cell>
      </up-cell-group>
      <!-- 全局底部 Tabbar -->
      <CustomTabbar />
    </view>
  </template>
  <script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import CustomTabbar from '../../components/CustomTabbar.vue'

const nickname = ref('会飞的鱼')
const isVerified = ref(true)
const role = ref('乡管理员')

onLoad(() => {
  // 可在此请求用户信息
})

const goMyPhotos = () => {
  uni.navigateTo({ url: '/pages/photowall/manage' })
}

const goMyMoments = () => {
  uni.showToast({ title: '我的动态（占位）', icon: 'none' })
}

const goMySale = () => {
  uni.navigateTo({ url: '/pages/sale/sale' })
}

const goMyPurchase = () => {
  uni.navigateTo({ url: '/pages/purchase/purchase' })
}

const goMyStore = () => {
  // 暂跳首页，后续可支持 section 参数直达商店
  uni.navigateTo({ url: '/pages/index/index' })
}

const goSettings = () => {
  uni.showToast({ title: '设置（占位）', icon: 'none' })
}

  </script>

        