/* eslint-disable array-callback-return */
import Vue from "vue";
import App from "./App.vue";
import PYUI from "../src/components/index";
import "./styles/theme-default/lib/index.css";
import VueRouter from "vue-router";
import store from "store";
import Vuex from "vuex";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Mock from "./mock";
import "font-awesome/css/font-awesome.min.css";
import VueParticles from "vue-particles";
import { router } from "./permission";

Mock.bootstrap();

// 标识生产环境变量
const isProduction = process.env.NODE_ENV === "production";
Vue.use(PYUI);
Vue.use(VueParticles);
Vue.use(VueRouter);
Vue.use(Vuex);

NProgress.configure({ showSpinner: true });

// 定义全局可访问，只能在不能使用this引用的情况下使用
global.PYFF = new Vue({
  // el: '#app',
  // template: '<App/>',
  router,
  store,
  // components: { App }
  render: h => h(App)
}).$mount("#app");
