exports.temple = `/* Automatic generated by './build/build-routes-entry.js' */
{{include}}

export const constantRoutes = [
  {
    path: "/login",
    component: Login,
    name: "login",
    hidden: true
  },
  {
    path: "/404",
    component: NotFound,
    name: "notFound",
    hidden: true
  },
  {
    path: "/unopened",
    component: Unopened,
    name: "unopened",
    hidden: true
  },
  {
    path: "/outside",
    component: Main,
    name: "outside",
    hidden: true,
    children: [
      {
        path: "/outside/email",
        component: OutsideEmail,
        name: "outside:email"
      },
      {
        path: "/outside/weChatBind",
        component: OutsideWeChatBind,
        name: "outside:weChatBind"
      }
    ]
  },
];

export const asyncRoutes = [
  {
    path: "/",
    redirect: "/alarmlog",
    component: Home,
    name: "alarmlog",
    menuName: "优驰监控",
    leaf: true,
    iconCls: "py-icon-document", // 图标样式class
    children: [
      {
        path: "/alarmlog",
        component: AlarmlogList,
        name: "alarmlog:list",
        menuName: "报警记录"
      }
    ]
  },
  {
    path: "/monitor",
    component: Home,
    name: "monitor",
    menuName: "优驰监控",
    leaf: true,
    iconCls: "fa fa-desktop fa-fw", // 图标样式class
    children: [
      {
        path: "/monitor",
        component: Main,
        name: "monitor:list",
        menuName: "监控列表",
        children: [
          {
            path: "",
            component: MonitorList,
            name: "monitor:admin",
            menuName: "监控列表",
            hidden: true
          },
          {
            path: "/monitor/create",
            component: MonitorCreate,
            name: "monitor:create",
            menuName: "新建监控",
            meta: { authority: "monitor:create" },
            hidden: true
          },
          {
            path: "/monitor/update/:id",
            component: MonitorUpdate,
            name: "monitor:detail",
            menuName: "详情与更新",
            hidden: true
          }
        ]
      }
    ]
  },
  {
    path: "/billfix",
    component: Home,
    name: "billfix",
    menuName: "预算修复",
    leaf: true,
    iconCls: "fa fa-wrench", // 图标样式class
    meta: { authority: "billfix" },
    children: [
      {
        path: "/billfix",
        component: BillfixList,
        name: "billfix:list",
        menuName: "预算修复"
      },
      {
        path: "/billfix/details/:id",
        component: BillfixDetails,
        name: "billfix:detail",
        menuName: "预算详情"
      }
    ]
  },
  {
    path: "/jobmanual",
    component: Home,
    name: "jobmanual",
    menuName: "定时任务",
    leaf: true,
    iconCls: "fa fa-clock-o", // 图标样式class
    meta: { authority: "jobmanual" },
    children: [
      {
        path: "/jobmanual",
        component: JobmanualBilling,
        name: "jobmanual:operator",
        menuName: "定时任务"
      }
    ]
  },
  {
    path: "/lineitem",
    redirect: "/business/lineitem",
    component: Home,
    name: "business",
    menuName: "业务查询",
    iconCls: "fa fa-th-list fa-fw", // 图标样式class
    children: [
      {
        path: "/business/lineitem",
        component: BusinessLineItem,
        name: "business:lineitem",
        menuName: "业务查询",
        meta: {
          keepAlive: true // 需要被缓存
        }
      },
      {
        path: "/business/uploadfile",
        component: Main,
        name: "business:nissan:uploadfile",
        menuName: "日产相关",
        meta: { authority: "business:nissan:uploadfile" },
        children: [
          {
            path: "/business/uploadfile",
            component: BusinessNissanUploadFile,
            name: "business:nissan:uploadfile:admin",
            menuName: "日产相关",
            hidden: true
          },
          {
            path: "/business/uploadfile/DAlist",
            component: BusinessNissanDAlist,
            name: "business:nissan:DAlist:admin",
            menuName: "关联表展示",
            hidden: true
          }
        ]
      },
      {
        path: "/business/kpialgorithm",
        component: Main,
        name: "business:nissan:multi_KPI_algorithm:list",
        menuName: "PDB多KPI算法",
        children: [
          {
            path: "",
            component: BusinessKpialgorithmList,
            name: "business:nissan:multi_KPI_algorithm:admin",
            menuName: "PDB多KPI算法",
            hidden: true
          },
          {
            path: "/business/kpialgorithm/operat/:id",
            component: BusinessKpialgorithmOperat,
            name: "business:nissan:multi_KPI_algorithm:operat",
            menuName: "编辑配置",
            hidden: true
          }
        ]
      }
    ]
  },
  {
    path: "/configure",
    redirect: "/configure/white",
    component: Home,
    name: "configure",
    menuName: "监控配置",
    iconCls: "fa fa-cog", // 图标样式class
    children: [
      {
        path: "/configure/white",
        component: ConfigureWhiteList,
        name: "configure:whiteList",
        menuName: "Deal监控白名单"
      },
      {
        path: "/configure/confirm",
        component: ConfigureConfirmList,
        name: "configure:confirmList",
        menuName: "订阅配置"
      }
    ]
  },
  {
    path: "/modifyUser",
    redirect: "/modifyUser/payPassword",
    component: Home,
    name: "user",
    menuName: "用户中心",
    hidden: true,
    children: [
      {
        path: "/modifyUser/payPassword",
        component: ModifyuserPayPassword,
        name: "user:update",
        menuName: "修改密码"
      }
    ]
  },
  {
    // *代表其它指向404页面（放到最后）
    path: "*",
    hidden: true,
    redirect: { path: "/404" }
  }
]
`;
