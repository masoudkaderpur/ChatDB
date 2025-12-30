import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue')
    },
    {
      path: '/application',
      name: 'application',
      component: () => import('../pages/ApplicationPage.vue')
    }
  ]
})

export default router
