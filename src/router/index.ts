import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Upload from '../views/UploadNFT.vue'
import Creator from '../views/Creator-Dashboard.vue'
import Assets from '../views/My-Assets.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/upload',
    name: 'upload',
    component: Upload
  },
  {
    path: '/assets',
    name: 'assets',
    component: Assets
  },
  {
    path: '/creator',
    name: 'creator',
    component: Creator
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
