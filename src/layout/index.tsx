/**
 * 后台布局
 */
import Vue from "vue";
import styles from "./index.module.scss";
import StoreApp from "@/store/modules/app";
import Header from "./components/Header";
import AppMain from "./components/AppMain";
import Sidebar from "./components/Sidebar";
import Breadcrumb from "./components/Breadcrumb";
import TagsView from "./components/TagsView";
import Loading from "./components/Loading";
import { apps } from "@/qiankun";

export default Vue.extend({
  name: "Layout",
  data() {
    return {
      loading: false
    };
  },
  created() {
    this.$watch("$route", this.onChageRoute, { immediate: true });
    window.appEventBus.$on("loadEnd", this.loadEnd);
    window.appEventBus.$on("loadError", this.loadError);
  },
  beforeDestroy() {
    window.appEventBus.$off("loadEnd", this.loadEnd);
    window.appEventBus.$off("loadError", this.loadError);
  },
  methods: {
    onChageRoute() {
      const app = apps.find(item => this.$route.path.startsWith("/" + item.name));
      if (app) {
        if (app.loaded === "0") {
          app.loaded = "1";
          this.loading = true;
        }
      }
    },
    loadEnd(name) {
      const app = apps.find(item => name === item.name);
      if (this.$route.path.startsWith("/" + name)) {
        this.loading = false;
      }
      if (app) {
        app.loaded = "2";
      }
    },
    loadError(name) {
      const app = apps.find(item => name === item.name);
      if (this.$route.path.startsWith("/" + name)) {
        this.loading = false;
      }
      if (app) {
        app.loaded = "3";
      }
    }
  },
  render() {
    return (
      <div class={styles.app}>
        <Header />
        <div class={styles.container}>
          <Sidebar />
          <div class={styles.mainBox}>
            {this.loading && <Loading />}
            {StoreApp.isCacheTag && <TagsView />}
            {StoreApp.isBreadcrumb && <Breadcrumb />}
            <AppMain />
          </div>
        </div>
      </div>
    );
  }
});
