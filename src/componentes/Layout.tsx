/** @jsxImportSource vue */
import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export default defineComponent(() => {
    return () => (
        <div class="min-h-screen bg-slate-50">
            <header class="fixed top-0 left-0 right-0 h-12 bg-white border-b border-slate-200 flex items-center px-6 z-50">
                <div class="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <div class="w-2 h-2 rounded-full bg-green-500"></div>
                    Bext Teste
                </div>
            </header>

            <main class="pt-12">
                <div class="max-w-7xl mx-auto px-6 py-6">
                    <RouterView />
                </div>
            </main>
        </div>
    );
});
