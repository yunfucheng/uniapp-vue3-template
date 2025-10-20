<template>
  <view class="add-rural-photo">
    <view>
      <u-navbar :auto-back="true" placeholder fixed>
        <template #right>
          <u-button size="small" color="#09BE4F" shape="circle" @click="publish">
            发布
          </u-button>
        </template>
      </u-navbar>
    </view>

    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      <view class="form-content">
        <view class="section">
          <u-input v-model="contentText" placeholder="描述乡村照片" border="bottom" />
        </view>
        <view class="divider" />

        <view class="section">
          <QiniuUploader
            v-model="uploadedUrls"
            :max-count="9"
            accept="image"
            @success="onUploadSuccess"
            @error="onUploadError"
            @progress="onUploadProgress"
          />
        </view>
        <view class="hint">最多选择 9 张图片，支持预览大图</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import QiniuUploader from '@/components/QiniuUploader.vue';
export default {
  name: 'AddRuralPhotoPage',
  components: { QiniuUploader },
  data() {
    return {
      uploadedUrls: [],
      contentText: '',
    };
  },
  methods: {
    onUploadSuccess(urls) {
      this.uploadedUrls = [...this.uploadedUrls, ...urls];
    },
    onUploadError(err) {
      uni.showToast({ title: '上传失败', icon: 'none' });
      console.error(err);
    },
    onUploadProgress(payload) {
      // 可根据需要显示进度
    },
    async publish() {
      if (!this.uploadedUrls.length) {
        uni.showToast({ title: '请先选择图片', icon: 'none' });
        return;
      }
      uni.showLoading({ title: '正在发表...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '已发表', icon: 'success' });
        setTimeout(() => uni.navigateBack(), 600);
      }, 800);
    },
  },
};
</script>

<style scoped>
.add-rural-photo { background-color: var(--theme-bg-color-secondary); height: 100vh; }
.content-scroll { height: 100vh; padding-top: calc(88rpx + var(--status-bar-height)); }
.form-content { padding: 24rpx; }
.section { margin-bottom: 16rpx; }
.divider { height: 1rpx; background-color: #e5e7eb; margin: 16rpx 0; }
.hint { margin-top: 16rpx; font-size: 24rpx; color: var(--theme-tips-color); }
</style>