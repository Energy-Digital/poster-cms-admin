import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

// axios http request
import axios from 'axios'
import VueAxios from 'vue-axios'

import router from './router.js'

Vue.use(ElementUI)
Vue.use(VueAxios, axios)

Vue.prototype.$qs = require('querystring')

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
