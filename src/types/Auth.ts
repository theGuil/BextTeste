import z4 from "zod/v4";

namespace TypesAuth {
    export const UserSchema = z4.object({
        id: z4.number().int(),
        email: z4.email(),
        senha: z4.string().min(6),
    });

    export type User = z4.infer<typeof UserSchema>;

    export namespace Login {
        export const route = "/auth/login" as const;

        export const InputSchema = z4.object({
            data: z4.object({
                email: z4.string().email(),
                senha: z4.string().min(6),
            }),
        });
        export type Input = z4.infer<typeof InputSchema>;

        export type Output = {
            data: {
                token: string;
                user: Omit<User, "senha">;
            };
        };
    }

    export namespace Register {
        export const route = "/auth/register" as const;

        export const InputSchema = z4.object({
            data: z4.object({
                email: z4.string().email(),
                senha: z4.string().min(6),
            }),
        });
        export type Input = z4.infer<typeof InputSchema>;

        export type Output = {
            data: {
                user: Omit<User, "senha">;
            };
        };
    }
}

export default TypesAuth;
