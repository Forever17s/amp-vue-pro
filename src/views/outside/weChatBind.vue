<template>
  <div class="container" v-loading.fullscreen.lock="fullscreenLoading">
    <span class="cancel-container" v-if="ucInfo.id">您已关联
      <span>{{ucInfo.account}}</span>
      <py-popover
              ref="popover"
              placement="top"
              width="325"
              v-model="cancelVisible">
        <p>取消关联后将无法接收该账户的信息，确定继续吗？</p>
        <div style="text-align: right; margin: 0">
          <py-button size="mini" type="text" @click="cancelVisible = false">取消</py-button>
          <py-button type="primary" size="mini" @click="cancelRelation">确定</py-button>
        </div>
      </py-popover>
      <py-button type="text" v-popover:popover>取消关联</py-button>
    </span>
    <py-form
            v-else
            :model="bindForm"
            :rules="rules"
            ref="bindForm"
            label-position="left"
            label-width="0px"
            class="demo-ruleForm bind-container"
    >
      <h4 class="title">你好 <span style="color: rgb(175, 93, 93);">{{ getWeChatName }}</span>，请关联优驰账号</h4>
      <py-form-item prop="account">
        <py-input
                type="text"
                v-model="bindForm.account"
                auto-complete="off"
                placeholder="账号"
                autofocus="autofocus"
                @keyup.enter.native="handleBindSubmit"
        ></py-input>
      </py-form-item>
      <py-form-item prop="checkPass">
        <py-input
                type="password"
                v-model="bindForm.checkPass"
                auto-complete="off"
                placeholder="密码"
                @keyup.enter.native="handleBindSubmit"
        ></py-input>
      </py-form-item>
      <py-form-item style="width:100%;">
        <py-button
                type="danger"
                style="width:100%;"
                @click.native.prevent="handleBindSubmit"
                :loading="binding"
        >关联账号</py-button
        >
      </py-form-item>
    </py-form>
  </div>
</template>

<script>
  import NProgress from "nprogress";
  import CryptoJS from "crypto-js";
  import { getWeChatRelation, getLogin, postBindWeChat, cancelWeChatRelation } from "api";
  import Qs from 'qs';

  export default {
    data() {
      return {
        fullscreenLoading: true, // 全局loading
        cancelVisible: false, // 取消关联提示框
        binding: false, // 关联进度loading
        bindForm: {
          account: "",
          checkPass: ""
        },
        rules: {
          account: [
            { required: true, message: "请输入账号", trigger: "blur" }
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: "请输入密码", trigger: "blur" }
            //{ validator: validaePass2 }
          ]
        },
        ucInfo: {},
      };
    },
    computed: {
      getWeChatName() {
        return this.getQueryString('nickname')
      },
      getWeChatOpenId() {
        return this.getQueryString('openid')
      },
    },
    watch: {

    },
    mounted() {
      this.getWeChatRelationInformation();
    },
    methods: {
      // 获取url参数
      getQueryString(name) {
        // hash模式
        const hash = location.hash;
        const query = Qs.parse(hash.substring(hash.indexOf('?')+1));
        return query[name];
      },
      // 获取用户关联信息
      getWeChatRelationInformation() {
        const params = {
          openId: this.getQueryString('openid'),
        };
        getWeChatRelation(params).then(res=>{
          this.ucInfo = res;
          this.fullscreenLoading = false;
        })
      },
      // 取消关联
      cancelRelation() {
        this.cancelVisible = false;
        const params = {
          id: this.ucInfo.id,
        };
        cancelWeChatRelation(params).then(res=>{
          this.$message({
            message: '取消关联完成',
            type: "success",
            center: true
          });
          this.getWeChatRelationInformation();
        })
      },
      //加密密码,第一个参数密码，第二个加密钥匙，第三个偏移量目前和密钥一致
      encrypt(data, key, iv) {
        //加密
        var key = CryptoJS.enc.Utf8.parse(key);
        var iv = CryptoJS.enc.Utf8.parse(iv);
        var encrypted = CryptoJS.AES.encrypt(data, key, {
          //加密方式CBC，padding为Pkcs7要与后台一致
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString(); //返回的是base64格式的密文
      },
      //解密密码
      decrypt(encrypted, key, iv) {
        //解密
        var key = CryptoJS.enc.Utf8.parse(key);
        var iv = CryptoJS.enc.Utf8.parse(iv);
        var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
      },
      handleReset() {
        this.$refs.bindForm.resetFields();
      },
      handleBindSubmit() {
        this.$refs.bindForm.validate(valid => {
          if (valid) {
            this.binding = true;
            NProgress.start();
            const password = this.bindForm.checkPass;
            const params = {
              grantType: "password",
              username: this.bindForm.account,
              password: password
            };
            getLogin()
              .then(data => {
                // getbind从后台获取加密token
                const key = data.tokenKey,
                  vi = data.tokenKey;
                const enpassword = this.encrypt(password, key, vi);
                const depassword = this.decrypt(enpassword, key, vi);
                const bindParams = {
                  grantType: "password",
                  username: this.bindForm.account,
                  password: enpassword,
                  wechatOpenId: this.getWeChatOpenId
                };
                //postbind向后台发送用户名和经过token加密后的密码和微信用户的openId进行微信和优驰账号的关联
                return postBindWeChat(bindParams);
              })
              .then(data => {
                this.$set(this, "binding", false);
                NProgress.done();
                this.$message({
                  message: '关联完成',
                  type: "success",
                  center: true
                });
                this.getWeChatRelationInformation();
              })
              .catch(err => {
                // 异常处理
                this.$set(this, "binding", false);
                this.$message({
                  message: err.message,
                  type: "error",
                  center: true
                });
                NProgress.done();
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
    }
  };
</script>

<style type="scss" scoped>
  .container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .bind-container {
      /*margin: calc(50vh - 200px) auto;*/
      max-width: 350px;
      width: 100%;
      .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
      }
    }
  }
</style>
