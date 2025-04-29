<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { inject } from 'vue'
import CardList from '../components/CardList.vue'

const { cart, addToCart, removeFromCart } = inject('cart')

const items = ref([])

const filters = reactive({
  sortBy: 'title',
  searchQuery: ''
})

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeSearchInput = debounce((event) => {
  filters.searchQuery = event.target.value
}, 300)

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const { data } = await axios.post('https://17b8e0fa574c3024.mokky.dev/favorites', {
        item_id: item.id
      });
      
      item.isFavorite = true;
      item.favoriteId = data.id;
    } else {
      await axios.delete(`https://17b8e0fa574c3024.mokky.dev/favorites/${item.favoriteId}`);
      item.isFavorite = false;
      item.favoriteId = null;
    }
    
    await fetchFavorites();
  } catch (err) {
    console.error("Ошибка при обновлении избранного:", err);
  }
};

const fetchFavorites = async () => {
  try {
    const { data } = await axios.get('https://17b8e0fa574c3024.mokky.dev/favorites');
    
    items.value = items.value.map(item => {
      const favorite = data.find(fav => fav.item_id === item.id);
      return {
        ...item,
        isFavorite: !!favorite,
        favoriteId: favorite?.id || null
      };
    });
  } catch (err) {
    console.error("Ошибка загрузки избранного:", err);
  }
};
const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy
    };

    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`;
    }

    const { data } = await axios.get('https://17b8e0fa574c3024.mokky.dev/items', { params });
    
    console.log("Получены товары:", data); 
    
    if (!Array.isArray(data)) {
      throw new Error("Некорректный формат данных");
    }

    items.value = data.map(obj => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false
    }));

    await fetchFavorites();
  } catch (err) {
    console.error("Ошибка загрузки товаров:", err);
    items.value = [];
  }
};

onMounted(async () => {
  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []
  
  cart.value = cart.value.map(item => ({
    ...item,
    quantity: item.quantity || 1
  }))

  await fetchItems()
  await fetchFavorites()
})

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
}, { deep: true })

watch(filters, fetchItems)
</script>

<template>
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-bold mb-8">Все изделия</h2>

    <div class="flex gap-4">
      <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none">
        <option value="name">По названию</option>
        <option value="price">По цене (дешевые)</option>
        <option value="-price">По цене (дорогие)</option>
      </select>

      <div class="relative">
        <img class="absolute left-4 top-3" src="/search.svg" />
        <input
          @input="onChangeSearchInput"
          class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
          type="text"
          placeholder="Поиск..."
        />
      </div>
    </div>
  </div>

  <div class="mt-10">
    <CardList :items="items" @add-to-favorite="addToFavorite" @add-to-cart="onClickAddPlus"></CardList>
  </div>
</template>
