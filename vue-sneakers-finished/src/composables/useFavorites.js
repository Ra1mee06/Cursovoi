import { ref } from 'vue';
import axios from 'axios';

export function useFavorites() {
  const favorites = ref([]);

  const fetchFavorites = async () => {
    try {
      const { data } = await axios.get('https://17b8e0fa574c3024.mokky.dev/favorites');
      return data;
    } catch (err) {
      console.error("Ошибка загрузки избранного:", err);
      return [];
    }
  };

  const toggleFavorite = async (item) => {
    try {
      if (!item.isFavorite) {
        const { data } = await axios.post('https://17b8e0fa574c3024.mokky.dev/favorites', {
          item_id: item.id
        });
        item.isFavorite = true;
        item.favoriteId = data.id;
      } else {
        await removeFavorite(item.favoriteId);
        item.isFavorite = false;
        item.favoriteId = null;
      }
    } catch (err) {
      console.error("Ошибка при обновлении избранного:", err);
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      await axios.delete(`https://17b8e0fa574c3024.mokky.dev/favorites/${favoriteId}`);
    } catch (err) {
      console.error("Ошибка при удалении из избранного:", err);
      throw err;
    }
  };

  const clearAllFavorites = async () => {
    try {
      const favoritesData = await fetchFavorites();
      await Promise.all(favoritesData.map(fav => 
        axios.delete(`https://17b8e0fa574c3024.mokky.dev/favorites/${fav.id}`)
      ));
      favorites.value = [];
    } catch (err) {
      console.error("Ошибка при очистке избранного:", err);
      throw err;
    }
  };

  const addToFavorites = async (item) => {
    if (!userData.value) return;
    
    try {
      await axios.patch(`${API_URL}/${userData.value.id}`, {
        favorites: [...userData.value.favorites, item.id]
      });
    } catch (error) {
      console.error("Ошибка добавления в избранное:", error);
    }
  };

  return {
    favorites,
    fetchFavorites,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites
  };
}