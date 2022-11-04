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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
    name: 'Login',
    component: () => import('@/views/login/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/AdminHome'),
      meta: {title: '首页', icon: 'el-icon-s-home'},
    }]
  },

  {
    path: '/blogManager',
    name: '文章管理',
    redirect: '/blogManager/editBlog',
    component: Layout,
    meta: {title: '文章管理', icon: 'el-icon-reading'},
    children: [
      {
        path: '/editBlog',
        name: '文章编辑',
        component: () => import('@/views/blog/info/EditBlog'),
        meta: {title: '文章编辑', icon: 'blogEdit'}
      },
      {
        path: '/blogList',
        name: '文章列表',
        component: () => import('@/views/blog/info/BlogList'),
        meta: {title: '文章列表', icon: 'blogList'}
      },
      {
        path: '/commentList',
        name: '评论列表',
        component: () => import('@/views/blog/info/CommentList'),
        meta: {title: '评论列表', icon: 'comment'}

      }
    ]
  },


  {
    path: '/labelManager',
    name: '标签管理',
    redirect: '/labelManager/labelList',
    component: Layout,
    meta: {title: '标签管理', icon: 'el-icon-collection-tag'},
    children: [
      {
        path: '/labelList',
        name: '标签列表',
        component: () => import('@/views/blog/label/LabelList'),
        meta: {title: '标签列表', icon: 'tag'}
      }
    ]
  },

  {
    path: '/classifyManager',
    name: '分类管理',
    redirect: '/classifyManager/groupList',
    component: Layout,
    meta: {title: '分类管理', icon: 'el-icon-s-custom'},
    children: [
      {
        path: '/groupList',
        name: '分类列表',
        component: () => import('@/views/blog/category/CategoryList'),
        meta: {title: '分类列表', icon: 'category'}
      }
    ]
  },
  {
    path: '/authManager',
    name: '权限管理',
    redirect: '/authManager/userManager',
    component: Layout,
    meta: {title: '权限管理', icon: 'el-icon-share'},
    children: [
      {
        path: '/userManager',
        name: '用户管理',
        component: () => import('@/views/auth/user/UserList'),
        meta: {title: '用户管理', icon: 'user'}
      },
      {
        path: '/roleManager',
        name: '角色管理',
        component: () => import('@/views/auth/role/RoleList'),
        meta: {title: '角色管理', icon: 'roleEdit'}
      },
      {
        path: '/resourceManager',
        name: '资源管理',
        component: () => import('@/views/auth/resource/ResourceList'),
        meta: {title: '资源管理', icon: 'resource'}
      },
      {
        path: '/resourceCategory',
        name: '资源分类管理',
        hidden: true,
        component: () => import('../views/auth/resource/ResourceCategoryList'),
        meta: {title: '资源分类管理', icon: 'table'}
      }
    ]
  },
  {
    path: '/systemManager',
    name: '系统管理',
    redirect: '/systemManager/systemMessage',
    component: Layout,
    meta: {title: '系统管理', icon: 'el-icon-s-tools'},
    children: [
      {
        path: '/systemMessage',
        name: '系统信息',
        component: () => import('@/views/system/ConfigList'),
        meta: {title: '系统信息', icon: 'config'}
      },
      {
        path: '/systemList',
        name: '链接列表',
        component: () => import('@/views/system/LinkList'),
        meta: {title: '链接列表', icon: 'link'}
      },
    ]
  },

  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router