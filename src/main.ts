import casLogin from "./casLogin";
import Vue from "vue";
// import StoreApp from "./store/modules/app";
// document.title = StoreApp.title || StoreApp.name || '';
// TODO 整体页面加载中的动画

async function initial() {
  // 如果走cas认证
  try {
    await casLogin();
  } catch (error) {
    console.error(error);
    const page = await import("@/views/base/401");
    new Vue({
      render: h => h(page.default)
    }).$mount("#app");
    return;
  }
  import("./initial");
}
// 独立运行时
initial();
