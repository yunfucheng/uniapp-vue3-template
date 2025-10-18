<template>
  <view class="flex flex-wrap gap-3">
    <view
      v-for="(item, index) in colors" :key="index"
      class="mb-10rpx h-40rpx w-40rpx center cursor-pointer border-4rpx border-gray-300 rounded-4rpx border-solid"
      :class="{ 'border-white': theme === item.name }" :style="{ backgroundColor: item.color }"
      @click="changeTheme(item.name)"
    >
      <view v-if="theme === item.name" class="i-mdi-check text-32rpx c-#fff" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';

const appStore = useAppStore();

const colors = [
  { name: 'light', color: '#21d59d' },
  { name: 'dark', color: '#3c9cff' },
  { name: 'auto', color: '#888888' },
];

const theme = computed(() => appStore.getTheme);

function changeTheme(theme: string) {
  appStore.setTheme(theme as any);
}
</script>
