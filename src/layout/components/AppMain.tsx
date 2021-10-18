/**
 * 页面中间的内容
 */
import Vue from "vue";
import styles from "../index.module.scss";
import { start } from "qiankun";

export default Vue.extend({
  name: "AppMain",
  mounted() {
    // 启动qiankun
    if (!window.qiankunStarted) {
      window.qiankunStarted = true;
      start();
    }
  },
  render() {
    return <div class={[styles.main]} id="container-page" />;
  }
});
