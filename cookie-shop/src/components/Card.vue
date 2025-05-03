<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  onClickFavorite: Function,
  onClickAdd: Function,
  onClickRemove: Function
})

const goToProduct = () => {
  router.push(`/product/${props.id}`)
}
</script>

<template>
  <div class="relative bg-white border border-slate-100 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl group">
    <div v-if="onClickRemove" class="absolute top-3 left-3 z-10">
      <button
        @click.stop="onClickRemove"
        class="p-2 bg-white rounded-full border border-slate-200 shadow-sm hover:bg-red-50 hover:border-red-200 transition-all duration-300"
      >
        <img src="/trash.svg" alt="Remove" class="w-5 h-5 opacity-80 hover:opacity-100" />
      </button>
    </div>

    <img
      v-if="onClickFavorite"
      :src="isFavorite ? '/like-2.svg' : '/like-1.svg'"
      class="absolute top-4 left-4 hover:scale-110 transition z-10"
      @click.stop="onClickFavorite"
      alt="Favorite"
    />

    <div class="relative overflow-hidden rounded-lg mb-4 h-48">
      <img 
        :src="imageUrl" 
        :alt="title"
        class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-3"
      />
      
      <button
        @click.stop="goToProduct"
        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:-translate-y-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-lime-500 text-white px-6 py-2 rounded-full whitespace-nowrap shadow-md hover:bg-lime-600"
      >
        Узнать больше
      </button>
    </div>

    <p class="mt-2 font-medium text-lg">{{ title }}</p>

    <div class="flex justify-between mt-3 items-center">
      <div class="flex flex-col">
        <span class="text-slate-400 text-sm">Цена:</span>
        <b class="text-lg">{{ price }} бун.</b>
      </div>

      <img
        v-if="onClickAdd"
        @click.stop="onClickAdd"
        :src="!isAdded ? '/plus.svg' : '/checked.svg'"
        alt="Add to cart"
        class="w-8 h-8 hover:scale-110 transition cursor-pointer"
      />
    </div>
  </div>
</template>

<style scoped>
.group:hover {
  transform: translateY(-5px);
}
</style>