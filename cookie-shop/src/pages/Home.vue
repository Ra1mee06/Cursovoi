<script setup lang="ts">
import { reactive, watch, ref, onMounted } from 'vue'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { inject } from 'vue'
import CardList from '../components/CardList.vue'
import { useFavorites } from '../composables/useFavorites'
import { useSuggestions } from '@/composables/useSuggestions';
import ProductModal from '@/components/ProductModal.vue'

const selectedProduct = ref(null)
const showModal = ref(false)

const openProduct = (product) => {
  selectedProduct.value = product
  showModal.value = true
}

const { cart, addToCart, removeFromCart } = inject('cart')

const { fetchFavorites, toggleFavorite } = useFavorites()

const showSuggestionForm = ref(false);
const isLoading = ref(false);
const isSubmitted = ref(false);
const suggestion = ref({
  author: '',
  productName: '',
  description: ''
});

const isValid = () => {
  return suggestion.value.author.trim() && 
         suggestion.value.productName.trim() && 
         suggestion.value.description.trim();
};

const openForm = () => {
  isSubmitted.value = false;
  suggestion.value = { author: '', productName: '', description: '' };
  showSuggestionForm.value = true;
};

const closeForm = () => {
  showSuggestionForm.value = false;
};

const submitForm = async () => {
  if (!isValid()) return;
  
  isLoading.value = true;
  try {
    await axios.post('https://17b8e0fa574c3024.mokky.dev/suggestions', {
      author: suggestion.value.author,
      product_name: suggestion.value.productName,
      description: suggestion.value.description,
      date: new Date().toISOString()
    });
    isSubmitted.value = true;
  } catch (error) {
    alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
    console.error('Ошибка отправки:', error);
  } finally {
    isLoading.value = false;
  }
};

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
  await toggleFavorite(item);
  await updateItemsFavoritesStatus();
};

const updateItemsFavoritesStatus = async () => {
  const favoritesData = await fetchFavorites();
  items.value = items.value.map(item => {
    const favorite = favoritesData.find(fav => fav.item_id === item.id);
    return {
      ...item,
      isFavorite: !!favorite,
      favoriteId: favorite?.id || null
    };
  });
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
    
    items.value = data.map(obj => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false
    }));

    await updateItemsFavoritesStatus();
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
    <CardList 
      :items="items"
      @add-to-favorite="addToFavorite"
      @add-to-cart="onClickAddPlus"
      @product-click="openProduct"
    />

    <ProductModal 
      v-if="showModal"
      :product="selectedProduct"
      @close="showModal = false"
    />
  </div>

  <div class="w-full flex justify-center mt-8 mb-12"> 
    <button 
      @click="openForm"
      class="px-6 py-3 bg-indigo-500 text-white rounded-xl transition-all duration-300 
             hover:-translate-y-1 hover:shadow-lg hover:bg-indigo-600 focus:outline-none
             transform mx-auto" 
    >
      Предложить товар
    </button>
  </div>


  <transition name="modal-fade">
    <div 
      v-if="showSuggestionForm" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <transition name="modal-content">
        <div 
          v-if="showSuggestionForm"
          class="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl"
        >
          <div v-if="!isSubmitted">
            <h3 class="text-2xl font-bold mb-6 text-center text-gray-800">Ваше предложение</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label>
                <input 
                  v-model="suggestion.author"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Как к вам обращаться?"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Название товара</label>
                <input 
                  v-model="suggestion.productName"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Какой товар предлагаете?"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea 
                  v-model="suggestion.description"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32"
                  placeholder="Опишите товар или ваше предложение"
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-4 mt-8">
              <button 
                @click="closeForm"
                class="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Отмена
              </button>
              <button 
                @click="submitForm"
                :disabled="!isValid() || isLoading"
                class="px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <span v-if="!isLoading">Отправить</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Отправка...
                </span>
              </button>
            </div>
          </div>

          <div v-else class="text-center py-6">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Спасибо за ваше предложение!</h3>
            <p class="text-gray-600 mb-6">Мы обязательно рассмотрим его в ближайшее время.</p>
            <button 
              @click="closeForm"
              class="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 
                     transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg mx-auto"
            >
              Закрыть форму
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>

</template>

