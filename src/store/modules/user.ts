import { loginByCode, getUserDetail, login, logout, getUserDetailByToken } from "@/api/modules/login"; // 几个自定义的登录

import { staticRoutes } from "@/router/static";
import { addRoutes, FunItem } from "@/router/permission";
import { Storage } from "@/utils/storage/local";

import { Module, VuexModule, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "../root";

const storage = new Storage();
export interface UserInfo {
  functionList?: AnyObj[];
  functionTreeList?: FunItem[];
  systemType?: string;

  group?: {
    groupId?: string;
    groupName?: string;
  };
  project?: {
    projectId?: string;
    projectName?: string;
  };

  userName?: string;
  userNo?: string;
  userId?: string;
  userLevel?: string;
  areaCode?: string;
  avatar?: string;
  roles?: string[];
}

function transformFuncs(funcs, pids = []) {
  const funcsTree: FunItem[] = [];
  for (const item of funcs) {
    const info: FunItem = {
      expanded: true,
      helpUrl: "",
      leaf: false,
      remark: item.remark,
      nodeType: { 101: 0, 102: 1, 103: 2, 104: 3 }[item.funType],
      text: item.funName,
      url: item.location,
      id: String(item.id),
      children: item.children ? transformFuncs(item.children, [...pids, item.id]) : item.children
    };
    funcsTree.push(info);
  }
  return funcsTree;
}

function transformUserInfo(userInfoBase): UserInfo {
  userInfoBase.userNo = userInfoBase.userAccount;
  if (!userInfoBase.functionTreeList && userInfoBase.funcs) {
    userInfoBase.functionTreeList = transformFuncs(userInfoBase.funcs);
  }
  const userInfo = {
    functionList: [],
    functionTreeList: [],
    systemType: null,

    group: {
      groupId: null,
      groupName: null
    },
    project: {
      projectId: null,
      projectName: null
    },

    userName: null,
    userNo: null,
    userId: null,
    userLevel: null,
    areaCode: null,
    avatar: null
  };
  Object.assign(userInfo, userInfoBase);
  return userInfo;
}
@Module({ dynamic: true, store, name: "user" })
class User extends VuexModule {
  private token_ = "";
  private userInfo_: UserInfo = {};
  private pointInfo_ = {};

  public get token(): string {
    return this.token_;
  }
  public get userInfo(): UserInfo {
    return this.userInfo_;
  }
  public get pointInfo() {
    return this.pointInfo_;
  }

  public get roles() {
    return this.userInfo?.roles;
  }
  public get avatar(): string {
    return this.userInfo?.avatar;
  }
  public get groupId(): string {
    return this.userInfo?.group?.groupId;
  }
  public get groupName(): string {
    return this.userInfo?.group?.groupName;
  }
  public get userName(): string {
    return this.userInfo?.userName;
  }
  public get userNo(): string {
    return this.userInfo?.userNo;
  }
  public get userId(): string {
    return this.userInfo?.userId;
  }
  public get userLevel(): string {
    return this.userInfo?.userLevel;
  }
  public get projectId(): string {
    return this.userInfo?.project?.projectId;
  }
  public get projectName(): string {
    return this.userInfo?.project?.projectName;
  }
  public get isAdminAcount(): boolean {
    return this.userInfo?.userNo === "admin";
  }

  @Mutation
  public SET_USERINFO(userInfo: UserInfo) {
    this.userInfo_ = userInfo;
    if (userInfo) {
      storage.set("userInfo", userInfo);
      if (userInfo.functionTreeList && userInfo.functionTreeList.length > 0) {
        // 这里直接用对象浅拷贝的特性赋值了。懒得写commit
        addRoutes(userInfo.functionTreeList);
      }
    } else {
      storage.remove("userInfo");
    }
  }
  @Mutation
  public SET_TOKEN(token) {
    this.token_ = token;
    if (token) {
      storage.set("accessToken", token);
    } else {
      storage.remove("accessToken");
    }
  }
  @Mutation
  public SET_POINT_INFO(pointInfo) {
    this.pointInfo_ = pointInfo;
  }

  // 重新加载登录信息到store
  @Action
  public RE_LOADUSER() {
    const token = storage.get("accessToken");
    const userInfo = storage.get<UserInfo>("userInfo");
    if (!token || !userInfo) {
      return Promise.reject(Error(""));
    }
    this.SET_TOKEN(token);
    this.SET_USERINFO(userInfo);
    return Promise.resolve(token);
  }
  // 模拟登录
  @Action
  public async MockLogin() {
    await this.GetUserDetail({
      userName: "虚拟登录",
      functionTreeList: staticRoutes
    });
    return Promise.resolve();
  }
  // 登录和获取用户信息分开接口，如接口合并，需重新处理逻辑
  // 登录通过code和state
  @Action
  public async CasLogin({ code, state }) {
    try {
      const { data } = await loginByCode(code, state);
      if (data.code !== 200) {
        return Promise.reject(data.message);
      }
      this.SET_TOKEN(data.data.accessToken);
      await this.GetUserDetail();
      return Promise.resolve("login:success");
    } catch (error) {
      this.SET_TOKEN(null);
      return Promise.reject(error);
    }
  }
  // 通过用户名和密码登录
  @Action
  public async Login({ username, password }) {
    try {
      const { data } = await login(username, password);
      if (data.code !== 200) {
        return Promise.reject(data.message);
      }
      this.SET_TOKEN(data.data.accessToken);
      await this.GetUserDetail();
      return Promise.resolve("login:success");
    } catch (error) {
      this.SET_TOKEN(null);
      return Promise.reject(error);
    }
  }
  // 通过token登录
  @Action
  public async TokenLogin(token: string) {
    this.SET_TOKEN(token);
    await this.GetUserDetail();
    return Promise.resolve("login:success");
  }
  // 通过userInfo和token登录
  @Action
  public async TokenUserLogin({ token, userInfo }) {
    this.SET_TOKEN(token);
    await this.GetUserDetail(userInfo);
    return Promise.resolve("login:success");
  }

  // 获取用户详情
  @Action
  public async GetUserDetail(userInfoStatic?: UserInfo) {
    try {
      const userInfo: UserInfo = transformUserInfo(userInfoStatic || (await getUserDetail()));
      // 使用本地static中的菜单
      const useLocalMenu = process.env.VUE_APP_LOCAL_MENU === "1";
      if (useLocalMenu) {
        userInfo.functionTreeList = staticRoutes;
      }
      this.SET_USERINFO(userInfo);
      return Promise.resolve(userInfo);
    } catch (error) {
      this.SET_TOKEN(null);
      this.SET_USERINFO(null);
      return Promise.reject(error);
    }
  }
  // 退出登录
  @Action
  public async FedLogOut() {
    try {
      const data = await logout();
      this.SET_TOKEN(null);
      this.SET_USERINFO(null);
      window.appEventBus.$emit("logout");
      try {
        // location.href = data.url
        const { loginUrl, logoutType } = data;
        if (logoutType === "1") {
          window.opener = null;
          window.open("", "_self", "");
          window.close(); // 以上三行可关闭单个页面
          window.open("", "_top");
          window.top.close();
          window.location.href = "about:blank ";
          window.close(); // 上面两次关闭适用于FireFox等浏览器
        } else {
          location.href = loginUrl;
        }
      } catch (error) {
        console.log(error);
      }
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

const StoreUser = getModule(User);
export default StoreUser;
