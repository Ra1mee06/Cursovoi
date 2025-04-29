<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'https://17b8e0fa574c3024.mokky.dev/users';

// Состояния
const isAuthenticated = ref(false);
const showLoginForm = ref(true);
const isLoading = ref(false);
const errorMessage = ref('');

// Данные форм
const loginForm = ref({
  email: '',
  password: ''
});

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

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

// Регистрация пользователя
const handleRegister = async () => {
  errorMessage.value = '';
  
  // Валидация
  if (!registerForm.value.name.trim()) {
    errorMessage.value = 'Введите имя';
    return;
  }
  
  if (!isValidEmail(registerForm.value.email)) {
    errorMessage.value = 'Введите корректный email';
    return;
  }

  if (registerForm.value.password.length < 6) {
    errorMessage.value = 'Пароль должен содержать минимум 6 символов';
    return;
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errorMessage.value = 'Пароли не совпадают';
    return;
  }

  isLoading.value = true;

  try {
    // Проверка существующего пользователя
    const emailToCheck = registerForm.value.email.toLowerCase().trim();
    const { data: existingUsers } = await axios.get(`${API_URL}?email=${encodeURIComponent(emailToCheck)}`);

    if (existingUsers.length > 0) {
      errorMessage.value = 'Пользователь с таким email уже существует';
      return;
    }

    // Создание нового пользователя
    const { data } = await axios.post(API_URL, {
      name: registerForm.value.name.trim(),
      email: emailToCheck,
      password: registerForm.value.password, // В реальном проекте нужно хешировать!
      favorites: [],
      cartItems: []
    });
    
    // Автоматический вход после регистрации
    userData.value = {
      id: data.id,
      name: data.name,
      email: data.email,
      favorites: data.favorites || [],
      cartItems: data.cartItems || []
    };
    
    isAuthenticated.value = true;
    localStorage.setItem('user', JSON.stringify(userData.value));
    
    // Очистка формы
    registerForm.value = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    
  } catch (error) {
    errorMessage.value = 'Ошибка регистрации. Попробуйте позже.';
    console.error('Registration error:', error);
  } finally {
    isLoading.value = false;
  }
};

// Вход пользователя
const handleLogin = async () => {
  errorMessage.value = '';
  
  // Валидация
  if (!isValidEmail(loginForm.value.email)) {
    errorMessage.value = 'Введите корректный email';
    return;
  }

  if (!loginForm.value.password) {
    errorMessage.value = 'Введите пароль';
    return;
  }

  isLoading.value = true;

  try {
    const emailToFind = loginForm.value.email.toLowerCase().trim();
    const { data: users } = await axios.get(`${API_URL}?email=${encodeURIComponent(emailToFind)}`);
    
    // Проверка существования пользователя
    if (!users || users.length === 0) {
      errorMessage.value = 'Пользователь с таким email не найден';
      return;
    }

    const user = users[0];
    
    // Проверка пароля (в реальном проекте нужно сравнивать хеши!)
    if (loginForm.value.password !== user.password) {
      errorMessage.value = 'Неверный пароль';
      return;
    }

    // Успешная авторизация
    userData.value = {
      id: user.id,
      name: user.name,
      email: user.email,
      favorites: user.favorites || [],
      cartItems: user.cartItems || []
    };
    
    isAuthenticated.value = true;
    localStorage.setItem('user', JSON.stringify(userData.value));
    
    // Очистка формы
    loginForm.value = {
      email: '',
      password: ''
    };
    
  } catch (error) {
    errorMessage.value = 'Ошибка входа. Попробуйте позже.';
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};

// Выход пользователя
const handleLogout = () => {
  isAuthenticated.value = false;
  userData.value = {
    name: '',
    email: '',
    favorites: [],
    cartItems: []
  };
  localStorage.removeItem('user');
};

// Проверка авторизации при загрузке
const checkAuth = () => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser?.email) {
        userData.value = parsedUser;
        isAuthenticated.value = true;
      }
    } catch (e) {
      localStorage.removeItem('user');
    }
  }
};

// Загрузка при монтировании
onMounted(checkAuth);
</script>

<template>
  <div class="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-md">
    <h2 class="text-3xl font-bold mb-8 text-center">Профиль</h2>
    
    <!-- Сообщение об ошибке -->
    <div 
      v-if="errorMessage" 
      class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
    >
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
            v-model="loginForm.email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Ваш email"
            @keyup.enter="handleLogin"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input 
            type="password" 
            v-model="loginForm.password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Ваш пароль"
            @keyup.enter="handleLogin"
          >
        </div>
        
        <button
          @click="handleLogin"
          :disabled="isLoading"
          class="w-full mt-4 py-3 bg-lime-500 text-white rounded-xl transition-all duration-300 hover:bg-lime-600 active:bg-lime-700 disabled:opacity-70"
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
            v-model="registerForm.name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Ваше имя"
            @keyup.enter="handleRegister"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            v-model="registerForm.email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Ваш email"
            @keyup.enter="handleRegister"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input 
            type="password" 
            v-model="registerForm.password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Придумайте пароль"
            @keyup.enter="handleRegister"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Подтвердите пароль</label>
          <input 
            type="password" 
            v-model="registerForm.confirmPassword"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
            placeholder="Повторите пароль"
            @keyup.enter="handleRegister"
          >
        </div>
        
        <button
          @click="handleRegister"
          :disabled="isLoading"
          class="w-full mt-4 py-3 bg-lime-500 text-white rounded-xl transition-all duration-300 hover:bg-lime-600 active:bg-lime-700 disabled:opacity-70"
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
        class="px-6 py-2 bg-red-500 text-white rounded-lg transition-all duration-300 hover:bg-red-600"
      >
        Выйти
      </button>
    </div>
  </div>
</template>