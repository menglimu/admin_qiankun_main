import { updatePwdByCode } from "@/api/modules/login";
import { REGS } from "@/utils/validate";
import { MlForm, MlFormConfig } from "ml-component/types/form";
import Vue from "vue";
import Vcode from "./vcode";

export default Vue.extend({
  name: "ForgetPassword",
  props: { phone: String },
  data() {
    return {
      editConfig: null as MlFormConfig,
      editValue: {
        userAccount: "",
        verifyCode: "",
        newPassword: "",
      },
      isShow: false,
    };
  },
  created() {
    this.editConfig = {
      inline: false,
      labelWidth: "80px",
      columns: [
        { label: "账号", prop: "userAccount", required: true, placeholder: "请输入手机号", reg: REGS.phone },
        {
          label: "验证码",
          prop: "verifyCode",
          required: true,
          render: () => <Vcode disabled={!this.editValue?.userAccount} phone={this.editValue?.userAccount} />,
        },
        {
          label: "新密码",
          required: true,
          prop: "newPassword",
          placeholder: "请输入6-8位数字或字母",
          attrs: { maxlength: 8 },
          props: { "show-word-limit": true },
          nodeData: {
            on: {
              input: value => {
                this.editValue.newPassword = value.replace(/[^a-zA-Z1-9]/g, "");
              },
            },
          },
        },
      ],
    };
  },
  methods: {
    show(account) {
      if (!this.editValue.userAccount) {
        this.editValue.userAccount = this.phone;
      }
      // account && (this.editValue = { account })
      this.isShow = true;
    },
    onCancel() {
      this.isShow = false;
    },
    async onSure() {
      const form = this.$refs.form as MlForm;
      await form.validate();
      await updatePwdByCode(this.editValue);
      this.$message.success("修改成功");
      this.onCancel();
    },
  },
  render() {
    return (
      <el-dialog
        class="forget"
        title="忘记密码"
        visible={this.isShow}
        onClose={this.onCancel}
        width="400px"
        top="-150px"
      >
        <ml-form ref="form" config={this.editConfig} v-model={this.editValue}></ml-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" onClick={this.onSure}>
            保 存
          </el-button>
          <el-button onClick={this.onCancel} type="danger" plain>
            关 闭
          </el-button>
        </span>
      </el-dialog>
    );
  },
});
