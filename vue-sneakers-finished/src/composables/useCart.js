import { ref, computed, watch, provide } from 'vue';

export function useCart() {
  const cart = ref([]);
  const drawerOpen = ref(false);

  const totalPrice = computed(() => 
    cart.value.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
  );

  const vatPrice = computed(() => 
    Math.round((totalPrice.value * 5) / 100)
  );

  const closeDrawer = () => {
    drawerOpen.value = false;
  };

  const openDrawer = () => {
    drawerOpen.value = true;
  };

  const addToCart = (item) => {
    item.isAdded = true;
    const existingItem = cart.value.find(i => i.id === item.id);
    if (!existingItem) {
      cart.value.push({ 
        ...item, 
        quantity: 1,  
      });
    }
  };

  const addToCartItem = (item) => {
    const existingItem = cart.value.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.value.push({ 
        ...item, 
        quantity: 1  
      });
    }
  };

  const removeFromCart = (item) => {
    item.isAdded = false;
    const index = cart.value.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      cart.value.splice(index, 1);
    }
  };

  const increaseQuantity = (item) => {
    const existingItem = cart.value.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    }
  };

  const decreaseQuantity = (item) => {
    const existingItem = cart.value.find(i => i.id === item.id);
    if (existingItem && existingItem.quantity > 1) {
      existingItem.quantity -= 1;
    }
  };

  watch(cart, (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
  }, { deep: true });

  // Предоставляем данные и методы для дочерних компонентов
  provide('cart', {
    cart,
    totalPrice,
    closeDrawer,
    openDrawer,
    addToCart,
    addToCartItem,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  });

  return {
    cart,
    drawerOpen,
    totalPrice,
    vatPrice,
    closeDrawer,
    openDrawer,
    addToCart,
    addToCartItem,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  };
}