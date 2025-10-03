/**
 * 数据管理工具类
 * 用于管理应用中的各种数据，提高代码复用性和维护性
 */

export class DataManager {
  
  /**
   * 获取默认Banner数据
   */
  static getDefaultBanners() {
    return [
      {
        imageUrl: "http://t2k8c3tkq.hn-bkt.clouddn.com/Banner/ww01.jpg",
        title: "乌翁正面",
        describe: "乌翁是一个美丽的乡村"
      },
      {
        imageUrl: "http://t2k8c3tkq.hn-bkt.clouddn.com/Banner/ww02.jpg",
        title: "乌翁角落",
        describe: ""
      }
    ]
  }

  /**
   * 获取默认黄历数据
   */
  static getDefaultCalendarData() {
    return {
      lunarCalendar: '七月十二',
      yearTips: '乙巳',
      suit: '祭祀.理发.作灶',
      avoid: '嫁娶.栽种.祈福'
    }
  }

  /**
   * 获取默认公告数据
   */
  static getDefaultAnnouncements() {
    return [
      {
        id: 1,
        type: 0, // 通知
        audioUrl: "https://res.gsmba.net/ETraining/Files/Audio/8e08930b-6b5b-4a8e-bf86-47decd39c967.mp3",
        title: "道路维修通知",
        text: "明天（20号），一、二组村民组织去东环路段修路，请各位村民注意出行安全。",
        createTimeFomat: "2小时前",
        adminLevel: 0
      },
      {
        id: 2,
        type: 0, // 通知
        audioUrl: "https://res.gsmba.net/ETraining/Files/Audio/8e08930b-6b5b-4a8e-bf86-47decd39c967.mp3",
        title: "8月20日停电通知",
        text: "本周三上午8-12点停水检修，请提前储水。",
        createTimeFomat: "1天前",
        adminLevel: 1
      },
      {
        id: 3,
        type: 1, // 公告
        audioUrl: "https://res.gsmba.net/ETraining/Files/Audio/8e08930b-6b5b-4a8e-bf86-47decd39c967.mp3",
        title: "2024年农业补贴申报开始",
        text: "各位村民请注意，2024年农业种植补贴开始申报，截止时间为3月31日，请到村委会办理相关手续。",
        createTimeFomat: "1天前",
        adminLevel: 2
      },
      {
        id: 4,
        type: 1, // 公告
        audioUrl: "",
        title: "春季农技培训会通知",
        text: "定于3月25日上午9:00在村委会大厅举办春季农技培训会，欢迎大家踊跃参加。",
        createTimeFomat: "2天前",
        adminLevel: 1
      }
    ]
  }

  /**
   * 获取默认出售商品数据
   */
  static getDefaultSaleItems() {
    return [
      {
        id: 1,
        title: '【示例】二手皮质沙发，用了三年，有需要的联系',
        image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.5HrLdoO912s6rZKqe-r_hAHaDu?w=303&h=175&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3',
        location: '乌翁屯',
        price: '1200',
        userAvatar: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.mD6iV0pmpobb5PNSw8wf4QAAAA?w=174&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.4&pid=3.1&rm=2',
        userNickname: '会飞的鱼',
        time: '2天前'
      },
      {
        id: 2,
        title: '新鲜土鸡蛋，家养土鸡产的，绿色无污染',
        image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=400',
        location: '乌翁屯',
        price: '1',
        userAvatar: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.SWWmUtJk_k7PS8U6DyrxQQAAAA?w=211&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.4&pid=3.1&rm=2',
        userNickname: '吹过村子的风',
        time: '3天前'
      }
    ]
  }

  /**
   * 获取默认收购信息数据
   */
  static getDefaultPurchaseItems() {
    return [
      {
        id: 1,
        title: '收购水稻鱼，要求每条2两以上，30斤',
        price: '30',
        location: '乌翁屯',
        image: '',
        userAvatar: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar004.jpg',
        userNickname: '花开富贵',
        time: '刚刚'
      },
      {
        id: 2,
        title: '村内收购山笋，可上门收购',
        price: '12',
        location: '乌翁屯',
        image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.T3My7oepL81wcR8HmDKt8wHaD0?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
        userAvatar: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar003.jpg',
        userNickname: '风中的男人',
        time: '30分钟前'
      },
      {
        id: 3,
        title: '土鸡土鸭收购不要吃料鸡',
        price: '23',
        location: '乌翁屯',
        image: '',
        userAvatar: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar003.jpg',
        userNickname: 'Done你是我的梦想',
        time: '5天前'
      }
    ]
  }

