/** @jsxImportSource vue */
// IMPORTAÇÕES DO VUE:
import { defineComponent, ref, onMounted, computed } from "vue";
// CONTEXTO:
import ContextoTarefa from "@/contexto/ContextoTarefa";
// COMPONENTES:
import DrawerLateral from "@/componentes/DrawerLateral";
import FormularioTarefa from "@/componentes/FormularioTarefa";
// TYPES
import type { TypeDrawerPadraoRef } from "@/componentes/DrawerLateral";
import type T from "@/types";

export default defineComponent(() => {
    const drawerRef = ref<TypeDrawerPadraoRef | null>(null);

    const load = async () => {
        await ContextoTarefa.Api.Listar();
    };

    const remove = async (id: number) => {
        await ContextoTarefa.Api.Remover({ params: { id } });
    };

    const editar = (tarefa: T.Tarefa.TarefaBase) => {
        ContextoTarefa.SetState((s) => {
            s.selecionada = tarefa;
        });
        drawerRef.value?.abrir();
    };

    const colunas = ["Baixa", "Média", "Alta"] as const;

    const tarefasPorPrioridade = computed(() =>
        colunas.map((p) => ({
            prioridade: p,
            itens: ContextoTarefa.GetState.lista.filter((t) => t.prioridade === p),
        }))
    );

    const corPrioridade = (p: string) =>
        ({
            Baixa: "bg-emerald-100 text-emerald-700",
            Média: "bg-amber-100 text-amber-700",
            Alta: "bg-rose-100 text-rose-700",
        }[p]);

    onMounted(load);

    return () => (
        <div class="h-[calc(100vh-96px)] flex flex-col">
            <div class="mb-4 p-1 md:p-2 flex items-center justify-between">
                <h1 class="text-lg font-semibold text-slate-900">Kanban de Tarefas</h1>

                <button
                    onClick={() => {
                        ContextoTarefa.SetState((s) => {
                            s.selecionada = null;
                        });
                        drawerRef.value?.abrir();
                    }}
                    class="h-10 px-4 rounded-xl bg-black text-white text-sm hover:bg-slate-800 transition"
                >
                    Nova tarefa
                </button>
            </div>

            <section class="flex-1 p-1 md:p-2 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
                {tarefasPorPrioridade.value.map((coluna) => (
                    <div class="bg-white rounded-2xl shadow-sm p-3 flex flex-col overflow-hidden">
                        <h2 class="font-medium text-slate-700 mb-2 flex items-center justify-between shrink-0">
                            {coluna.prioridade}
                            <span class="text-xs text-slate-400">{coluna.itens.length}</span>
                        </h2>

                        <div class="flex-1 space-y-3 overflow-y-auto pr-1">
                            {coluna.itens.map((tarefa) => (
                                <div class="p-3 rounded-xl border hover:shadow-sm transition">
                                    <div class="font-medium text-slate-800 text-sm">{tarefa.titulo}</div>
                                    <div class="text-xs text-slate-500 mt-1 line-clamp-3">{tarefa.descricao}</div>

                                    <div class="flex items-center justify-between mt-2">
                                        <span class={["px-2 py-0.5 rounded-full text-xs", corPrioridade(tarefa.prioridade)]}>{tarefa.prioridade}</span>

                                        <div class="flex gap-2">
                                            <button class="text-xs text-blue-500 hover:text-blue-800" onClick={() => editar(tarefa)}>
                                                Editar
                                            </button>

                                            <button class="text-rose-500 text-xs hover:text-rose-700" onClick={() => remove(tarefa.id)}>
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            <DrawerLateral ref={drawerRef} title={ContextoTarefa.GetJsx.selecionada ? "Editar tarefa" : "Nova tarefa"} subTitle="Organize seu dia de forma eficiente">
                {() => <FormularioTarefa sucessoSalvar={drawerRef?.value?.fechar} />}
            </DrawerLateral>
        </div>
    );
});
