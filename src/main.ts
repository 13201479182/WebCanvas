import { createApp } from 'vue';
import App from './App.vue';
import router from './route';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

createApp(App).use(ElementPlus).use(router).mount('#app');
