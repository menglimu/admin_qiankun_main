/**
 * 页面中间的内容
 */
import StoreApp from "@/store/modules/app";
import Vue from "vue";
import { getMenuById } from "../common";
import styles from "../index.module.scss";
import { start } from "qiankun";

export default Vue.extend({
  name: "AppMain",
  computed: {
    cachedIds: () => StoreApp.cachedIds
  },
  created() {
    this.$watch("$route", this.destroyNoCache, { immediate: true });
  },
  mounted() {
    // 启动qiankun
    if (!window.qiankunStarted) {
      window.qiankunStarted = true;
      start();
    }
  },
  methods: {
    destroyNoCache() {
      this.addCache();
      this.$children.forEach(item => {
        if (!this.cachedIds.includes(item.$attrs.pageId)) {
          item.$destroy();
        }
      });
    },
    addCache() {
      // 处理缓存相关
      if (StoreApp.isCacheTag) {
        StoreApp.addCachedTags(getMenuById(this.$route.name));
      } else if (this.$route.meta.cache) {
        StoreApp.AddCachedId(this.$route.name);
      }
    }
  },
  render() {
    return (
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view class={[styles.main, "container-page"]} key={this.$route.name} pageId={this.$route.name} />
        </keep-alive>
      </transition>
    );
  }
});
//  include={StoreApp.cachedNames}
// .app-box {
//   // height: calc(100% - 60px);
//   height: 100%;
//   padding: 30px;
//   overflow: auto;
// }
// .app-main {
//   min-height: 100%;
//   // margin: 30px;
//   background: #fff;
//   box-shadow: 0px 6px 18px 0px rgba(0, 60, 166, 0.05);
//   border-radius: 10px;
//   overflow: auto;
// }
