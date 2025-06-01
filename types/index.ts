type CamelToSnake<S extends string> = S extends `${infer First}${infer Rest}` ? `${First extends Uppercase<First> ? '_' : ''}${Lowercase<First>}${CamelToSnake<Rest>}` : S

type ToSnakeCaseObject<T extends Record<string, unknown>> = {
  [K in keyof T as CamelToSnake<string & K>] : T[K]
}

export type {
  ToSnakeCaseObject
}
