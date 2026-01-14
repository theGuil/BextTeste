/** @jsxImportSource vue */
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import ContextoAuth from "@/contexto/ContextoAuth";

export default defineComponent(() => {
    const router = useRouter();

    const email = ref("");
    const senha = ref("");

    const register = async () => {
        if (!email.value || !senha.value) return;

        await ContextoAuth.Api.Register({
            data: {
                email: email.value,
                senha: senha.value,
            },
        });

        email.value = "";
        senha.value = "";
    };

    const irParaLogin = () => {
        router.push("/auth/login");
    };

    return () => (
        <div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div class="mb-6">
                    <h1 class="text-2xl font-semibold text-slate-800">Criar conta</h1>
                    <p class="text-sm text-slate-500">Crie uma conta e começe a cadastrar tarefas</p>
                </div>

                <div class="space-y-3 mb-6">
                    <input
                        class="w-full px-3 py-2 text-black rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        value={email.value}
                        onInput={(e: any) => (email.value = e.target.value)}
                        placeholder="Email"
                        type="email"
                    />

                    <input
                        class="w-full px-3 py-2 text-black rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        value={senha.value}
                        onInput={(e: any) => (senha.value = e.target.value)}
                        placeholder="Senha"
                        type="password"
                    />

                    <button
                        onClick={register}
                        disabled={ContextoAuth.GetJsx.loadingRegister}
                        class="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {ContextoAuth.GetJsx.loadingRegister ? "Criando conta..." : "Registrar"}
                    </button>
                </div>

                <div class="text-center text-sm text-slate-500">
                    Já tem conta?{" "}
                    <button class="text-indigo-600 hover:underline" onClick={irParaLogin}>
                        Entrar
                    </button>
                </div>

                {ContextoAuth.GetJsx.user && (
                    <div class="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm text-center">
                        Conta criada para <strong>{ContextoAuth.GetJsx.user.email}</strong>
                    </div>
                )}
            </div>
        </div>
    );
});
