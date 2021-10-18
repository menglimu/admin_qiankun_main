import Vue from "vue";
import { getCode } from "@/api/modules/login";
import { REGS } from "@/utils/validate";
export default Vue.extend({
  name: "Vcode",
  props: { value: String, disabled: Boolean, phone: String },
  data() {
    return {
      getting: false,
      time: 60,
      timer: null
    };
  },
  methods: {
    async onGetCode() {
      if (!REGS.phone.test(this.phone)) {
        this.$message.error("请填写正确的手机号");
        return;
      }
      await getCode(this.phone);
      this.$message.success("发送验证码成功");
      this.getting = true;
      this.timer = setInterval(() => {
        if (this.time === 0) {
          clearInterval(this.timer);
          this.getting = false;
          this.time = 60;
          return;
        }
        this.time--;
      }, 1000);
    },
    onInput(value) {
      this.$emit("input", value.replace(/[^1-9]/g, ""));
    }
  },
  render() {
    return (
      <div class="vcode-box">
        <el-input
          class="vcode-box-input"
          maxlength={4}
          show-word-limit={true}
          attrs={this.$attrs}
          value={this.value}
          onInput={this.onInput}
        ></el-input>
        <el-button
          class="vcode-box-btn"
          plain
          type="primary"
          disabled={this.disabled || this.getting}
          onClick={this.onGetCode}
        >
          {this.getting ? `获取验证码(${this.time})` : "获取验证码"}
        </el-button>
      </div>
    );
  }
});
