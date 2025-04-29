<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import CardList from '../components/CardList.vue'

const favorites = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get('https://17b8e0fa574c3024.mokky.dev/favorites');
    
    const favoritesList = data.flatMap(fav => {
      const itemsFromObject = Object.values(fav)
        .filter(val => typeof val === 'object' && val.id && val.title)
        .map(item => ({ ...item, favoriteId: fav.id }));
      
      if (fav.item_id) {
        return { id: fav.item_id, favoriteId: fav.id };
      }
      
      return itemsFromObject;
    });

    const itemsWithIds = favoritesList.filter(f => typeof f === 'object' && !f.title);
    if (itemsWithIds.length > 0) {
      const { data: itemsData } = await axios.get('https://17b8e0fa574c3024.mokky.dev/items');
      favorites.value = favoritesList.map(fav => {
        if (fav.title) return fav;
        const fullItem = itemsData.find(item => item.id === fav.id);
        return fullItem ? { ...fullItem, favoriteId: fav.favoriteId } : null;
      }).filter(Boolean);
    } else {
      favorites.value = favoritesList;
    }
  } catch (err) {
    console.error("Ошибка загрузки избранного:", err);
  }
});
</script>

<template>
  <h2 class="text-3xl font-bold mb-8">Мои закладки</h2>

  <CardList :items="favorites" is-favorites />
</template>