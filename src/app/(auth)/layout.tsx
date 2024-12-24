import { ILayout } from "@/@types/interfaces/ILayout";
import IdentityLayout from "@/components/layout/IdentityLayout";

export default function layout({ children }: Readonly<ILayout>) {
  return <IdentityLayout>{children}</IdentityLayout>;
}
