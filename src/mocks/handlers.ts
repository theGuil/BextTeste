import { http, HttpResponse } from "msw";
import T from "./types";

let tarefas: T.TarefaBase[] = [
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

export const handlers = [
    http.get(T.Listar.route, () => {
        const output: T.Listar.Output = {
            data: {
                tarefas,
            },
        };

        return HttpResponse.json(output);
    }),

    http.post(T.Criar.route, async ({ request }) => {
        const body = (await request.json()) as T.Criar.Input;

        const novaTarefa: T.TarefaBase = {
            ...body.data,
        };

        tarefas.unshift(novaTarefa);

        const output: T.Criar.Output = {
            data: {
                tarefa: novaTarefa,
            },
        };

        return HttpResponse.json(output, { status: 201 });
    }),

    http.put(T.Atualizar.route, async ({ request, params }) => {
        const { id } = params as { id: string };
        const body = (await request.json()) as T.Atualizar.Input["data"];

        const tarefaId = Number(id);

        const index = tarefas.findIndex(t => t.id === tarefaId);
        if (index !== -1) {
            tarefas[index] = { ...tarefas[index], ...body };
        }

        const output: T.Atualizar.Output = {
            data: {
                tarefa: tarefas[index],
            },
        };

        return HttpResponse.json(output);
    }),

    http.delete(T.Remover.route, ({ params }) => {
        const { id } = params as { id: string };
        const tarefaId = Number(id);

        tarefas = tarefas.filter(t => t.id !== tarefaId);

        const output: T.Remover.Output = {
            data: {
                tarefa: {},
            },
        };

        return HttpResponse.json(output);
    }),
];
