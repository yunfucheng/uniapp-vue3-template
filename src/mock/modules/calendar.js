/**
 * 黄历相关模拟数据
 */

// 天干地支数据
const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const shengXiao = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 星座数据
const constellations = [
  '水瓶座',
  '双鱼座',
  '白羊座',
  '金牛座',
  '双子座',
  '巨蟹座',
  '狮子座',
  '处女座',
  '天秤座',
  '天蝎座',
  '射手座',
  '摩羯座',
];

// 二十四节气
const solarTerms = [
  '立春',
  '雨水',
  '惊蛰',
  '春分',
  '清明',
  '谷雨',
  '立夏',
  '小满',
  '芒种',
  '夏至',
  '小暑',
  '大暑',
  '立秋',
  '处暑',
  '白露',
  '秋分',
  '寒露',
  '霜降',
  '立冬',
  '小雪',
  '大雪',
  '冬至',
  '小寒',
  '大寒',
];

// 宜事项
const suitItems = [
  '祭祀',
  '祈福',
  '求嗣',
  '开光',
  '塑绘',
  '斋醮',
  '订盟',
  '纳采',
  '嫁娶',
  '起基',
  '动土',
  '竖柱',
  '上梁',
  '造屋',
  '安门',
  '收财',
  '纳畜',
  '造畜椆栖',
  '安床',
  '修造',
  '动土',
  '置产',
  '破土',
  '启钻',
  '修坟',
  '安葬',
  '谢土',
  '赴任',
  '出行',
  '移徙',
  '祈福',
  '求医',
  '治病',
  '会友',
  '执友',
  '造船',
  '乘船',
  '捕捉',
  '进人口',
  '裁衣',
  '冠笄',
  '理发',
  '造桥',
  '作灶',
  '开池',
  '栽种',
  '牧养',
  '修饰垣墙',
  '造仓',
  '鼓铸',
  '经络',
  '酝酿',
  '开市',
  '立券',
  '交易',
  '纳财',
  '开仓',
  '出货财',
  '启钻',
  '安葬',
  '入殓',
  '移柩',
  '除服',
  '成服',
  '余事勿取',
  '结婚',
  '搬家',
  '装修',
  '开业',
  '入宅',
  '打扫',
  '房屋清洁',
  '美甲浴足',
];

// 忌事项
const avoidItems = [
  '栽种',
  '开渠',
  '放水',
  '针灸',
  '安床',
  '安葬',
  '开池',
  '放水',
  '针灸',
  '开市',
  '立券',
  '挂匾',
  '交易',
  '纳财',
  '造船',
  '入宅',
  '移徙',
  '分居',
  '安香',
  '出火',
  '出行',
  '祭祀',
  '祈福',
  '斋醮',
  '订盟',
  '纳采',
  '嫁娶',
  '起基',
  '动土',
  '竖柱',
  '上梁',
  '造屋',
  '合帐',
  '造床',
  '开仓',
  '作灶',
  '造船',
  '经络',
  '纳畜',
  '捕捉',
  '取鱼',
  '畋猎',
  '造畜椆栖',
  '造桥',
  '作灶',
  '造仓',
  '修造',
  '动土',
  '置产',
  '破土',
  '启钻',
  '修坟',
  '谢土',
  '安葬',
  '伐木',
  '作梁',
  '行丧',
  '理发',
  '剃头',
  '整手足甲',
];

/**
 * 生成指定日期的黄历数据
 * @param {string} dateStr 日期字符串 YYYY-MM-DD
 */
const generateCalendarData = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 计算一年中的第几天
  const yearStart = new Date(year, 0, 1);
  const dayOfYear = Math.ceil((date - yearStart) / (1000 * 60 * 60 * 24)) + 1;

  // 计算一年中的第几周
  const weekOfYear = Math.ceil(dayOfYear / 7);

  // 获取星期几 (0-6，0为周日)
  const dayOfWeek = date.getDay();
  const weekDay = dayOfWeek === 0 ? 7 : dayOfWeek;

  // 计算天干地支
  const tianGanIndex = (year - 4) % 10;
  const diZhiIndex = (year - 4) % 12;
  const yearTips = tianGan[tianGanIndex] + diZhi[diZhiIndex];

  // 生肖
  const chineseZodiac = shengXiao[diZhiIndex];

  // 星座计算
  const constellationIndex = Math.floor((month - 1) / 1) % 12;
  const constellation = constellations[constellationIndex];

  // 判断工作日/假日类型
  const isWeekend = weekDay >= 6;
  const type = isWeekend ? 1 : 0;
  const detailsType = isWeekend ? 1 : 0;
  const typeDes = isWeekend ? '休息日' : '工作日';

  // 农历日期 (简单模拟)
  const lunarDay = ((day + 10) % 30) + 1;
  const lunarDayStr = lunarDay < 10
    ? `初${['', '一', '二', '三', '四', '五', '六', '七', '八', '九'][lunarDay]}`
    : lunarDay < 20
      ? `十${['', '一', '二', '三', '四', '五', '六', '七', '八', '九'][lunarDay - 10]}`
      : lunarDay < 30
        ? `廿${['', '一', '二', '三', '四', '五', '六', '七', '八', '九'][lunarDay - 20]}`
        : '三十';

  // 修复农历月份计算
  const lunarMonth = ((month + 5) % 12) + 1;
  const lunarMonthNames = ['', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  const lunarMonthStr = lunarMonthNames[lunarMonth] || '正';
  const lunarCalendar = `${lunarMonthStr}月${lunarDayStr}`;

  // 节气 (简单模拟)
  const termIndex = Math.floor((month - 1) * 2 + (day > 15 ? 1 : 0)) % 24;
  const solarTerms_str = `${solarTerms[termIndex]}后`;

  // 随机生成宜忌事项
  const suitCount = Math.floor(Math.random() * 8) + 5;
  const avoidCount = Math.floor(Math.random() * 6) + 3;

  const shuffledSuit = [...suitItems].sort(() => Math.random() - 0.5).slice(0, suitCount);
  const shuffledAvoid = [...avoidItems].sort(() => Math.random() - 0.5).slice(0, avoidCount);

  const suit = shuffledSuit.join('.');
  const avoid = shuffledAvoid.join('.');

  // 工作日索引
  const indexWorkDayOfMonth = type === 0 ? Math.floor(day / 7) + 1 : 0;

  return {
    date: dateStr,
    weekDay,
    yearTips,
    type,
    detailsType,
    typeDes,
    chineseZodiac,
    solarTerms: solarTerms_str,
    avoid,
    lunarCalendar,
    suit,
    dayOfYear,
    weekOfYear,
    constellation,
    indexWorkDayOfMonth,
  };
};

/**
 * 获取指定日期的黄历信息
 * @param {string} date 日期字符串 YYYY-MM-DD，默认为今天
 */
export const getCalendarInfo = (date) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const calendarData = generateCalendarData(targetDate);

      resolve({
        code: 200,
        message: 'success',
        data: calendarData,
      });
    }, 300); // 模拟网络延迟
  });
};

// 默认导出黄历所有模拟数据
export default {
  getCalendarInfo,
  generateCalendarData,
};
