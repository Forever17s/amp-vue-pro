<template>
  <div>
    <vue-particles
      class="particles-bg"
      :particleOpacity="0.7"
      :particlesNumber="50"
      shapeType="circle"
      :particleSize="10"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="6"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="repulse"
    ></vue-particles>
    <py-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-container"
    >
      <h3 class="title">系统登录</h3>
      <py-form-item prop="account">
        <py-input
          type="text"
          v-model="loginForm.account"
          auto-complete="off"
          placeholder="账号"
          autofocus="autofocus"
          @keyup.enter.native="handleLoginSubmit"
        ></py-input>
      </py-form-item>
      <py-form-item prop="checkPass">
        <py-input
          type="password"
          v-model="loginForm.checkPass"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLoginSubmit"
        ></py-input>
      </py-form-item>
      <py-checkbox v-model="checked" checked class="remember"
        >记住密码</py-checkbox
      >
      <py-form-item style="width:100%;">
        <py-button
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLoginSubmit"
          :loading="logining"
          >登录</py-button
        >
        <!-- <py-button @click.native.prevent="handleReset">重置</py-button> -->
      </py-form-item>
    </py-form>
  </div>
</template>

<script>
import NProgress from "nprogress";
import CryptoJS from "crypto-js";
import { consoleLogin, getLogin, postLogin, getUserInfo, getUserPermissions } from "api";

export default {
  data() {
    return {
      logining: false,
      loginForm: {
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
      checked: true,
      redirect: null
    };
  },
  computed: {},
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {
    this.getCookie(); // 读取本地是否有用户密码
  },
  methods: {
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
      this.$refs.loginForm.resetFields();
    },
    handleLoginSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.logining = true;
          NProgress.start();
          const password = this.loginForm.checkPass;
          const params = {
            grantType: "password",
            username: this.loginForm.account,
            password: password
          };
          consoleLogin(params)
            .then(res => {
              sessionStorage.setItem(
                "console_token",
                JSON.stringify(res.accessToken)
              );
              return getLogin();
            })
            .then(data => {
              // getlogin从后台获取加密token
              const key = data.tokenKey,
                vi = data.tokenKey;
              const enpassword = this.encrypt(password, key, vi);
              const depassword = this.decrypt(enpassword, key, vi);
              //              console.log(depassword);
              const loginParams = {
                grantType: "password",
                username: this.loginForm.account,
                password: enpassword
              };
              //postlogin向后台发送用户名和经过token加密后的密码
              return postLogin(loginParams);
            })
            .then(data => {
              const { accessToken } = data;
              sessionStorage.setItem("token", JSON.stringify(accessToken));
              this.setPasswordCookie(); // 缓存用户密码
              return getUserInfo();
            })
            .then(data => {
              sessionStorage.setItem("userInfo", JSON.stringify(data));
              return getUserPermissions();
            })
            .then(data => {
              this.$set(this, "logining", false);
              NProgress.done();
              sessionStorage.setItem("permission", data);
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(err => {
              // 异常处理
              this.$set(this, "logining", false);
              this.$message({
                message: err.response.data.message || err.response.statusText,
                type: "error"
              });
              NProgress.done();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setPasswordCookie() {
      // 判断记住密码是否勾选，勾选则调用配置cookie方法
      if (this.checked) {
        // 传入账号名，密码，和保存天数3个参数
        this.setCookie(this.loginForm.account, this.loginForm.checkPass, 7);
      } else {
        // 清空Cookie
        this.clearCookie();
      }
    },
    // 设置cookie
    setCookie(c_name, c_pwd, exdays) {
      const exdate = new Date(); // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      // 字符串拼接cookie
      window.document.cookie =
        "ampMonitor_uName" +
        "=" +
        c_name +
        ";path=/;expires=" +
        exdate.toGMTString();
      window.document.cookie =
        "ampMonitor_uPwd" +
        "=" +
        c_pwd +
        ";path=/;expires=" +
        exdate.toGMTString();
    },
    // 读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        let arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
        for (let i = 0; i < arr.length; i++) {
          let arr2 = arr[i].split("="); //再次切割
          //判断查找相对应的值
          if (arr2[0] === "ampMonitor_uName") {
            this.loginForm.account = arr2[1]; //保存到保存数据的地方
          } else if (arr2[0] === "ampMonitor_uPwd") {
            this.loginForm.checkPass = arr2[1];
          }
        }
      }
    },
    // 清除cookie
    clearCookie() {
      this.setCookie("", "", -1); // 修改2值都为空，天数为负1天就好了
    }
  }
};
</script>

<style scoped>
.particles-bg {
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: calc(50vh - 200px) auto;
  max-width: 350px;
  width: 100%;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
