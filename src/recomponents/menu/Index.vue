2<template>
  <div>
    <py-menu
      :default-active="defaultActive"
      :mode="mode"
      :background-color="backgroundColor"
      :text-color="textColor"
      :active-text-color="activeTextColor"
      unique-opened
      router
      @select="handleSelectMenu"
      :collapse="isCollapsed"
    >
      <py-submenu-item
        :show-mode="mode"
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :min-show-nav-words="minShowNavWords"
      ></py-submenu-item>
    </py-menu>
  </div>
</template>

<script>
import store from "store";
import PySubmenuItem from "./SubmenuItem";

export default {
  name: "PyRemenu",
  components: { PySubmenuItem },
  props: {
    // menu object
    defaultActive: {
      type: String,
      default: ""
    },
    routes: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: "horizontal"
    },
    backgroundColor: {
      type: String,
      default: "#324157"
    },
    textColor: {
      type: String,
      default: "#fff"
    },
    activeTextColor: {
      type: String,
      default: "#20a0ff"
    },
    minShowNavWords: {
      type: Number,
      default: 1000
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    // 只有在mode为vertical情况下导航栏可展开折叠
    isCollapsed() {
      return this.mode === "vertical" && this.collapsed;
    },
  },
  methods: {
    // 切换左侧导航时，折叠导航
    handleSelectMenu(key, keyPath) {
      if (this.mode === "vertical") store.dispatch("setCollapsed", false);
    },
  },
  mounted() {}
};
</script>