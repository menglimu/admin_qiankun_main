/**
 * @Author: wenlin
 * @Description: 图标组件。在组件内再引入对应的svg。保留之前的字段。加了个name
 * vue-svg-icon 这个组件有问题，一些复杂的svg没有处理到，显示不了
 */
import Vue from "vue";
import { VNode } from "vue/types/umd";
import "./index.scss";

export default Vue.extend({
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String
    },
    name: {
      type: String
    },
    className: {
      type: String,
      default: ""
    }
  },
  computed: {
    iconName(): string {
      return this.name || this.iconClass;
    }
  },
  // render 中 第一层不返回 标签时，this取的有问题了
  created() {
    this.$watch("iconName", this.requireIcon, { immediate: true });
  },
  methods: {
    requireIcon() {
      if (this.iconName && !this.iconName?.includes("el-icon")) {
        import(`../svg/${this.iconName}.svg`);
      }
    }
  },
  render(): VNode {
    return this.iconName?.includes("el-icon") ? (
      <i class={[this.iconName, this.className]} on={this.$listeners} />
    ) : (
      <svg class={["svg-icon", this.className]} on={this.$listeners} aria-hidden="true">
        <use attrs={{ "xlink:href": `#icon-${this.iconName}` }} />
      </svg>
    );
  }
});
