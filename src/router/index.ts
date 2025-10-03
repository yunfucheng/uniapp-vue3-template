import pagesJson from '@/pages.json';

// 路径常量（迁移旧项目后更新为旧页面路径）
export const HOME_PATH = '/pages/index/index';
export const LOGIN_PATH = '/pages/index/index';
export const ERROR404_PATH = '/pages/index/index';

/**
 * 解析路由地址
 * @param {object} pagesJson
 * @returns [{"path": "/pages/tab/home/index","needLogin": false},...]
 */
function parseRoutes(pagesJson = {} as any) {
  if (!pagesJson.pages) {
    pagesJson.pages = [];
  }
  if (!pagesJson.subPackages) {
    pagesJson.subPackages = [];
  }

  function parsePages(pages = [] as any, rootPath = '') {
    const routes = [];
    for (let i = 0; i < pages.length; i++) {
      routes.push({
        path: rootPath ? `/${rootPath}/${pages[i].path}` : `/${pages[i].path}`,
        needLogin: pages[i].needLogin === true,
      });
    }
    return routes;
  }

  function parseSubPackages(subPackages = [] as any) {
    const routes = [];
    for (let i = 0; i < subPackages.length; i++) {
      routes.push(...parsePages(subPackages[i].pages, subPackages[i].root));
    }
    return routes;
  }

  return [
    ...parsePages(pagesJson.pages),
    ...parseSubPackages(pagesJson.subPackages),
  ];
}
export const routes = parseRoutes(pagesJson);

/**
 * 当前路由
 * @returns {string} 当前路由
 */
export function currentRoute() {
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  return currentPage?.$page?.fullPath || currentPage.route;
}

/**
 * 去除查询字符串
 * @param {string} path
 * @returns {string} 去除查询字符串后的路径
 */
export function removeQueryString(path = '') {
  return path.split('?')[0];
}

/**
 * 路径是否存在
 * @param {string} path
 * @returns {boolean} 路径是否存在
 */
export function isPathExists(path = '') {
  const cleanPath = removeQueryString(path);
  return routes.some(item => item.path === cleanPath);
}

/**
 * 是否是tabbar页面路径
 * @param {string} path
 * @returns {boolean} 是否是tabbar页面
 */
export function isTabBarPath(path = '') {
  const cleanPath = removeQueryString(path);
  return (
    (pagesJson as any).tabBar?.list?.some(
      (item: any) => `/${item.pagePath}` === cleanPath,
    ) === true
  );
}
