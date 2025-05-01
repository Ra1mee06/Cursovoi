import { ref } from 'vue';
import axios from 'axios';

interface FavoriteItem {
  id: number;
  item_id: number;
  [key: string]: any;
}

interface UserItem {
  id: number;
  isFavorite?: boolean;
  favoriteId?: number | null;
  [key: string]: any;
}

export function useFavorites() {
  const favorites = ref<FavoriteItem[]>([]);

  const fetchFavorites = async (): Promise<FavoriteItem[]> => {
    try {
      const { data } = await axios.get('https://17b8e0fa574c3024.mokky.dev/favorites');
      return data;
    } catch (err) {
      console.error("Ошибка загрузки избранного:", err);
      return [];
    }
  };

  const toggleFavorite = async (item: UserItem) => {
    try {
      if (!item.isFavorite) {
        const { data } = await axios.post('https://17b8e0fa574c3024.mokky.dev/favorites', {
          item_id: item.id
        });
        item.isFavorite = true;
        item.favoriteId = data.id;
      } else {
        await removeFavorite(item.favoriteId as number);
        item.isFavorite = false;
        item.favoriteId = null;
      }
    } catch (err) {
      console.error("Ошибка при обновлении избранного:", err);
    }
  };

  const removeFavorite = async (favoriteId: number) => {
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

  const addToFavorites = async (item: UserItem) => {
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
    clearAllFavorites,
    addToFavorites
  };
}

declare const userData: { value: { id: number; favorites: number[] } };
declare const API_URL: string;