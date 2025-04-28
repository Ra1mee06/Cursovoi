<script setup>
const emit = defineEmits(['onClickRemove', 'onClickDelete', 'onClickAdd'])



defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number,
  quantity: Number
})
</script>

<template>
  <div class="flex items-center border border-slate-200 p-4 rounded-xl gap-4">
    <img class="w-16 h-16" :src="imageUrl" :alt="title" />

    <div class="flex flex-col flex-1">
      <p>{{ title }}</p>

      <div class="flex justify-between mt-2">
        <b class="flex-1">{{ price }} бун</b>
        <span v-if="quantity" class="mx-2">{{ quantity }} шт.</span>
        <img
          @click="$emit('onClickAdd')"
          class="opacity-40 hover:opacity-100 cursor-pointer transition"
          src="/plus.svg"
          alt="+"
        />
        <img
          @click="$emit('onClickDelete')"
          class="opacity-40 hover:opacity-100 cursor-pointer transition"
          src="/minus.svg"
          alt="-"
        />
        <img
          @click="$emit('onClickRemove')"
          class="opacity-40 hover:opacity-100 cursor-pointer transition"
          src="/trash.svg"
          alt="×"
        />
      </div>
    </div>
  </div>
</template>
