# 规则

## 模型回复

- 请简明扼要地回答，避免不必要的重复或填充语言
- 始终以简体中文回复

## 细分规则

- 项目开发规范
- Vue 开发规范
- TypeScript 开发规范
- Git 提交规范

# 项目开发规范

- 你是一位前端开发专家，精通前端架构

## 技术栈

- 框架: Uniapp、Vue 3.4+
- 打包构建工具: Vite 5.0+
- 状态管理: Pinia
- UI 组件库: uview-plus 3.4+
- CSS 预处理器: Scss
- CSS 框架: UnoCSS
 
- 开发语言: TypeScript
- 包管理工具: pnpm

## 导入规范

- 使用路径别名 `@` 指向 `src` 目录

## 目录结构

```sh
# uniapp-vue3-project
├ build                 # vite配置统一管理
│  ├ config             # vite配置管理
│  └ plugins            # vite插件管理
├ env                   # 环境变量
├ scripts               # 一些脚本
│  ├ post-upgrade.js    # 依赖库清理
│  └ verify-commit.js   # git提交检验
├ src
│  ├ api                # 接口管理
│  ├ components         # 公共组件
│  ├ hooks              # 常用hooks封装
│  ├ locale             # 国际化语言管理
│  ├ pages              # 页面管理
│  ├ plugins            # 插件管理
│  ├ router             # 路由管理
│  ├ static             # 静态资源
│  ├ store              # 状态管理
│  ├ utils              # 一些工具
│  ├ App.vue            # 根组件
│  ├ main.ts            # 入口文件
│  ├ manifest.json      # uniapp 项目配置
│  ├ pages.json         # uniapp 页面配置
│  └ uni.scss           # 全局scss变量
├ types                 # 全局typescript类型文件
├ index.html            # html入口文件
├ stylelint.config.js   # stylelint配置
├ tsconfig.json         # ts 配置
├ uno.config.ts         # unocss配置
└ vite.config.ts        # vite配置
```

- 保持目录结构清晰，遵循现有目录规范

## 代码

- 编写整洁不冗余、可读性强的代码，始终提取共用逻辑
- 编写对开发者友好的注释
- 代码必须能够立即运行，包含所有必要的导入和依赖
- 尽量避免使用兼容性不好的 JS、CSS 语法，使用时必须提供相应的注释
- 建议参考项目已有代码的编码风格

## 代码检查

 
- 禁用 Prettier 进行代码格式化

## 其他

- 优先使用现有第三方依赖，避免重新发明轮子

# Vue 开发规范

- 你是一位前端开发专家，精通 Uniapp、Vue、Pinia、Uview Plus 等前端框架

## 代码风格

- 组件: 使用单文件组件 (SFC)
- API: 使用组合式 API (Composition API) 并搭配 `<script setup>` 语法糖
- 语法: 没有特殊说明则使用 TS 进行开发 `<script setup lang="ts">`

## 命名

- 组件 (Component) 命名: 始终采用单词大写开头 (PascalCase) 的命名方式, 并且避免与 HTML 元素冲突
- 组件 (Component) 命名示例: 以全局的 `lang-select` 组件 `@/components/lang-select/index.vue` 和 `@/components/agree-privacy/index.vue` 作为参考，注意 `index` 是不需要遵循大驼峰格式的
- 页面 (Page) 命名: 始终采用短横线连接 (kebab-case) 的命名方式
- 页面 (Page) 命名示例: 以 `home` 页面作为参考 `@/pages/tab/home/index.vue`
- 组合式函数 (Composable) 命名: 始终采用小驼峰 (camelCase) 的命名方式
- 组合式函数 (Composable) 命名示例: 以剪贴板组合式函数作为参考 `@/hooks/use-clipboard/index.ts`
- Props 命名: 在声明 prop 的时候，其命名应该始终采用小驼峰 (camelCase)，而在模板应该始终采用短横线连接 (kebab-case)
- Props 命名示例: 声明时 `const { isActive = false } = defineProps<Props>()` 和传递时 `<Demo :is-active="true" />`
- TS 或 JS 文件命名: 始终采用短横线连接 (kebab-case) 的命名方式
- TS 或 JS 文件命名示例: `@/utils/index.ts`

