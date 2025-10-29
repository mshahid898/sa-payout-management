/**
 * Application Entry Point
 * 
 * Initializes and mounts the Vue 3 application with:
 * - Vue Router for client-side routing
 * - Element Plus UI component library
 * - Global styles
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// Create Vue application instance
const app = createApp(App)

// Register plugins
app.use(ElementPlus) // UI component library
app.use(router)      // Vue Router for navigation

// Mount the application to the DOM
app.mount('#app')
