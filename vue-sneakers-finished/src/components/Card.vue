<script setup>
defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  onClickFavorite: Function,
  onClickAdd: Function,
  onClickRemove: Function,
  quantity: Number
})
</script>

<template>
  <div
    class="relative bg-white border border-slate-100 rounded-3xl p-8 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl"
  >
  <div v-if="onClickRemove" class="absolute top-3 left-3">
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
      class="absolute top-8 left-8 hover:scale-110 transition"
      @click.stop="onClickFavorite"
      alt="Favorite"
    />

    <img :src="imageUrl" alt="Cookie" class="max-w-full max-h-full object-contain p-4" />

    <p class="mt-2">{{ title }}</p>

    <div class="flex justify-between mt-5">
      <div class="flex flex-col">
        <span class="text-slate-400">Цена:</span>
        <b>{{ price }} бун.</b>
      </div>

      <img
        v-if="onClickAdd"
        @click="onClickAdd"
        :src="!isAdded ? '/plus.svg' : '/checked.svg'"
        alt="Plus"
        class="hover:scale-110 transition"
      />
    </div>
  </div>
</template>