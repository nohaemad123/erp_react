"use client";

import { ILayout } from "@/@types/interfaces/ILayout";
import HeaderOrganism from "@/components/organisms/HeaderOrganism";
import SidebarOrganism from "@/components/organisms/SidebarOrganism";
import { useAppStore } from "@/store";
import { useState } from "react";

export default function HomeLayout({ children }: Readonly<ILayout>) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const { myUser } = useAppStore();

  if (!myUser) return <></>;

  return (
    <div>
      <HeaderOrganism setOpen={setIsDrawerOpen} />
      <div className="flex h-full overflow-y-auto">
        <SidebarOrganism open={isDrawerOpen} setOpen={setIsDrawerOpen} />
        {children}
      </div>
    </div>
  );
}
