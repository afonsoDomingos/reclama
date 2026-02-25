import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import Dashboard from '../views/Dashboard.vue';
import Tickets from '../views/Tickets.vue';
import Login from '../views/Login.vue';

// Axios global config
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Placeholder views
const Team = { template: '<div class="p-8"><h1>Equipe (Em Construção)</h1></div>' };
const Settings = { template: '<div class="p-8"><h1>Configurações (Em Construção)</h1></div>' };

const routes = [
    {
        path: '/',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/tickets',
        component: Tickets,
        meta: { requiresAuth: true }
    },
    {
        path: '/tickets/new',
        component: () => import('../views/NewTicket.vue')
        // New tickets usually come from public ingestion, 
        // but if this is the INTERNAL view, it might need auth.
        // For now, keeping it consistent with the Dashboard.
        , meta: { requiresAuth: true }
    },
    {
        path: '/team',
        component: Team,
        meta: { requiresAuth: true }
    },
    {
        path: '/settings',
        component: Settings,
        meta: { requiresAuth: true }
    },
    { path: '/login', component: Login, meta: { guest: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (to.meta.guest && isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;
