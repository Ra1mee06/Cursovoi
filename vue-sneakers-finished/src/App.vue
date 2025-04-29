<script setup>
import { useCart } from './composables/useCart';
import Header from './components/Header.vue';
import Drawer from './components/Drawer.vue';

const {
  drawerOpen,
  totalPrice,
  vatPrice,
  openDrawer,
  closeDrawer,
} = useCart();
</script>

<template>
  <Drawer 
    v-if="drawerOpen" 
    :total-price="totalPrice" 
    :vat-price="vatPrice" 
  />

  <div v-else class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <Header 
      :total-price="totalPrice" 
      @open-drawer="openDrawer" 
    ></Header>
    
    <div class="p-10">
      <router-view />
    </div>
  </div>
</template>