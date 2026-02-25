import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Tickets from '../views/Tickets.vue';
// Placeholder views
const Team = { template: '<div class="p-8"><h1>Equipe (Em Construção)</h1></div>' };
const Settings = { template: '<div class="p-8"><h1>Configurações (Em Construção)</h1></div>' };

const routes = [
    { path: '/', component: Dashboard },
    { path: '/tickets', component: Tickets },
    { path: '/tickets/new', component: () => import('../views/NewTicket.vue') },
    { path: '/team', component: Team },
    { path: '/settings', component: Settings },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
