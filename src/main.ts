import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/main.css'
// import VueNativeSock from 'vue-native-websocket-vue3'
import { EthosConnectPlugin, type EthosConfiguration } from "ethos-connect-vue"

const app = createApp(App)
const config: EthosConfiguration = {
  apiKey: "Scale-Web"
}

app
.use(EthosConnectPlugin, config)
.use(router)
.use(store)
.mount("#app")

// app.use(
//   VueNativeSock, 
//   `wss://dev-api.scale.exchange/ws?account=0xb557b6ad553d627bc27f8323a9935876526a6947`,
//   {
//     store: store, // 启用vuex集成
//     format: 'json', // 数据发送 / 接收使用 json
//     connectManually: true, // 开启手动调用 connect() 连接服务器
//     reconnection: false //  关闭自动重连
//   }
// )

export default app