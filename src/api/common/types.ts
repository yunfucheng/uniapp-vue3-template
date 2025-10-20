export interface CommonReq {
  [key: string]: any;
}

export interface CommonRes {
  [key: string]: any;
}

export interface UploadRes {
  file: string;
  url: string;
}

export interface SendCodeReq {
  phone: number;
  code: number;
}

export interface SendCodeRes {
  code: number;
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
