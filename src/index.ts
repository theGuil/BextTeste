import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import './index.css'

const { worker } = await import('./mocks/browser')
await worker.start({
    serviceWorker: {
        url: '/mockServiceWorker.js',
    },
    onUnhandledRequest: 'bypass',
})

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#root')
