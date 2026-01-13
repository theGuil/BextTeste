/** @jsxImportSource vue */
import { defineComponent, ref } from "vue";
import ContextoAuth from "@/contexto/ContextoAuth";

export default defineComponent(() => {
    const email = ref("");
    const senha = ref("");
    const modo = ref<"login" | "register">("login");

    const submit = async () => {
        if (!email.value || !senha.value) return;

        if (modo.value === "login") {
            await ContextoAuth.Api.Login({
                data: {
                    email: email.value,
                    senha: senha.value,
                },
            });
        } else {
            await ContextoAuth.Api.Register({
                data: {
                    email: email.value,
                    senha: senha.value,
                },
            });
        }

        email.value = "";
        senha.value = "";
    };

    return () => (
        <div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div class="mb-6">
                    <h1 class="text-2xl font-semibold text-slate-800">{modo.value === "login" ? "Entrar" : "Criar conta"}</h1>
                    <p class="text-sm text-slate-500">Faça o login e começe as tarefas</p>
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
                        onClick={submit}
                        disabled={ContextoAuth.GetJsx.loadingLogin || ContextoAuth.GetJsx.loadingRegister}
                        class="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {modo.value === "login"
                            ? ContextoAuth.GetJsx.loadingLogin
                                ? "Entrando..."
                                : "Entrar"
                            : ContextoAuth.GetJsx.loadingRegister
                            ? "Criando conta..."
                            : "Registrar"}
                    </button>
                </div>

                <div class="text-center text-sm text-slate-500">
                    {modo.value === "login" ? (
                        <span>
                            Não tem conta?{" "}
                            <button class="text-indigo-600 hover:underline" onClick={() => (modo.value = "register")}>
                                Criar agora
                            </button>
                        </span>
                    ) : (
                        <span>
                            Já tem conta?{" "}
                            <button class="text-indigo-600 hover:underline" onClick={() => (modo.value = "login")}>
                                Entrar
                            </button>
                        </span>
                    )}
                </div>

                {ContextoAuth.GetJsx.user && (
                    <div class="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm text-center">
                        Logado como <strong>{ContextoAuth.GetJsx.user.email}</strong>
                    </div>
                )}
            </div>
        </div>
    );
});
