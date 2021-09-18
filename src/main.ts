import casLogin from "./casLogin";
import { UserInfo } from "./store/modules/user";
import Vue from "vue";
// import StoreApp from "./store/modules/app";
// document.title = StoreApp.title || StoreApp.name || '';
// TODO 整体页面加载中的动画

export interface QKProps {
  container: HTMLElement;
  appBaseurl: string;
  appName: string;
  userInfo: UserInfo;
  accessToken: string;
}

async function initial(props?: QKProps) {
  // 如果走cas认证
  try {
    await casLogin();
  } catch (error) {
    const page = await import("@/views/base/401");
    const container = props?.container;
    new Vue({
      render: h => h(page.default)
    }).$mount(container ? container.querySelector("#app") : "#app");
    return;
  }
  const { render } = await import("./initial");
  await render(props);
}
// 独立运行时
initial();
