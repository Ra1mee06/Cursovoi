<script setup>
import { useCart } from '../composables/useCart';
import { useRouter } from 'vue-router';
import Header from './Header.vue';
import Drawer from './Drawer.vue';

const {
  drawerOpen,
  totalPrice,
  vatPrice,
  openDrawer,
  closeDrawer,
} = useCart();
</script>

<template>
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <Header 
      :total-price="totalPrice" 
      @open-drawer="openDrawer" 
    ></Header>
    
    <div class="p-10">
      <router-view ></router-view>
    </div>
  </div>

  <Drawer 
    v-if="drawerOpen" 
    :total-price="totalPrice" 
    :vat-price="vatPrice" 
  />
</template>