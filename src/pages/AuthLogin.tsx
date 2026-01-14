/** @jsxImportSource vue */
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import ContextoAuth from "@/contexto/ContextoAuth";

export default defineComponent(() => {
    const router = useRouter();

    const email = ref("");
    const senha = ref("");
    const modo = ref<"login" | "register">("login");
    const erro = ref<string | null>(null);

    const submit = async () => {
        erro.value = null;

        if (!email.value || !senha.value) {
            erro.value = "Preencha todos os campos";
            return;
        }

        if (modo.value === "login") {
            const resutls = await ContextoAuth.Api.Login({
                data: { email: email.value, senha: senha.value },
            });

            if (resutls?.code === 401) {
                erro.value = resutls.message || "Email ou senha inválidos";
                return;
            }
        } else {
            await ContextoAuth.Api.Register({
                data: { email: email.value, senha: senha.value },
            });
        }

        email.value = "";
        senha.value = "";
    };

    const irParaRegistro = () => {
        modo.value = "register";
        router.push("/auth/register");
    };

    const irParaLogin = () => {
        modo.value = "login";
        router.push("/auth/login");
    };

    return () => (
        <div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div class="mb-6">
                    <h1 class="text-2xl font-semibold text-slate-800">{modo.value === "login" ? "Entrar" : "Criar conta"}</h1>
                    <p class="text-sm text-slate-500">Entre no app bext teste e começe as tarefas</p>
                </div>

                <div class="space-y-3 mb-6">
                    <input
                        class={[
                            "w-full px-3 py-2 rounded-lg border transition focus:outline-none",
                            erro.value ? "border-red-400 focus:ring-2 focus:ring-red-400" : "border-slate-300 focus:ring-2 focus:ring-indigo-500",
                        ]}
                        value={email.value}
                        onInput={(e: any) => (email.value = e.target.value)}
                        placeholder="Email"
                        type="email"
                    />

                    <input
                        class={[
                            "w-full px-3 py-2 rounded-lg border transition focus:outline-none",
                            erro.value ? "border-red-400 focus:ring-2 focus:ring-red-400" : "border-slate-300 focus:ring-2 focus:ring-indigo-500",
                        ]}
                        value={senha.value}
                        onInput={(e: any) => (senha.value = e.target.value)}
                        placeholder="Senha"
                        type="password"
                    />

                    {erro.value && <div class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{erro.value}</div>}

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
                            <button class="text-indigo-600 hover:underline" onClick={irParaRegistro}>
                                Criar agora
                            </button>
                        </span>
                    ) : (
                        <span>
                            Já tem conta?{" "}
                            <button class="text-indigo-600 hover:underline" onClick={irParaLogin}>
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
