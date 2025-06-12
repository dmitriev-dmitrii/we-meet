import HomeView from '../views/HomeView.vue'

export const routes = [
        {
            path: '/',
            name: 'HomeView',
            component: HomeView,
        },
        {
            path: '/meet',
            name: 'MeetView',
            component: () => import('../views/MeetView.vue'),
        },
    ]


