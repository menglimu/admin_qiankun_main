import { createRandomId } from "@/utils";
import { FunItem } from "./permission";

export const staticRoutes: FunItem[] = [
  {
    id: createRandomId(),
    text: "考核管理",
    url: "",
    children: [
      {
        id: createRandomId(),
        text: "首页",
        url: "/basechat/home",
      },
      {
        id: createRandomId(),
        text: "cache缓存",
        url: "/cache",
        icon: "avatar",
      },
      {
        id: createRandomId(),
        text: "root下的菜单",
        url: "/root",
      },
      {
        id: createRandomId(),
        text: "外链",
        url: "https://www.baidu.com",
        orderNo: 3,
      },
      {
        id: createRandomId(),
        text: "相对地址外链",
        url: "/http//12325",
        orderNo: 1,
      },
      {
        id: createRandomId(),
        text: "iframe",
        url: "/iframe/https://www.baidu.com",
        orderNo: 2,
      },
      {
        id: createRandomId(),
        text: "隐藏菜单",
        url: "/hide",
        nodeType: 3,
      },
      {
        id: createRandomId(),
        text: "下面有按钮权限",
        url: "/normal",
        orderNo: 0,
        children: [
          {
            id: createRandomId(),
            text: "按钮",
            url: "add",
            nodeType: 3,
          },
        ],
      },
      {
        id: createRandomId(),
        text: "嵌套菜单",
        url: "",
        children: [
          {
            id: createRandomId(),
            text: "菜单1",
            url: "/add1",
          },
          {
            id: createRandomId(),
            text: "菜单2",
            url: "/add2",
          },
        ],
      },
    ],
  },
];
