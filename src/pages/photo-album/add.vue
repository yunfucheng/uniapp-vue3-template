<template>
  <view class="add-photo-page">
    <view>
      <u-navbar :auto-back="true" placeholder fixed>
        <template #right>
          <u-button size="small" color="#09BE4F" shape="circle" @click="publish">
            发布
          </u-button>
        </template>
      </u-navbar>
    </view>

    <!-- 内容区域：文本 + 多图片上传（去卡片，用细线分隔） -->
    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      <view>
        <!-- 文本内容：与添加公告风格一致，去分区标题，仅保留输入框与细线 -->
        <view>
          <u-input placeholder="描述照片" border="bottom" />
          <u-divider />
        </view>

        <!-- 多图片上传：不使用卡片容器，仅保留组件与细线 -->
        <view class="section">
          <QiniuUploader
            v-model="uploadedUrls"
            :max-count="9"
            accept="image"
            @success="onUploadSuccess"
            @error="onUploadError"
            @progress="onUploadProgress"
          />
          <view class="divider" />
        </view>
        <view class="hint">
          最多选择 9 张图片，支持预览大图
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import QiniuUploader from '@/components/QiniuUploader.vue';
export default {
  name: 'AddPhotoPage',
  components: { QiniuUploader },
  data() {
    return {
      uploadedUrls: [],
      contentText: '',
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
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
.add-photo-page { background-color: var(--theme-bg-color-secondary); height: 100vh; display:flex; flex-direction:column; }

.title-text {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--theme-main-color);
}

.action-text {
  font-size: 28rpx;
  color: #3cc51f;
}

.content-scroll {
  height: 100vh;
  padding-top: calc(88rpx + var(--status-bar-height));
}

.form-content { padding: 24rpx; }

.hint {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: var(--theme-tips-color);
}
</style>
