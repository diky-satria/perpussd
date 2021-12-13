import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/style.css'
// const Vue = window.vue;

//bootstrap
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

//datatable
import 'datatables.net-bs4'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css'

//vue loading overlay
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'

axios.interceptors.request.use((config) => {
    config.baseURL = 'http://localhost:8000'
    config.withCredentials = true
    return config
})

store.dispatch('auth/me').then(() => {
    createApp(App).use(store).use(router).mount('#app')
})
