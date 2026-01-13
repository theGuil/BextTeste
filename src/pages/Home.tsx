/** @jsxImportSource vue */
import { defineComponent, ref, onMounted, watchEffect } from "vue";
import ContextoTarefa from "@/contexto/ContextoTarefa";
import T from "@/types";

export default defineComponent(() => {
    const newTitulo = ref("");
    const newDescricao = ref("");

    const load = async () => {
        await ContextoTarefa.Api.Listar();
    };

    const create = async () => {
        if (!newTitulo.value.trim()) return;

        await ContextoTarefa.Api.Criar({
            data: {
                id: new Date().getTime(),
                titulo: newTitulo.value,
                descricao: newDescricao.value || "Sem descrição",
                prioridade: "Média",
                data_conclusao: "2024-12-31",
            },
        });

        newTitulo.value = "";
        newDescricao.value = "";
    };

    const update = async (tarefa: T.Tarefa.TarefaBase) => {
        await ContextoTarefa.Api.Atualizar({
            params: { id: tarefa.id },
            data: { titulo: tarefa.titulo + " ✔" },
        });
    };

    const remove = async (id: number) => {
        await ContextoTarefa.Api.Remover({
            params: { id },
        });
    };

    onMounted(load);

    watchEffect(() => {
        console.log(ContextoTarefa.GetJsx.lista, "lista mudou");
    });

    return () => (
        <div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <div class="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div class="mb-6">
                    <h1 class="text-2xl font-semibold text-slate-800">Tarefas</h1>
                    <p class="text-sm text-slate-500">Gerencie suas atividades com MSW + Pinia + Zod</p>
                </div>
                <div class="space-y-3 mb-6">
                    <input
                        class="w-full px-3 py-2 text-black rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        value={newTitulo.value}
                        onInput={(e: any) => (newTitulo.value = e.target.value)}
                        placeholder="Título da tarefa"
                    />

                    <input
                        class="w-full px-3 py-2 text-black rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        value={newDescricao.value}
                        onInput={(e: any) => (newDescricao.value = e.target.value)}
                        placeholder="Descrição (opcional)"
                    />

                    <button
                        onClick={create}
                        disabled={ContextoTarefa.GetJsx.loading}
                        class="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {ContextoTarefa.GetJsx.loadingCriar ? "Criando..." : "Adicionar tarefa"}
                    </button>
                </div>
                <ul class="space-y-3">
                    {ContextoTarefa.GetJsx.lista.map((tarefa) => (
                        <li key={tarefa.id} class="group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition">
                            <div>
                                <div class="font-medium text-slate-800">{tarefa.titulo}</div>
                                <div class="text-xs text-slate-500">
                                    {tarefa.prioridade} • {tarefa.data_conclusao}
                                </div>
                            </div>

                            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button class="text-indigo-600 text-sm hover:underline" onClick={() => update(tarefa)}>
                                    Editar
                                </button>
                                <button class="text-rose-500 text-sm hover:underline" onClick={() => remove(tarefa.id)}>
                                    Excluir
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                {ContextoTarefa.GetJsx.loading && <div class="mt-4 text-center text-sm text-slate-400 animate-pulse">Carregando tarefas...</div>}
            </div>
        </div>
    );
});
