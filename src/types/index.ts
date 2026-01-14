

// TYPES DO PROJETO
import TypesTarefa from "./TypesTarefa";
import TypesAuth from "./TypesAuth";
import TypesResponse from "./TypesResponse";

namespace T {

    export import Tarefa = TypesTarefa

    export import Auth = TypesAuth

    export namespace Response { TypesResponse }
}

export default T;
