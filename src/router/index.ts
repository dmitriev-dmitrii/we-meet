import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import MeetPage from "@/pages/MeetPage.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/meet/:id',
      name: 'MeetPage',
      component: MeetPage

    },
    {
      path: '/about',
      name: 'AboutPage',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/AboutPage.vue')
    }
  ]
})

export default router