  /**
   * 获取默认商店列表数据
   */
  static getDefaultStoreItems() {
    return [
      {
        id: 1,
        name: '妙妙小卖部',
        desc: '（描述）主卖日常用品，有卖现煮螺丝粉，本屯包送到家',
        location: '乌翁屯 | 主后街道小溪旁边',
        image: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Banner/ww01.jpg',
        status: '营业中',
        tags: ['日常用品', '粉店'],
        phone: '',
        supportPhone: false
      },
      {
        id: 2,
        name: '广场小卖部',
        desc: '（描述）生活用品，这里可以收快递',
        location: '乌翁屯 | 篮球场旁边',
        image: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Banner/ww02.jpg',
        status: '营业中',
        tags: ['日常用品', '快递代收'],
        phone: '',
        supportPhone: false
      }
    ]
  }

  /**
   * 获取默认照片墙数据
   */
  static getDefaultPhotoWallItems() {
    return [
      {
        id: 1,
        imageUrl: 'http://t2k8c3tkq.hn-bkt.clouddn.com/PhotoWall/wall001.jpg',
        userAvatar: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar005.jpg',
        userNickname: '幸福一生',
        time: '5天前'
      },
      {
        id: 2,
        imageUrl: 'http://t2k8c3tkq.hn-bkt.clouddn.com/PhotoWall/wall002.jpg',
        userAvatar: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar006.jpg',
        userNickname: '爱江山更爱美人',
        time: '1天前'
      },
      {
        id: 3,
        imageUrl: 'http://t2k8c3tkq.hn-bkt.clouddn.com/PhotoWall/wall003.jpg',
        userAvatar: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar007.jpg',
        userNickname: 'Aser0327',
        time: '5天前'
      },
      {
        id: 4,
        imageUrl: 'http://t2k8c3tkq.hn-bkt.clouddn.com/PhotoWall/wall004.jpg',
        userAvatar: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar008.jpg',
        userNickname: '俗了月.',
        time: '半月前'
      },
      {
        id: 5,
        imageUrl: 'http://t2k8c3tkq.hn-bkt.clouddn.com/PhotoWall/wall005.jpg',
        userAvatar: 'http://t2k8c3tkq.hn-bkt.clouddn.com/Avatar/avatar009.jpg',
        userNickname: '🌸豌豆糕🎀',
        time: '半月前'
      }
    ]
  }

  /**
   * 获取导航配置数据
   */
  static getNavigationSections() {
    return [
      { title: '首页' },
      { title: '公告' },
      { title: '照片' },
      { title: '收购' },
      { title: '出售' },
      { title: '商店' },
      { title: '招工' },
      { title: '科普' }
    ]
  }

  /**
   * 获取村庄列表数据
   */
  static getVillageList() {
    return ['乌翁屯', '南河屯', '北山屯', '东林屯']
  }

  /**
   * 根据管理级别获取徽章颜色
   */
  static getLevelColor(adminLevel) {
    const colorMap = {
      0: '#F59E0B', // 屯 - 黄色
      1: '#DC2626', // 村 - 红色
      2: '#3B82F6'  // 乡 - 蓝色
    }
    return colorMap[adminLevel] || '#DC2626'
  }

  /**
   * 根据管理级别获取徽章文本
   */
  static getLevelText(adminLevel) {
    const levelMap = {
      0: '屯',
      1: '村', 
      2: '乡'
    }
    return levelMap[adminLevel] || '村'
  }

  /**
   * 格式化价格显示
   */
  static formatPrice(price, type = 'sale') {
    const unit = type === 'sale' ? '元' : '元/斤'
    return `${price}${unit}`
  }

  /**
   * 格式化时间显示
   */
  static formatTime(timeStr) {
    // 这里可以根据需要添加更复杂的时间格式化逻辑
    return timeStr
  }
}

export default DataManager