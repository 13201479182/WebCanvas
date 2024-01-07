const menus = [
    {
        path: '/draw-point',
        component: () => import('@/components/DrawPoint.vue'),
        meta: {
            name: 'Point',
        },
    },
];

export default menus;
