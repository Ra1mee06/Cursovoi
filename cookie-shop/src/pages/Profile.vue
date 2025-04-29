<script setup>
import { ref, computed, onMounted } from 'vue';

const API_REGISTER = 'https://17b8e0fa574c3024.mokky.dev/register';
const API_AUTH = 'https://17b8e0fa574c3024.mokky.dev/auth';

const isAuthenticated = ref(false);
const showLoginForm = ref(true);
const isLoading = ref(false);
const errorMessage = ref('');

const loginEmail = ref('');
const loginPassword = ref('');
const registerName = ref('');
const registerEmail = ref('');
const registerPassword = ref('');

const userData = ref({
  fullName: '',
  email: '',
  favorites: [],
  cartItems: []
});

const userInitials = computed(() => {
  if (!userData.value.fullName) return '?';
  return userData.value.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
});

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleRegister = async () => {
  errorMessage.value = '';
  
  if (!registerName.value.trim()) {
    errorMessage.value = 'Введите имя';
    return;
  }
  
  if (!isValidEmail(registerEmail.value)) {
    errorMessage.value = 'Введите корректный email';
    return;
  }

  if (registerPassword.value.length < 6) {
    errorMessage.value = 'Пароль должен содержать минимум 6 символов';
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch(API_REGISTER, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName: registerName.value.trim(),
        email: registerEmail.value.toLowerCase().trim(),
        password: registerPassword.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка регистрации');
    }

    userData.value = {
      ...data.data,
      favorites: [],
      cartItems: []
    };
    
    isAuthenticated.value = true;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData.value));
    
    registerName.value = '';
    registerEmail.value = '';
    registerPassword.value = '';
    
  } catch (error) {
    errorMessage.value = error.message || 'Ошибка регистрации. Попробуйте позже.';
    console.error('Registration error:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleLogin = async () => {
  errorMessage.value = '';
  
  if (!isValidEmail(loginEmail.value)) {
    errorMessage.value = 'Введите корректный email';
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch(API_AUTH, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: loginEmail.value.toLowerCase().trim(),
        password: loginPassword.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка входа');
    }

    userData.value = {
      ...data.data,
      favorites: [],
      cartItems: []
    };
    
    isAuthenticated.value = true;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData.value));
    
    loginEmail.value = '';
    loginPassword.value = '';
    
  } catch (error) {
    errorMessage.value = error.message || 'Неверный email или пароль';
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = () => {
  isAuthenticated.value = false;
  userData.value = {
    fullName: '',
    email: '',
    favorites: [],
    cartItems: []
  };
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showLoginForm.value = true;
};

const checkAuth = () => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  if (token && savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser?.email) {
        userData.value = parsedUser;
        isAuthenticated.value = true;
      }
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};

onMounted(checkAuth);
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-md">
    <h2 class="text-3xl font-bold mb-8 text-center">Профиль</h2>
    
    <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
      {{ errorMessage }}
    </div>
    
    <div v-if="!isAuthenticated">
      <div class="space-y-4" v-if="showLoginForm">
        <h3 class="text-xl font-semibold text-center">Вход в аккаунт</h3>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            v-model="loginEmail"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Ваш email"
            @keyup.enter="handleLogin"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input 
            type="password" 
            v-model="loginPassword"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Ваш пароль"
            @keyup.enter="handleLogin"
          >
        </div>
        
        <button
          @click="handleLogin"
          :disabled="isLoading"
          class="w-full mt-4 py-3 bg-lime-500 text-white rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:bg-lime-600 active:bg-lime-700 active:scale-95 disabled:opacity-70"
        >
          <span v-if="!isLoading">Войти</span>
          <span v-else>Вход...</span>
        </button>
        
        <p class="text-center text-sm text-gray-500 mt-2">
          Нет аккаунта? 
          <button 
            @click="showLoginForm = false"
            class="text-lime-600 hover:text-lime-800 font-medium transition-colors"
          >
            Зарегистрироваться
          </button>
        </p>
      </div>
      
      <div class="space-y-4" v-else>
        <h3 class="text-xl font-semibold text-center">Регистрация</h3>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
          <input 
            type="text" 
            v-model="registerName"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Ваше имя"
            @keyup.enter="handleRegister"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            v-model="registerEmail"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Ваш email"
            @keyup.enter="handleRegister"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input 
            type="password" 
            v-model="registerPassword"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Придумайте пароль"
            @keyup.enter="handleRegister"
          >
        </div>
        
        <button
          @click="handleRegister"
          :disabled="isLoading"
          class="w-full mt-4 py-3 bg-lime-500 text-white rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:bg-lime-600 active:bg-lime-700 active:scale-95 disabled:opacity-70"
        >
          <span v-if="!isLoading">Зарегистрироваться</span>
          <span v-else>Регистрация...</span>
        </button>
        
        <p class="text-center text-sm text-gray-500 mt-2">
          Уже есть аккаунт? 
          <button 
            @click="showLoginForm = true"
            class="text-lime-600 hover:text-lime-800 font-medium transition-colors"
          >
            Войти
          </button>
        </p>
      </div>
    </div>
    
    <div v-else class="text-center">
      <div class="mb-6">
        <div class="w-20 h-20 bg-lime-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <span class="text-2xl font-bold text-lime-600">{{ userInitials }}</span>
        </div>
        <h3 class="text-xl font-semibold">{{ userData.fullName }}</h3>
        <p class="text-gray-500">{{ userData.email }}</p>
      </div>
      
      <button
        @click="handleLogout"
        class="px-6 py-2 bg-red-500 text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:bg-red-600 active:bg-red-700 active:scale-95"
      >
        Выйти
      </button>
    </div>
  </div>
</template>
