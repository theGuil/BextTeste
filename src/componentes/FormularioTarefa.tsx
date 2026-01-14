/** @jsxImportSource vue */
// IMPORTAÇÕES DO VUE:
import { defineComponent, ref, watch, type PropType } from "vue";

// CONTEXTO:
import ContextoTarefa from "@/contexto/ContextoTarefa";

// TYPES
import type T from "@/types";

export default defineComponent({
    props: {
        sucessoSalvar: {
            type: Function as PropType<(result: T.Tarefa.Criar.Output) => void>,
            required: false,
        },
    },

    setup(props) {
        const prioridade = ref<T.Tarefa.TarefaBase["prioridade"]>("Média");
        const categoria = ref<T.Tarefa.TarefaBase["categoria"]>("Pessoal");
        const titulo = ref<string>("");
        const descricao = ref<string>("");
        const isFocused = ref("");

        watch(
            () => ContextoTarefa.GetJsx.selecionada,
            () => {
                const tarefa = ContextoTarefa.GetJsx.selecionada;
                if (tarefa?.id) {
                    titulo.value = tarefa.titulo;
                    descricao.value = tarefa.descricao;
                    prioridade.value = tarefa.prioridade;
                    categoria.value = tarefa.categoria;
                } else if (tarefa === null) {
                    titulo.value = "";
                    descricao.value = "";
                    prioridade.value = "Média";
                    categoria.value = "Pessoal";
                }
            },
            { immediate: true }
        );

        const salvar = async () => {
            if (!titulo.value.trim()) return;
            const tarefaSelecionada = ContextoTarefa.GetJsx.selecionada;

            if (tarefaSelecionada) {
                const result = await ContextoTarefa.Api.Atualizar({
                    params: { id: tarefaSelecionada.id },
                    data: {
                        titulo: titulo.value,
                        descricao: descricao.value || "",
                        prioridade: prioridade.value,
                        categoria: categoria.value,
                    },
                });

                props.sucessoSalvar?.(result);
            } else {
                const result = await ContextoTarefa.Api.Criar({
                    data: {
                        id: Date.now(),
                        titulo: titulo.value,
                        descricao: descricao.value || "",
                        prioridade: prioridade.value,
                        data_conclusao: "2024-12-31",
                        categoria: categoria.value,
                    },
                });

                props.sucessoSalvar?.(result);
            }

            titulo.value = "";
            descricao.value = "";
            prioridade.value = "Média";
            categoria.value = "Pessoal";
        };

        const prioridades = [
            { value: "Baixa", color: "bg-blue-500" },
            { value: "Média", color: "bg-amber-500" },
            { value: "Alta", color: "bg-red-500" },
        ];

        return () => (
            <div class="min-h-screen bg-white flex justify-center p-4">
                <div class="w-full max-w-md">
                    <div class="space-y-6">
                        <div class="space-y-2">
                            <div class="flex">
                                <label class="text-xs font-medium text-gray-700 uppercase tracking-wider pr-2">Título</label>
                                <p class="text-[10px] text-gray-400 text-right">{titulo.value.length}/20</p>
                            </div>

                            <input
                                type="text"
                                value={titulo.value}
                                maxlength={20}
                                onInput={(e: any) => (titulo.value = e.target.value)}
                                onKeydown={(e: KeyboardEvent) => {
                                    if (e.key === "Enter") salvar();
                                }}
                                onFocus={() => (isFocused.value = "titulo")}
                                onBlur={() => (isFocused.value = "")}
                                placeholder="Ex: Revisar código do projeto"
                                class={`
                                    w-full px-0 py-3 text-base
                                    border-0 border-b-2 transition-all duration-200
                                    bg-transparent
                                    placeholder:text-gray-400
                                    focus:outline-none focus:ring-0
                                    ${isFocused.value === "titulo" ? "border-black" : "border-gray-200"}
                                `}
                            />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-xs font-medium text-gray-700 uppercase tracking-wider">Categoria</label>
                                <div class="relative">
                                    <select
                                        value={categoria.value}
                                        onChange={(e: any) => (categoria.value = e.target.value)}
                                        class="w-full px-4 py-2.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none cursor-pointer"
                                    >
                                        <option>Pessoal</option>
                                        <option>Trabalho</option>
                                        <option>Estudo</option>
                                    </select>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="text-xs font-medium text-gray-700 uppercase tracking-wider">Prioridade</label>
                                <div class="relative">
                                    <select
                                        value={prioridade.value}
                                        onChange={(e: any) => (prioridade.value = e.target.value)}
                                        class="w-full px-4 py-2.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none cursor-pointer"
                                    >
                                        <option>Baixa</option>
                                        <option>Média</option>
                                        <option>Alta</option>
                                    </select>
                                    <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                        <div class={`w-2 h-2 rounded-full ${prioridades.find((p) => p.value === prioridade.value)?.color}`} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div class="flex">
                                <label class="text-xs font-medium text-gray-700 uppercase tracking-wider pr-2">Descrição</label>
                                <p class="text-[10px] text-gray-400 text-right">{descricao.value.length}/50</p>
                            </div>
                            <textarea
                                value={descricao.value}
                                maxlength={50}
                                onInput={(e: any) => (descricao.value = e.target.value)}
                                onFocus={() => (isFocused.value = "descricao")}
                                onBlur={() => (isFocused.value = "")}
                                placeholder="Adicione detalhes sobre a tarefa..."
                                onKeydown={(e: KeyboardEvent) => {
                                    if (e.key === "Enter") salvar();
                                }}
                                rows={4}
                                class={`
                                    w-full px-4 py-3 text-sm
                                    bg-gray-50
                                    border-2 transition-all duration-200
                                    rounded-xl resize-none
                                    placeholder:text-gray-400
                                    focus:outline-none focus:bg-white
                                    ${isFocused.value === "descricao" ? "border-gray-900 bg-white" : "border-gray-200"}
                                `}
                            />
                        </div>

                        <button
                            onClick={salvar}
                            disabled={!titulo.value.trim()}
                            class={`
                                w-full h-12 rounded-xl
                                text-sm font-medium
                                transition-all duration-200
                                ${
                                    titulo.value.trim()
                                        ? "bg-black text-white hover:bg-gray-800 active:scale-[0.98] shadow-sm hover:shadow"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }
                            `}
                        >
                            {ContextoTarefa.GetJsx.selecionada ? "Salvar tarefa" : titulo.value.trim() ? "Criar tarefa" : "Digite um título para continuar"}
                        </button>
                    </div>

                    <div class="mt-6 text-center">
                        <p class="text-xs text-gray-400">Pressione Enter para salvar rapidamente</p>
                    </div>
                </div>
            </div>
        );
    },
});
