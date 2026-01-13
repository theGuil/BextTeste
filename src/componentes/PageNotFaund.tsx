/** @jsxImportSource vue */
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent(() => {
    const router = useRouter();

    const goHome = () => {
        router.push("/");
    };

    return () => (
        <div class="min-h-screen flex items-center justify-center bg-slate-50">
            <div class="text-center space-y-4">
                <h1 class="text-6xl font-bold text-slate-800">404</h1>
                <p class="text-slate-500">Página não encontrada</p>

                <button onClick={goHome} class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">
                    Voltar
                </button>
            </div>
        </div>
    );
});
