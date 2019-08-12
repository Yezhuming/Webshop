import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import ShopCart from './views/ShopCart.vue';
import Login from './views/Login.vue';
import Collect from './views/Collect.vue';
import Order from './views/Order.vue';
import Introduce from './views/Introduce.vue';
import Admin from './views/Admin.vue';
import AdminOrder from './views/AdminOrder.vue';
import User from './views/User.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/shopCart',
            name: 'shopCart',
            meta: {
                auth: true
            },
            component: ShopCart
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/collect',
            name: 'collect',
            meta: {
                auth: true
            },
            component: Collect
        },
        {
            path: '/order',
            name: 'order',
            meta: {
                auth: true
            },
            component: Order
        },
        {
            path: '/introduce',
            name: 'introduce',
            meta: {
                auth: true
            },
            component: Introduce
        },
        {
            path: '/admin',
            name: 'admin',
            component: Admin
        },
        {
            path: '/adminOrder',
            name: 'adminOrder',
            component: AdminOrder
        },
        {
            path: '/user',
            name: 'user',
            component: User
        }
    ]
});
