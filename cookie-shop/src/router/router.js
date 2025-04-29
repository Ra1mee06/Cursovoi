import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Favorites from '../pages/Favorites.vue';
import Profile from '../pages/Profile.vue';

const routes = [
  {
    path: '../pages/Home.vue',
    name: 'Home',
    component: Home,
  },
  {
    path: '../pages/Favorites.vue',
    name: 'Favorites',
    component: Favorites,
  },
    {
    path: '../pages/Profile.vue',
    name: 'Profile',
    component: Profile,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;