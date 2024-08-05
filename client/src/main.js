import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import App from './App.vue'

import Toast from 'vue-toastification';
import { toastOptions } from './toast.js'
import 'vue-toastification/dist/index.css';

import router from './router';

createApp(App).use(router).use(createPinia()).use(Toast, toastOptions).mount('#app')