## API

- 定义响应式变量时优先使用 `ref` 而非 `reactive`
- 复杂的模板表达式则应该重构为计算属性或方法
- 尽量避免侦听器的循坏触发，防止进入死循环

## Props

- Prop 定义应该尽量详细，包括类型、必传、默认值
- 如果是使用了 TS 那么应该使用「基于类型的声明」，示例: `const props = defineProps<Props>()`

## 状态管理

- 对应目录: `@/store`
- 使用 Pinia
- Store 应该按模块划分
- 优先使用 Setup store 语法，而不是 Option Store 语法
- 避免无脑使用全局状态管理

## 样式

- 优先使用 Scoped CSS，示例: `<style scoped lang="scss">`
- 尽可能避免使用 `!important`
- 优先使用 UnoCSS 内联样式

## 其他

- 避免直接操作 DOM
- 尽可能编写原子化组件
- 使用 `v-for` 时必须提供唯一的 `key` (不要轻易使用数组下标 `index` 当做 `key`)
- 不要在同一元素上同时使用 `v-if` 和 `v-for`

## 参考示例文件

@/pages/tab/home/index.vue

# TypeScript 开发规范

- 你是一位前端开发专家，精通 TypeScript、JavaScript 等前端技术

## 类型

- 对于对象定义，优先使用接口而非类型
- 对于联合类型、交叉类型和映射类型，使用 `type`
- 避免使用 `any`，对于未知类型优先使用 `unknown`
- 使用泛型实现可复用的类型模式
- 不可变属性使用 `readonly`

## 命名

- 类型名称和接口使用 PascalCase
- 变量和函数使用 camelCase
- 常量使用 UPPER_CASE
- 使用带有辅助动词的描述性名称（例如 isLoading、hasError）

## 代码组织

- 类型定义应靠近使用它们的地方
- 共享的类型和接口从公共类型文件导出
- 将 `*.d.ts` 文件放在 `types` 目录中

## 错误处理

- 捕获可能的异常，并对其进行处理

## 其他

- 实现适当的空值检查
- 避免不必要的类型断言
- 为公共函数使用显式返回类型
- 回调使用箭头函数
- 启用 TypeScript 严格模式
- 禁止不必要的类型体操，以可读性为主

# Git 提交规范

- 你是一位前端开发专家，精通 Git 操作

## Commit 规范

提交模板 `type: message`，具体要求如下:

1. 注意英文冒号后有一个空格
2. `type` 的枚举值有:

- `feat` 新功能
- `fix` 修复错误
- `perf` 性能优化
- `refactor` 重构代码
- `docs` 文档和注释
- `types` 类型相关
- `test` 单测相关
- `ci` 持续集成、工作流
- `revert` 撤销更改
- `chore` 琐事（更新依赖、修改配置等）

3. 保持 `message` 简洁明了，描述清楚变更内容

## 分支说明

- `main / master`: 主分支
- `gh-pages`: GitHub Pages 构建分支

## 其他

- 禁止自动提交，除非有明确的指示
- 提交前确保代码通过代码校验和单元测试
- 避免大型提交，尽量将变更分解为小的、相关的提交

# 统一主题与品牌色

- 入口与职责
  - `src/static/styles/theme.scss`: 定义全局 CSS 变量（主色、文字、背景、边框等），以及暗色主题 `.theme-dark` 的变量覆盖；已补充 `--theme-primary-dark`。
  - `src/uni.scss`: 将 uview-plus 的 SCSS 变量映射到上述 CSS 变量，保证组件库统一用色（如 `$u-primary: var(--theme-primary)`）。
  - `uno.config.ts`: 将 UnoCSS 的 `theme.colors` 映射到同一套 CSS 变量（如 `'primary': 'var(--theme-primary)'`），统一原子类与组件用色。
  - `src/plugins/theme.ts`: 运行时主题应用，基于 `pinia` 中的主题状态为 H5 端根元素切换 `.theme-dark` 类，驱动 CSS 变量切换；支持 `ThemeMode` 的 `light | dark | auto`。

