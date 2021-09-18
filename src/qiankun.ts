import { registerMicroApps, start } from "qiankun";
import router from "@/router";
// import { initGlobalState, MicroAppStateActions } from 'qiankun'

const apps = [
  {
    name: "assessmentmanagement",
    entry: process.env.NODE_ENV === "development" ? "http://localhost:8082/assessmentmanagement/" : null
  },
  {
    name: "systemsetting",
    entry: process.env.NODE_ENV === "development" ? "http://localhost:8081/systemsetting/" : null
  }
];

router.addRoutes(
  apps.map(item => ({
    name: item.name,
    path: `/${item.name}/*`,
    component: () => import(/* webpackChunkName: "layout" */ "@/layout/index.vue"),
    chunkName: "layout"
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
      userInfo: getUser(),
      accessToken: getToken()
    }
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
