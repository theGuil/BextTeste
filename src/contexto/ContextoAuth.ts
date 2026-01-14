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

const STORAGE_LOGADO = "auth:logado";
const STORAGE_USER = "auth:user";

const criarEstadoInicial = (): AuthState => ({
    user: sessionStorage.getItem(STORAGE_USER)
        ? JSON.parse(sessionStorage.getItem(STORAGE_USER)!)
        : null,
    token: null,
    logado: sessionStorage.getItem(STORAGE_LOGADO) === "true",
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

            sessionStorage.setItem(STORAGE_LOGADO, String(this.states.logado));

            if (this.states.user) {
                sessionStorage.setItem(STORAGE_USER, JSON.stringify(this.states.user));
            } else {
                sessionStorage.removeItem(STORAGE_USER);
            }
        },

        async Login(props: T.Auth.Login.Input): Promise<T.Auth.Login.Response> {
            try {
                this.SetState(s => { s.loadingLogin = true });

                const res = await fetch(T.Auth.Login.route, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(props),
                });

                const data = await res.json();

                if (!res.ok) {
                    return data;
                }

                const typed = data as T.Auth.Login.Response;

                if (typed?.code === 200) {
                    this.SetState(s => {
                        s.user = typed?.data?.user;
                        s.token = typed?.data?.token;
                        s.logado = true;
                    });
                }

                return typed;
            } finally {
                this.SetState(s => { s.loadingLogin = false });
            }
        },

        async Register(props: T.Auth.Register.Input): Promise<T.Auth.Register.Response> {
            try {
                this.SetState(s => { s.loadingRegister = true });

                const res: globalThis.Response = await fetch(T.Auth.Register.route, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(props),
                });

                const data = await res.json();

                if (!res.ok) {
                    return data;
                }

                const typed = data as T.Auth.Register.Response;

                this.SetState(s => {
                    s.user = typed.data.user;
                    s.logado = true;
                });

                return typed;
            } finally {
                this.SetState(s => { s.loadingRegister = false });
            }
        },

        sair() {
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
        Sair: () => this.store.sair(),
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
