const menus = [
    {
        path: '/draw-point',
        component: () => import('@/components/DrawPoint.vue'),
        meta: {
            name: 'Point',
        },
    },
    {
        path: '/draw-line',
        component: () => import('@/components/DrawLine.vue'),
        meta: {
            name: 'Line',
        },
    },
];

export default menus;
