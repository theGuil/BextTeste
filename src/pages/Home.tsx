/** @jsxImportSource vue */
import { defineComponent, ref, computed } from "vue";
// TYPES
import type { TypeDrawerPadraoRef } from "@/componentes/DrawerLateral";
import type T from "@/types";
// CONTEXTO
import ContextoTarefa from "@/contexto/ContextoTarefa";
//COMPONENTES
import FormularioTarefa from "@/componentes/FormularioTarefa";
import DrawerLateral from "@/componentes/DrawerLateral";
import FiltrarTarefas from "@/componentes/FiltrarTarefas";

export default defineComponent(() => {
    const drawerRef = ref<TypeDrawerPadraoRef | null>(null);

    const modalCancelarAberto = ref(false);
    const tarefaSelecionada = ref<T.Tarefa.TarefaBase | null>(null);

    const modalExcluirAberto = ref(false);
    const tarefaParaExcluir = ref<number | null>(null);

    const modalConcluirAberto = ref(false);
    const tarefaParaConcluir = ref<T.Tarefa.TarefaBase | null>(null);

    const confirmarExcluir = (id: number) => {
        tarefaParaExcluir.value = id;
        modalExcluirAberto.value = true;
    };

    const removerConfirmado = async () => {
        if (!tarefaParaExcluir.value) return;
        await ContextoTarefa.Api.Remover({ params: { id: tarefaParaExcluir.value } });
        modalExcluirAberto.value = false;
        tarefaParaExcluir.value = null;
    };

    const confirmarConcluir = (tarefa: T.Tarefa.TarefaBase) => {
        tarefaParaConcluir.value = tarefa;
        modalConcluirAberto.value = true;
    };

    const concluirConfirmado = async () => {
        if (!tarefaParaConcluir.value) return;

        await ContextoTarefa.Api.Atualizar({
            params: { id: tarefaParaConcluir.value.id },
            data: {
                ...tarefaParaConcluir.value,
                concluido: true,
                data_conclusao: new Date().toISOString(),
            },
        });

        modalConcluirAberto.value = false;
        tarefaParaConcluir.value = null;
    };

    const confirmarCancelar = (tarefa: T.Tarefa.TarefaBase) => {
        tarefaSelecionada.value = tarefa;
        modalCancelarAberto.value = true;
    };

    const cancelarConfirmado = async () => {
        if (!tarefaSelecionada.value) return;

        await ContextoTarefa.Api.Atualizar({
            params: { id: tarefaSelecionada.value.id },
            data: {
                ...tarefaSelecionada.value,
                concluido: false,
                data_conclusao: "",
            },
        });

        modalCancelarAberto.value = false;
        tarefaSelecionada.value = null;
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

    const formatarData = (iso?: string | null) => {
        if (!iso) return null;
        const d = new Date(iso);
        return d.toLocaleDateString("pt-BR");
    };

    return () => (
        <div class="h-[calc(100vh-96px)] flex flex-col relative">
            <header class="mb-4 px-2 md:px-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <h1 class="text-xl font-semibold text-slate-900">Tarefas</h1>
                    <FiltrarTarefas />
                </div>
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
            </header>

            <section class="flex-1 px-2 md:px-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
                {tarefasPorPrioridade.value.map((coluna) => (
                    <div class="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 flex flex-col overflow-hidden">
                        <div class="px-4 py-3 border-b flex items-center justify-between">
                            <h2 class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                Prioridade {coluna.prioridade}
                                <span class="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{coluna.itens.length}</span>
                            </h2>
                        </div>

                        <div class="flex-1 space-y-3 overflow-y-auto p-3">
                            {coluna.itens.map((tarefa) => {
                                const concluida = tarefa.concluido;

                                return (
                                    <div
                                        class={[
                                            "group rounded-xl border p-3 transition-all",
                                            concluida ? "bg-emerald-50/40 border-emerald-200/60" : "bg-white border-slate-200 hover:shadow-md",
                                        ]}
                                    >
                                        <div class="flex items-start justify-between gap-2">
                                            <div class="space-y-1">
                                                <h3 class={["font-medium text-sm leading-tight", concluida ? "text-slate-500 line-through" : "text-slate-800"]}>{tarefa.titulo}</h3>

                                                <p class={["text-xs line-clamp-2", concluida ? "text-slate-400" : "text-slate-500"]}>{tarefa.descricao}</p>

                                                {concluida && tarefa.data_conclusao && (
                                                    <p class="text-[11px] text-emerald-600">Concluída em {formatarData(tarefa.data_conclusao)}</p>
                                                )}
                                            </div>

                                            <span
                                                class={["shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full", corPrioridade(tarefa.prioridade), concluida && "opacity-60"]}
                                            >
                                                {tarefa.prioridade}
                                            </span>
                                        </div>

                                        <div class="mt-3 flex items-center justify-between">
                                            <span class="text-[11px] text-slate-400">{tarefa.categoria}</span>

                                            <div class="flex gap-3 text-xs">
                                                {tarefa.concluido === false ? (
                                                    <button class="text-emerald-600 hover:text-emerald-800 transition" onClick={() => confirmarConcluir(tarefa)}>
                                                        Concluir
                                                    </button>
                                                ) : (
                                                    <button class="text-gray-600 hover:text-gray-800 transition" onClick={() => confirmarCancelar(tarefa)}>
                                                        Reabrir
                                                    </button>
                                                )}

                                                <button class="text-blue-500 hover:text-blue-700 transition" onClick={() => editar(tarefa)}>
                                                    Editar
                                                </button>
                                                <button class="text-rose-500 hover:text-rose-700 transition" onClick={() => confirmarExcluir(tarefa.id)}>
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </section>

            {modalExcluirAberto.value && (
                <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                        <h3 class="text-lg font-semibold text-slate-800 mb-2">Confirmar exclusão</h3>
                        <p class="text-sm text-slate-500 mb-6">Tem certeza que deseja excluir esta tarefa? Essa ação não pode ser desfeita.</p>

                        <div class="flex justify-end gap-3">
                            <button class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => (modalExcluirAberto.value = false)}>
                                Cancelar
                            </button>
                            <button class="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700" onClick={removerConfirmado}>
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalConcluirAberto.value && (
                <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                        <h3 class="text-lg font-semibold text-slate-800 mb-2">Concluir tarefa</h3>
                        <p class="text-sm text-slate-500 mb-6">Deseja marcar esta tarefa como concluída?</p>

                        <div class="flex justify-end gap-3">
                            <button class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => (modalConcluirAberto.value = false)}>
                                Cancelar
                            </button>
                            <button class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700" onClick={concluirConfirmado}>
                                Concluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalCancelarAberto.value && (
                <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                        <h3 class="text-lg font-semibold text-slate-800 mb-2">Reabrir tarefa</h3>
                        <p class="text-sm text-slate-500 mb-6">Deseja remover a conclusão e voltar esta tarefa para pendente?</p>

                        <div class="flex justify-end gap-3">
                            <button class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => (modalCancelarAberto.value = false)}>
                                Cancelar
                            </button>
                            <button class="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800" onClick={cancelarConfirmado}>
                                Reabrir
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <DrawerLateral
                onClose={() => {
                    ContextoTarefa.SetState((s) => {
                        s.selecionada = null;
                    });
                }}
                ref={drawerRef}
                title={ContextoTarefa.GetJsx.selecionada ? "Editar tarefa" : "Nova tarefa"}
                subTitle="Organize seu dia de forma eficiente"
            >
                {() => <FormularioTarefa sucessoSalvar={drawerRef?.value?.fechar} />}
            </DrawerLateral>
        </div>
    );
});
