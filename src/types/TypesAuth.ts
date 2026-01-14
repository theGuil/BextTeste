import z4 from "zod/v4";

import TypesResponse from "./TypesResponse";

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
                email: z4.email(),
                senha: z4.string().min(6),
            }),
        });
        export type Input = z4.infer<typeof InputSchema>;

        type Output = {
            token: string;
            user: Omit<User, "senha">;
        };

        export type Response = TypesResponse.Response<Output>;

    }

    export namespace Register {
        export const route = "/auth/register" as const;

        export const InputSchema = z4.object({
            data: z4.object({
                email: z4.email(),
                senha: z4.string().min(6),
            }),
        });
        export type Input = z4.infer<typeof InputSchema>;

        type Output = {
            user: Omit<User, "senha">;
        };

        export type Response = TypesResponse.Response<Output>;

    }
}

export default TypesAuth;
