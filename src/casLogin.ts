import { checkToken } from "./api/modules/login";
import StoreUser from "./store/modules/user";
import { GetQueryString, urlDelete, urlQuery } from "./utils";

/* 单点登录未完成 */

// 是否使用 cas 认证
const isCasLogin = process.env.VUE_APP_CAS === "1";

export default async function casLogin() {
  if (window.location.href.includes("/login")) {
    return;
  }

  // 模拟登录
  if (!isCasLogin) {
    StoreUser.MockLogin();
    return;
  }

  try {
    // 不是qiankun的时候。在进行浏览器上参数的处理
    // 如果有初始链接中有code,则去取用户信息,如果没有则读取本地
    const code = urlQuery("code");
    const username = urlQuery("username");
    const password = urlQuery("password");
    const accessToken = urlQuery("accessToken");
    if (code) {
      const state = urlQuery("state");
      await StoreUser.CasLogin({ code, state });
      location.href = urlDelete("code");
      return;
    } else if (username && password) {
      await StoreUser.Login({ username, password });
      location.href = urlDelete("username", urlDelete("password"));
      return;
    } else if (accessToken && typeof accessToken === "string") {
      await StoreUser.TokenLogin(accessToken);
      location.href = urlDelete("accessToken");
      return;
    }

    let token = StoreUser.token;
    if (!token) {
      token = await StoreUser.RE_LOADUSER();
    }
    const { data } = await checkToken();
    if (data.code !== 200) {
      return Promise.reject(data);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
    // console.log(error)
    // const canLogin = false //默认去到登录页
    // if (process.env.NODE_ENV === 'development' || canLogin) {
    //   next('/login')
    //   return Promise.resolve()
    // }
  }
}
