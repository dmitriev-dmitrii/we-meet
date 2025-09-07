import HomeView from '../views/HomeView.vue'
import {ROUTER_NAMES} from "@/router/constants/routerNames.js";

export const routes = [
    {
        path: '/',
        name: ROUTER_NAMES.HOME,
        component: HomeView,
    },
    {
        path: '/:meetId',
        name: ROUTER_NAMES.MEET,
        meta: {},
        component: () => import('../views/MeetView.vue'),
    },
    {
        path: '/error',
        name: ROUTER_NAMES.ERROR,
        component: () => import('../views/ErrorView.vue'),
        props: () => {

            const {
                status,
                statusText,
                message,
                errorId
            } = history.state

            return {
                status,
                statusText,
                message,
                errorId
            }
        }
    },
]


