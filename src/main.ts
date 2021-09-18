import casLogin from "./casLogin";
import { UserInfo } from "./store/modules/user";
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
  // 在这里用await 防止公共样式没加载。页面就展示
  // 微服务启动的时候，公共样式从主应用引入
  await import("@/styles/common/index.scss");
  // 如果走cas认证
  try {
    await casLogin();
  } catch (error) {
    return;
  }
  const { render } = await import("./initial");
  await render(props);
}
// 独立运行时
initial();
