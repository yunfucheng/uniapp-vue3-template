# Mock数据与API接口管理使用说明

## 目录结构
```
src/mock/
├── index.js          # Mock数据管理入口
├── api.js           # API统一管理工具（支持模拟/真实接口切换）
└── modules/         # 各模块的模拟数据
    └── home.js      # 首页相关模拟数据
```

## 功能特性

### 1. 模拟数据管理
- 📁 模块化管理：按功能模块组织模拟数据
- 🔄 异步模拟：模拟真实网络请求的延迟
- 📝 标准化格式：统一的返回数据格式

### 2. API接口管理
- 🔀 无缝切换：模拟数据与真实接口之间快速切换
- 🛡️ 降级处理：真实接口失败时自动降级到模拟数据
- ⚙️ 灵活配置：可配置超时时间、基础URL等

## 使用方法

### 基础使用
```javascript
// 在Vue组件中使用
import { api } from '@/mock/api.js'

export default {
  async mounted() {
    // 获取Banner数据
    const res = await api.getBannerList()
    if (res.code === 200) {
      this.banners = res.data.banners
    }
  }
}
```

### 配置管理
```javascript
import { setApiConfig } from '@/mock/api.js'

// 切换到真实接口
setApiConfig({
  useMock: false,
  baseURL: 'https://your-api-domain.com'
})

// 切换回模拟数据
setApiConfig({
  useMock: true
})
```

## 添加新的模拟数据

### 1. 创建模块文件
在 `src/mock/modules/` 目录下创建新的模块文件，如 `user.js`：

```javascript
// 用户数据
export const userData = {
  "user": {
    "id": 1,
    "name": "张三",
    "avatar": "avatar_url"
  }
}

// 模拟用户信息接口
export const getUserInfo = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: userData
      })
    }, 300)
  })
}

export default {
  userData,
  getUserInfo
}
```

### 2. 注册到API管理器
在 `src/mock/api.js` 中添加新的接口：

```javascript
// 导入新模块
import userApi from './modules/user.js'

// 在apiList中添加新接口
const apiList = {
  // ... 其他接口
  user: {
    getUserInfo: {
      mockFn: userApi.getUserInfo,
      realApi: () => request({ url: '/api/user/info' })
    }
  }
}

// 在便捷API中添加调用方法
export const api = {
  // ... 其他方法
  getUserInfo: (params) => callApi('user', 'getUserInfo', params),
}
```

## 现有接口列表

### 首页相关
- `api.getBannerList()` - 获取Banner轮播图数据

### 返回数据格式
```javascript
{
  "code": 200,
  "message": "success", 
  "data": {
    "banners": [
      {
        "imageUrl": "图片地址",
        "title": "标题",
        "describe": "描述"
      }
    ]
  }
}
```

## Banner数据示例

当前首页Banner包含以下数据：
1. 乌翁正面 - 展示美丽乡村风貌
2. 乌翁角落 - 展示乡村特色场景

可通过修改 `src/mock/modules/home.js` 文件来调整Banner内容。

## 注意事项

1. **开发环境**：建议使用模拟数据进行开发，避免依赖后端接口
2. **生产环境**：通过配置切换到真实接口
3. **错误处理**：API调用应包含适当的错误处理逻辑
4. **性能考虑**：模拟数据会添加延迟以模拟真实网络环境

## 后续扩展

随着项目发展，可以考虑添加：
- 通知公告数据
- 活动信息数据
- 用户相关数据
- 村务服务数据
- 等其他业务模块的模拟数据