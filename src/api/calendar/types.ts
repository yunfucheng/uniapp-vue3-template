/**
 * 日历API相关类型定义
 */

// 日历数据响应接口
export interface CalendarResponse {
  code: string;
  message: string;
  result: CalendarData;
  status: string | number;
}

// 日历数据接口
export interface CalendarData {
  /** 日期 */
  date: string;
  /** 农历信息 */
  yinLi: string;
  /** 五行信息 */
  wuXing: string;
  /** 冲煞信息 */
  chongSha: string;
  /** 百忌信息 */
  baiJi: string;
  /** 吉神信息 */
  jiShen: string;
  /** 宜事项 */
  yi: string;
  /** 凶神信息 */
  xiongShen: string;
  /** 忌事项 */
  ji: string;
  /** ID */
  id: string;
}

// 获取日历数据的请求参数
export interface GetCalendarByDateParams {
  /** 日期，格式：YYYY-MM-DD */
  date: string;
}