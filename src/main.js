import Vue from 'vue';
import App from './App.vue';
import router from './router';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from 'axios';

Vue.use(ElementUI);

// 配置axios
Vue.prototype.$axios = axios;
// 配置公共的url
axios.defaults.baseURL = 'http://127.0.0.1:8081';

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

router.beforeEach((to, from, next) => {
    if (to.meta.auth) {
        if (localStorage.getItem('user')) {
            next();
        } else {
            alert("请先登陆！");
            next(false);
        }
    } else {
        next();
    }
});