import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

// axios http request
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VueAxios, axios)

Vue.prototype.$qs = require('querystring')

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
