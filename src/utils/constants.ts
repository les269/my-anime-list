import { MyRouterType } from "./typings";

export const drawerWidth = 240;
export const MyRouteObject: { [name: string]: MyRouterType } = {
  home: { path: "/", title: "我的動畫清單" },
  edit: { path: "/edit", title: "動畫資料編輯" },
};
export const MyRouteList: MyRouterType[] = Object.keys(MyRouteObject).map(
  (x) => MyRouteObject[x]
);
