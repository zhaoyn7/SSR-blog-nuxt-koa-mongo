import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Index from '@/components/Index.vue'
import Overview from '@/components/pages/Overview.vue'
import List from '@/components/pages/List.vue'
import Edit from '@/components/pages/Edit.vue'
import Post from '@/components/pages/Post.vue'
import Categories from '@/components/pages/Categories.vue'
import Google from '@/components/pages/Google.vue'
import Settings from '@/components/pages/Settings.vue'
import auth from '../utils/auth'

Vue.use(Router)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    component: Index,
    redirect: '/overview',
    // meta: { requireAuth: true },
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview,
        meta: { requireAuth: true }
      },
      {
        path: 'list',
        name: 'List',
        component: List,
        // meta: { requireAuth: true }
      },
      {
        path: 'edit/:id',
        name: 'Edit',
        component: Edit,
        meta: { requireAuth: true }
      },
      {
        path: 'post',
        name: 'Post',
        component: Post,
        meta: { requireAuth: true }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: Categories,
        meta: { requireAuth: true }
      },
      {
        path: 'google',
        name: 'Google',
        component: Google,
        meta: { requireAuth: true }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        meta: { requireAuth: true }
      }
    ]
  }
]

const router = new Router({
  mode: 'history',
  routes,
})

router.beforeEach(
  (to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) {
      if (!auth.checkLogin()) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else next()
    } else next()
  }
)

export default router
