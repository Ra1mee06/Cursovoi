<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const product = ref(null)

onMounted(async () => {
  try {
    const { data } = await axios.get(`https://17b8e0fa574c3024.mokky.dev/items/${route.params.id}`)
    product.value = data
  } catch (error) {
    console.error('Ошибка загрузки товара:', error)
  }
})
</script>

<template>
  <div v-if="product" class="product-page p-8 max-w-4xl mx-auto">
    <div class="grid md:grid-cols-2 gap-8">
      <div>
        <img :src="product.imageUrl" :alt="product.title" class="w-full rounded-lg">
      </div>
      <div>
        <h1 class="text-3xl font-bold mb-4">{{ product.title }}</h1>
        <p class="text-2xl font-semibold text-lime-600 mb-6">{{ product.price }} бун</p>
        <p class="text-gray-700 mb-8">{{ product.description || 'Описание товара' }}</p>
        <button 
          class="bg-lime-500 text-white px-6 py-3 rounded-xl hover:bg-lime-600 transition"
          @click="$router.back()"
        >
          Назад
        </button>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12">
    Загрузка товара...
  </div>
</template>