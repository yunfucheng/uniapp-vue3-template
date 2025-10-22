export interface RuralRegion {
  code: string;
  name: string;
  level: number;
  parentCode?: string;
  hasChildren?: boolean;
}

export interface GetChildrenParams {
  parentCode?: string;
}

export interface DefaultSelectionRes {
  path: string[];
  leafLabel: string;
}

// 七牛云上传相关接口
export interface QiniuUploadTokenRes {
  /** 七牛云上传凭证 */
  token: string;
  /** 上传服务器地址 */
  uploadEndpoint: string;
  /** 资源访问域名 */
  domain: string;
  /** token 有效期（秒） */
  expireSeconds: number;
}

export interface QiniuUploadResult {
  /** 文件唯一标识 */
  key: string;
  /** 文件访问 URL */
  url: string;
  /** 文件大小 */
  size?: number;
  /** 文件类型 */
  mimeType?: string;
}

// 乡村照片相关接口
export interface CreateRuralPhotoParams {
  /** 照片标题 */
  title: string;
  /** 照片描述 */
  description: string;
  /** 图片URL */
  imageUrl: string;
  /** 乡村代码 */
  ruralCode: string;
}

export interface RuralPhoto {
  /** 照片ID */
  id: string;
  /** 照片标题 */
  title: string;
  /** 照片描述 */
  description: string;
  /** 图片URL */
  imageUrl: string;
  /** 乡村代码 */
  ruralCode: string;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime?: string;
}

// 获取推荐照片接口参数
export interface GetRecommendedPhotosParams {
  /** 乡村代码 */
  ruralCode: string;
}