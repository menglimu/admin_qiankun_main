/**
 * @Author: wenlin
 * @Description: 顶部菜单
 */
import { getActiveMenu, goLink } from "@/layout/common";
import { MenuItem } from "@/router/permission";
import StoreApp from "@/store/modules/app";
import Vue from "vue";
import styles from "../../index.module.scss";

export default Vue.extend({
  name: "TopMenu",
  created() {
    //  有顶部菜单的时候。查询左侧的菜单。没有的时候。左侧直接使用store的menu
    if (StoreApp.isTopMenu) {
      this.$watch("$route", this.findSidebarMenu, { immediate: true });
    }
  },
  data() {
    return { activeMenu: null as MenuItem };
  },
  methods: {
    // 查询左侧的菜单
    findSidebarMenu() {
      const activeMenu = getActiveMenu();
      if (!activeMenu) return;
      this.activeMenu = activeMenu;
      const menu = StoreApp.menus.find(_ => _.id === this.activeMenu?.pids[0]);
      StoreApp.SetSidebarMenus(menu?.children || []);
    },
    handleRouteJump({ name }) {
      const menu = StoreApp.menus.find(_ => _.id === name);
      if (menu.urlType === "http") {
        // 外链的时候。将激活的还原为当前的路由
        (this.$refs.tabs as any).setCurrentName(this.activeMenu?.pids?.[0] || this.activeMenu?.id);
      }
      goLink(menu);
    }
  },
  //
  render() {
    return (
      <el-tabs
        ref="tabs"
        value={this.activeMenu?.pids?.[0] || this.activeMenu?.id}
        class={[styles.topMenu, "topMenu"]}
        on={{ "tab-click": this.handleRouteJump }}
      >
        {StoreApp.menus?.map(item => (
          <el-tab-pane key={item.id} label={item.text} name={item.id}></el-tab-pane>
        ))}
      </el-tabs>
    );
  }
});
