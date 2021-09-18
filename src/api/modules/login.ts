// import MD5 from 'crypto-js/md5'
import axios from "axios";
import request from "@/api/request";
import StoreUser from "@/store/modules/user";

/** 通过code登录 */
export function loginByCode(code: string, state: string) {
  return axios.get(`/oauth-api/v1/authorizeCode`, {
    params: { code, state }
  });
}
/** 通过用户名，密码登录 */
export function login(username: string, password: string, projectId?: string) {
  return axios.post("/oauth-api/v1/login", {
    userAccount: username,
    password: password
  });
}

/** 登录获取code */
export function getCode(phone: string) {
  return request.get(`account/getVerifyCode`, { userAccount: phone });
}

/** 通过token获取用户详情 */
export function getUserDetailByToken(token: string) {
  return request.get(`/v1/security/getCurrentUserInfo?access_token=${token}`);
}
/** 获取用户详情 */
export function getUserDetail() {
  return request.get(`/oauth-api/v1/userInfo`);
}
/** 通过code修改密码 */
export function updatePwdByCode(phone) {
  return request.get(`account/getVerifyCode`, { userAccount: phone });
}

/** 校验token是否失效 */
export function checkToken() {
  return axios.get(`/oauth/v1/checkToken`, { headers: { accessToken: StoreUser.token } });
}

/** 登出 */
export function logout() {
  return request.post(`/oauth-api/v1/logout`);
}
