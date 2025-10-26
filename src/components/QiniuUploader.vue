<template>
  <view class="qiniu-uploader">
    <u-upload
      v-model:file-list="fileList"
      :max-count="props.singleMode ? 1 : maxCount"
      :multiple="props.singleMode ? false : multiple"
      :auto-upload="false"
      :preview-full-image="true"
      :accept="accept"
      @after-read="onAfterRead"
      @delete="onDelete"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getQiniuUploadToken } from '@/api/common';
import type { QiniuUploadTokenRes } from '@/api/common/types';

interface QiniuUploaderProps {
  modelValue?: string | string[];
  maxCount?: number;
  multiple?: boolean;
  accept?: 'image' | 'video' | 'all';
  /** 上传到七牛的 key 前缀，例如 'images/' */
  keyPrefix?: string;
  /** 是否在选择后自动上传 */
  autoUpload?: boolean;
  /** 是否为单图模式 */
  singleMode?: boolean;
}

const props = withDefaults(defineProps<QiniuUploaderProps>(), {
  modelValue: () => [],
  maxCount: 9,
  multiple: true,
  accept: 'image',
  keyPrefix: 'uploads/',
  autoUpload: true,
  singleMode: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void;
  (e: 'success', urls: string[]): void;
  (e: 'error', error: any): void;
  (e: 'progress', payload: { index: number; percent: number }): void;
}>();

// u-upload 文件列表
const fileList = ref<any[]>([]);

// 缓存的 token
let cachedToken: (QiniuUploadTokenRes & { expireAt: number }) | null = null;

function now() {
  return Date.now();
}
function isTokenExpired() {
  if (!cachedToken) return true;
  // 预留 60 秒缓冲
  return now() >= (cachedToken.expireAt - 60 * 1000);
}

async function ensureToken() {
  if (!cachedToken || isTokenExpired()) {
    try {
      console.log('获取七牛云上传token...');
      const tokenRes = await getQiniuUploadToken();
      console.log('获取token成功:', {
        domain: tokenRes.domain,
        uploadEndpoint: tokenRes.uploadEndpoint,
        expireSeconds: tokenRes.expireSeconds
      });
      cachedToken = {
        ...tokenRes,
        expireAt: now() + (tokenRes.expireSeconds * 1000),
      };
    } catch (error) {
      console.error('获取七牛云token失败:', error);
      throw new Error('获取上传凭证失败，请检查网络连接');
    }
  }
  return cachedToken;
}

function normalizeDomain(domain: string) {
  if (!domain) return '';
  let d = domain.trim();
  if (!d.startsWith('http://') && !d.startsWith('https://')) d = `http://${d}`;
  return d.replace(/\/+$/, '');
}

function getExtByNameOrUrl(name?: string, url?: string) {
  const fromName = name && name.includes('.') ? name.split('.').pop() || '' : '';
  if (fromName) return fromName.toLowerCase();
  if (url && url.includes('.')) {
    const seg = url.split('?')[0];
    const ext = seg.split('.').pop() || '';
    return ext.toLowerCase();
  }
  return 'jpg'; // 默认图片扩展
}

function buildKey(item: any, prefix = props.keyPrefix) {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const ext = getExtByNameOrUrl(item.name, item.url || item.path);
  return `${prefix}${ts}-${rand}.${ext}`;
}

async function uploadOne(item: any, index: number): Promise<{ key: string; url: string }> {
  const tk = await ensureToken();
  const uploadUrl = tk.uploadEndpoint;
  const key = buildKey(item);

  return new Promise((resolve, reject) => {
    // H5 端优先使用 File 对象
    // #ifdef H5
    const optionH5: UniApp.UploadFileOption = {
      url: uploadUrl,
      name: 'file',
      formData: { token: tk.token, key },
      file: (item.file as File) || undefined,
      success(res) {
        try {
          const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          const fileUrl = `${normalizeDomain(tk.domain)}/${data.key}`;
          emit('progress', { index, percent: 100 });
          resolve({ key: data.key, url: fileUrl });
        }
        catch (e) {
          console.error('H5上传解析响应失败:', e, res);
          reject(e);
        }
      },
      fail(err) {
        console.error('H5上传失败:', err);
        emit('error', err);
        reject(err);
      },
    };
    const taskH5 = (uni.uploadFile as unknown as (opt: UniApp.UploadFileOption) => UniApp.UploadTask)(optionH5);
    taskH5.onProgressUpdate?.((progress) => {
      emit('progress', { index, percent: progress.progress });
    });
    return;
    // #endif

    // 非 H5 端使用 filePath
    // #ifndef H5
    const filePath = item.url || item.path || item.tempFilePath || item.thumb || '';
    
    // 检查文件路径是否有效
    if (!filePath) {
      const error = new Error('文件路径为空，无法上传');
      console.error('上传失败 - 文件路径为空:', item);
      emit('error', error);
      reject(error);
      return;
    }

    console.log('开始上传文件:', {
      filePath,
      uploadUrl,
      key,
      token: tk.token ? '***' : '无token'
    });

    const option: UniApp.UploadFileOption = {
      url: uploadUrl,
      name: 'file',
      filePath,
      formData: { token: tk.token, key },
      timeout: 60000, // 设置60秒超时
      success(res) {
        console.log('上传成功响应:', res);
        try {
          // 检查HTTP状态码
          if (res.statusCode !== 200) {
            throw new Error(`HTTP状态码错误: ${res.statusCode}`);
          }
          
          const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          
          // 检查七牛云响应
          if (!data.key) {
            throw new Error('七牛云响应格式错误，缺少key字段');
          }
          
          const fileUrl = `${normalizeDomain(tk.domain)}/${data.key}`;
          console.log('文件上传成功:', fileUrl);
          emit('progress', { index, percent: 100 });
          resolve({ key: data.key, url: fileUrl });
        }
        catch (e) {
          console.error('解析上传响应失败:', e, res);
          emit('error', e);
          reject(e);
        }
      },
      fail(err) {
        console.error('上传请求失败:', err);
        emit('error', err);
        reject(err);
      },
    };
    
    const task = (uni.uploadFile as unknown as (opt: UniApp.UploadFileOption) => UniApp.UploadTask)(option);
    task.onProgressUpdate?.((progress) => {
      emit('progress', { index, percent: progress.progress });
    });
    // #endif
  });
}

async function onAfterRead(event: any) {
  const files = Array.isArray(event.file) ? event.file : [event.file];
  
  console.log('选择文件后回调:', files);
  
  // 单图模式下，替换现有文件
  if (props.singleMode) {
    fileList.value = files;
  } else {
    fileList.value = fileList.value.concat(files);
  }

  if (props.autoUpload) {
    console.log('开始自动上传...');
    const uploaded: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        console.log(`上传第${i + 1}个文件:`, files[i]);
        const { url } = await uploadOne(files[i], i);
        uploaded.push(url);
        console.log(`第${i + 1}个文件上传成功:`, url);
      }
      catch (e) {
        console.error(`第${i + 1}个文件上传失败:`, e);
        uni.showToast({ 
          title: `第${i + 1}个文件上传失败`, 
          icon: 'none',
          duration: 3000
        });
        emit('error', e);
      }
    }
    
    console.log('所有文件上传完成:', uploaded);
    
    // 单图模式下返回单个URL，多图模式返回数组
    if (props.singleMode) {
      emit('update:modelValue', uploaded[0] || '');
    } else {
      const currentValue = Array.isArray(props.modelValue) ? props.modelValue : [];
      emit('update:modelValue', [...currentValue, ...uploaded]);
    }
    emit('success', uploaded);
  }
}

function onDelete(event: any) {
  const index = event.index;
  if (index >= 0 && index < fileList.value.length) {
    fileList.value.splice(index, 1);
    
    // 单图模式下清空modelValue
    if (props.singleMode) {
      emit('update:modelValue', '');
    }
  }
}

async function submit() {
  const uploaded: string[] = [];
  for (let i = 0; i < fileList.value.length; i++) {
    const item = fileList.value[i];
    try {
      const { url } = await uploadOne(item, i);
      uploaded.push(url);
    }
    catch (e) {
      uni.$u.toast('上传失败');
      emit('error', e);
    }
  }
  
  // 单图模式下返回单个URL，多图模式返回数组
  if (props.singleMode) {
    emit('update:modelValue', uploaded[0] || '');
  } else {
    const currentValue = Array.isArray(props.modelValue) ? props.modelValue : [];
    emit('update:modelValue', [...currentValue, ...uploaded]);
  }
  emit('success', uploaded);
  return uploaded;
}

// 暴露提交方法，适用于 autoUpload=false
defineExpose({ submit });
</script>

<style scoped>
.qiniu-uploader {
  width: 100%;
}
</style>