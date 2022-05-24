import { registerMicroApps, start } from "qiankun";
import router from "@/router";
import StoreUser from "./store/modules/user";
import Layout from "@/layout";
// import { initGlobalState, MicroAppStateActions } from 'qiankun'

export const apps = [
  // {
  //   name: "evaluation",
  //   entry: process.env.NODE_ENV === "development" ? "http://localhost:8080/evaluation/" : null,
  //   loaded: "0" // 0: 未加载   1: 加载中   2: 已加载  3: 加载失败
  // },
  {
    name: "basechat",
    entry:
      process.env.NODE_ENV === "development"
        ? "http://localhost:8081/basechat/"
        : "http://vue-admin.shinianrj.top/basechat/",
    loaded: "0",
  },
  // {
  //   name: "standingbookmanagement",
  //   entry: process.env.NODE_ENV === "development" ? "http://localhost:8080/evaluation/" : null
  // },
  // {
  //   name: "systemsetting",
  //   entry: process.env.NODE_ENV === "development" ? "http://localhost:8080/evaluation/" : null
  // }
];

router.addRoutes(
  apps.map(item => ({
    name: item.name,
    path: `/${item.name}/*`,
    component: Layout,
    chunkName: "layout",
  }))
);

registerMicroApps(
  apps.map(item => ({
    name: item.name,
    entry: item.entry || `/${item.name}/`,
    container: "#container-page",
    activeRule: `${process.env.VUE_APP_BASEURL || "/"}${item.name}`,
    props: {
      appBaseurl: process.env.VUE_APP_BASEURL,
      appName: process.env.VUE_APP_NAME,
      userInfo: StoreUser.userInfo,
      accessToken: StoreUser.token,
    },
  }))
);

// 启动 qiankun
// start()

// const initialState = {}
// const actions: MicroAppStateActions = initGlobalState(initialState)
// actions.onGlobalStateChange((state, prev) => {
//   // state: 变更后的状态; prev 变更前的状态
//   console.log(state, prev)
// })
// actions.setGlobalState(initialState)
// actions.offGlobalStateChange()
// export { actions }
