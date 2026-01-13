import { defineStore } from "pinia";
import { produce } from "immer";
import T from "@/mocks/types";

type Tarefa = T.TarefaBase;

interface TarefaState {
    lista: Tarefa[];
    selecionada: Tarefa | null;
    loading: boolean;
    loadingCriar: boolean;
}

const criarEstadoInicial = (): TarefaState => ({
    lista: [],
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

        async Listar(): Promise<T.Listar.Output | null> {
            try {
                this.SetState(s => { s.loading = true });

                const res = await fetch(T.Listar.route);
                const data: T.Listar.Output = await res.json();

                this.SetState(s => {
                    s.lista = data.data.tarefas;
                });

                return data;
            } finally {
                this.SetState(s => { s.loading = false });
            }
        },

        async Criar(props: T.Criar.Input): Promise<T.Criar.Output | null> {
            try {
                this.SetState(s => { s.loadingCriar = true });

                const res = await fetch(T.Criar.route, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(props),
                });

                const data: T.Criar.Output = await res.json();

                this.SetState(s => {
                    s.lista.unshift(data.data.tarefa);
                });

                return data;
            } finally {
                this.SetState(s => { s.loadingCriar = false });
            }
        },

        async Atualizar(props: T.Atualizar.Input): Promise<T.Atualizar.Output | null> {
            const url = T.Atualizar.route.replace(":id", String(props.params.id));

            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(props),
            });

            const data: T.Atualizar.Output = await res.json();

            this.SetState(s => {
                const index = s.lista.findIndex(t => t.id === props.params.id);
                if (index !== -1) s.lista[index] = data.data.tarefa;
            });

            return data;
        },

        async Remover(props: T.Remover.Input): Promise<T.Remover.Output | null> {
            const url = T.Remover.route.replace(":id", String(props.params.id));

            const res = await fetch(url, { method: "DELETE" });
            const data: T.Remover.Output = await res.json();

            this.SetState(s => {
                s.lista = s.lista.filter(t => t.id !== props.params.id);
            });

            return data;
        },

        selecionar(tarefa: Tarefa) {
            this.SetState(s => { s.selecionada = tarefa });
        },
    },
});

class contexto_tarefa {
    private get store() {
        return useTarefaStore();
    }

    public Api = {
        Listar: () => this.store.Listar(),
        Criar: (props: T.Criar.Input) => this.store.Criar(props),
        Atualizar: (props: T.Atualizar.Input) => this.store.Atualizar(props),
        Remover: (props: T.Remover.Input) => this.store.Remover(props),
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

export default new contexto_tarefa();
