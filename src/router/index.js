import { createRouter, createWebHistory } from "vue-router";
import myRoutes from "./autoSetOption";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: () => import("../layout/Home.vue"),
        },
        {
            path: "/index",
            component: () => import("../views/admin/index.vue"),
        },
        ...myRoutes,
    ],
});

export default router;
