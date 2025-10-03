/**
 * API统一管理工具
 * 支持模拟数据和真实接口的无缝切换
 */

import { api as mockApi } from './index.js';

// 配置项
const config = {
  // 是否使用模拟数据 (true: 使用mock数据, false: 使用真实接口)
  useMock: true,
  // 真实接口的基础URL
  baseURL: 'https://api.rurclou.com',
  // 请求超时时间
  timeout: 10000,
};

/**
 * 网络请求封装
 * @param {object} options 请求选项
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: config.baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header,
      },
      timeout: config.timeout,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        }
        else {
          reject(new Error(`请求失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

/**
 * API接口定义
 */
const apiList = {
  // 首页相关接口
  home: {
    // 获取Banner列表
    getBannerList: {
      mockFn: mockApi.getBannerList,
      realApi: () => request({ url: '/api/banners' }),
    },
    // 获取公告列表
    getAnnouncementList: {
      mockFn: mockApi.getAnnouncementList,
      realApi: () => request({ url: '/api/announcements' }),
    },
  },

  // 黄历相关接口
  calendar: {
    // 获取黄历信息
    getCalendarInfo: {
      mockFn: mockApi.getCalendarInfo,
      realApi: params => request({
        url: '/api/calendar',
        data: params,
      }),
    },
  },

  // 通知相关接口
  notification: {
    // 获取通知列表
    getNotificationList: {
      mockFn: () => Promise.resolve({ code: 200, data: { notifications: [] } }),
      realApi: () => request({ url: '/api/notifications' }),
    },
  },
};

/**
 * 统一API调用函数
 * @param {string} module 模块名
 * @param {string} method 方法名
 * @param {object} params 参数
 */
const callApi = async (module, method, params = {}) => {
  try {
    const apiConfig = apiList[module]?.[method];
    if (!apiConfig) {
      throw new Error(`API不存在: ${module}.${method}`);
    }

    if (config.useMock) {
      // 使用模拟数据
      return await apiConfig.mockFn(params);
    }
    else {
      // 使用真实接口
      return await apiConfig.realApi(params);
    }
  }
  catch (error) {
    console.error(`API调用失败 ${module}.${method}:`, error);

    // 如果真实接口失败，自动降级到模拟数据
    if (!config.useMock && apiList[module]?.[method]?.mockFn) {
      console.warn('接口失败，降级使用模拟数据');
      return await apiList[module][method].mockFn(params);
    }

    throw error;
  }
};

/**
 * 便捷的API调用方法
 */
export const api = {
  // 首页接口
  getBannerList: params => callApi('home', 'getBannerList', params),
  getAnnouncementList: params => callApi('home', 'getAnnouncementList', params),

  // 黄历接口
  getCalendarInfo: params => callApi('calendar', 'getCalendarInfo', params),

  // 通知接口
  getNotificationList: params => callApi('notification', 'getNotificationList', params),
};

/**
 * 设置API配置
 * @param {object} newConfig 新配置
 */
export const setApiConfig = (newConfig) => {
  Object.assign(config, newConfig);
};

/**
 * 获取当前配置
 */
export const getApiConfig = () => ({ ...config });

// 默认导出
export default {
  api,
  setApiConfig,
  getApiConfig,
  callApi,
};
