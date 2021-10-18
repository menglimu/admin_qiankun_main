/**
 * @Author: wenlin
 * @Description: 左侧菜单栏
 */
import { getActiveMenu, getMenuById, goLink } from "@/layout/common";
import { MenuItem } from "@/router/permission";
import StoreApp from "@/store/modules/app";
import Vue from "vue";
import { VNode } from "vue/types/umd";
import styles from "../../index.module.scss";
import Collapse from "../Collapse";
import "./index.scss";

export default Vue.extend({
  name: "Sidebar",
  computed: {
    menus: () => (StoreApp.isTopMenu ? StoreApp.sidebarMenus : StoreApp.menus),
    activeId(): string {
      return this.getActiveId(this.activeMenu);
    }
  },
  data() {
    return { activeMenu: null as MenuItem };
  },
  created() {
    this.$watch(
      "$route",
      () => {
        this.activeMenu = getActiveMenu();
      },
      { immediate: true }
    );
  },
  methods: {
    getActiveId(menu: MenuItem) {
      if (menu.hidden) {
        return this.getActiveId(getMenuById(menu.pids[menu.pids.length - 1]));
      } else {
        return menu.id;
      }
    },
    // 跳转链接
    goLink(menu: MenuItem) {
      if (menu.urlType === "http") {
        // 外链的时候。将激活的还原为当前的路由
        (this.$refs.menu as any).updateActiveIndex(this.activeMenu?.id);
      }
      goLink(menu);
    },
    // 渲染单个子菜单或者具体一个菜单
    renderItem(menu: MenuItem) {
      if (menu.hidden) {
        return;
      }
      if (menu?.children?.filter(item => !item.hidden).length > 0) {
        return (
          <el-submenu index={menu.id}>
            <template slot="title">
              {menu.icon && <svg-icon name={menu.icon} class="menu_icon" />}
              <span>{menu.text}</span>
            </template>
            {menu.children.map(_ => this.renderItem(_))}
          </el-submenu>
        );
      } else {
        return (
          <el-menu-item index={menu.id} onClick={() => this.goLink(menu)}>
            {menu.icon && <svg-icon name={menu.icon} class="menu_icon" />}
            <span>{menu.text}</span>
          </el-menu-item>
        );
      }
    }
  },
  render(): VNode {
    // 设置key，让菜单组件重新渲染。不重新渲染的话。激活的值有问题
    return this.menus?.length ? (
      <div class={[styles.sidebar, StoreApp.collapsed ? styles.collapsed : ""]}>
        <el-scrollbar class={styles.menuBox}>
          {
            <el-menu
              class={[styles.menu, "leftMenuMain"]}
              default-active={this.activeId}
              collapse={StoreApp.collapsed}
              unique-opened
              collapse-transition={false}
              mode="vertical"
              key={this.menus[0].id}
              ref="menu"
            >
              {this.menus.map(this.renderItem)}
            </el-menu>
          }
        </el-scrollbar>
        {StoreApp.isCollapse && <Collapse />}
      </div>
    ) : null;
  }
});
