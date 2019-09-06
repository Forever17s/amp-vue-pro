<template>
  <py-row class="tac container">
    <py-col :span="24" class="header">
      <py-col :xs="14" :sm="4" :md="4" :lg="4" :xl="4" class="logo">
        <py-col :xs="16" :sm="24" :md="24" :lg="24" :xl="24">
          <span>品友监控</span>
          <img v-if="!deviceIsMobile" class="logoUrl" :src="logoUrl">
        </py-col>
        <py-col :xs="8" :sm="0" :md="0" :lg="0" :xl="0">
          <i :class="getCollapseIcon" style="cursor: pointer;" @click="changeCollapse"></i>
        </py-col>
      </py-col>
      <py-col :xs="0" :sm="16" :md="16" :lg="16" :xl="16" class="navigation">
        <!-- 导航菜单 -->
        <py-remenu
                :default-active="$route.path"
                :routes="routes"
                :min-show-nav-words="minShowNavWords"
                mode="horizontal"
                background-color="#324157"
                text-color="#fff"
                active-text-color="#20a0ff"
        ></py-remenu>
      </py-col>
      <py-col :xs="6" :sm="2" :md="2" :lg="2" :xl="2" class="userinfo">
        <py-dropdown trigger="hover">
          <span class="py-dropdown-link userinfo-inner">
            <i class="fa fa-user-circle"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <py-dropdown-menu slot="dropdown">
            <py-dropdown-item>我的消息</py-dropdown-item>
            <py-dropdown-item>设置</py-dropdown-item>
            <py-dropdown-item @click.native="userCenter">个人中心</py-dropdown-item>
            <py-dropdown-item divided @click.native="logout">退出登录</py-dropdown-item>
          </py-dropdown-menu>
        </py-dropdown>
      </py-col>
      <py-col :xs="4" :sm="1" :md="1" :lg="1" :xl="1" class="userinfo">
        <py-badge :value="reminding" :max="10" class="itemTip">
          <i class="fa fa-bell-o itemBell" @click="setUrlToAlarm"></i>
        </py-badge>
      </py-col>
    </py-col>
    <py-col :span="24" class="main">
      <py-scrollbar wrap-class="side-menu-scrollbar" :class={hideSidebar:!collapsed} >
        <py-remenu
                :default-active="$route.path"
                :routes="routes"
                mode="vertical"
                :collapsed="false"
                background-color="#324157"
                text-color="#fff"
                active-text-color="#20a0ff"
                class="slideMenu"
        ></py-remenu>
      </py-scrollbar>

      <template v-if="collapsed">
        <div class="mobileShadow" @click="changeCollapse"></div>
      </template>

      <section class="py-col py-col-24 content-container">
        <div class="grid-content bg-purple-light">
          <py-col :span="24" class="breadcrumb-container">
            <py-breadcrumb separator="/" class="breadcrumb-inner">
              <py-breadcrumb-item
                v-for="(item, i) in breadcrumbs"
                :to="{ path: item.path }"
                :key="item.path"
              >{{ item.menuName }}</py-breadcrumb-item>
            </py-breadcrumb>
            <!-- <strong class="title">{{$route.name}}</strong> -->
          </py-col>
          <py-col :span="24" class="content-wrapper">
            <!-- {{$route.meta.keepAlive}} -->
            <transition name="fade" mode="out-in">
              <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
              </keep-alive>
            </transition>
            <transition name="fade" mode="out-in">
              <router-view v-if="!$route.meta.keepAlive"></router-view>
            </transition>
          </py-col>
        </div>
      </section>
    </py-col>
  </py-row>
</template>

<script>
import { mapGetters } from "vuex";
import store from "store";
import { logout, getUnresolvedNum } from "api";
import logoUrl from "../assets/logo.svg";
import PyRemenu from "recomponents/menu/Index";
import ResizeMixin from "../common/mixins/resizeHandler";

