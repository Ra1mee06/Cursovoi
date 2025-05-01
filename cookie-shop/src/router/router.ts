import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Home from '../pages/Home.vue';
import Favorites from '../pages/Favorites.vue';
import Profile from '../pages/Profile.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',  
    name: 'Home',
    component: Home,
  },
  {
    path: '/favorites',  
    name: 'Favorites',
    component: Favorites,
  },
  {
    path: '/profile',  
    name: 'Profile',
    component: Profile,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),  
  routes,
});

export default router;