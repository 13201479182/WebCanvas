const menus = [
    {
        path: '/demo',
        component: () => import('@/components/Demo.vue'),
        meta: {
            name: 'demo',
        },
    },
];

export default menus;
