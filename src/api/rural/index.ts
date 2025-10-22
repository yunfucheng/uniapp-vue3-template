/**
 * 农村层级接口
 */
import { get, post } from '@/utils/request';
import type { GetChildrenParams, RuralRegion, DefaultSelectionRes, CreateRuralPhotoParams, RuralPhoto, GetRecommendedPhotosParams } from './types';

// 获取子节点（parentCode为空时返回顶层）
export const getChildren = (params: GetChildrenParams = {}) => get<RuralRegion[]>('/api/app/rural/children', { params });
export const getDefault = () => get<DefaultSelectionRes>('/api/app/rural/default');

// 乡村照片相关接口
export const createRuralPhoto = (data: CreateRuralPhotoParams) => post<RuralPhoto>('/api/app/rural-photo/create', { data });

// 获取推荐照片
export const getRecommendedPhotos = (params: GetRecommendedPhotosParams) => get<RuralPhoto[]>('/api/app/rural-photo/recommended', { params });