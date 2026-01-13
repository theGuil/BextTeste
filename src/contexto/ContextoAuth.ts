import { defineStore } from "pinia";
import { produce } from "immer";
import T from "@/types";

type User = Omit<T.Auth.User, "senha">;

interface AuthState {
    user: User | null;
    token: string | null;
    logado: boolean;
    loadingLogin: boolean;
    loadingRegister: boolean;
}

const criarEstadoInicial = (): AuthState => ({
    user: null,
    token: null,
    logado: false,
    loadingLogin: false,
    loadingRegister: false,
});

const useAuthStore = defineStore("auth", {
    state: () => ({
        states: criarEstadoInicial(),
    }),

    actions: {
        SetState(updater: (state: AuthState) => void) {
            this.states = produce(this.states, draft => {
                updater(draft);
            });
        },

        async Login(props: T.Auth.Login.Input): Promise<T.Auth.Login.Output | null> {
            try {
                this.SetState(s => { s.loadingLogin = true });

                const res = await fetch(T.Auth.Login.route, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(props),
                });

                const data: T.Auth.Login.Output = await res.json();

                this.SetState(s => {
                    s.user = data.data.user;
                    s.token = data.data.token;
                    s.logado = true;
                });

                return data;
            } finally {
                this.SetState(s => { s.loadingLogin = false });
            }
        },

        async Register(props: T.Auth.Register.Input): Promise<T.Auth.Register.Output | null> {
            try {
                this.SetState(s => { s.loadingRegister = true });

                const res = await fetch(T.Auth.Register.route, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(props),
                });

                const data: T.Auth.Register.Output = await res.json();

                this.SetState(s => {
                    s.user = data.data.user;
                    s.logado = true;
                });

                return data;
            } finally {
                this.SetState(s => { s.loadingRegister = false });
            }
        },

        Logout() {
            this.SetState(s => {
                s.user = null;
                s.token = null;
                s.logado = false;
            });
        },
    },
});

class ContextoAuth {
    private get store() {
        return useAuthStore();
    }

    public Api = {
        Login: (props: T.Auth.Login.Input) => this.store.Login(props),
        Register: (props: T.Auth.Register.Input) => this.store.Register(props),
        Logout: () => this.store.Logout(),
    };

    public get GetJsx(): AuthState {
        return this.store.states;
    }

    public get GetState(): AuthState {
        return this.store.$state.states;
    }

    public SetState = (updater: (state: AuthState) => void) => {
        this.store.SetState(updater);
    };
}

export default new ContextoAuth();
