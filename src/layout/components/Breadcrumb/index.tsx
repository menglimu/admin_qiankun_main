/**
 * 面包屑
 */
import { getActiveMenu, goLink } from "@/layout/common";
import { MenuItem } from "@/router/permission";
import StoreApp from "@/store/modules/app";
import Vue from "vue";
import styles from "../../index.module.scss";

export default Vue.extend({
  name: "Breadcrumb",
  data() {
    return {
      levelList: [] as MenuItem[]
    };
  },
  created() {
    this.$watch("$route", this.getBreadcrumb, { immediate: true });
  },
  methods: {
    getBreadcrumb() {
      let parent = StoreApp.menus;
      const menu = getActiveMenu();
      if (!menu) return;

      this.levelList = [];
      [...menu.pids, menu.id].forEach(id => {
        const menu = parent.find(item => item.id === id);
        this.levelList.push(menu);
        parent = menu.children || [];
      });
    },
    goLink(menu: MenuItem) {
      if (!menu.url || menu.url === this.$route.path) {
        return;
      }
      goLink(menu);
    },
    onBack() {
      this.$router.go(-1);
    }
    // 注释掉左侧没有菜单，自动隐藏面包屑的功能
    // hideBreadcrumb() {
    //   const menu = this.levelList[this.levelList.length - 1];
    //   if (StoreApp.isTopMenu && !StoreApp.sidebarMenus?.length) {
    //     return true;
    //   }
    //   if (!menu) return false;
    //   for (const rule of StoreApp.hiddenBreadcrumbViews) {
    //     if (typeof rule === "string" && rule === menu.url) {
    //       return true;
    //     }
    //     if (rule instanceof RegExp && rule.test(menu.url)) {
    //       return true;
    //     }
    //     if (typeof rule === "function" && rule(menu)) {
    //       return true;
    //     }
    //   }
    //   return false;
    // }
  },
  render() {
    return (
      // this.hideBreadcrumb() ? null :
      <div class={styles.breadcrumb}>
        <el-breadcrumb separator="/">
          {this.levelList.map((item, index) => (
            <el-breadcrumb-item
              key={item.id}
              class={{
                [styles.disabled]: !item.url,
                [styles.normal]: item.url,
                [styles.active]: index === this.levelList.length - 1
              }}
              nativeOnClick={() => this.goLink(item)}
            >
              {item.text}
            </el-breadcrumb-item>
          ))}
        </el-breadcrumb>
      </div>
    );
  }
});

/* <style lang="scss" scoped>
.app-breadcrumb {
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 30px;

  .el-button {
    font-size: 18px;
    color: #010101;
  }

  .el-breadcrumb {
    display: inline-flex;
    align-items: center;
    height: 100%;
    margin-left: 8px;
    font-size: 16px;

    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
}
</style> */
