import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import ElementUI from 'element-ui'
import App from './App.vue'



// require styles
import 'element-ui/lib/theme-chalk/index.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, /* { default global options } */)

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
