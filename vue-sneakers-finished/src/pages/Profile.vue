<template>
  <div class="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-md">
    <h2 class="text-3xl font-bold mb-8 text-center">Профиль</h2>
    
    <!-- Сообщение об ошибке -->
    <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
      {{ errorMessage }}
    </div>
    
    <!-- Форма входа -->
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
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input 
            type="password" 
            v-model="loginPassword"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Ваш пароль"
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
      
      <!-- Форма регистрации -->
      <div class="space-y-4" v-else>
        <h3 class="text-xl font-semibold text-center">Регистрация</h3>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
          <input 
            type="text" 
            v-model="registerName"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Ваше имя"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            v-model="registerEmail"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Ваш email"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input 
            type="password" 
            v-model="registerPassword"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Придумайте пароль"
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
    
    <!-- Профиль пользователя -->
    <div v-else class="text-center">
      <div class="mb-6">
        <div class="w-20 h-20 bg-lime-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <span class="text-2xl font-bold text-lime-600">{{ userInitials }}</span>
        </div>
        <h3 class="text-xl font-semibold">{{ userData.name }}</h3>
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

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'https://17b8e0fa574c3024.mokky.dev/users'; // Замените на реальный URL

// Состояния
const isAuthenticated = ref(false);
const showLoginForm = ref(true);
const isLoading = ref(false);
const errorMessage = ref('');

// Данные форм
const loginEmail = ref('');
const loginPassword = ref('');
const registerName = ref('');
const registerEmail = ref('');
const registerPassword = ref('');

// Данные пользователя
const userData = ref({
  name: '',
  email: '',
  favorites: [],
  cartItems: []
});

// Инициалы для аватара
const userInitials = computed(() => {
  if (!userData.value.name) return '?';
  return userData.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
});

// Валидация email
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Регистрация
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
    // Проверка существующего пользователя
    const { data: users } = await axios.get(API_URL, {
      params: { email: registerEmail.value.toLowerCase().trim() }
    });

    if (users.length > 0) {
      errorMessage.value = 'Пользователь с таким email уже существует';
      return;
    }

    // Создание нового пользователя
    const newUser = {
      name: registerName.value.trim(),
      email: registerEmail.value.toLowerCase().trim(),
      password: registerPassword.value,
      createdAt: new Date().toISOString(),
      favorites: [],
      cartItems: []
    };

    const { data } = await axios.post(API_URL, newUser);
    
    // Сохраняем данные пользователя (без пароля)
    userData.value = {
      id: data.id,
      name: data.name,
      email: data.email,
      favorites: data.favorites || [],
      cartItems: data.cartItems || []
    };
    
    isAuthenticated.value = true;
    localStorage.setItem('user', JSON.stringify(userData.value));
    
    // Очищаем форму
    registerName.value = '';
    registerEmail.value = '';
    registerPassword.value = '';
    
  } catch (error) {
    errorMessage.value = 'Ошибка регистрации. Попробуйте позже.';
    console.error('Registration error:', error);
  } finally {
    isLoading.value = false;
  }
};

// Вход
const handleLogin = async () => {
  errorMessage.value = '';
  
  if (!isValidEmail(loginEmail.value)) {
    errorMessage.value = 'Введите корректный email';
    return;
  }

  isLoading.value = true;

  try {
    // Ищем пользователя по email
    const { data: users } = await axios.get(API_URL, {
      params: { email: loginEmail.value.toLowerCase().trim() }
    });

    if (users.length === 0) {
      errorMessage.value = 'Пользователь с таким email не найден';
      return;
    }

    const user = users[0];
    
    // Проверяем пароль
    if (user.password !== loginPassword.value) {
      errorMessage.value = 'Неверный пароль';
      return;
    }

    // Сохраняем данные пользователя (без пароля)
    userData.value = {
      id: user.id,
      name: user.name,
      email: user.email,
      favorites: user.favorites || [],
      cartItems: user.cartItems || []
    };
    
    isAuthenticated.value = true;
    localStorage.setItem('user', JSON.stringify(userData.value));
    
    // Очищаем форму
    loginEmail.value = '';
    loginPassword.value = '';
    
  } catch (error) {
    errorMessage.value = 'Ошибка входа. Попробуйте позже.';
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};

// Выход
const handleLogout = () => {
  isAuthenticated.value = false;
  userData.value = {
    name: '',
    email: '',
    favorites: [],
    cartItems: []
  };
  localStorage.removeItem('user');
  showLoginForm.value = true;
};

// Проверка авторизации при загрузке
const checkAuth = () => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser && parsedUser.email) {
        userData.value = parsedUser;
        isAuthenticated.value = true;
      }
    } catch (e) {
      localStorage.removeItem('user');
    }
  }
};

// Проверяем авторизацию при загрузке компонента
onMounted(checkAuth);
</script>