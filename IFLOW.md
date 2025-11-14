# 项目概览

这是一个基于 `uni-app` 框架构建的跨平台应用项目，名为“农村云”。项目采用现代化的技术栈，旨在为团队协作开发提供一个高效、规范且功能丰富的模板。

## 核心技术栈

- **框架**: `uni-app` (Vue 3)
- **构建工具**: `Vite`
- **语言**: `TypeScript`
- **UI 组件库**: `uview-plus`
- **状态管理**: `Pinia`
- **CSS 引擎**: `UnoCSS`
- **包管理器**: `pnpm`

## 项目结构

项目遵循清晰的分层架构，主要目录如下：

- `build/`: Vite 配置和自定义插件。
- `env/`: 多环境配置文件（开发、测试、生产）。
- `src/`: 源代码目录。
  - `api/`: 按模块组织的 API 接口封装。
  - `components/`: 公共及业务组件。
  - `hooks/`: 自定义 Vue Composition API hooks。
  - `pages/`: 应用页面。
  - `plugins/`: Vue 插件（如主题、权限）。
  - `store/`: Pinia 状态管理模块。
  - `utils/`: 工具函数。
  - `locales/`: 国际化语言包。
- `types/`: 全局 TypeScript 类型声明。

## 构建与运行

项目通过 `package.json` 中的脚本进行管理和构建。

### 安装依赖
```bash
pnpm install
```

### 开发模式
- 启动 H5 开发服务器:
  ```bash
  pnpm dev:h5
  ```
- 启动微信小程序开发:
  ```bash
  pnpm dev:mp-weixin
  ```

### 构建
- 构建 H5 生产版本:
  ```bash
  pnpm build:h5-prod
  ```
- 构建微信小程序生产版本:
  ```bash
  pnpm build:mp-weixin-prod
  ```

## 开发规范与特性

- **代码规范**: 集成了 `Stylelint` 和 `EditorConfig` 以保证代码风格统一。
- **自动导入**: 通过 Vite 插件自动导入 API 和组件，减少手动 `import`。
- **权限控制**: 内置页面访问权限拦截逻辑，通过在 `pages.json` 中设置 `needLogin` 属性或在页面 `onShow` 生命周期中调用 `usePermission` hook 来实现。
- **网络请求**: 封装了通用的网络请求方法，并支持 TypeScript 类型。
- **国际化**: 使用 `vue-i18n` 实现多语言支持。
- **UnoCSS**: 使用原子化 CSS 引擎 UnoCSS 进行样式开发，并集成了图标库 `@iconify-json/mdi`。
- **AI 友好**: 项目配置了对 `Cursor` 和 `Trae` 等 AI 编程助手的规则支持。