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
import("@ml/ml-components/dist/style.css");
import "@/icons"; // icon svg图标
// import "@/directives"; // 指令

import "@/styles/index.scss"; // global css
import { QKProps } from "./main";

Vue.config.productionTip = false;
// 初始化vue
export async function render(props: QKProps) {
  const container = props?.container;
  return new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector("#app") : "#app");
}

window.eventBus = window.eventBus || new Vue(); // eventBus
window.appEventBus = window.appEventBus || new Vue(); // appEventBus

// 给Date原型增加方法
// eslint-disable-next-line no-extend-native
Date.prototype.Format = function(fmt = "yyyy-MM-dd hh:mm:ss") {
  let fmt_ = fmt;
  const o = {
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "h+": this.getHours(), // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt_)) fmt_ = fmt_.replace(RegExp.$1, String(this.getFullYear()).substr(4 - RegExp.$1.length));
  for (const k in o)
    if (new RegExp("(" + k + ")").test(fmt_))
      fmt_ = fmt_.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(String(o[k]).length));
  return fmt_;
};
