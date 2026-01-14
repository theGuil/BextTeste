/** @jsxImportSource vue */
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from "vue";
import ContextoTarefa from "@/contexto/ContextoTarefa";
import T from "@/types";

export default defineComponent(() => {
    const open = ref(false);
    const popupRef = ref<HTMLElement | null>(null);

    const categoriaDraft = ref<T.Tarefa.TarefaBase["categoria"] | "">("");
    const prioridadeDraft = ref<T.Tarefa.TarefaBase["prioridade"] | "">("");
    const concluidoDraft = ref<"" | "true" | "false">("");

    const categoriaAplicada = ref<T.Tarefa.TarefaBase["categoria"] | "">("");
    const prioridadeAplicada = ref<T.Tarefa.TarefaBase["prioridade"] | "">("");
    const concluidoAplicado = ref<"" | "true" | "false">("");

    const load = async () => {
        await ContextoTarefa.Api.Listar();
    };

    const totalFiltros = computed(() => {
        let total = 0;
        if (categoriaAplicada.value) total++;
        if (prioridadeAplicada.value) total++;
        if (concluidoAplicado.value) total++;
        return total;
    });

    const temFiltro = computed(() => totalFiltros.value > 0);

    const aplicarFiltro = () => {
        categoriaAplicada.value = categoriaDraft.value;
        prioridadeAplicada.value = prioridadeDraft.value;
        concluidoAplicado.value = concluidoDraft.value;

        ContextoTarefa.Api.Filtrar({
            data: {
                categoria: categoriaAplicada.value || undefined,
                prioridade: prioridadeAplicada.value || undefined,
                concluido: concluidoAplicado.value ? concluidoAplicado.value === "true" : undefined,
            },
        });

        open.value = false;
    };

    const limparFiltro = () => {
        categoriaDraft.value = "";
        prioridadeDraft.value = "";
        concluidoDraft.value = "";

        categoriaAplicada.value = "";
        prioridadeAplicada.value = "";
        concluidoAplicado.value = "";

        ContextoTarefa.Api.Listar();
        open.value = false;
    };

    const fecharModal = () => {
        open.value = false;
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.value && !popupRef.value.contains(event.target as Node)) {
            open.value = false;
        }
    };

    onMounted(() => document.addEventListener("mousedown", handleClickOutside));
    onBeforeUnmount(() => document.removeEventListener("mousedown", handleClickOutside));

    onMounted(load);

    return () => (
        <div class="relative flex flex-col items-center">
            <div class="flex center gap-2">
                <button onClick={() => (open.value = !open.value)} class="relative p-2 rounded-full hover:bg-slate-100 transition">
                    <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18M6 10h12M10 16h4" />
                    </svg>

                    {temFiltro.value && (
                        <span class="absolute -top-1 -right-1 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-neutral-600 text-[10px] text-white font-medium shadow">
                            {totalFiltros.value}
                        </span>
                    )}
                </button>

                {temFiltro.value && (
                    <button onClick={limparFiltro} class="mt-1 text-[11px] text-slate-400 underline underline-offset-4 hover:text-slate-500 transition tracking-wide">
                        limpar filtro
                    </button>
                )}
            </div>

            {open.value && (
                <>
                    <div class="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={fecharModal} />

                    <div
                        ref={popupRef}
                        class="z-50 bg-white rounded-2xl shadow-xl border border-slate-100 p-4
                               fixed inset-x-4 top-1/2 -translate-y-1/2
                               sm:absolute sm:top-full sm:left-1/2 sm:-translate-x-1/2 sm:mt-2 sm:translate-y-0
                               w-auto sm:w-64"
                    >
                        <button onClick={fecharModal} class="absolute top-3 right-3 text-red-400 hover:text-red-600 transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 class="text-sm font-medium text-slate-700 mb-3">Filtrar</h3>

                        <div class="space-y-3">
                            <select
                                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                                value={categoriaDraft.value}
                                onChange={(e) => (categoriaDraft.value = (e.target as HTMLSelectElement).value as any)}
                            >
                                <option value="">Categoria</option>
                                <option value="Pessoal">Pessoal</option>
                                <option value="Trabalho">Trabalho</option>
                                <option value="Estudo">Estudo</option>
                            </select>

                            <select
                                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                                value={prioridadeDraft.value}
                                onChange={(e) => (prioridadeDraft.value = (e.target as HTMLSelectElement).value as any)}
                            >
                                <option value="">Prioridade</option>
                                <option value="Baixa">Baixa</option>
                                <option value="Média">Média</option>
                                <option value="Alta">Alta</option>
                            </select>

                            <select
                                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                                value={concluidoDraft.value}
                                onChange={(e) => (concluidoDraft.value = (e.target as HTMLSelectElement).value as any)}
                            >
                                <option value="">Status</option>
                                <option value="false">Pendentes</option>
                                <option value="true">Concluídas</option>
                            </select>

                            <div class="flex gap-2 pt-2">
                                <button onClick={aplicarFiltro} class="flex-1 bg-neutral-800 text-white text-xs py-2 rounded-lg hover:bg-neutral-700 transition">
                                    Aplicar
                                </button>

                                <button onClick={limparFiltro} class="flex-1 bg-slate-100 text-slate-600 text-xs py-2 rounded-lg hover:bg-slate-200 transition">
                                    Limpar
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
});
