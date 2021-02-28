declare namespace OPUtils {
  type Maybe<T> = null | undefined | T

  type Record<K extends string | number | symbol = any, T = any> = {
    [P in K]: T
  }

  type Nullable<T> = {
    [P in keyof T]?: T[P]
  }
}
