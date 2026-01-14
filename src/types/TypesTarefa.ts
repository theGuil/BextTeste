import z4 from "zod/v4";

namespace TypesTarefa {
    export const CategoriaEnum = z4.enum(["Pessoal", "Trabalho", "Estudo"]);

    export const TarefaBaseSchema = z4.object({
        id: z4.number().int(),
        titulo: z4.string().min(1),
        descricao: z4.string().min(1),
        prioridade: z4.enum(["Baixa", "Média", "Alta"]),
        categoria: CategoriaEnum,
        data_conclusao: z4.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    });

    export type TarefaBase = z4.infer<typeof TarefaBaseSchema>;

    export namespace Listar {
        export const route = "/api/tarefas" as const;

        export const InputSchema = z4.object({});
        export type Input = z4.infer<typeof InputSchema>;

        export type Output = {
            data: {
                tarefas: TarefaBase[];
            };
        };
    }

    export namespace Criar {
        export const route = "/api/tarefas" as const;

        export const InputSchema = z4.object({
            data: TarefaBaseSchema,
        });
        export type Input = z4.infer<typeof InputSchema>;

        export type Output = {
            data: {
                tarefa: TarefaBase;
            };
        };
    }

    export namespace Atualizar {
        export const route = "/api/tarefas/:id" as const;

        export const InputSchema = z4.object({
            params: z4.object({
                id: z4.number().int(),
            }),
            data: TarefaBaseSchema.partial(),
        });
        export type Input = z4.infer<typeof InputSchema>;

        export type Output = {
            data: {
                tarefa: TarefaBase;
            };
        };
    }

    export namespace Remover {
        export const route = "/api/tarefas/:id" as const;

        export const InputSchema = z4.object({
            params: z4.object({
                id: z4.number().int(),
            }),
        });
        export type Input = z4.infer<typeof InputSchema>;

        export type Output = {
            data: {
                tarefa: {};
            };
        };
    }
}

export default TypesTarefa;
