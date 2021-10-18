/** 路由处理
 * 不需要左侧菜单的页面: 一级菜单下不配置的时候。左侧菜单不显示
 */
import router from "@/router";
import StoreApp from "@/store/modules/app";
import { isNull } from "@/utils";
import { RouteConfigSingleView } from "vue-router/types/router";

// TODO: 不需要登录的页面。后台系统目前没需求。
/** 后端返回的菜单或本地静态菜单 */
export interface FunItem {
  id: string;
  text: string;
  url: string;
  expanded?: boolean;
  helpUrl?: string;
  icon?: string;
  leaf?: boolean;
  remark?: string;
  // 0"顶级菜单", 1"节点", 2"叶子", 3"按钮"
  nodeType?: number;
  // 排序号
  orderNo?: number;
  // 是否日志
  logFlag?: boolean;
  children?: FunItem[];

  /** 是否隐藏的菜单，目前后台没有字段配。通过nodeType */
  hidden?: boolean;
  /** 是否缓存菜单。目前后台没有字段。通过store中app中列表进行匹配 */
  cache?: boolean;
  /** 不需要layout的菜单。目前后台没有字段。通过store中app中列表进行匹配 */
  root?: boolean;
}
export interface MenuItem extends FunItem {
  /** 父级的id层级 */
  pids?: string[];
  /** http为外部链接。点击直接跳转走。iframe为嵌入在系统中的外部链接 */
  urlType?: "http" | "iframe";
  /** 主应用时，不能使用route进行一些路由的处理，在菜单中增加重定向 */
  redirect?: string;
  /** 子菜单 */
  children?: MenuItem[];
}

export interface RouteCustom extends RouteConfigSingleView {
  meta: {
    pids?: string[];
    text?: string;
    url?: string;
    btns?: string[];
    icon?: string;
    id?: string;
    cache?: boolean;
  };
}

// 是否是按钮权限菜单 ， 三中心没有是否隐藏的菜单类型。先以 / 开头区分。 非/表示按钮权限
function isBtn(fun: FunItem) {
  const reg = /^[http|/]/;
  return fun.nodeType === 3 && !reg.test(fun.url);
}

/** 是否缓存菜单。目前后台没有字段。应该要通过列表进行匹配 */
function isCache(fun: FunItem) {
  for (const rule of StoreApp.cacheViews) {
    if (typeof rule === "string" && rule === fun.url) {
      return true;
    }
    if (rule instanceof RegExp && rule.test(fun.url)) {
      return true;
    }
    if (typeof rule === "function" && rule(fun)) {
      return true;
    }
  }
  return false;
}
/** 不需要layout的菜单。目前后台没有字段。应该要通过列表进行匹配 */
function isRoot(fun: FunItem) {
  for (const rule of StoreApp.rootViews) {
    if (typeof rule === "string" && rule === fun.url) {
      return true;
    }
    if (rule instanceof RegExp && rule.test(fun.url)) {
      return true;
    }
    if (typeof rule === "function" && rule(fun)) {
      return true;
    }
  }
  return false;
}

// type: http为外部链接。点击直接跳转走。iframe为嵌入在系统中的外部链接
export function parseUrl(fun: FunItem): { url: string; urlType?: "http" | "iframe" } {
  const url = fun.url;
  if (/^https?:\/\//.test(url)) {
    return {
      url: "/http/" + window.btoa(url),
      urlType: "http"
    };
  }
  // 外部链接可能不以http开头, 暂定以/http/的相对路径为外链
  if (/^\/http\//.test(url)) {
    return {
      url: "/http/" + window.btoa(url.slice(6)),
      urlType: "http"
    };
  }
  if (/^\/iframe\//.test(url)) {
    return {
      url: "/iframe/" + window.btoa(url.slice(8)),
      urlType: "iframe"
    };
  }
  return { url: url ? "/" + fun.remark + url : url };
}

// 找到第一个路由。首页重定向到这个地址
function findFirstRoute(menus: MenuItem[]) {
  if (!menus) return;
  for (const item of menus) {
    // 排除按钮，隐藏菜单，外链等一些特殊的菜单
    if (item.url && !item.hidden && item.urlType !== "http") return item.url;
    if (item.children?.length) {
      const url = findFirstRoute(item.children);
      if (url) return url;
    }
  }
}

/** 将funs转换为route和menu */
const toMenuRoute = function(funs: FunItem[], pids: string[]) {
  const menus: MenuItem[] = [];
  funs.forEach(fun => {
    // 处理目前后端不支持配置的几个项
    if (isNull(fun.hidden)) {
      fun.hidden = fun.nodeType === 3;
    }
    if (isNull(fun.cache)) {
      fun.cache = isCache(fun);
    }
    if (isNull(fun.root)) {
      fun.root = isRoot(fun);
    }
    // fun2route,menu
    if (!isBtn(fun)) {
      const { url, urlType } = parseUrl(fun);

      // 菜单
      const menu: MenuItem = {
        ...fun,
        url,
        urlType,
        pids
      };
      if (fun.children?.length) {
        menu.children = toMenuRoute(fun.children, [...pids, fun.id]);
        // 重定向到第一个
        menu.redirect = findFirstRoute(menu.children);
      }
      menus.push(menu);
    }
  });
  return menus.sort((a, b) => a.orderNo - b.orderNo);
};
function createMenusRoutes(funs: FunItem[]) {
  const menus = toMenuRoute(funs, []);
  const first = findFirstRoute(menus);
  // 入口路由
  const main: RouteCustom[] = [
    {
      path: "/",
      redirect: first,
      meta: {}
    }
  ];

  router.addRoutes(main);
  StoreApp.SetMenus(menus);
}

// 添加异步route到vue
export function addRoutes(funs: FunItem[]) {
  if (!funs?.length) return;
  createMenusRoutes(funs);
}
