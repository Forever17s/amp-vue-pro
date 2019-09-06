<template>
  <py-row :gutter="20">
    <py-col :span="8" :offset="8">
      <py-card>
        <py-form
          :model="payForm"
          ref="payForm"
          :rules="payFormRules"
          label-width="120px"
          class="form"
        >
          <py-form-item label="用户账号" prop="account">
            <py-input
              v-model="payForm.account"
              v-permission="permission_update"
            ></py-input>
            <py-input
              v-model="payForm.account"
              v-permission="'!' + permission_update"
              :disabled="true"
            ></py-input>
          </py-form-item>
          <py-form-item label="支付密码" prop="payPassword">
            <py-input v-model="payForm.payPassword"></py-input>
          </py-form-item>
          <py-form-item label="确认支付密码" prop="confirmPayPassword">
            <py-input v-model="payForm.confirmPayPassword"></py-input>
          </py-form-item>
          <py-form-item>
            <py-button
              type="primary"
              @click.native="modifyUserPayPassword"
              :loading="submitLoading"
              >确定</py-button
            >
          </py-form-item>
        </py-form>
      </py-card>
    </py-col>
  </py-row>
</template>

<script>
import { modifyUserPayPassword } from "api";
export default {
  data() {
    return {
      submitLoading: false,
      payForm: {
        account: "",
        payPassword: "",
        confirmPayPassword: ""
      },
      payFormRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }]
      },
      permission_update: "user:updateAll"
    };
  },
  methods: {
    modifyUserPayPassword() {
      this.$refs.payForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          let para = Object.assign({}, this.payForm);
          modifyUserPayPassword(para)
            .then(res => {
              this.submitLoading = false;
              this.$message({
                message: res.msg,
                type: "success"
              });
            })
            .catch(err => {
              this.submitLoading = false;
            });
        }
      });
    }
  },
  mounted() {
    // 初始化用户账号信息
    this.payForm.account = JSON.parse(
      sessionStorage.getItem("userInfo")
    ).account;
  }
};
</script>
