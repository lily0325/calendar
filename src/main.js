import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';
import { createApp } from 'vue'
import App from './App.vue'
// import router from './router'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');


const app = createApp(App)

// app.use(router)
app.use(Antd)

app.mount('#app')
