<template>
  <view class="add-photo-page">
    <view>
      <u-navbar :auto-back="true" placeholder fixed>
        <template #right>
          <u-button size="small" color="#09BE4F" shape="circle" >
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
          <u-upload
            v-model:file-list="fileList"
            accept="image"
            :max-count="9"
            :auto-upload="false"
            multiple
            :preview-full-image="true"
            list-type="picture"
            @after-read="onAfterRead"
            @delete="onDelete"
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
export default {
  name: 'AddPhotoPage',
  data() {
    return {
      fileList: [],
      contentText: '',
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    onAfterRead(event) {
      const files = Array.isArray(event.file) ? event.file : [event.file];
      const mapped = files.map(f => ({
        url: f.url || f.path || '',
        name: f.name || 'image',
        ext: f.ext || '',
        size: f.size || 0,
      })).filter(f => f.url);
      this.fileList = this.fileList.concat(mapped);
    },
    onDelete(event) {
      const index = event.index;
      if (index >= 0 && index < this.fileList.length) {
        this.fileList.splice(index, 1);
      }
    },
    async publish() {
      if (!this.fileList.length) {
        uni.showToast({ title: '请先选择图片', icon: 'none' });
        return;
      }
      // 此处可对接上传接口；当前仅作提交成功提示
      uni.showLoading({ title: '正在发表...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '已发表', icon: 'success' });
        // 返回上一页或首页
        setTimeout(() => uni.navigateBack(), 600);
      }, 800);
    },
  },
};
</script>

<style scoped>
.add-photo-page { background-color: #f8fafc; height: 100vh; display:flex; flex-direction:column; }

.title-text {
  font-size: 34rpx;
  font-weight: 700;
  color: #1f2937;
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
  color: #6b7280;
}
</style>
