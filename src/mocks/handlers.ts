import { http, HttpResponse } from "msw";
import T from "../types";

const STORAGE_KEY = "msw:tarefas";
const USER_KEY = "msw:users";

const loadUsers = (): T.Auth.User[] => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : [];
};

const saveUsers = (users: T.Auth.User[]) => {
    localStorage.setItem(USER_KEY, JSON.stringify(users));
};

let users: T.Auth.User[] = loadUsers();

const loadTarefas = (): T.Tarefa.TarefaBase[] => {
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

let tarefas: T.Tarefa.TarefaBase[] = loadTarefas();

export const handlers = [
    http.get(T.Tarefa.Listar.route, () => {
        tarefas = loadTarefas();

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

    http.post(T.Auth.Register.route, async ({ request }) => {
        const body = (await request.json()) as T.Auth.Register.Input;
        const { email, senha } = body.data;

        if (users.find(u => u.email === email)) {
            return HttpResponse.json(
                { message: "Email já cadastrado" },
                { status: 409 }
            );
        }

        const newUser: T.Auth.User = {
            id: Date.now(),
            email,
            senha,
        };

        users.push(newUser);
        saveUsers(users);

        const output: T.Auth.Register.Output = {
            data: {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                },
            },
        };

        return HttpResponse.json(output, { status: 201 });
    }),

    http.post(T.Auth.Login.route, async ({ request }) => {
        const body = (await request.json()) as T.Auth.Login.Input;
        const { email, senha } = body.data;

        const user = users.find(u => u.email === email && u.senha === senha);

        if (!user) {
            return HttpResponse.json(
                { message: "Credenciais inválidas" },
                { status: 401 }
            );
        }

        const output: T.Auth.Login.Output = {
            data: {
                token: "fake-jwt-token-" + user.id,
                user: {
                    id: user.id,
                    email: user.email,
                },
            },
        };

        return HttpResponse.json(output);
    }),
];
