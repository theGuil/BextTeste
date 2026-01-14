import z4 from "zod/v4";

namespace TypesResponse {
    export const StatusEnum = z4.enum(["success", "error", "warning"]);

    export const HttpStatusEnum = z4.enum({
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_ERROR: 500,
        UNAUTORIZATED: 409,
        UNPROCESSABLE: 422,
    });

    export const ResponseSchema = z4.object({
        data: z4.unknown(),
        status: StatusEnum,
        code: HttpStatusEnum,
        message: z4.string(),
    });

    export type Response<T = unknown> = z4.infer<typeof ResponseSchema> & {
        data: T | any;
    };

}

export default TypesResponse;
