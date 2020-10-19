import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '../static/css/icon.css';
import "babel-polyfill";
import api from '@/api/api.js'
import qs from 'qs'
import axios from 'axios'
import mgui from '@/utils/mgui'
import  VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'

Vue.use(ElementUI, { size: 'small' });
Vue.use(VueQuillEditor)
Vue.prototype.$api = api
Vue.prototype.$qs = qs
Vue.prototype.$axios = axios
Vue.prototype.$mgui = mgui

// 本地环境开启mock
// if(process.env.NODE_ENV == 'development'){
//   require('@/mock/index.js')
// }

// 简单的登录超时登出控制，真要做好需要后端配合，现在后端是到时间一定超时，调接口没有刷新会话，正确做法是需要刷新会话session
// let timer = null;
// window.addEventListener('click',()=>{
//     if(timer){
//         clearTimeout(timer);
//         timer = setTimeout(()=>{
//         }, 60000)
//         return
//     }
//     api.onReTableList({pageNo: 1,type: 19,pageSize: 50})
//     // 定时5分钟
//     timer = setTimeout(()=>{
//     }, 60000)
// })
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');