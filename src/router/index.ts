import { createRouter, createWebHistory } from "vue-router";

// Layout
import Layout from "@/componentes/Layout";

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
            component: Layout,
            children: [
                {
                    path: "",
                    name: "home",
                    component: Home,
                },
            ],
        },

        {
            path: "/login",
            name: "login",
            component: AuthLogin,
        },
        {
            path: "/register",
            name: "register",
            component: AuthRegister,
        },
    ],
});
