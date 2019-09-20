import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'


// require styles
import 'element-ui/lib/theme-chalk/index.css'


// axios http request
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router.js'
import Clipboard from 'v-clipboard'

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.use(Clipboard)


Vue.prototype.$qs = require('querystring')

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
