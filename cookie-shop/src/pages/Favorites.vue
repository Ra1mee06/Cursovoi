<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CardList from '../components/CardList.vue'
import { useFavorites } from '../composables/useFavorites'

const { favorites, fetchFavorites, removeFavorite, clearAllFavorites } = useFavorites()

const removeFromFavorites = async (item) => {
  try {
    await removeFavorite(item.favoriteId);
    favorites.value = favorites.value.filter(fav => fav.id !== item.id);
  } catch (err) {
    console.error("Ошибка при удалении из избранного:", err);
  }
};




const clearFavorites = async () => {
  try {
    await clearAllFavorites();
    favorites.value = [];
  } catch (err) {
    console.error("Ошибка при очистке избранного:", err);
  }
};

onMounted(async () => {
  const data = await fetchFavorites();
  const favoritesList = data.flatMap(fav => {
    if (fav.item_id) {
      return { id: fav.item_id, favoriteId: fav.id };
    }
    return [];
  });

  if (favoritesList.length > 0) {
    const { data: itemsData } = await axios.get('https://17b8e0fa574c3024.mokky.dev/items');
    favorites.value = favoritesList.map(fav => {
      const fullItem = itemsData.find(item => item.id === fav.id);
      return fullItem ? { ...fullItem, favoriteId: fav.favoriteId } : null;
    }).filter(Boolean);
  }
});
</script>

<template>
  <div class="flex justify-between items-center mb-8">
    <h2 class="text-3xl font-bold">Мои закладки</h2>
    <button
      @click="clearFavorites"
      class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="favorites.length === 0"
    >
      Очистить всё
    </button>
  </div>

  <CardList 
    :items="favorites" 
    is-favorites 
    @remove-from-favorites="removeFromFavorites"
  />
</template>