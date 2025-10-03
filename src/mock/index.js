/**
 * Mock数据管理入口文件
 */

import calendarApi from './modules/calendar.js';
import homeApi from './modules/home.js';

// 导出所有模拟接口
export const mockApi = {
  home: homeApi,
  calendar: calendarApi,
};

// 便捷的接口调用方法
export const api = {
  // 首页相关接口
  getBannerList: homeApi.getBannerList,
  getAnnouncementList: homeApi.getAnnouncementList,

  // 黄历相关接口
  getCalendarInfo: calendarApi.getCalendarInfo,
};

// 默认导出
export default {
  mockApi,
  api,
};
