/** @jsxImportSource vue */
import { defineComponent, ref, watch, onBeforeUnmount, type PropType } from "vue";

export type TypeDrawerPadraoRef = {
    abrir: () => void;
    fechar: () => void;
};

export default defineComponent({
    props: {
        title: {
            type: String,
            required: true,
        },
        subTitle: {
            type: String,
            required: true,
        },
        onClose: {
            type: Function as PropType<() => void>,
            required: false,
        },
    },
    setup(props, { slots, expose }) {
        const open = ref(false);
        const closeBtnRef = ref<HTMLButtonElement | null>(null);

        const abrir = () => (open.value = true);
        const fechar = () => {
            open.value = false;
            props.onClose?.();
        };

        expose({ abrir, fechar });

        const onKey = (e: KeyboardEvent) => e.key === "Escape" && fechar();

        watch(open, (val) => {
            if (val) {
                const prev = document.documentElement.style.overflow;
                document.documentElement.style.overflow = "hidden";
                window.addEventListener("keydown", onKey);
                setTimeout(() => closeBtnRef.value?.focus(), 0);

                return () => {
                    document.documentElement.style.overflow = prev;
                    window.removeEventListener("keydown", onKey);
                };
            }
        });

        onBeforeUnmount(() => {
            document.documentElement.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        });

        return () => (
            <teleport to="body">
                <div role="dialog" aria-modal="true" class={["fixed inset-0 z-50 transition-opacity duration-300", open.value ? "opacity-100" : "opacity-0 pointer-events-none"]}>
                    <div class="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={fechar} />

                    <aside
                        class={[
                            "absolute right-0 top-0 h-full w-full md:max-w-180",
                            "bg-white border-l border-slate-200",
                            "transform transition-transform duration-300 ease-out",
                            open.value ? "translate-x-0" : "translate-x-full",
                        ]}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                            <div class="flex items-center gap-3 min-h-10">
                                {props.title && (
                                    <>
                                        <div class="p-1">
                                            <div class="flex items-center">
                                                <div class="h-1.5 w-1.5 rounded-full bg-black mr-2"></div>
                                                <h1 class="text-sm font-medium text-black">{props.title}</h1>
                                            </div>
                                            <p class="text-xs text-gray-500 ml-3">Organize seu dia de forma eficiente</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                ref={closeBtnRef}
                                onClick={fechar}
                                aria-label="Fechar"
                                class="h-9 w-9 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2  transition flex items-center justify-center"
                            >
                                <span class="text-slate-600 text-lg leading-none">×</span>
                            </button>
                        </div>

                        {slots.default?.()}
                    </aside>
                </div>
            </teleport>
        );
    },
});
