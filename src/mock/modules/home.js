/**
 * 首页相关模拟数据
 */

// Banner数据
export const bannerData = {
  banners: [
    {
      imageUrl: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Banner/ww01.jpg',
      title: '乌翁苗寨',
      describe: '乌翁欢迎您，欢迎来到乌翁苗寨。',
    },
    {
      imageUrl: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Banner/ww02.jpg',
      title: '乌翁角落',
      describe: '',
    },
  ],
};

// 模拟Banner接口
export const getBannerList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: bannerData,
      });
    }, 300); // 模拟网络延迟
  });
};

// 公告数据
export const announcementData = {
  announcements: [
    {
      id: 1,
      type: 0,
      audioUrl: 'https://res.gsmba.net/ETraining/Files/Audio/8e08930b-6b5b-4a8e-bf86-47decd39c967.mp3',
      title: '道路维修通知',
      text: '道路维修通知，请各位乡亲注意安全。',
      createTimeFomat: '2小时前',
      adminLevel: 0,
    },
    {
      id: 2,
      audioUrl: '',
      type: 0,
      title: '8月20日停电通知',
      text: '8月20日停电通知，请各位乡亲注意安全。',
      createTimeFomat: '1天前',
      adminLevel: 1,
    },
    {
      id: 3,
      audioUrl: 'https://res.gsmba.net/ETraining/Files/Audio/8e08930b-6b5b-4a8e-bf86-47decd39c967.mp3',
      type: 1,
      title: '六月六尝鲜节活动资助公告',
      text: '尊敬的各位领导、各位乡亲们，大家好，六月六尝鲜节活动,欢迎大家',
      createTimeFomat: '1天前',
      adminLevel: 1,
    },
    {
      id: 4,
      audioUrl: 'https://res.gsmba.net/ETraining/Files/Audio/8e08930b-6b5b-4a8e-bf86-47decd39c967.mp3',
      type: 1,
      title: '开展免费体验医疗糖尿病',
      text: '柳州市眼科医院于明天20号开展免费体验医疗糖尿病',
      createTimeFomat: '1天前',
      adminLevel: 1,
    },
  ],
};

// 模拟公告接口
export const getAnnouncementList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: announcementData,
      });
    }, 300); // 模拟网络延迟
  });
};

// 默认导出首页所有模拟数据
export default {
  bannerData,
  getBannerList,
  announcementData,
  getAnnouncementList,
};
