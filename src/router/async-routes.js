export const asyncRoutes = [
  {
    code: 'Dashboard',
    name: '控制台',
    type: 'MENU',
    icon: 'i-fe:monitor',
    path: '/',
    component: '/src/views/home/index.vue',
    show: true,
    enable: true,
  },
  {
    code: 'UserManage',
    name: '用户管理',
    type: 'MENU',
    icon: 'i-fe:user',
    path: null,
    component: '/src/views/home/index.vue',
    show: true,
    enable: true,
    children: [
      {
        name: '用户列表管理',
        code: 'UserList',
        type: 'MENU',
        path: '/user/list',
        redirect: null,
        component: '/src/views/user/list/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: true,
        enable: true,
        order: 1,
        roles: ['agent'],
        meta: {
          btns: {
            agent: ['AddUser'],
          },
        },
      },
      {
        name: '余额变动明细',
        code: 'UserBalanceLog',
        type: 'MENU',
        path: '/user/balance-log',
        redirect: null,
        component: '/src/views/user/balance-log/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: true,
        enable: true,
        order: 1,
      },
      {
        name: '会员等级',
        code: 'VipLevel',
        type: 'MENU',
        path: '/user/vip',
        redirect: null,
        component: '/src/views/user/vip/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: true,
        enable: true,
        order: 1,
      },
      {
        name: '会员开通记录',
        code: 'VipLog',
        type: 'MENU',
        path: '/user/vip-log',
        redirect: null,
        component: '/src/views/user/vip-log/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: true,
        enable: true,
        order: 1,
      },
      {
        name: '用户行为日志',
        code: 'UserOperationLog',
        type: 'MENU',
        path: '/user/operation-log',
        redirect: null,
        component: '/src/views/user/operation-log/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: true,
        enable: true,
        order: 1,
      },
    ],
  },
  {
    code: 'GroupManage',
    name: '群管理',
    type: 'MENU',
    icon: 'i-fe:users',
    path: null,
    component: null,
    show: true,
    enable: true,
    children: [
      {
        name: '群列表管理',
        code: 'GroupList',
        type: 'MENU',
        path: '/group/list',
        redirect: null,
        component: '/src/views/group/list/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: true,
        enable: true,
        order: 1,
        children: [
          {
            name: '群用户列表',
            code: 'GroupUserList',
            type: 'MENU',
            path: '/group/user',
            redirect: null,
            component: '/src/views/group/user/index.vue',
            layout: null,
            keepAlive: true,
            method: null,
            description: null,
            show: false,
            enable: true,
            order: 1,
          },
        ],
      },
      {
        name: '群配置',
        code: 'GroupConfig',
        type: 'MENU',
        path: '/group/config',
        redirect: null,
        component: '/src/views/group/config/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: true,
        enable: true,
        order: 1,
      },
    ],
  },
  {
    code: 'FinanceManage',
    name: '财务管理',
    type: 'MENU',
    icon: 'i-fe:inbox',
    path: null,
    component: null,
    show: true,
    enable: true,
    children: [
      {
        name: '充值列表',
        code: 'RechargeManage',
        type: 'MENU',
        parentId: 2,
        path: '/finance/recharge',
        redirect: null,
        component: '/src/views/finance/recharge/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: true,
        enable: true,
        order: 1,
      },
      {
        name: '提现列表',
        code: 'WithholdManage',
        type: 'MENU',
        parentId: 2,
        path: '/finance/withhold',
        redirect: null,
        component: '/src/views/finance/withhold/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: true,
        enable: true,
        order: 1,
      },
    ],
  },
  {
    code: 'BeautifulNumManage',
    name: '靓号管理',
    type: 'MENU',
    icon: 'i-fe:sun',
    path: '/beautiful-num/label',
    component: '/src/views/beautiful-num/label/index.vue',
    show: true,
    enable: true,
    children: [
      {
        name: '靓号列表',
        code: 'BeautifulList',
        type: 'MENU',
        path: '/beautiful-num/list',
        redirect: null,
        component: '/src/views/beautiful-num/list/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: false,
        enable: true,
        order: 1,
      },
    ],
  },
  {
    code: 'EmojiManage',
    name: '表情包管理',
    type: 'MENU',
    icon: 'i-fe:smile',
    path: '/emoji/label',
    component: '/src/views/emoji/label/index.vue',
    show: true,
    enable: true,
    children: [
      {
        name: '表情列表',
        code: 'EmojiList',
        type: 'MENU',
        path: '/emoji/list',
        redirect: null,
        component: '/src/views/emoji/list/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: false,
        enable: true,
        order: 1,
      },
    ],
  },
  // {
  //   code: 'GameManager',
  //   name: '游戏管理',
  //   type: 'MENU',
  //   icon: 'i-fe:github',
  //   path: '/game',
  //   component: '/src/views/game/list.vue',
  //   show: true,
  //   enable: true,
  // },
  // {
  //   code: 'NoticeManage',
  //   name: '公告配置',
  //   type: 'MENU',
  //   icon: 'i-fe:users',
  //   path: null,
  //   component: null,
  //   show: true,
  //   enable: true,
  //   children: [
  //     {
  //       name: '公告列表',
  //       code: 'NoticeList',
  //       type: 'MENU',
  //       parentId: 2,
  //       path: '/notice/list',
  //       redirect: null,
  //       component: '/src/views/notice/list/index.vue',
  //       layout: null,
  //       keepAlive: true,
  //       method: null,
  //       description: null,
  //       show: true,
  //       enable: true,
  //       order: 1,
  //     },
  //     {
  //       name: '公告分类',
  //       code: 'NoticeClass',
  //       type: 'MENU',
  //       path: '/notice/classification',
  //       redirect: null,
  //       component: '/src/views/notice/classification/index.vue',
  //       layout: null,
  //       keepAlive: true,
  //       method: null,
  //       description: null,
  //       show: true,
  //       enable: true,
  //       order: 1,
  //     },
  //   ],
  // },
  {
    code: 'OperateConfig',
    name: '运营配置',
    type: 'MENU',
    icon: 'i-fe:send',
    path: null,
    show: true,
    enable: true,
    roles: ['admin'],
    children: [
      {
        name: '参数管理',
        code: 'KeyConfig',
        type: 'MENU',
        path: '/operate-config/list',
        redirect: null,
        component: '/src/views/operate-config/key/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: true,
        enable: true,
        roles: ['admin'],
      },
      {
        name: '发现页',
        code: 'FindPage',
        type: 'MENU',
        path: '/operate-config/find',
        redirect: null,
        component: '/src/views/operate-config/find/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: true,
        enable: true,
        roles: ['admin'],
      },
    ],
  },
  {
    code: 'FeedbackManager',
    name: '意见反馈',
    type: 'MENU',
    icon: 'i-fe:github',
    path: '/feedback',
    component: '/src/views/feedback/index.vue',
    show: true,
    enable: true,
  },
  {
    code: 'SystemManage',
    name: '系统管理',
    type: 'MENU',
    icon: 'i-fe:settings',
    path: '/',
    component: '/src/views/home/index.vue',
    show: true,
    enable: true,
    children: [
      {
        name: '系统用户',
        code: 'SysUser',
        type: 'MENU',
        parentId: 2,
        path: '/sys/user',
        redirect: null,
        component: '/src/views/pms/user/index.vue',
        layout: null,
        keepAlive: true,
        method: null,
        description: null,
        show: true,
        enable: true,
        order: 1,
      },
      // {
      //   name: '角色管理',
      //   code: 'SysRole',
      //   type: 'MENU',
      //   parentId: 2,
      //   path: '/sys/role',
      //   redirect: null,
      //   component: '/src/views/pms/role/index.vue',
      //   layout: null,
      //   keepAlive: true,
      //   method: null,
      //   description: null,
      //   show: true,
      //   enable: true,
      //   order: 1,
      // },
      // {
      //   name: '菜单管理',
      //   code: 'SysResource',
      //   type: 'MENU',
      //   parentId: 2,
      //   path: '/sys/resource',
      //   redirect: null,
      //   component: '/src/views/pms/resource/index.vue',
      //   layout: null,
      //   keepAlive: true,
      //   method: null,
      //   description: null,
      //   show: true,
      //   enable: true,
      //   order: 1,
      // },
      // {
      //   name: '短信记录',
      //   code: 'SysSMS',
      //   type: 'MENU',
      //   parentId: 2,
      //   path: '/sys/sms',
      //   redirect: null,
      //   component: '/src/views/pms/sms/index.vue',
      //   layout: null,
      //   keepAlive: true,
      //   method: null,
      //   description: null,
      //   show: true,
      //   enable: true,
      //   order: 1,
      // },
    ],
  },
  // {
  //   id: 2,
  //   name: '游戏记录',
  //   code: 'SysMgt',
  //   type: 'MENU',
  //   parentId: null,
  //   path: null,
  //   redirect: null,
  //   icon: 'i-fe:grid',
  //   component: null,
  //   layout: null,
  //   keepAlive: null,
  //   method: null,
  //   description: null,
  //   show: true,
  //   enable: true,
  //   order: 2,
  //   children: [
  //     {
  //       id: 4,
  //       name: '用户管理',
  //       code: 'UserMgt',
  //       type: 'MENU',
  //       parentId: 2,
  //       path: '/pms/user',
  //       redirect: null,
  //       icon: 'i-fe:user',
  //       component: '/src/views/pms/user/index.vue',
  //       layout: null,
  //       keepAlive: true,
  //       method: null,
  //       description: null,
  //       show: true,
  //       enable: true,
  //       order: 3,
  //     },
  //   ],
  // },
  // {
  //   id: 2,
  //   name: '系统管理',
  //   code: 'SysMgt',
  //   type: 'MENU',
  //   parentId: null,
  //   path: null,
  //   redirect: null,
  //   icon: 'i-fe:grid',
  //   component: null,
  //   layout: null,
  //   keepAlive: null,
  //   method: null,
  //   description: null,
  //   show: true,
  //   enable: true,
  //   order: 2,
  //   children: [
  //     {
  //       id: 1,
  //       name: '资源管理',
  //       code: 'Resource_Mgt',
  //       type: 'MENU',
  //       parentId: 2,
  //       path: '/pms/resource',
  //       redirect: null,
  //       icon: 'i-fe:list',
  //       component: '/src/views/pms/resource/index.vue',
  //       layout: null,
  //       keepAlive: null,
  //       method: null,
  //       description: null,
  //       show: true,
  //       enable: true,
  //       order: 1,
  //     },
  //     {
  //       id: 3,
  //       name: '角色管理',
  //       code: 'RoleMgt',
  //       type: 'MENU',
  //       parentId: 2,
  //       path: '/pms/role',
  //       redirect: null,
  //       icon: 'i-fe:user-check',
  //       component: '/src/views/pms/role/index.vue',
  //       layout: null,
  //       keepAlive: null,
  //       method: null,
  //       description: null,
  //       show: true,
  //       enable: true,
  //       order: 2,
  //       children: [
  //         {
  //           id: 5,
  //           name: '分配用户',
  //           code: 'RoleUser',
  //           type: 'MENU',
  //           parentId: 3,
  //           path: '/pms/role/user/:roleId',
  //           redirect: null,
  //           icon: 'i-fe:user-plus',
  //           component: '/src/views/pms/role/role-user.vue',
  //           layout: 'full',
  //           keepAlive: null,
  //           method: null,
  //           description: null,
  //           show: false,
  //           enable: true,
  //           order: 1,
  //         },
  //       ],
  //     },
  //     {
  //       id: 4,
  //       name: '用户管理',
  //       code: 'UserMgt',
  //       type: 'MENU',
  //       parentId: 2,
  //       path: '/pms/user',
  //       redirect: null,
  //       icon: 'i-fe:user',
  //       component: '/src/views/pms/user/index.vue',
  //       layout: null,
  //       keepAlive: true,
  //       method: null,
  //       description: null,
  //       show: true,
  //       enable: true,
  //       order: 3,
  //       children: [
  //         {
  //           id: 13,
  //           name: '创建新用户',
  //           code: 'AddUser',
  //           type: 'BUTTON',
  //           parentId: 4,
  //           path: null,
  //           redirect: null,
  //           icon: null,
  //           component: null,
  //           layout: null,
  //           keepAlive: null,
  //           method: null,
  //           description: null,
  //           show: true,
  //           enable: true,
  //           order: 1,
  //         },
  //       ],
  //     },
  //   ],
  // },
]
