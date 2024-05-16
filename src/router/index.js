import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    name: 'home',
    path: '/',
    meta: {
      title: '首页'
    },
    component: () => import('../components/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎页'
        },
        component: () => import('../view/Welcome.vue')
      },
      {
        name: '用户管理',
        path: '/system/user',
        meta: {
          title: '用户管理'
        },
        component: () => import('../view/User.vue')
      },
      {
        name: '菜单管理',
        path: '/system/menu',
        meta: {
          title: '菜单管理'
        },
        component: () => import('../view/Menu.vue')
      },
      {
        name: '角色管理',
        path: '/system/role',
        meta: {
          title: '角色管理'
        },
        component: () => import('../view/Role.vue')
      },
      {
        name: '部门管理',
        path: '/system/dept',
        meta: {
          title: '部门管理'
        },
        component: () => import('./../view/Dept.vue')
      },
      {
        name: '审批管理',
        path: '/audit',
        meta: {
          title: '审批管理'
        },
        component: () => import('./../view/Leave.vue')
      },
      {
        name: '待审批',
        path: '/audit/approve',
        meta: {
          title: '待审批'
        },
        component: () => import('./../view/Approve.vue')
      }
    ]
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录页'
    },
    component: () => import('../view/Login.vue')
  },
  {
    name: '404页面',
    path: '/404',
    meta: {
      title: '404'
    },
    component: () => import('./../view/404.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
function checkPermission(path) {
  let hasPermission = router
    .getRoutes()
    .filter(route => route.path == path).length;
  if (hasPermission) {
    return true;
  } else {
    return false;
  }
}
router.beforeEach((to, from, next) => {
  if (checkPermission(to.path)) {
    document.title = to.meta.title;
    next();
  } else {
    next('/404');
  }
});

export default router;
