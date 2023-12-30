import { createRouter, createWebHashHistory } from 'vue-router';

import menus from './menus';

const routes = [
    {
        path: '/',
        component: () => import('@/layout/Menu.vue'),
        children: menus,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
