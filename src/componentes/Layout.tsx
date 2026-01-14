/** @jsxImportSource vue */
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { RouterView, useRouter } from "vue-router";
import ContextoAuth from "@/contexto/ContextoAuth";

export default defineComponent(() => {
    const open = ref(false);
    const router = useRouter();
    const dropdownRef = ref<HTMLElement | null>(null);

    const sair = () => {
        ContextoAuth.Api.Sair();
        open.value = false;
        router.push("/auth/login");
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
            open.value = false;
        }
    };

    onMounted(() => {
        document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
        document.removeEventListener("click", handleClickOutside);
    });

    return () => (
        <div class="min-h-screen bg-[#eff3f7] app-safe">
            <header class="fixed top-0 left-0 right-0 h-12 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-50">
                <div class="flex items-center gap-2 text-sm font-medium text-slate-900 tracking-tight">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    Bext Teste
                </div>

                <div class="relative" ref={dropdownRef}>
                    <button
                        onClick={() => (open.value = !open.value)}
                        class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center text-xs font-semibold text-slate-700"
                    >
                        {ContextoAuth.GetJsx.user?.email?.charAt(0).toUpperCase() || "U"}
                    </button>

                    {open.value && (
                        <div class="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <div class="px-4 py-2 text-xs text-slate-500 border-b">{ContextoAuth.GetJsx.user?.email}</div>

                            <button onClick={sair} class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </header>
            <main class="pt-12">
                <div class="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
                    <RouterView />
                </div>
            </main>
        </div>
    );
});
