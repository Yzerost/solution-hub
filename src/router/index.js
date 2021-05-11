import Vue from 'vue'
import Router from 'vue-router'
import childrenArray from '../api/menu-config'

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
 *                                it will becomes fileManager mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
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
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/solution',
    component: Layout,
    redirect: '/solution/Solution',
    name: 'Solution',
    meta: { title: '解决方案' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: { title: '解决方案图谱' },
        component: () => import('@/views/solution/SolutionDashboard')
      },
      {
        path: 'list',
        name: 'versionList',
        hidden: true,
        meta: { title: '版本列表' },
        component: () => import('@/views/solution/VersionList')
      },
      {
        path: 'detail',
        name: 'versionDetail',
        hidden: true,
        meta: { title: '版本详情' },
        component: () => import('@/views/solution/VersionDetail')
      },
      {
        path: 'type',
        name: 'type',
        component: () => import('@/views/solution/Type'),
        meta: { title: '分类管理' }
      },
      {
        path: 'solution',
        name: 'solution',
        component: () => import('@/views/solution/Solution'),
        meta: { title: '方案管理' }
      },
      {
        path: 'version',
        name: 'version',
        component: () => import('@/views/solution/SolutionVersion'),
        meta: { title: '版本管理' }
      }
    ]
  },
  {
    path: '/fileManager',
    component: Layout,
    redirect: '/fileManager/fileList',
    name: 'fileManager',
    meta: {
      title: '文件管理',
      icon: 'fileManager'
    },
    children: [
      {
        path: 'fileUpload',
        component: () => import('@/views/fileManager/fileUpload/index'),
        meta: { title: '文件上传' }
      },
      {
        path: 'fileList',
        component: () => import('@/views/fileManager/fileList/index'), // Parent router-view
        name: '版本文件',
        meta: { title: '版本文件' },
        children: childrenArray // 从menu-config中动态获取
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '权限管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/logs',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'logs',
        component: () => import('@/views/form/index'),
        meta: { title: '操作日志', icon: 'form' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
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
