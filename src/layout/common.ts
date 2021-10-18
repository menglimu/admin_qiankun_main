import router from "@/router";
import { MenuItem } from "@/router/permission";
import StoreApp from "@/store/modules/app";
export function goLink(menu: MenuItem) {
  if (menu.urlType === "http") {
    window.open(window.atob(menu.url.slice(6)));
  } else {
    router.push(menu.url || menu.redirect);
  }
}

function getList(data: MenuItem[], val: string, key = "id") {
  for (const item of data) {
    if (item[key] === val) {
      return item;
    }
    if (item.children?.length) {
      const result = getList(item.children, val, key);
      if (result) return result;
    }
  }
}
export function getMenuById(id: string): MenuItem {
  return getList(StoreApp.menus, id);
}

export function getMenuByUrl(url: string): MenuItem {
  return getList(StoreApp.menus, url, "url");
}
export function getActiveMenu(): MenuItem {
  return getList(StoreApp.menus, router.currentRoute.path, "url");
}
