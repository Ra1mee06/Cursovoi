<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value.path);

defineProps({
  totalPrice: Number,
});

const emit = defineEmits(['openDrawer']);
</script>

<template>
  <header class="flex justify-between border-b border-slate-200 px-10 py-8">
    <router-link to="/">
      <div class="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" class="w-10" />
        <div>
          <h2 class="text-xl font-bold uppercase">Homless cookies</h2>
          <p class="text-slate-400">Лучший кондитерский магазин печенья</p>
        </div>
      </div>
    </router-link>

    <ul class="flex items-center gap-10">
      <li
        @click="() => emit('openDrawer')"
        class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black"
      >
        <img src="/cart.svg" alt="Cart" />
        <b>{{ totalPrice }} бун.</b>
      </li>

      <router-link 
        to="/favorites" 
        class="flex items-center gap-3"
        :class="currentRoute === '/favorites' ? 'text-black' : 'text-gray-500 hover:text-black'"
      >
        <img src="/heart.svg" alt="Favorites" />
        <span>Закладки</span>
      </router-link>

      <router-link 
        to="/profile" 
        class="flex items-center gap-3 text-gray-500 hover:text-black"
      >
        <img src="/profile.svg" alt="Profile" />
        <span>Профиль</span>
      </router-link>
    </ul>
  </header>
</template>