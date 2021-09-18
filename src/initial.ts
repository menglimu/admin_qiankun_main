/*
 * @Author: wenlin
 * @Date: 2020-04-24 15:29:36
 * @LastEditors: wenlin
 * @LastEditTime: 2020-12-25 09:52:44
 * @Description:
 */
// import 'babel-polyfill'
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";

import "@/icons"; // icon svg图标

import "@/styles/common/index.scss";
import "@/styles/index.scss"; // global css

window.eventBus = window.eventBus || new Vue(); // eventBus
window.appEventBus = window.appEventBus || new Vue(); // appEventBus
declare module "element-ui" {
  export const Scrollbar: any;
}
import {
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabPane,
  Scrollbar
} from "element-ui";
Vue.use(Dialog)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(Input)
  .use(Button)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Tabs)
  .use(TabPane)
  .use(Input)
  .use(Scrollbar);

Vue.config.productionTip = false;
// 初始化vue
export async function render() {
  return new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
}
render();
