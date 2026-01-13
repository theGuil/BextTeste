import { http, HttpResponse } from "msw";
import T from "../types";

const STORAGE_KEY = "msw:tarefas";

const load = (): T.Tarefa.TarefaBase[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data
        ? JSON.parse(data)
        : [
            {
                id: 1,
                titulo: "Aprender Vue 3",
                descricao: "Estudar Composition API",
                prioridade: "Alta",
                data_conclusao: "2024-01-10",
            },
            {
                id: 2,
                titulo: "Aprender Vue 3 + TSX",
                descricao: "Vue 3 com TypeScript",
                prioridade: "Média",
                data_conclusao: "2024-01-15",
            },
        ];
};

const save = (data: T.Tarefa.TarefaBase[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

let tarefas: T.Tarefa.TarefaBase[] = load();

export const handlers = [
    http.get(T.Tarefa.Listar.route, () => {
        tarefas = load();

        const output: T.Tarefa.Listar.Output = {
            data: {
                tarefas,
            },
        };

        return HttpResponse.json(output);
    }),

    http.post(T.Tarefa.Criar.route, async ({ request }) => {
        const body = (await request.json()) as T.Tarefa.Criar.Input;

        const novaTarefa: T.Tarefa.TarefaBase = {
            ...body.data,
        };

        tarefas.unshift(novaTarefa);
        save(tarefas);

        const output: T.Tarefa.Criar.Output = {
            data: {
                tarefa: novaTarefa,
            },
        };

        return HttpResponse.json(output, { status: 201 });
    }),

    http.put(T.Tarefa.Atualizar.route, async ({ request, params }) => {
        const { id } = params as { id: string };
        const body = (await request.json()) as T.Tarefa.Atualizar.Input["data"];

        const tarefaId = Number(id);

        const index = tarefas.findIndex(t => t.id === tarefaId);
        if (index !== -1) {
            tarefas[index] = { ...tarefas[index], ...body };
        }

        save(tarefas);

        const output: T.Tarefa.Atualizar.Output = {
            data: {
                tarefa: tarefas[index],
            },
        };

        return HttpResponse.json(output);
    }),

    http.delete(T.Tarefa.Remover.route, ({ params }) => {
        const { id } = params as { id: string };
        const tarefaId = Number(id);

        tarefas = tarefas.filter(t => t.id !== tarefaId);
        save(tarefas);

        const output: T.Tarefa.Remover.Output = {
            data: {
                tarefa: {},
            },
        };

        return HttpResponse.json(output);
    }),

];
