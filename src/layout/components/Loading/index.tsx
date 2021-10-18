/**
 * @Author: wenlin
 * @Description: 子应用加载中的动画
 */
import Vue from "vue";
import styles from "./index.module.scss";

export default Vue.extend({
  name: "PageLoading",
  data() {
    return {};
  },
  methods: {},
  render() {
    return (
      <div class={styles.loaderWrapper}>
        <div class={styles.loader}></div>
        <div class={styles.loadTitle}>系统初始化中，请稍后...</div>
      </div>
    );
  }
});
