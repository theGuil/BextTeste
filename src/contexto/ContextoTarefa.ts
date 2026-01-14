import { defineStore } from "pinia";

import { produce, setAutoFreeze } from "immer";

import T from "@/types";

setAutoFreeze(false);

type Tarefa = T.Tarefa.TarefaBase;

interface TarefaState {
    lista: Tarefa[];
    selecionada: Tarefa | null;
    loading: boolean;
    loadingCriar: boolean;
}

const STORAGE_KEY = "msw:tarefas";

const loadStorage = (): Tarefa[] => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
};

const saveStorage = (data: Tarefa[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const criarEstadoInicial = (): TarefaState => ({
    lista: loadStorage(),
    selecionada: null,
    loading: false,
    loadingCriar: false,
});

const useTarefaStore = defineStore("tarefa", {
    state: () => ({
        states: criarEstadoInicial(),
    }),

    actions: {
        SetState(updater: (state: TarefaState) => void) {
            this.states = produce(this.states, draft => {
                updater(draft);
            });
        },

        async Listar(): Promise<T.Tarefa.Listar.Output> {
            try {
                this.SetState(s => { s.loading = true });

                const res = await fetch(T.Tarefa.Listar.route);
                const data: T.Tarefa.Listar.Output = await res.json();

                saveStorage(data.data.tarefas);

                this.SetState(s => {
                    s.lista = data.data.tarefas;
                });

                return data;
            } finally {
                this.SetState(s => { s.loading = false });
            }
        },

        async Criar(props: T.Tarefa.Criar.Input): Promise<T.Tarefa.Criar.Output> {
            try {
                this.SetState(s => { s.loadingCriar = true });

                const res = await fetch(T.Tarefa.Criar.route, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(props),
                });

                const data: T.Tarefa.Criar.Output = await res.json();

                const novaLista = [data.data.tarefa, ...this.states.lista];
                saveStorage(novaLista);

                this.SetState(s => {
                    s.lista = novaLista;
                });

                return data;
            } finally {
                this.SetState(s => { s.loadingCriar = false });
            }
        },

        async Atualizar(props: T.Tarefa.Atualizar.Input): Promise<T.Tarefa.Atualizar.Output> {
            const url = T.Tarefa.Atualizar.route.replace(":id", String(props.params.id));

            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(props.data),
            });

            const data: T.Tarefa.Atualizar.Output = await res.json();

            const novaLista = this.states.lista.map(t =>
                t.id === props.params.id ? data.data.tarefa : t
            );

            saveStorage(novaLista);

            this.SetState(s => {
                s.lista = novaLista;
            });

            return data;
        },

        async Remover(props: T.Tarefa.Remover.Input): Promise<T.Tarefa.Remover.Output> {
            const url = T.Tarefa.Remover.route.replace(":id", String(props.params.id));

            const res = await fetch(url, { method: "DELETE" });
            const data: T.Tarefa.Remover.Output = await res.json();

            const novaLista = this.states.lista.filter(t => t.id !== props.params.id);

            saveStorage(novaLista);

            this.SetState(s => {
                s.lista = novaLista;
            });

            return data;
        },

        selecionar(tarefa: Tarefa) {
            this.SetState(s => { s.selecionada = tarefa });
        },
    },
});

class ContextoTarefa {
    private get store() {
        return useTarefaStore();
    }

    public Api = {
        Listar: () => this.store.Listar(),
        Criar: (props: T.Tarefa.Criar.Input) => this.store.Criar(props),
        Atualizar: (props: T.Tarefa.Atualizar.Input) => this.store.Atualizar(props),
        Remover: (props: T.Tarefa.Remover.Input) => this.store.Remover(props),
    };

    public get GetJsx(): TarefaState {
        return this.store.states;
    }

    public get GetState(): TarefaState {
        return this.store.$state.states;
    }

    public SetState = (updater: (state: TarefaState) => void) => {
        this.store.SetState(updater);
    };
}

export default new ContextoTarefa();
