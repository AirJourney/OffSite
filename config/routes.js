export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/core',
    name: '核心配置',
    icon: 'crown',
    access: 'molly',
    routes: [
      {
        path: '/core/group',
        name: '集团列表',
        icon: 'table',
        component: './Group',
      },
      {
        path: '/core/revenue',
        name: '加价政策列表',
        icon: 'table',
        component: './Revenue',
      },
    ],
  },
  {
    path: '/supplier',
    name: '供应商',
    icon: 'crown',
    access: 'staff',
    routes: [
      {
        path: '/supplier/list',
        name: '供应商列表',
        icon: 'table',
        component: './Supplier',
        access: 'staff',
      },
      {
        path: '/supplier/ipcc',
        name: '供应商IPCC',
        icon: 'table',
        component: './IPCC',
      },

      {
        path: '/supplier/prohibition',
        name: '销售航线配置',
        icon: 'table',
        component: './Prohibition',
      },
      {
        path: '/supplier/vedibility',
        name: '销售航司配置',
        icon: 'table',
        component: './Vendibility',
      },
      {
        path: '/supplier/staff',
        name: '账号管理',
        icon: 'table',
        component: './Staff',
        access: 'admin',
      },
    ],
  },
  {
    path: '/delivery',
    name: '价格投放',
    icon: 'crown',
    access: 'staff',
    routes: [
      {
        path: '/delivery/profit',
        name: '扣率调整',
        icon: 'table',
        component: './ProfitTableList',
      },

      {
        path: '/delivery/penalty',
        name: '退改政策调整',
        icon: 'table',
        component: './PenaltyAdjustment',
      },
      {
        path: '/delivery/baggage',
        name: '行李额调整',
        icon: 'table',
        component: './Baggage',
      },
      {
        path: '/delivery/taxes',
        name: '税费调整',
        icon: 'table',
        component: './404',
      },
    ],
  },
  {
    path: '/order',
    name: '订单管理',
    icon: 'crown',
    access: 'staff',
    routes: [
      {
        path: '/order/list',
        name: '订单列表',
        icon: 'table',
        component: './OrderTableList',
      },
      {
        path: '/order/accounting',
        name: '订单账务',
        icon: 'table',
        component: './OrderAccounting',
      },
    ],
  },
  {
    path: '/info',
    name: '静态信息',
    icon: 'crown',
    access: 'admin',
    routes: [
      {
        path: '/info/exchange',
        name: '汇率查询',
        icon: 'table',
        component: './Exchange',
      },
      {
        path: '/info/flight',
        name: '航线查询',
        icon: 'table',
        component: './Flight',
      },
      {
        path: '/info/company',
        name: '航司编码',
        icon: 'table',
        component: './Company',
      },
      {
        path: '/info/territory',
        name: '地域信息',
        icon: 'table',
        component: './404',
      },
      {
        path: '/info/airport',
        name: '机场编码',
        icon: 'table',
        component: './404',
      },
      {
        path: '/info/plane',
        name: '机型编码',
        icon: 'table',
        component: './404',
      },
      {
        path: '/info/relationship',
        name: '地域机场信息',
        icon: 'table',
        component: './404',
      },
    ],
  },
  {
    path: '/statistics',
    name: '统计信息',
    icon: 'crown',
    access: 'admin',
    routes: [
      {
        path: '/statistics/flight',
        name: '航线统计',
        icon: 'table',
        component: './404',
      },
      {
        path: '/statistics/gds',
        name: 'GDS查询量',
        icon: 'table',
        component: './404',
      },
      {
        path: '/statistics/bill',
        name: '出票统计',
        icon: 'table',
        component: './404',
      },
    ],
  },
  {
    path: '/monitoring',
    name: '监控信息',
    icon: 'crown',
    access: 'admin',
    routes: [
      {
        path: '/monitoring/shopping',
        name: '查询监控',
        icon: 'table',
        component: './404',
      },
      {
        path: '/monitoring/check',
        name: '验舱验价监控',
        icon: 'table',
        component: './404',
      },
      {
        path: '/monitoring/booking',
        name: '创单监控',
        icon: 'table',
        component: './404',
      },
    ],
  },
  // LCC Start
  // {
  //   name: 'lcc.table-list',
  //   icon: 'table',
  //   path: '/lcc',
  //   access: 'lcc',
  //   component: './LccTableList',
  // },
  // {
  //   name: 'orderstatus.table-list',
  //   icon: 'table',
  //   path: '/orderstatus',
  //   access: 'lcc',
  //   component: './OrderStatusTableList',
  // },
  // LCC End
  // {
  //   name: 'profit.table-list',
  //   icon: 'table',
  //   path: '/profit',
  //   access: 'staff',
  //   component: './ProfitTableList',
  // },
  // {
  //   name: 'order.table-list',
  //   icon: 'table',
  //   path: '/order',
  //   access: 'staff',
  //   component: './OrderTableList',
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
