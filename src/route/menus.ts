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
    {
        path: '/draw-triangle',
        component: () => import('@/components/DrawTriangle.vue'),
        meta: {
            name: 'Triangle',
        },
    },
];

export default menus;
