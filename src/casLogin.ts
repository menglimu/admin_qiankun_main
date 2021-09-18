import { checkToken } from "./api/modules/login";
import StoreUser from "./store/modules/user";
import { GetQueryString } from "./utils";

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
    const code = GetQueryString("code");
    const username = GetQueryString("username");
    const password = GetQueryString("password");
    const accessToken = GetQueryString("access_token") || GetQueryString("accessToken");
    if (code) {
      const state = GetQueryString("state");
      await StoreUser.CasLogin({ code, state });
      location.href = location.origin + process.env.BASE_URL + "#/";
      return;
    } else if (username && password) {
      await StoreUser.Login({ username, password });
      location.href = location.origin + process.env.BASE_URL + "#/";
      return;
    } else if (accessToken) {
      await StoreUser.TokenLogin(accessToken);
      location.href = location.origin + process.env.BASE_URL + "#/";
      return;
    }

    let token = StoreUser.token;
    if (!token) {
      token = await StoreUser.RE_LOADUSER();
    }
    // TODO: 调用后台接口校验token是否已失效
    // }
  } catch (error) {
    console.error(error);
    // console.log(error)
    // const canLogin = false //默认去到登录页
    // if (process.env.NODE_ENV === 'development' || canLogin) {
    //   next('/login')
    //   return Promise.resolve()
    // }
  }
  const res = await checkToken();
  return res;
}
