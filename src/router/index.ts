import { createRouter, createWebHistory } from "vue-router";

// Layout
import Layout from "@/componentes/Layout";

// Guardas de rota
import PrivateRoute from "./PrivateRoute.tsx";
import PublicRoute from "./PublicRoute";

// Auth
import AuthLogin from "@/pages/AuthLogin";
import AuthRegister from "@/pages/AuthRegister";

// Pages
import Home from "@/pages/Home";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: PrivateRoute,
            children: [
                {
                    path: "",
                    component: Layout,
                    children: [
                        {
                            path: "",
                            name: "home",
                            component: Home,
                        },
                    ],
                },
            ],
        },

        {
            path: "/auth/login",
            component: PublicRoute,
            children: [{ path: "", name: "login", component: AuthLogin }],
        },
        {
            path: "/auth/register",
            component: PublicRoute,
            children: [{ path: "", name: "register", component: AuthRegister }],
        },
    ],
});
