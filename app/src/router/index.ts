import { createRouter as createVueRouter, createWebHashHistory, Router } from "vue-router";
import { App } from 'vue';

import Home from '../views/Home.vue'
import PageNotFound from '../views/PageNotFound.vue'

export function createRouter(app: App): Router {
  return createVueRouter({
    routes: [
      {
        path: '/',
        name: 'root',
        component: Home
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: PageNotFound
      }
    ],
    history: createWebHashHistory()
  })
}
