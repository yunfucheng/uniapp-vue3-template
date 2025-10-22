/**
 * 日历相关接口
 */
import { requestFull } from '@/utils/request';
import type { CalendarResponse, GetCalendarByDateParams, CalendarData } from './types';

/**
 * 根据日期获取日历信息
 * @param params 请求参数，包含日期
 * @returns 日历数据
 */
export const getCalendarByDate = (params: GetCalendarByDateParams): Promise<CalendarResponse> => 
  requestFull<CalendarData>({ url: '/api/app/calendar/by-date', method: 'GET', params }) as Promise<CalendarResponse>;