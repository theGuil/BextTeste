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
                titulo: "Estudar matemática financeira",
                descricao: "Revisar juros compostos e amortização.",
                prioridade: "Alta",
                data_conclusao: "2024-01-10",
                categoria: "Estudo",
            },
            {
                id: 2,
                titulo: "Ler capítulo de algoritmos",
                descricao: "Estudar estruturas de dados básicas.",
                prioridade: "Média",
                data_conclusao: "2024-01-15",
                categoria: "Estudo",
            },
            {
                id: 3,
                titulo: "Finalizar relatório mensal",
                descricao: "Compilar métricas e enviar para a gerência.",
                prioridade: "Alta",
                data_conclusao: "2024-01-12",
                categoria: "Trabalho",
            },
            {
                id: 4,
                titulo: "Reunião com equipe",
                descricao: "Alinhar metas do próximo sprint.",
                prioridade: "Baixa",
                data_conclusao: "2024-01-18",
                categoria: "Trabalho",
            },
            {
                id: 5,
                titulo: "Ir à academia",
                descricao: "Treino de musculação e cardio.",
                prioridade: "Média",
                data_conclusao: "2024-01-11",
                categoria: "Pessoal",
            },
            {
                id: 6,
                titulo: "Organizar finanças",
                descricao: "Revisar gastos e planejar orçamento do mês.",
                prioridade: "Alta",
                data_conclusao: "2024-01-20",
                categoria: "Pessoal",
            },
        ]
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

        return HttpResponse.json(output, { status: 200 });
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

        return HttpResponse.json(output, { status: 200 });
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

        return HttpResponse.json(output, { status: 200 });
    }),

    http.get(T.Tarefa.Filtrar.route, ({ request }) => {
        const url = new URL(request.url);

        const categoria = url.searchParams.get("categoria") as T.Tarefa.TarefaBase["categoria"] | null;
        const prioridade = url.searchParams.get("prioridade") as T.Tarefa.TarefaBase["prioridade"] | null;

        let resultado = loadTarefas();

        if (categoria) {
            resultado = resultado.filter(t => t.categoria === categoria);
        }

        if (prioridade) {
            resultado = resultado.filter(t => t.prioridade === prioridade);
        }

        const output: T.Tarefa.Filtrar.Response = {
            status: "success",
            code: 200,
            message: "Tarefas filtradas com sucesso",
            data: {
                tarefas: resultado,
            },
        };

        return HttpResponse.json(output, { status: 200 });
    }),


    http.post(T.Auth.Register.route, async ({ request }): Promise<HttpResponse<T.Auth.Register.Response>> => {
        const body = (await request.json()) as T.Auth.Register.Input;
        const { email, senha } = body.data;

        if (senha?.length < 6) {
            return HttpResponse.json<T.Auth.Register.Response>({
                status: "error",
                code: 422,
                message: "Senha deve ter no mínimo 6 caracteres",
                data: null,
            }, { status: 422 });
        }

        if (users.find(u => u.email === email)) {
            return HttpResponse.json<T.Auth.Register.Response>({
                status: "error",
                code: 409,
                message: "Email já cadastrado",
                data: null,
            }, { status: 409 });
        }

        const newUser: T.Auth.User = {
            id: Date.now(),
            email,
            senha,
        };

        users.push(newUser);
        saveUsers(users);

        const output: T.Auth.Register.Response = {
            status: "success",
            code: 201,
            message: "Usuário cadastrado com sucesso",
            data: {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                },
            },
        };

        return HttpResponse.json<T.Auth.Register.Response>(output, { status: 201 });
    }
    ),

    http.post(T.Auth.Login.route, async ({ request }): Promise<HttpResponse<T.Auth.Login.Response>> => {
        const body = (await request.json()) as T.Auth.Login.Input;
        const { email, senha } = body.data;

        const SAFE_USER: T.Auth.User = {
            id: 1,
            email: "bextteste@gmail.com",
            senha: "123456",
        };

        let users: T.Auth.User[] = loadUsers();

        if (!users.find(u => u.email === SAFE_USER.email)) {
            users.push(SAFE_USER);
            saveUsers(users);
        }

        const user = users.find(u => u.email === email && u.senha === senha);

        if (!user) {
            return HttpResponse.json<T.Auth.Login.Response>({
                status: "error",
                code: 401,
                message: "E-mail ou senha inválido!",
                data: null,
            }, { status: 401 });
        }

        const output: T.Auth.Login.Response = {
            status: "success",
            code: 200,
            message: "Login realizado com sucesso",
            data: {
                token: "fake-jwt-token-" + user.id,
                user: {
                    id: user.id,
                    email: user.email,
                },
            },
        };

        return HttpResponse.json<T.Auth.Login.Response>(output, { status: 200 });
    }
    )
];
