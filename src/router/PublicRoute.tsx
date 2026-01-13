/** @jsxImportSource vue */
import { defineComponent, watch } from "vue";
import { RouterView, useRouter } from "vue-router";
import ContextoAuth from "@/contexto/ContextoAuth";

export default defineComponent({
    setup() {
        const router = useRouter();

        watch(
            () => ContextoAuth.GetJsx.logado,
            (logado) => {
                if (logado) {
                    router.replace("/");
                }
            },
            { immediate: true }
        );

        return () => <RouterView />;
    },
});
