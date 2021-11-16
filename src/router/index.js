import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    alwaysShow: true, // will always show the root menu
    name: 'user',
    meta: {
      title: '用户中心',
      icon: 'user',
      roles: ['admin', 'editor', 'guest'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'Index',
        meta: {
          title: '用户列表',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'comment',
        component: () => import('@/views/user/comment'),
        name: 'Comment',
        meta: {
          title: '评论列表',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'refer',
        component: () => import('@/views/user/refer'),
        name: 'Refer',
        meta: {
          title: '推广列表',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'accountLog',
        component: () => import('@/views/user/accountLog'),
        name: 'AccountLog',
        meta: {
          title: '账变记录',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'withdrawLog',
        component: () => import('@/views/user/withdrawLog'),
        name: 'WithdrawLog',
        meta: {
          title: '提现记录',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'tags',
        component: () => import('@/views/user/tags'),
        name: 'Tags',
        meta: {
          title: '标签列表',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'group',
        component: () => import('@/views/user/group'),
        name: 'Group',
        meta: {
          title: '群组列表',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'profile',
        component: () => import('@/views/permission/profile'),
        hidden: true
      },
      {
        path: 'forget',
        component: () => import('@/views/user/forget'),
        hidden: true
      }
    ]
  },
  {
    path: '/content',
    component: Layout,
    redirect: '/content/video',
    alwaysShow: true, // will always show the root menu
    name: 'content',
    meta: {
      title: '内容中心',
      icon: 'component',
      roles: ['admin', 'editor', 'guest'] // you can set roles in root nav
    },
    children: [
      {
        path: 'topic',
        component: () => import('@/views/content/topic'),
        name: 'Topic',
        meta: {
          title: '话题列表',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'video',
        component: () => import('@/views/content/video'),
        name: 'Video',
        meta: {
          title: '视频列表',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'article',
        component: () => import('@/views/content/article'),
        name: 'Article',
        meta: {
          title: '图文列表',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'category',
        component: () => import('@/views/content/category'),
        name: 'Category',
        meta: {
          title: '分类列表',
          roles: ['admin', 'editor', 'guest']
        }
      }
    ]
  },
  {
    path: '/movie',
    component: Layout,
    redirect: '/movie',
    alwaysShow: true, // will always show the root menu
    name: 'movie',
    meta: {
      title: '影视中心',
      icon: 'education',
      roles: ['admin', 'editor', 'guest'] // you can set roles in root nav
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/movie/list'),
        name: 'list',
        meta: {
          title: '影视列表',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'category',
        component: () => import('@/views/movie/category'),
        name: 'Category',
        meta: {
          title: '分类列表',
          roles: ['admin', 'editor', 'guest']
        }
      }
    ]
  },
  {
    path: '/live',
    component: Layout,
    redirect: '/live',
    alwaysShow: true, // will always show the root menu
    name: 'live',
    meta: {
      title: '直播中心',
      icon: 'international',
      roles: ['admin', 'editor', 'guest'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/live/index'),
        name: 'Index',
        meta: {
          title: '直播列表',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'history',
        component: () => import('@/views/live/history'),
        name: 'History',
        meta: {
          title: '直播历史',
          roles: ['admin', 'editor', 'guest']
        }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    redirect: '/task/index',
    alwaysShow: true, // will always show the root menu
    name: 'task',
    meta: {
      title: '任务中心',
      icon: 'list',
      roles: ['admin', 'editor', 'guest'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/task/index'),
        name: 'Index',
        meta: {
          title: '任务列表',
          roles: ['admin', 'editor', 'guest']
        }
      }
    ]
  },
  {
    path: '/cipher',
    component: Layout,
    redirect: '/cipher/index',
    alwaysShow: true, // will always show the root menu
    name: 'cipher',
    meta: {
      title: '营销中心',
      icon: 'guide',
      roles: ['admin', 'editor', 'guest'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/cipher/index'),
        name: 'Index',
        meta: {
          title: '卡密列表',
          roles: ['admin', 'editor', 'guest']
        }
      }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/vip',
    alwaysShow: true, // will always show the root menu
    name: 'Shop',
    meta: {
      title: '商品中心',
      icon: 'shopping',
      roles: ['admin', 'editor', 'guest'] // you can set roles in root nav
    },
    children: [
      {
        path: 'goods',
        component: () => import('@/views/shop/goods'),
        name: 'Goods',
        meta: {
          title: '商品列表',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'vip',
        component: () => import('@/views/shop/vip'),
        name: 'Vip',
        meta: {
          title: 'VIP商品列表',
          roles: ['admin', 'editor', 'guest']
        }
      }
    ]
  },
  {
    path: '/advert',
    component: Layout,
    redirect: '/advert/index',
    alwaysShow: true, // will always show the root menu
    name: 'advert',
    meta: {
      title: '广告中心',
      icon: 'language',
      roles: ['admin', 'editor', 'guest'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/advert/index'),
        name: 'Index',
        meta: {
          title: '广告列表',
          roles: ['admin', 'editor', 'guest']
        }
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    redirect: '/config/index',
    alwaysShow: true, // will always show the root menu
    name: 'config',
    meta: {
      title: '站点配置',
      icon: 'example',
      roles: ['admin', 'editor', 'guest'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/config/index'),
        name: 'Index',
        meta: {
          title: '基础配置',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'safe',
        component: () => import('@/views/config/safe'),
        name: 'Safe',
        meta: {
          title: '内容安全',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'agent',
        component: () => import('@/views/config/agent'),
        name: 'Agent',
        meta: {
          title: '代理设置',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'system',
        component: () => import('@/views/config/system'),
        name: 'System',
        meta: {
          title: '系统配置',
          roles: ['admin', 'editor', 'guest']
        }
      },
      {
        path: 'version',
        component: () => import('@/views/config/version'),
        name: 'Version',
        meta: {
          title: '版本更新',
          roles: ['admin', 'editor', 'guest']
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/user',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'lock',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/permission/admin'),
        name: 'Admin',
        meta: {
          title: '管理员列表',
          roles: ['admin']
        }
      },
      {
        path: 'adminLog',
        component: () => import('@/views/permission/adminLog'),
        name: 'AdminLog',
        meta: {
          title: '管理员日志',
          roles: ['admin']
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'Role',
        meta: {
          title: '角色管理',
          roles: ['admin']
        }
      },
      {
        path: 'permission',
        component: () => import('@/views/permission/permission'),
        name: 'Permission',
        meta: {
          title: '权限管理',
          roles: ['admin']
        }
      }

    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
