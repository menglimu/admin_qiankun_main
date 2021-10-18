import Vue from "vue";
import styles from "./index.module.scss";
import Forget from "./components/forget";
import StoreUser from "@/store/modules/user";
import { Message } from "element-ui";
export default Vue.extend({
  name: "Login",
  data() {
    return {
      formValue: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    onForget() {
      (this.$refs.forget as any).show(this.formValue?.username);
    },
    async onLogin() {
      if (!this.formValue.username) {
        Message.warning("请输入用户名");
        return;
      }
      if (!this.formValue.password) {
        Message.warning("请输入密码");
        return;
      }
      try {
        await StoreUser.Login(this.formValue);
        // this.$router.push("/");
        window.open("/", "_self");
      } catch (error) {
        console.error(error);
      }
    }
  },
  render() {
    return (
      <div class={styles.login}>
        <div class={styles.box}>
          <div class={styles.name}></div>
          <div class={styles.formBox}>
            <div class={styles.title}>系统登录</div>
            <el-input class={styles.input} placeholder="请输入用户名" v-model={this.formValue.username}>
              <svg-icon icon-class="loginUser" class={styles.icon} slot="prefix" />
            </el-input>
            <div class={styles.errInfo}></div>
            <el-input class={styles.input} placeholder="请输入密码" type="password" v-model={this.formValue.password}>
              <svg-icon icon-class="loginPassword" class={styles.icon} slot="prefix" />
            </el-input>
            <div class={styles.errInfo}></div>
            <el-button class={styles.loginBtn} type="primary" size="large" onClick={this.onLogin}>
              登录
            </el-button>
            {false && (
              <div class="login-box-forget">
                <el-button class="login-box-forget-btn" type="text" onClick={this.onForget}>
                  忘记密码？
                </el-button>
              </div>
            )}
          </div>
        </div>
        <Forget ref="forget" phone={this.formValue?.username} />
      </div>
    );
  }
});