- 使用与约定
  - 页面与组件样式优先使用 CSS 变量或 UnoCSS 映射：`color: var(--theme-main-color)`、`bg-bg-main`、`c-primary` 等，避免硬编码颜色。
  - 全局页面基础色由 `src/static/styles/common.scss` 设置：`$u-main-color`、`$u-bg-color`。

- 主题切换
  - 通过 `useTheme` 或 `useAppStore().setTheme(mode)` 切换主题；`mode` 取值为 `'light' | 'dark' | 'auto'`。
  - H5：运行时插件会将 `.theme-dark` 类添加到 `document.documentElement`；`auto` 模式基于系统暗色偏好（`prefers-color-scheme`）动态切换。
  - 小程序等非 H5 端：建议在页面根容器上根据状态绑定类名（如 `:class="theme==='dark' ? 'theme-dark' : ''"`），以启用暗色变量覆盖。

- 品牌色扩展
  - 如需新增品牌主题（例如 `theme-blue`）：在 `src/static/styles/theme.scss` 新增 `.theme-blue { ...同名变量覆写... }`，并在运行时根据选择切换对应类名。
  - 对应的选择入口可在 `@/components/theme-picker/index.vue` 增加选项，传入同名 `name`，使 `store` 持久化保存选择（当前已支持 `light/dark/auto`）。

- 变量命名建议
  - 主色：`--theme-primary`，按需提供 `--theme-primary-dark` 用于按压或深色态对比。
  - 文本：`--theme-main-color`、`--theme-content-color`、`--theme-tips-color` 等。
  - 背景：`--theme-bg-color`、`--theme-bg-color-secondary`。
  - 边框：`--theme-border-color`。

# API 接入规范

## 接口调用标准流程

### 1. 接口定义与类型
- 在 `@/api` 目录下按模块组织接口
- 每个模块包含 `index.ts`（接口函数）和 `types.ts`（类型定义）
- 使用统一的请求工具 `@/utils/request` 中的 `get`、`post` 等方法

```typescript
// @/api/rural/index.ts
import { get, post } from '@/utils/request';
import type { CreateRuralPhotoParams, RuralPhoto } from './types';

export const createRuralPhoto = (data: CreateRuralPhotoParams) => 
  post<RuralPhoto>('/api/app/rural-photo/create', { data });
```

### 2. 类型定义规范
- 接口参数和返回值必须定义明确的 TypeScript 类型
- 类型文件统一放在对应模块的 `types.ts` 中

```typescript
// @/api/rural/types.ts
export interface CreateRuralPhotoParams {
  title: string;
  description: string;
  imageUrl: string;
  ruralCode: string;
}

export interface RuralPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ruralCode: string;
  createTime: string;
  updateTime?: string;
}
```

### 3. 页面中的接口调用
- 使用 `async/await` 语法进行异步调用
- 统一的错误处理和用户反馈
- 调用前进行必要的参数验证

```typescript
// 页面中的标准调用模式
const publish = async () => {
  // 1. 参数验证
  if (!canPublish.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' });
    return;
  }
  
  // 2. 显示加载状态
  uni.showLoading({ title: '正在发表...' });
  
  try {
    // 3. 准备请求数据
    const requestData = {
      title: titleText.value.trim(),
      description: contentText.value.trim(),
      imageUrl: uploadedUrl.value,
      ruralCode: getCurrentRuralCode()
    };
    
    // 4. 调用接口
    const result = await createRuralPhoto(requestData);
    
    // 5. 成功处理
    uni.hideLoading();
    uni.showToast({ title: '发表成功', icon: 'success' });
    
    // 6. 页面跳转或状态更新
    setTimeout(() => {
      uni.navigateBack();
    }, 600);
  } catch (error) {
    // 7. 错误处理
    console.error('发布失败:', error);
    uni.hideLoading();
    uni.showToast({ title: '发表失败，请重试', icon: 'none' });
  }
};
```

