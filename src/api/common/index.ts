/**
 * 通用接口
 */
import type { SendCodeReq, SendCodeRes, UploadRes, QiniuUploadTokenRes } from './types';
import { post, upload } from '@/utils/request';

// 文件上传
export const uploadFile = (filePath: string) =>
  upload<UploadRes>('/common/upload', { filePath, name: 'file' });

// 获取七牛云上传token
export const getQiniuUploadToken = () =>
  post<QiniuUploadTokenRes>('/api/file/uploadToken', { custom: { auth: false } });

// 发送验证码
export const sendCode = (data: SendCodeReq) => post<SendCodeRes>('/sendCode', { data });