export default {
  components: {
    PyRemenu
  },
  mixins: [ResizeMixin],
  data() {
    return {
      logoUrl: logoUrl,
      reminding: 0,
      remindInterval: null,
      screenWidth: document.body.clientWidth, // 屏幕宽度
      minShowNavWords: 1000 // 当屏幕宽度小于1000时，只显示导航图标
    };
  },
  computed: {
    // 设备是否为移动端
    deviceIsMobile () {
      return this.device === 'mobile';
    },
    // 获取控制导航栏折叠展开的图标
    getCollapseIcon () {
      return this.collapsed ? 'fa fa-indent fa-fw' : 'fa fa-outdent fa-fw';
    },
    ...mapGetters({
      device: "getDevice",
      collapsed: "getCollapsed",
      routes: "getRoutes",
      breadcrumbs: "getBreadcrumbs"
    })
  },
  methods: {
    // 改变侧边导航栏展开折叠状态和阴影的展示状态
    changeCollapse() {
      store.dispatch("setCollapsed", !this.collapsed);
    },
    // 退出登录
    logout() {
      let _this = this;
      this.$confirm("确认退出吗?", "提示", {
        // type: 'warning'
      })
        .then(() => {
          logout();
          sessionStorage.removeItem("console_token");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("userInfo");
          sessionStorage.removeItem("permission");
          _this.$router.push("/login");
        })
        .catch(() => {});
    },
    // 个人中心
    userCenter() {
      this.$router.push("/modifyUser");
    },
    // 定时获取待办事项
    getRemind() {
      getUnresolvedNum().then(res => {
        this.$set(this, "reminding", res);
      });
    },
    // 点击跳转alarmlog页面
    setUrlToAlarm() {
      let url = document.location.toString();
      let arrUrl = url.split("//");
      let start = arrUrl[1].indexOf("/");
      let relUrl = arrUrl[1].substring(start);
      if (relUrl.indexOf("?") !== -1) {
        relUrl = relUrl.split("?")[0];
      }
      if (this.reminding && relUrl !== "/#/alarmlog")
        this.$router.push("/alarmlog");
    }
  },
  mounted() {
    this.getRemind();
    this.remindInterval = setInterval(this.getRemind, 300000);
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        this.screenWidth = window.screenWidth;
        store.dispatch("setScreenWidth", window.screenWidth); // 存储到vuex
      })();
    };
  },
  destroyed() {
    window.clearInterval(this.remindInterval);
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: #324157;
    color: black;
    width: 100%;
    .py-menu-demo i {
      font-size: 16px;
    }
    .logo {
      border-color: #cccccc;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      color: #fff;
      span {
        height: 60px;
        font-size: 22px;
        padding-left: 20px;
        padding-right: 20px;
      }
      img.logoUrl {
        width: 40px;
        height: 40px;
        float: left;
        margin-top: 10px;
        margin-left: 20px;
        -webkit-animation: circle 10s infinite ease-in-out;
        @-webkit-keyframes circle {
          0% {
            transform: rotateY(0deg);
          }
          80% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(-360deg);
          }
        }
      }
    }
    .userinfo {
      text-align: right;
      float: right;
      color: #fff;
      .userinfo-inner {
        cursor: pointer;
        i {
          color: #fff;
          font-size: 20px;
        }
      }
      .itemBell {
        font-size: 20px;
        margin-top: 8px;
        margin-left: -20px;
        display: inline-block;
        position: absolute;
        cursor: pointer;
        z-index: 1;
      }
      .itemTip {
        margin-top: -40px;
      }
    }
  }
}
.main {
  overflow: hidden;
  display: flex;
  position: absolute;
  top: 60px;
  bottom: 0px;
  overflow: hidden;
  .slideMenu {
    transition: transform .28s;
    width: 180px !important;
    position: fixed;
    left: 0;
    height: 100vh;
    background-color: #324157;
    z-index: 99999;
  }
  .hideSidebar {
    .slideMenu {
      transition-duration: 0.3s;
      transform: translate3d(-180px, 0, 0);
    }
  }
  .mobileShadow {
    background: #000;
    opacity: .3;
    width: 100%;
    top: 0;
    height: 100%;
    position: fixed;
    z-index: 999;
  }
  .content-container {
    overflow-y: auto;
    padding: 10px;
    background-color: #f0f0f0;
  }
}
.breadcrumb-container {
  margin: 5px 0 15px 0;
}
</style>

<style>
.py-scrollbar__wrap {
  overflow: scroll;
  /*overflow-x: auto;*/
}

.side-menu-scrollbar {
  max-height: calc(100vh - 100px);
}

.py-dialog {
  min-width: 380px !important;
}

.dialog-content-scrollbar {
  max-height: 70vh;
}
</style>
