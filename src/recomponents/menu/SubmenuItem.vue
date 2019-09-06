<template>
  <div v-if="showMode=='horizontal' && !item.hidden">
    <py-submenu
      :index="item.path + ''"
      :key="item.path + ''"
      v-if="haveShowChildren(item) && !item.leaf"
      class="nav-menu-item"
    >
      <template slot="title">
        <i :class="item.iconCls"></i>
        <span v-if="screenWidth > minShowNavWords || alwaysShowWords">
          {{
          item.menuName
          }}
        </span>
      </template>
      <template v-for="child in item.children">
        <py-menu-item
          :index="child.path"
          :key="child.path"
          v-if="!haveShowChildren(child)"
          class="nav-menu-item"
        >{{ child.menuName }}</py-menu-item>
        <py-submenu v-else :index="child.path" :key="child.path" class="nav-menu-item">
          <template slot="title">
            <i :class="child.iconCls"></i>
            <span>
              {{
              child.menuName
              }}
            </span>
          </template>
          <py-submenu-item
            :show-mode="showMode"
            v-for="route in child.children"
            :key="route.path"
            :item="route"
            :always-show-words="childrenShowWords"
          ></py-submenu-item>
        </py-submenu>
      </template>
    </py-submenu>
    <py-menu-item
      v-if="haveShowChildren(item) && item.leaf"
      :index="item.children[0].path"
      :key="item.children[0].path"
      class="nav-menu-item"
    >
      <i :class="item.iconCls"></i>
      <span v-if="screenWidth > minShowNavWords || alwaysShowWords">
        {{
        item.children[0].menuName
        }}
      </span>
    </py-menu-item>
    <py-menu-item
      v-else-if="!haveShowChildren(item)"
      :index="item.path + ''"
      :key="item.path + ''"
      class="nav-menu-item"
    >
      <i :class="item.iconCls"></i>
      <span v-if="screenWidth > minShowNavWords || alwaysShowWords">
        {{
        item.menuName
        }}
      </span>
    </py-menu-item>
  </div>
  <div v-else-if="showMode=='vertical' && !item.hidden">
    <py-submenu
      :index="item.path + ''"
      :key="item.path + ''"
      v-if="haveShowChildren(item) && !item.leaf"
    >
      <template slot="title">
        <i :class="item.iconCls"></i>
        <span>
          {{
          item.menuName
          }}
        </span>
      </template>
      <template v-for="child in item.children">
        <py-menu-item :index="child.path" :key="child.path" v-if="!haveShowChildren(child)">
          <span slot="title">{{ child.menuName }}</span>
        </py-menu-item>
        <py-submenu v-else :index="child.path" :key="child.path">
          <template slot="title">
            <i :class="child.iconCls"></i>
            <span>
              {{
              item.menuName
              }}
            </span>
          </template>
          <py-submenu-item
            :show-mode="showMode"
            v-for="route in child.children"
            :key="route.path"
            :item="route"
            :always-show-words="childrenShowWords"
          ></py-submenu-item>
        </py-submenu>
      </template>
    </py-submenu>
    <py-menu-item
      v-if="haveShowChildren(item) && item.leaf"
      :index="item.children[0].path"
      :key="item.children[0].path"
    >
      <i :class="item.iconCls"></i>
      <span slot="title">
        {{
        item.children[0].menuName
        }}
      </span>
    </py-menu-item>
    <py-menu-item v-else-if="!haveShowChildren(item)" :index="item.path + ''" :key="item.path + ''">
      <i :class="item.iconCls"></i>
      <span slot="title">
        {{
        item.menuName
        }}
      </span>
    </py-menu-item>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "PySubmenuItem",
  props: {
    // menu object
    showMode: {
      type: String,
      default: "horizontal"
    },
    item: {
      type: Object,
      default: () => ({})
    },
    minShowNavWords: {
      // 当屏幕宽度小于1000时，只显示导航图标
      type: Number,
      default: 1000
    },
    alwaysShowWords: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      childrenShowWords: true
    };
  },
  computed: {
    ...mapGetters({
      screenWidth: "getScreenWidth"
    })
  },
  methods: {
    // 是否有可以展示的children
    haveShowChildren(node) {
      if (!node.children) return false;
      else {
        const menuArr = node.children.filter(item => !item.hidden);
        return menuArr.length > 0;
      }
    }
  },
  created() {}
};
</script>

<style scope>
.nav-menu-item,
.nav-menu-item .py-submenu__title {
  height: 60px !important;
  line-height: 60px !important;
  min-width: 80px;
}
</style>