## 全局乡村编码变量获取

### 1. 存储键规范
- 乡村路径：`user:selectedVillagePath` (JSON 数组)
- 乡村代码：`user:selectedVillageCode` (字符串)
- 乡村名称：`user:selectedVillage` (字符串)

### 2. 获取方式
```typescript
import storage from '@/utils/storage';

// 获取当前选择的乡村代码
const getCurrentRuralCode = (): string => {
  return storage.get('user:selectedVillageCode') || '';
};

// 获取乡村路径（用于级联选择器）
const getVillagePath = (): string[] => {
  return storage.getJSON('user:selectedVillagePath') || [];
};

// 获取乡村名称
const getVillageName = (): string => {
  return storage.get('user:selectedVillage') || '';
};
```

### 3. 设置方式
```typescript
// 保存乡村选择（通常在 CustomNavbar 组件中处理）
const saveVillageSelection = (path: string[], leafLabel: string) => {
  const code = path.length ? path[path.length - 1] : '';
  storage.setJSON('user:selectedVillagePath', path);
  storage.set('user:selectedVillageCode', code);
  storage.set('user:selectedVillage', leafLabel);
};
```

### 4. 使用场景
- 发布内容时获取当前乡村代码
- 筛选数据时使用乡村代码作为条件
- 页面显示时展示当前选择的乡村名称

## 通用上传组件使用规范

### 1. 组件引入
```typescript
import QiniuUploader from '@/components/QiniuUploader.vue';
```

### 2. 基本使用
```vue
<template>
  <QiniuUploader
    v-model="uploadedUrl"
    :single-mode="true"
    :max-count="1"
    accept="image"
    @success="onUploadSuccess"
    @error="onUploadError"
    @progress="onUploadProgress"
  />
</template>

<script setup lang="ts">
const uploadedUrl = ref<string>('');

const onUploadSuccess = (urls: string[]) => {
  if (urls.length > 0) {
    uploadedUrl.value = urls[0];
  }
};

const onUploadError = (err: any) => {
  uni.showToast({ title: '上传失败', icon: 'none' });
  console.error(err);
};

const onUploadProgress = (payload: any) => {
  // 可根据需要显示进度
};
</script>
```

### 3. 组件属性说明
- `v-model`: 绑定上传结果 URL（单图模式为字符串，多图模式为数组）
- `single-mode`: 是否为单图模式，默认 `false`
- `max-count`: 最大上传数量，默认 `9`
- `multiple`: 是否支持多选，默认 `true`
- `accept`: 接受的文件类型，可选 `'image' | 'video' | 'all'`
- `key-prefix`: 上传到七牛的 key 前缀，默认 `'uploads/'`
- `auto-upload`: 是否选择后自动上传，默认 `true`

### 4. 事件处理
- `@success`: 上传成功回调，参数为 URL 数组
- `@error`: 上传失败回调，参数为错误信息
- `@progress`: 上传进度回调，参数包含 `{ index, percent }`

### 5. 手动上传模式
```vue
<template>
  <QiniuUploader
    ref="uploaderRef"
    v-model="uploadedUrls"
    :auto-upload="false"
    :multiple="true"
  />
  <u-button @click="handleSubmit">手动上传</u-button>
</template>

<script setup lang="ts">
const uploaderRef = ref();
const uploadedUrls = ref<string[]>([]);

const handleSubmit = async () => {
  try {
    const urls = await uploaderRef.value.submit();
    console.log('上传完成:', urls);
  } catch (error) {
    console.error('上传失败:', error);
  }
};
</script>
```

### 6. 注意事项
- 组件内部自动处理七牛云 token 获取和缓存
- 支持 H5 和小程序等多端上传
- 自动生成唯一的文件名，避免冲突
- 内置进度显示和错误处理机制
