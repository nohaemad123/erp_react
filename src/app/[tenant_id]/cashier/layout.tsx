import { ILayout } from "@/@types/interfaces/ILayout";
import CashierHeaderOrganism from "@/components/organisms/cashier/CashierHeaderOrganism";

export default function layout({ children }: Readonly<ILayout>) {
  return (
    <>
      <CashierHeaderOrganism />
      {children}
    </>
  );
}
