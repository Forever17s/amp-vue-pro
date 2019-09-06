/* eslint-disable array-callback-return */
import Vue from "vue";
import VueRouter from "vue-router";
import store from "store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { constantRoutes, asyncRoutes } from "src/routes";

NProgress.configure({ showSpinner: true });

export const router = new VueRouter({
  // mode: 'hash',
  // base: __dirname,
  routes: constantRoutes
});

let routeConfigs = [];
// 递归展开路由
const setRouteConfig = function(routeConfigs, item) {
  routeConfigs.push(item);
  if (item.children) {
    item.children.forEach(em => setRouteConfig(routeConfigs, em));
  }
};
// 初始化路由信息
const initRouteConfig = function() {
  routeConfigs = [];
  if (store.getters) store.getters.getRoutes.forEach(item => setRouteConfig(routeConfigs, item));
};

// 是否拥有动态权限
function hasPermission(permission, route) {
  if (!route.meta || !route.meta.authority) return true;
  const authority = route.meta.authority;
  if (permission.indexOf("admin") >= 0) return true; // admin permission passed directly
  // Array 处理
  if (Array.isArray(authority)) {
    if (!authority || authority.length == 0) return true;
    return permission.some(role => authority.indexOf(role) >= 0);
  }
  // string 处理
  if (typeof authority === "string") {
    if (!authority) return true;
    return permission.some(role => authority == role);
  }
}

// 递归过滤异步路由表，返回符合用户角色权限的路由表
function filterAsyncRouter(routes, roles) {
  const res = [];
  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles);
      }
      res.push(tmp);
    }
  });
  return res;
}

// 路由白名单
const whiteRouteList = ["/login", "/outside/email", "/outside/weChatBind"];

// 路由请求之前的处理
router.beforeEach((to, from, next) => {
  NProgress.start();
  const token = JSON.parse(sessionStorage.getItem("token"));
  const consoleToken = JSON.parse(sessionStorage.getItem("console_token"));
  if (token && consoleToken) {
    if (to.path == "/login") {
      sessionStorage.clear();
      next();
    } else {
      const permission = sessionStorage.getItem("permission").split(",");
      if (permission.length > 0 && store.getters.getPermission.length === 0) {
        store.dispatch("setPermission", permission);
        const filterAsyncRoutes = filterAsyncRouter(asyncRoutes, permission);
        store.dispatch("setRoutes", filterAsyncRoutes);
        router.addRoutes(filterAsyncRoutes);
        initRouteConfig(); // 动态添加路由后重新初始化路由
        next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
      } else {
        //TODO 后期可以通过vuex存储permission,通过页面操作动态改变权限（单独接口获取permission） 目前系统不需要
        if (hasPermission(permission, to)) {
          next();
        } else {
          next({ path: "/404" });
        }
      }
      next();
    }
  } else {
    /* has no token*/
    if (whiteRouteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

initRouteConfig(); //  初始化路由信息

// 检索并检查路由
const findRouteConfig = function(routeName) {
  const configs = routeConfigs.filter(item => item.name === routeName);
  if (configs.length === 0) {
    console.error(`没能找到路由名称为${routeName}的路由`);
  } else if (configs.length === 1) {
    return configs[0];
  } else {
    console.warn(`找到多个路由名称为${routeName}的路由`);
    return configs[configs.length - 1];
  }
  return false;
};

// 路由请求之后的处理
router.afterEach(route => {
  let breadcrumbs = [];
  // 更新面包屑
  route.matched.forEach(item => {
    const config = findRouteConfig(item.name);
    // 当配置为''时，不显示子级
    if (config.path !== "") {
      breadcrumbs.push(config);
    }
  });
  store.dispatch("setBreadcrumbs", breadcrumbs);
  NProgress.done();
});

// 定义组件级别权限指令，支持 & | ！字符串识别
Vue.directive("permission", {
  // 只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作。
  bind(el, binding) {
    // 检测权限是否拥有
    if (!binding.value) return;
    // 初始化用户权限
    const permission_str = sessionStorage.getItem("permission");
    const permission = permission_str ? permission_str.split(",") : [];
    let per = binding.value.replace(/\s*/g, "");
    let has_per = true;
    per = per.split("|");
    for (let i = 0; i < per.length; i++) {
      let item = per[i].split("&");
      has_per = true;
      item.forEach(it => {
        if (it.indexOf("!") > -1) {
          it = it.slice(1);
          if (permission.indexOf(it) > -1) has_per = false;
        } else {
          if (permission.indexOf(it) === -1) has_per = false;
        }
      });
      if (has_per) break;
    }
    if (!has_per) {
      el.innerHTML = "<strong>权限不足</strong>";
      el.style.display = "none";
    }
  }
});
