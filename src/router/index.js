import HomeView from '../views/HomeView.vue'

export const routes = [
    {
        path: '/',
        name: 'HomeView',
        component: HomeView,
    },
    {
        path: '/meet/:meetId',
        name: 'MeetView',
        meta: {

        },
        component: () => import('../views/MeetView.vue'),
    },
    {
        path: '/error',
        name: 'ErrorView',
        component: () => import('../views/ErrorView.vue'),
    },
]


