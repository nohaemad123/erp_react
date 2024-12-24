import { classNameGen } from "@/lib/cn";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export type ILineBreakAtomProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export default function LineBreakAtom({ className, ...props }: Readonly<ILineBreakAtomProps>) {
  return <div className={classNameGen("text-[var(--gray)] bg-[var(--gray)] h-[1px] w-full", className)} {...props} />;
}
