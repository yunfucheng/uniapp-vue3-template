/**
 * 农村层级接口
 */
import { get } from '@/utils/request';
import type { GetChildrenParams, RuralRegion } from './types';

// 获取子节点（parentCode为空时返回顶层）
export const getChildren = (params: GetChildrenParams = {}) =>
  get<RuralRegion[]>('/api/app/rural/children', { params });