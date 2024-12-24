import { ILayout } from "@/@types/interfaces/ILayout";
import HomeLayout from "@/components/layout/HomeLayout";

export default function layout({ children }: Readonly<ILayout>) {
  return <HomeLayout>{children}</HomeLayout>;
}
