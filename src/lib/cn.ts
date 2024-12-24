export function classNameGen<T = string | number | boolean | null | undefined | unknown>(...props: T[]) {
  return props.filter((x) => typeof x === "string" && x.trim()).join(" ");
}
